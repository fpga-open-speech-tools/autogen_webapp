
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
import { EffectPageDiv } from "../Components/Autogen/Containers/EffectPageDiv.jsx";
import NotificationWrapper from "../Components/Notifications/NotificationWrapper.jsx";
import { FileUploaderPresentationalComponent } from "../Components/FileManagement/FileUploaderPresentationalComponent";

import * as signalR from "@microsoft/signalr";

// At runtime, Redux will merge together...
type OpenSpeechProps =
  OpenSpeechDataStore.OpenSpeechToolsState // ... state we've requested from the Redux store
  & typeof OpenSpeechDataStore.openSpeechDataActionCreators // ... plus action creators we've requested
  & RouteComponentProps<{}>; // ... plus incoming routing parameters

interface IState {
  ipFragment1: string,
  ipFragment2: string,
  ipFragment3: string,
  ipFragment4: string,
  port: string,

  uiConfigName: string,

  dragging: boolean,
  file: File | null,

  groupID: string,
  sessionPatientConnected: boolean,
  sessionStarted: boolean,
  user: string,
  message: string,
  patientFeedback: boolean|null,

  notificationText: string,
  notificationLevel:string
}

let connection = new signalR.HubConnectionBuilder().withUrl("/chathub").build();


class Doctor extends React.PureComponent<OpenSpeechProps, IState> {

  static counter = 0;
  fileUploaderInput: HTMLElement | null = null;
  constructor(props: OpenSpeechProps) {
    super(props);

    this.state = {
      ipFragment1: '127',
      ipFragment2: '0',
      ipFragment3: '0',
      ipFragment4: '1',
      port: '3355',

      uiConfigName: "",

      dragging: false,
      file: null,

      sessionStarted: false,
      sessionPatientConnected: false,
      groupID: "",
      user: "Doctor",
      message: "",
      patientFeedback: null,

      notificationText: "",
      notificationLevel: ""
    };
    this.handleIP1Change = this.handleIP1Change.bind(this);
    this.handleIP2Change = this.handleIP2Change.bind(this);
    this.handleIP3Change = this.handleIP3Change.bind(this);
    this.handleIP4Change = this.handleIP4Change.bind(this);
    this.handlePortChange = this.handlePortChange.bind(this);

    this.handleRequestUI = this.handleRequestUI.bind(this);
    this.handleInputCommand = this.handleInputCommand.bind(this);

    this.setNotificationText = this.setNotificationText.bind(this);
    this.setNotificationLevel = this.setNotificationLevel.bind(this);

    this.startSession = this.startSession.bind(this);
    this.startGroup = this.startGroup.bind(this);
    this.stopGroup = this.stopGroup.bind(this);
    this.sendFeedbackRequestToServer = this.sendFeedbackRequestToServer.bind(this);
  }//End Constructor 

  dragEventCounter = 0;
  dragenterListener = (event: React.DragEvent<HTMLDivElement>) => {
    this.overrideEventDefaults(event);
    this.dragEventCounter++;
    if (event.dataTransfer.items && event.dataTransfer.items[0]) {
      this.setState({ dragging: true });
    } else if (
      event.dataTransfer.types &&
      event.dataTransfer.types[0] === "Files"
    ) {
      // This block handles support for IE - if you're not worried about
      // that, you can omit this
      this.setState({ dragging: true });
    }
  };

  dragleaveListener = (event: React.DragEvent<HTMLDivElement>) => {
    this.overrideEventDefaults(event);
    this.dragEventCounter--;

    if (this.dragEventCounter === 0) {
      this.setState({ dragging: false });
    }
  };

  dropListener = (event: React.DragEvent<HTMLDivElement>) => {
    this.overrideEventDefaults(event);
    this.dragEventCounter = 0;
    this.setState({ dragging: false });

    if (event.dataTransfer.files && event.dataTransfer.files[0]) {
      this.setState({ file: event.dataTransfer.files[0] });
    }
  };

  overrideEventDefaults = (event: Event | React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
  };

  onSelectFileClick = () => {
    this.fileUploaderInput && this.fileUploaderInput.click();
  };

  onFileChanged = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      this.setState({ file: event.target.files[0] });
    }
  };

  componentDidMount() {
    this.handleRequestUI();
    this.startSession();
    window.addEventListener("dragover", (event: Event) => {
      this.overrideEventDefaults(event);
    });
    window.addEventListener("drop", (event: Event) => {
      this.overrideEventDefaults(event);
    });
  } // End ComponentDidMount

  componentDidUpdate() {

    if (this.props.uiConfig) {
      if (this.props.uiConfig.name === 'Demo Upload Failed' && this.props.uiConfig.name != this.state.uiConfigName) {
        this.setNotificationLevel('error');
        this.setNotificationText('Demo Upload Failed');
        this.setState({ uiConfigName: this.props.uiConfig.name });
      }
      else if (this.props.uiConfig.name === "ERROR" && this.props.uiConfig.name != this.state.uiConfigName) {
        this.setNotificationLevel('error');
        this.setNotificationText('Control Generation Failed');
        this.setState({ uiConfigName: this.props.uiConfig.name });
      }
      else if (this.props.uiConfig.name != this.state.uiConfigName){
        this.setNotificationLevel('success');
        this.setNotificationText('New Controls Generated: ' + this.props.uiConfig.name);
        this.setState({ uiConfigName: this.props.uiConfig.name });
      }
    }
  }//End ComponentDidUpdate

  componentWillMount() {
    window.removeEventListener("dragover", this.overrideEventDefaults);
    window.removeEventListener("drop", this.overrideEventDefaults);
  }


  handleIP1Change(e: React.ChangeEvent<HTMLInputElement>) {
    this.setState({ ipFragment1: e.target.value });
  }

  handleIP2Change(e: React.ChangeEvent<HTMLInputElement>) {
    this.setState({ ipFragment2: e.target.value });
  }

  handleIP3Change(e: React.ChangeEvent<HTMLInputElement>) {
    this.setState({ ipFragment3: e.target.value });
  }

  handleIP4Change(e: React.ChangeEvent<HTMLInputElement>) {
    this.setState({ ipFragment4: e.target.value });
  }

  handlePortChange(e: React.ChangeEvent<HTMLInputElement>) {
    this.setState({ port: e.target.value });
  }

  handleRequestUI() {
    this.props.requestOpenSpeechUI(
      this.state.ipFragment1, this.state.ipFragment2, this.state.ipFragment3, this.state.ipFragment4,
      this.state.port);
  }

  handleDownloadDemosJSON = () =>{
    downloadObjectAsJson(this.props.availableDemos,"demos");
  }

  handleInputCommand(module: string, link: string, value: string) {
    if (!this.props.isLoading) {
        this.props.requestSendCommand(link, value, module,
        this.state.ipFragment1, this.state.ipFragment2, this.state.ipFragment3, this.state.ipFragment4,
        this.state.port)
    }
  }

  setNotificationText(text:string) {
    this.setState({notificationText:text});
  }

  setNotificationLevel(level:string) {
    this.setState({notificationLevel:level});
  }

  startSession(){
    connection.on("ReceiveMessage", (user, message) => {
      var msg = message.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
      var encodedMsg = user + ": " + msg;
      this.setState({ message: encodedMsg });
    });

    connection.on("Send", (message) => {
      var msg = message.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
      var encodedMsg = msg;
      this.setState({
        notificationLevel: "info",
        notificationText: msg
      })
    });

    connection.on("ReceiveFeedback", (user, feedback) => {
      this.setState({ message: feedback });
      var level = feedback ? "success" : "error";
      var feedbackText = feedback ? "Good" : "Bad";
      var d = new Date();
      var n = d.toLocaleTimeString();
      feedbackText = feedbackText + " at " + n;
      this.setState({
        notificationLevel: level,
        notificationText: feedbackText
      });
    });

    connection.start().then(function () {
    }).catch(function (err) {
      return console.error(err.toString());
    });
  }

  startGroup() {
    var nums = "0123456789";
    var result = "";
    for (var i = 4; i > 0; --i) {
      result += nums[Math.round(Math.random() * (nums.length - 1))]
    }
    this.setState({ groupID: result });
    connection.invoke("AddToGroup", result).catch(function (err) {
      return console.error(err.toString());
    });
    this.setState({sessionStarted: true});
  }

  stopGroup() {
    connection.invoke("RemoveFromGroup", this.state.groupID).catch(function (err) {
      return console.error(err.toString());
    });
    this.setState({ sessionStarted: false,groupID:"" });
  }

  sendFeedbackRequestToServer() {
    connection.invoke("RequestFeedback", this.state.user, this.state.groupID).catch(function (err) {
      return console.error(err.toString());
    });
  }

  render() {

    function getAutogen(board: Doctor, props: OpenSpeechProps) {
      if (props.uiConfig) {
        if (props.uiConfig.pages) {
          var effectName = props.uiConfig.name ? props.uiConfig.name : "";
          effectName = (effectName === "ERROR") ? "" : effectName;
          return (
            <div className="autogen autogen-effectContainer">
              <Jumbotron className="autogen-effect-name">{effectName}</Jumbotron>
              <Card>
                {props.uiConfig.pages.map((page) =>
                  <React.Fragment key={page.name}>
                    <div className={page.name}>
                      <Jumbotron className="autogen-page-name">{page.name}</Jumbotron>
                      <EffectPageDiv
                        callback={board.handleInputCommand}
                        page={page} />
                    </div>
                  </React.Fragment>)
                }
              </Card>
            </div>);
        }
        else if (props.uiConfig.name) {
          var effectName = props.uiConfig.name ? props.uiConfig.name : "";
          effectName = (effectName === "ERROR") ? "" : effectName;
          return (
            <div className="autogen autogen-effectContainer autogen-error">
            </div>);
        }
      }
    }// End Get Autogen

    function getUploadIcon() {
      return (<Button
        variant="primary"
        className="float-right btn-simple btn-icon">
        <i className="fa fa-upload large-icon" />
      </Button>);
    }

    function getSessionButton(props: Doctor, state: IState) {
      if (state.sessionStarted) {
        return (
          <Button
            className="flex-right btn-simple btn-icon"
            onClick={props.stopGroup}
          ><i className="fa fa-stop large-icon" />
          </Button>);
      }
      else {
        return (
          <Button
            className="flex-right btn-simple btn-icon"
            onClick={props.startGroup}
          ><i className="fa fa-play large-icon" />
          </Button>);
      }
    }

    return (
      <div className="content">
        <NotificationWrapper
          pushText={this.state.notificationText}
          level={this.state.notificationLevel}
        />
        <Container fluid>
          <Row>
            <Modal.Dialog id="controls">
              <Modal.Header>
                <Modal.Title className="float-left">
                  Controls
                </Modal.Title>
                <div className="flex-right">
                <Button
                  variant="primary"
                  className="btn-simple btn-icon"
                  onClick={this.handleRequestUI}
                >
                  <i className="fa fa-refresh large-icon" />
                  </Button>
                  <Button
                    variant="primary"
                    className="float-right btn-simple btn-icon"
                    onClick={this.handleDownloadDemosJSON}>
                    <i className="fa fa-save large-icon" />
                  </Button>
                  <FileUploaderPresentationalComponent
                    dragging={this.state.dragging}
                    file={this.state.file}
                    onSelectFileClick={this.onSelectFileClick}
                    onDrag={this.overrideEventDefaults}
                    onDragStart={this.overrideEventDefaults}
                    onDragEnd={this.overrideEventDefaults}
                    onDragOver={this.overrideEventDefaults}
                    onDragEnter={this.dragenterListener}
                    onDragLeave={this.dragleaveListener}
                    onDrop={this.dropListener}
                  >
                    <input
                      ref={el => (this.fileUploaderInput = el)}
                      type="file"
                      className="file-uploader-hidden file-uploader__input"
                      onChange={this.onFileChanged}
                    />
                  </FileUploaderPresentationalComponent>
              </div></Modal.Header>
            {getAutogen(this, this.props)}
            </Modal.Dialog>
          </Row>

          <Row>
            <Modal.Dialog>
              <Modal.Header>
                <Modal.Title className="float-left">
                  Session
                </Modal.Title>
                {getSessionButton(this, this.state)}
              </Modal.Header>
              <Row>
                <h4 className="centered-header">{this.state.groupID}</h4>
              </Row>
              <Button
                onClick={this.sendFeedbackRequestToServer}
              >GetFeedback
              </Button>
            </Modal.Dialog>
          </Row>
          <script src="~/js/signalr/dist/browser/signalr.js"></script>
          <script src="~/js/chat.js"></script>
        </Container>
      </div>
    );
  }//End Render

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
)(Doctor as any);     
