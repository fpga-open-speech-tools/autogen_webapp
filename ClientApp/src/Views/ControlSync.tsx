
import * as React from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps } from 'react-router';
import * as OpenSpeechDataStore from '../Store/OpenSpeechToolsData';
import { ApplicationState } from '..';
import {
  Container, Row, Col, InputGroup,
  FormControl, Button, Spinner,
  Card, Jumbotron, Modal,Form
} from "react-bootstrap";
import NotificationWrapper from "../Components/Notifications/NotificationWrapper.jsx";
import SliderWrapper from "./ControlWrapperTest.jsx";

import * as signalR from "@microsoft/signalr";

// At runtime, Redux will merge together...
type OpenSpeechProps =
  OpenSpeechDataStore.OpenSpeechToolsState // ... state we've requested from the Redux store
  & typeof OpenSpeechDataStore.openSpeechDataActionCreators // ... plus action creators we've requested
  & RouteComponentProps<{}>; // ... plus incoming routing parameters

interface SyncState {
  connectedToServer:boolean,
  groupID: string,
  sessionPatientConnected: boolean,
  sessionStarted: boolean,
  user: string,
  message: string,

  value1: number,
  value2: number,
  value3: number

  notificationText: string,
  notificationLevel:string
}

let connection = new signalR.HubConnectionBuilder().withUrl("/model-data").build();

export class ControlSyncView extends React.PureComponent<OpenSpeechProps, SyncState> {

  constructor(props: OpenSpeechProps) {
    super(props);

    this.state = {

      connectedToServer: false,
      sessionStarted: false,
      sessionPatientConnected: false,
      groupID: "",
      user: "Test",
      message: "",
      value1: 1,
      value2: 5,
      value3: 9,

      notificationText: "",
      notificationLevel: ""
    };

    this.setNotificationText = this.setNotificationText.bind(this);
    this.setNotificationLevel = this.setNotificationLevel.bind(this);

    this.startSession = this.startSession.bind(this);
    this.verifyConnection = this.verifyConnection.bind(this);
    this.sendFeedbackRequestToServer = this.sendFeedbackRequestToServer.bind(this);
    this.handleChange = this.handleChange.bind(this);

    this.doNothing = this.doNothing.bind(this);
  }//End Constructor 



  componentDidMount() {
    this.startSession();
  } // End ComponentDidMount

  componentDidUpdate() {

  }//End ComponentDidUpdate

  componentWillMount() {
  }


  setNotificationText(text: string) {
    this.setState({ notificationText: text });
  }

  setNotificationLevel(level: string) {
    this.setState({ notificationLevel: level });
  }

  handleChange(index: number, value: number) {
    if (index === 1) {
      this.setState({ value1: value });
    }
    else if (index === 2) {
      this.setState({ value2: value });
    }
    else {
      this.setState({ value3: value });
    }
    var obj = { index: index, value: value };
    connection.invoke("SendDataPacket", obj).catch(function (err) {
      return console.error(err.toString());
    });
  }

  verifyConnection() {
    connection.invoke("AfterConnected").catch(function (err) {
      return console.error(err.toString());
    });
  }

  startSession() {

    connection.on("Connected", (message) => {
      var msg = message.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
      this.setState({
        connectedToServer: true,
        notificationLevel: "success",
        notificationText: msg
      });
    });

    connection.on("Update", (obj) => {
      var msg = "index: " + obj.index + " value: " + obj.value;
      if (obj.index === 1) {
        this.setState({ value1: obj.value });
      }
      else if (obj.index === 2) {
        this.setState({ value2: obj.value });
      }
      else {
        this.setState({ value3: obj.value });
      }
      this.setState({ message: msg });
    });

    connection.start()
      .then(function (val) {
      }).then(res => this.verifyConnection())
      .catch(function (err) {
        setTimeout(() => connection.start(), 5000);
        return console.error(err.toString());
      });

  } //End Start Connection to SignalR Client hub


  sendFeedbackRequestToServer() {
    connection.invoke("SendDataPacket", this.state.user, this.state.groupID).catch(function (err) {
      return console.error(err.toString());
    });
  }

  doNothing() {

  }

  render() {
    return (
      <div className="content">
        <NotificationWrapper
          pushText={this.state.notificationText}
          level={this.state.notificationLevel}
        />
        <Container fluid>
          <Row>
            <Modal.Dialog>
              <Modal.Header>
                <Modal.Title className="float-left">
                  Session
                </Modal.Title>
              </Modal.Header>
              <Row>
                <h4 className="centered-header">{this.state.groupID}</h4>
              </Row>
            </Modal.Dialog>
          </Row>
          <Row>{this.state.message}</Row>
                <Row>
                <span>value: {this.state.value1}</span>
                  <SliderWrapper
                  value={this.state.value1}
                  index={1}
                  callback={this.handleChange} />
          </Row>
          <Row>
            <span>value: {this.state.value2}</span>
            <SliderWrapper
              value={this.state.value2}
              index={2}
              callback={this.handleChange} />
          </Row>
          <Row>
            <span>value: {this.state.value3}</span>
            <SliderWrapper
              value={this.state.value3}
              index={3}
              callback={this.handleChange} />
          </Row>
          <script src="~/js/signalr/dist/browser/signalr.js"></script>
          <script src="~/js/chat.js"></script>
        </Container>
      </div>
    );
  }//End Render
}

export default connect(
  (state: ApplicationState) => state.openSpeechData,
  OpenSpeechDataStore.openSpeechDataActionCreators 
)(ControlSyncView as any);     
