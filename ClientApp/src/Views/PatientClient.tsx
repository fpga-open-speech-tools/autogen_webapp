
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


class Patient extends React.PureComponent<OpenSpeechProps, IState> {

  constructor(props: OpenSpeechProps) {
    super(props); 

    this.state = {
      messages: ["Message1", "Message2"],
      testString: "test",

      outboundMessage: "message",
      user: "user", 
      groupID: "",
      pinEntry: "",
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

  handlePinEntryUpdate(e: React.ChangeEvent<HTMLInputElement>) {
    this.setState({ pinEntry: e.target.value });
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
      var encodedMsg = msg;
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
    connection.invoke("AddToGroup", this.state.pinEntry).catch(function (err) {
      //Add Handling for SessionJoinFailure
      return console.error(err.toString());
    });
  }


  

  render() {

    function feedbackUI(props: Patient, state: IState) {

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
                <i className="fa fa-smile-o large-icon"/>
              </Button>
              <Button
                variant="light"
                disabled={disabled}
                onClick={() => props.setFeedback(0, state.userFeedbackNotes)}
                className="btn-simple btn-icon btn-warning"
              >
                <i className="far fa-meh large-icon" />
              </Button>
              <Button
                variant="light"
                disabled={disabled}
                className="btn-simple btn-icon btn-danger"
                onClick={() => props.setFeedback(-1, state.userFeedbackNotes)}
              >
                <i className="far fa-frown large-icon" />
              </Button>
            </div>
            <div>
              <InputGroup>
                <InputGroup.Prepend>
                  <InputGroup.Text>Notes</InputGroup.Text>
                </InputGroup.Prepend>
                <FormControl
                  name="Note-Entry"
                  defaultValue={state.userFeedbackNotes}
                  onChange={props.setFeedbackNotes}
                  as="textarea"
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

    return (
      <div className="content">
        <NotificationWrapper
          pushText={this.state.notificationText}
          level={this.state.notificationLevel}
        />
        <Container fluid>
          <div>
            <Modal.Dialog className="patient-session">
              <Modal.Header className={isSessionActive(this.state)}><Modal.Title>Session</Modal.Title></Modal.Header>
                <InputGroup className="mb-3">
                  <InputGroup.Prepend>
                    <InputGroup.Text id="inputGroup-sizing-default">Pin</InputGroup.Text>
                  </InputGroup.Prepend>
                  <FormControl
                    name="PinEntry"
                    defaultValue={this.state.groupID}
                    onChange={this.handlePinEntryUpdate}
                    aria-label="Pin"
                    aria-describedby="inputGroup-sizing-default"
                  />
                  <Button
                  onClick={this.joinGroupByID}
                  className="btn-simple btn-icon"
                >
                  <i className="fa fa-sign-in icon-large" />
                  </Button>
                </InputGroup>
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


function downloadObjectAsJson(exportObj:any, exportName: string) {
  var dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(exportObj,null,4));
  var downloadAnchorNode = document.createElement('a');
  downloadAnchorNode.setAttribute("href", dataStr);
  downloadAnchorNode.setAttribute("download", exportName + ".json");
  document.body.appendChild(downloadAnchorNode); // required for firefox
  downloadAnchorNode.click();
  downloadAnchorNode.remove();
}

export default connect(
  (state: ApplicationState) => state.openSpeechData,
  OpenSpeechDataStore.openSpeechDataActionCreators 
)(Patient as any);     
