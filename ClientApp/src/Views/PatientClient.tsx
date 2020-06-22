
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
  testString: string,
  userFeedback: boolean|null,
  feedbackRequested: boolean,
  pinEntry:string,

  notificationText: string,
  notificationLevel:string
}


let connection = new signalR.HubConnectionBuilder().withUrl("/chathub").build();


class Patient extends React.PureComponent<OpenSpeechProps, IState> {

  constructor(props: OpenSpeechProps) {
    super(props);

    this.state = {
      messages: ["Message1", "Message2"],
      testString: "test",
      outboundMessage: "message",
      user: "user", 
      groupID: "",
      userFeedback: null,
      feedbackRequested:false,
      pinEntry: "",

      notificationText: "",
      notificationLevel: ""
    };


    this.setNotificationText = this.setNotificationText.bind(this);
    this.setNotificationLevel = this.setNotificationLevel.bind(this);

    this.setFeedback = this.setFeedback.bind(this);

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

  setFeedback(feedback: boolean) {
    this.setState({
      userFeedback: feedback, 
      notificationLevel: "success",
      notificationText: "Feedback Sent."
    });
    this.sendFeedbackToServer(feedback);
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

    connection.start().then(function () {
    }).catch(function (err) {
      return console.error(err.toString());
    });
  }

  sendMessageToServer() {
    connection.invoke("SendMessage", this.state.user, this.state.outboundMessage).catch(function (err) {
      return console.error(err.toString());
    });
  }

  sendFeedbackToServer(feedback:boolean) {
    connection.invoke("SendFeedback", this.state.user, feedback, this.state.groupID).catch(function (err) {
      return console.error(err.toString());
    });
    this.setState({ feedbackRequested: false });
  }

  joinGroupByID() {
    this.handleGroupUpdate();
    connection.invoke("AddToGroup", this.state.pinEntry).catch(function (err) {
      return console.error(err.toString());
    });
  }


  

  render() {

    function feedbackUI(props:Patient,state:IState) {
      if (state.feedbackRequested) {
        return (
          <div>
            <Button
              onClick={() => props.setFeedback(true)}
            >Good
            </Button>
            <Button
              onClick={() => props.setFeedback(false)}
            >Bad
            </Button>
          </div>
        );
      }
      else { return (<div></div>);}
    }

    return (
      <div className="content">
        <NotificationWrapper
          pushText={this.state.notificationText}
          level={this.state.notificationLevel}
        />
        <Container fluid>
          <div>
            <Modal.Dialog>
            <Modal.Header></Modal.Header>
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
              >Join
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
