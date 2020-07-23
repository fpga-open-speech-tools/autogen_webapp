import * as React from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps } from 'react-router';
import * as OpenSpeechDataStore from '../../Store/OpenSpeechToolsData';
import { ApplicationState } from '../..';
import * as signalR from "@microsoft/signalr"; 

import NotificationWrapper from "../Notifications/NotificationWrapper.jsx";

import {
  Container, Row, Col, InputGroup,
  FormControl, Button, Spinner,
  Card, Jumbotron, Modal, Form
} from "react-bootstrap";


// At runtime, Redux will merge together...
type OpenSpeechProps =
  OpenSpeechDataStore.OpenSpeechToolsState // ... state we've requested from the Redux store
  & typeof OpenSpeechDataStore.openSpeechDataActionCreators // ... plus action creators we've requested
  & RouteComponentProps<{}>; // ... plus incoming routing parameters

interface IState {
  connectedToServer: boolean,

  notificationText: string,
  notificationLevel: string,

  shadowObject: {
    value: number,
    name:string
  }
}

let connection = new signalR.HubConnectionBuilder().withUrl("/controls").build();


export class SandboxView extends React.PureComponent<OpenSpeechProps, IState> {

  constructor(props: OpenSpeechProps) {
    super(props);

    this.state = {
      connectedToServer: false,

      shadowObject: {
        value: 3,
        name: "default"
      },

      notificationText: "",
      notificationLevel: ""
    };

    this.setNotificationText = this.setNotificationText.bind(this);
    this.setNotificationLevel = this.setNotificationLevel.bind(this);

    this.sendObject = this.sendObject.bind(this);
    this.startSession = this.startSession.bind(this);
    this.verifyConnection = this.verifyConnection.bind(this);

  }//End Constructor 


  componentDidMount() {
    this.startSession();
  } // End ComponentDidMount

  componentDidUpdate() {
  }//End ComponentDidUpdate

  setNotificationText(text: string) {
    this.setState({ notificationText: text });
  }

  setNotificationLevel(level: string) {
    this.setState({ notificationLevel: level });
  }

  verifyConnection() {
    connection.invoke("AfterConnected").catch(function (err) {
      return console.error(err.toString());
    });
  }

  sendObject() {
    var num = Math.floor(Math.random() * 10);

    var shadow = {
      value: num,
      name: "Name"
      }

    this.setState({
      shadowObject:shadow
    });

    connection.invoke("SendControl", shadow).catch(function (err) {
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

    connection.on("ReceiveControl", (obj) => {
      this.setState({
        shadowObject:obj
      });
    });


    connection.start()
      .then(function (val) {
      }).then(res => this.verifyConnection())
      .catch(function (err) {
        setTimeout(() => connection.start(), 5000);
        return console.error(err.toString());
      });

  } //End Start Connection to SignalR Client hub

  render(){
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
            </Modal.Dialog>
          </Row>
          <Row>
            <Button
              onClick={this.sendObject}
            >
            </Button>
          </Row>
          <Row>
            {this.state.shadowObject.value}
          </Row>
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
)(SandboxView as any);     
