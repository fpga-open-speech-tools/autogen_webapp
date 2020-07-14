
import * as React from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps } from 'react-router';
import * as OpenSpeechDataStore from '../Store/OpenSpeechToolsData';
import { ApplicationState } from '..';
import {
  Container, Row, Col, InputGroup,
  FormControl, Button, Spinner,
  Card, Jumbotron, Modal
} from "react-bootstrap";
import NotificationWrapper from "../Components/Notifications/NotificationWrapper.jsx";
import * as signalR from "@microsoft/signalr";
import PinInput from "react-pin-input";


// At runtime, Redux will merge together...
type OpenSpeechProps =
  OpenSpeechDataStore.OpenSpeechToolsState // ... state we've requested from the Redux store
  & typeof OpenSpeechDataStore.openSpeechDataActionCreators // ... plus action creators we've requested
  & RouteComponentProps<{}>; // ... plus incoming routing parameters

interface IState {
  messages: string[],
  outboundMessage: string,

  user: string,
  groupID: string,
  sessionIsActive: boolean,
  testString: string,
  userFeedback: number | null,
  userFeedbackNotes: string,
  feedbackRequested: boolean,
  pinEntry: string,

  connectedToServer:boolean,

  notificationText: string,
  notificationLevel:string
}


let connection = new signalR.HubConnectionBuilder().withUrl("/doctor-patient").build();


class PatientView extends React.PureComponent<OpenSpeechProps, IState> {

  constructor(props: OpenSpeechProps) {
    super(props); 

    this.state = {
      messages: ["Message1", "Message2"],
      testString: "test",

      outboundMessage: "message",
      user: "user", 
      groupID: "-----",
      pinEntry: "-----",
      sessionIsActive: false,

      userFeedback: null,
      userFeedbackNotes: "",
      feedbackRequested: false,

      connectedToServer:false,

      notificationText: "",
      notificationLevel: ""
    };


    this.setNotificationText = this.setNotificationText.bind(this);
    this.setNotificationLevel = this.setNotificationLevel.bind(this);

    this.setFeedback = this.setFeedback.bind(this);
    this.setFeedbackNotes = this.setFeedbackNotes.bind(this);

    this.handleOutboutMessageUpdate = this.handleOutboutMessageUpdate.bind(this);
    this.addMessageToMessageList = this.addMessageToMessageList.bind(this);
    this.handleUserUpdate = this.handleUserUpdate.bind(this);
    this.sendMessageToServer = this.sendMessageToServer.bind(this);

    this.handlePinEntryUpdate = this.handlePinEntryUpdate.bind(this);
    this.handleGroupUpdate = this.handleGroupUpdate.bind(this);

    this.joinGroupByID = this.joinGroupByID.bind(this);
    this.leaveGroupByID = this.leaveGroupByID.bind(this);
  }


  componentDidMount() {
    this.startConnection();
  }

  componentDidUpdate() {

  }

  setFeedback(feedback: number,feedbackNotes:string) {
    this.setState({
      userFeedback: feedback, 
      notificationLevel: "success",
      notificationText: "Feedback Sent."
    });
    this.sendFeedbackToServer(feedback,feedbackNotes);
  }

  setFeedbackNotes(e: React.ChangeEvent<HTMLInputElement>){
    this.setState({
      userFeedbackNotes:e.target.value
    })
  }

  setNotificationText(text:string) {
    this.setState({notificationText:text});
  }

  setNotificationLevel(level:string) {
    this.setState({notificationLevel:level});
  }

  handleOutboutMessageUpdate(e: React.ChangeEvent<HTMLInputElement>) {
    this.setState({ outboundMessage: e.target.value });
  }

  handleUserUpdate(e: React.ChangeEvent<HTMLInputElement>){
    this.setState({ user: e.target.value });
  }

  handleGroupUpdate() {
    this.setState({ groupID: this.state.pinEntry});
  }

  handlePinEntryUpdate(value: string) {
    this.setState({ pinEntry: value });
  }

  addMessageToMessageList(incomingMessage: string) {
    var newList = this.state.messages;
    newList.push(incomingMessage);
    this.setState({ messages: newList });
  }

  startConnection() {

    connection.on("Connected", (message) => {
      var msg = message.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
      this.setState({
        connectedToServer:true,
        notificationLevel:"success",
        notificationText: msg
      });
    });

    connection.on("Disconnected", () => {
      this.setState({
        connectedToServer: false,
        notificationLevel: "error",
        notificationText: "Disconnected."
      });
    });

    connection.on("ReceiveMessage",  (user, message) => {
      var msg = message.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
      var encodedMsg = user + ": " + msg;
      this.setState({ testString: encodedMsg });
      this.addMessageToMessageList(encodedMsg);
    });

    connection.on("FeedbackRequested", (user) => {
      this.setNotificationLevel("success");
      this.setNotificationText("Feedback Requested from " + user);
      this.setState({ feedbackRequested: true });
    });

    connection.start()
      .then(function (val) {

      }).then(res => this.verifyConnection())
      .catch(function (err) {

        return console.error(err.toString());

      });


    connection.on("AddedToGroup", (message) => {
      this.setState({
        sessionIsActive: true,
        notificationLevel: "info",
        notificationText: message
      })
    });

    connection.on("LeftGroup", (message) => {
      this.setState({
        sessionIsActive: false,
        notificationLevel: "info",
        notificationText: message
      })
    });

    connection.on("GroupMessage", (message) => {
      var msg = message.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
      if (msg === "Session Ended") {
        this.setState({
          userFeedback: null,
          userFeedbackNotes: "",
          feedbackRequested: false
        })
        window.location.reload(false);
      }
      this.setState({
        notificationLevel: "info",
        notificationText: msg
      })

    });

    connection.on("GroupEnded", (message) => {
      var msg = message.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
      this.setState({
        sessionIsActive: false,
        groupID:"Inactive"
      })
    });

  }//End Start Connection

  verifyConnection() {
    connection.invoke("AfterConnected").catch(function (err) {
      return console.error(err.toString());
    });
    return true;
  }

  sendMessageToServer() {
    connection.invoke("SendMessage", this.state.user, this.state.outboundMessage).catch(function (err) {
      return console.error(err.toString());
    });
  }

  sendFeedbackToServer(feedback:number,feedbackNotes:string) {
    connection.invoke("SendFeedback", this.state.user, feedback, feedbackNotes, this.state.groupID).catch(function (err) {
      //Add Handling for FeedbackSendFailure
      return console.error(err.toString());
    });
    this.setState({ feedbackRequested: false });
  }

  joinGroupByID() {
    this.handleGroupUpdate();
    connection.invoke("RequestToJoinGroup", this.state.pinEntry).catch(function (err) {
      //Add Handling for SessionJoinFailure
      return console.error(err.toString());
    });
  }

  leaveGroupByID() {
    connection.invoke("RemoveFromGroup", this.state.pinEntry).catch(function (err) {
      //Add Handling for SessionJoinFailure
      return console.error(err.toString());
    });
  }


  

  render() {

    function feedbackUI(props: PatientView, state: IState) {

      var disabled = !state.feedbackRequested;

        return (
          <Modal.Dialog className="patient-feedback-modal">
            <Modal.Header><Modal.Title>Feedback</Modal.Title></Modal.Header>
            <div className="patient-feedback-interface">
              <Button
                variant="light"
                disabled={disabled}
                onClick={() => props.setFeedback(1,state.userFeedbackNotes)}
                className="btn-simple btn-icon btn-success"
              >
                <i className="fa fa-smile-o large-icon patient-feedback-lg"/>
              </Button>
              <Button
                variant="light"
                disabled={disabled}
                onClick={() => props.setFeedback(0, state.userFeedbackNotes)}
                className="btn-simple btn-icon btn-warning"
              >
                <i className="far fa-meh large-icon patient-feedback-lg" />
              </Button>
              <Button
                variant="light"
                disabled={disabled}
                className="btn-simple btn-icon btn-danger"
                onClick={() => props.setFeedback(-1, state.userFeedbackNotes)}
              >
                <i className="far fa-frown large-icon patient-feedback-lg" />
              </Button>
            </div>
            <div>
              <InputGroup>
                <InputGroup.Prepend>
                  <InputGroup.Text className="patient-notes">Notes</InputGroup.Text>
                </InputGroup.Prepend>
                <FormControl
                  name="Note-Entry"
                  defaultValue={state.userFeedbackNotes}
                  onChange={props.setFeedbackNotes}
                  as="textarea"
                  className="patient-notes"
                  aria-label="With textarea" />
              </InputGroup>
            </div>

          </Modal.Dialog>
        );
    }

    function isSessionActive(state: IState) {
      var sessionClassName = "";
      if (state.sessionIsActive) {
        sessionClassName+=("session-active");
      }
      else {
        sessionClassName +=("session-inactive");
      }
      return sessionClassName;
    }

    function getJoinSessionButton(props: PatientView, state: IState) {
      if (state.connectedToServer && !state.sessionIsActive) {
        return (
          <Button
            onClick={props.joinGroupByID}
            className="btn-simple btn-icon float-right patient-button"
          >
            <i className="fa fa-sign-in icon-large" />
          </Button>
      );
      }
      else if (state.connectedToServer && state.sessionIsActive) {
        return (
          <Button
            onClick={props.leaveGroupByID}
            className="btn-simple btn-icon float-right patient-button"
          >
            <i className="fa fa-sign-out icon-large" />
          </Button>
        );
      }
      else {
        return (
          <Button
            className="flex-right btn-simple btn-icon"
          >
            <Spinner animation="border" variant="primary" />
          </Button>
        );
      }
    }

    return (
      <div className="content">
        <NotificationWrapper
          pushText={this.state.notificationText}
          level={this.state.notificationLevel}
          position="bc"
        />
        <Container fluid>
          <div>
            <Modal.Dialog className="patient-session">
              <Modal.Header className={isSessionActive(this.state)}>
                <Modal.Title>Session</Modal.Title>
                {getJoinSessionButton(this,this.state)}
              </Modal.Header>
              <PinInput
                length={4}
                initialValue={this.state.groupID}
                onChange={(value, index) => { this.handlePinEntryUpdate(value) }}
                type="numeric"
                style={{ padding: '10px' }}
                inputStyle={{ borderColor: 'gray' }}
                inputFocusStyle={{ borderColor: 'blue' }}
                onComplete={(value, index) => { }}
              />
            </Modal.Dialog>
            {feedbackUI(this,this.state)}

          </div>
          <script src="~/js/signalr/dist/browser/signalr.js"></script>
          <script src="~/js/chat.js"></script>
        </Container>
      </div>
    );
  }
  

}

export default connect(
  (state: ApplicationState) => state.openSpeechData,
  OpenSpeechDataStore.openSpeechDataActionCreators 
)(PatientView as any);     
