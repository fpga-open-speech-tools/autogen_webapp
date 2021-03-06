
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
import { FileUploaderPresentationalComponent } from "../Components/FileManagement/FileUploaderPresentationalComponent";
import { ControlPanel } from './FunctionalElements/ControlPanel';

import * as signalR from "@microsoft/signalr";

// At runtime, Redux will merge together...
type OpenSpeechProps =
  OpenSpeechDataStore.OpenSpeechToolsState // ... state we've requested from the Redux store
  & typeof OpenSpeechDataStore.openSpeechDataActionCreators // ... plus action creators we've requested
  & RouteComponentProps<{}>; // ... plus incoming routing parameters

interface IState {

  uiConfigName: string,

  dragging: boolean,
  file: File | null,
  newFile:boolean,

  connectedToServer:boolean,
  groupID: string,
  sessionPatientConnected: boolean,
  sessionStarted: boolean,
  user: string,
  message: string,

  patientFirstName: string,
  patientLastName: string,
  patientFeedback: number,
  patientFeedbackNotes: string,
  doctorNotes: string,

  notificationText: string,
  notificationLevel:string
}

let connection = new signalR.HubConnectionBuilder().withUrl("/doctor-patient").build();


export class DoctorView extends React.PureComponent<OpenSpeechProps, IState> {

  static counter = 0;
  fileUploaderInput: HTMLElement | null = null;
  constructor(props: OpenSpeechProps) {
    super(props);

    this.state = {
      uiConfigName: "",

      dragging: false,
      file: null,
      newFile:false,

      connectedToServer:false,
      sessionStarted: false,
      sessionPatientConnected: false,
      groupID: "",
      user: "Doctor",
      message: "",

      patientFirstName: "",
      patientLastName: "",
      patientFeedback: -2,
      patientFeedbackNotes: "",
      doctorNotes: "",

      notificationText: "",
      notificationLevel: ""
    };


    this.handleNotesChange = this.handleNotesChange.bind(this);


    this.setNotificationText = this.setNotificationText.bind(this);
    this.setNotificationLevel = this.setNotificationLevel.bind(this);

    this.startSession = this.startSession.bind(this);
    this.verifyConnection = this.verifyConnection.bind(this);
    this.startGroup = this.startGroup.bind(this);
    this.stopGroup = this.stopGroup.bind(this);
    this.sendFeedbackRequestToServer = this.sendFeedbackRequestToServer.bind(this);

    this.handleRequestGetRegisterConfig = this.handleRequestGetRegisterConfig.bind(this);
    this.handleRequestSetRegisterConfig = this.handleRequestSetRegisterConfig.bind(this);

    this.handlePatientFirstNameChange = this.handlePatientFirstNameChange.bind(this);
    this.handlePatientLastNameChange = this.handlePatientLastNameChange.bind(this);
    this.handleDownloadDemosJSON = this.handleDownloadDemosJSON.bind(this);
    this.downloadPatientConfig = this.downloadPatientConfig.bind(this);
    this.handleNewPatientConfigFile = this.handleNewPatientConfigFile.bind(this);
    
    this.doNothing = this.doNothing.bind(this);
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
      this.setState({ file: event.dataTransfer.files[0], newFile: true });
      this.handleNewPatientConfigFile(event.dataTransfer.files[0]);
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
      this.setState({ file: event.target.files[0], newFile: true });
      this.handleNewPatientConfigFile(event.target.files[0]);
    }
  };

  componentDidMount() {
    this.startSession();
    window.addEventListener("dragover", (event: Event) => {
      this.overrideEventDefaults(event);
    });
    window.addEventListener("drop", (event: Event) => {
      this.overrideEventDefaults(event);
    });
  } // End ComponentDidMount

  componentDidUpdate() {

    if (this.props.autogen) {
      if (this.props.autogen.name === 'Demo Upload Failed' && this.props.autogen.name != this.state.uiConfigName) {
        this.setNotificationLevel('error');
        this.setNotificationText('Demo Upload Failed');
        this.setState({ uiConfigName: this.props.autogen.name });
      }
      else if (this.props.autogen.name === "ERROR" && this.props.autogen.name != this.state.uiConfigName) {
        this.setNotificationLevel('error');
        this.setNotificationText('Control Generation Failed');
        this.setState({ uiConfigName: this.props.autogen.name });
      }
      else if (this.props.autogen.name != this.state.uiConfigName){
        this.setNotificationLevel('success');
        this.setNotificationText('New Controls Generated: ' + this.props.autogen.name);
        this.setState({ uiConfigName: this.props.autogen.name });
      }
    }
  }//End ComponentDidUpdate

  componentWillMount() {
    window.removeEventListener("dragover", this.overrideEventDefaults);
    window.removeEventListener("drop", this.overrideEventDefaults);
  }

  handleNotesChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (!this.state.newFile) {
      this.setState({ doctorNotes: e.target.value });
    }
  }

  handlePatientFirstNameChange(e: React.ChangeEvent<HTMLInputElement>) {
    this.setState({ patientFirstName: e.target.value });
  }

  handlePatientLastNameChange(e: React.ChangeEvent<HTMLInputElement>) {
    this.setState({ patientLastName: e.target.value });
  }

  handleRequestGetRegisterConfig(callback: Function) {

    this.props.requestAutogenConfiguration(this.props.deviceAddress);
  }

  handleRequestSetRegisterConfig(configuration: OpenSpeechDataStore.ModelData[]) {
    var output: OpenSpeechDataStore.DataPacket[] = [];
    var packet: OpenSpeechDataStore.DataPacket;
    for (var i = 0; i < configuration.length; i++) {
        packet = {
           index: i,
           value : configuration[i].value
        }
        output.push(packet);
      }
    this.props.requestSendModelData(output, this.props.deviceAddress);
  }

  handleNewPatientConfigFile(configFile: File | null) {
    if (configFile) {
      var text: string;
      text = "";

      var reader = new FileReader();
      reader.readAsBinaryString(configFile);
      reader.onloadend = ( () => {
        text = reader.result as string;
        var obj = JSON.parse(text);

        interface patientConfig {
          patientFeedback: number,
          patientFeedbackNotes: string,
          doctorNotes: string,
          patientFirstName: string,
          patientLastName: string,
          configuration: OpenSpeechDataStore.ModelData[] | undefined
        }

        var config: patientConfig = {
          patientFeedback: obj.patientFeedback,
          patientFeedbackNotes: obj.patientFeedbackNotes,
          doctorNotes: obj.doctorNotes,
          patientFirstName: obj.patientFirstName,
          patientLastName: obj.patientLastName,
          configuration: obj.registerConfiguration,
        };
        this.setState({
          patientFeedback: config.patientFeedback,
          patientFeedbackNotes: config.patientFeedbackNotes,
          doctorNotes: config.doctorNotes,
          patientFirstName: config.patientFirstName,
          patientLastName: config.patientLastName,
          newFile: false
        });

        this.handleRequestSetRegisterConfig(config.configuration as OpenSpeechDataStore.ModelData[]);
      });
    }
  }


  handleDownloadDemosJSON = () => {
    this.handleRequestGetRegisterConfig(this.downloadPatientConfig);
  }

  downloadPatientConfig() {
    interface patientConfig {
      patientFeedback: number,
      patientFeedbackNotes: string,
      doctorNotes: string,
      patientFirstName: string,
      patientLastName: string,
      configuration: OpenSpeechDataStore.ModelData[] | undefined | null
    }

    var config: patientConfig = {
      patientFeedback: this.state.patientFeedback,
      patientFeedbackNotes: this.state.patientFeedbackNotes,
      doctorNotes: this.state.doctorNotes,
      patientFirstName: this.state.patientFirstName,
      patientLastName: this.state.patientLastName,
      configuration: null
    };
    if (this.props.autogen) {
      config.configuration = this.props.autogen.data;
    }

    downloadObjectAsJson(config, "patient_config");
  }


  setNotificationText(text:string) {
    this.setState({notificationText:text});
  }

  setNotificationLevel(level:string) {
    this.setState({notificationLevel:level});
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

    connection.on("ReceiveMessage", (user, message) => {
      var msg = message.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
      var encodedMsg = user + ": " + msg;
      this.setState({ message: encodedMsg });
    });

    connection.on("GroupMessage", (message) => {
      var msg = message.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
      var encodedMsg = msg;
      this.setState({
        notificationLevel: "info",
        notificationText: msg
      })
    });

    connection.on("AddedToGroup", (message) => {
      this.setState({
        sessionStarted: true,
        notificationLevel: "info",
        notificationText: message
      })
    });

    connection.on("RequestToJoin", (message) => {
      connection.invoke("AcceptRequestToJoinGroup", this.state.groupID,message).catch(function (err) {
        return console.error(err.toString());
      });
    });

    connection.on("LeftGroup", (message) => {
      this.setState({
        sessionStarted: false,
        notificationLevel: "info",
        notificationText: message
      })
    });

    connection.on("UserDisconnected", (user) => {
      var msg = "User " + user + " has disconnected";
      this.setState({
        notificationLevel: "warning",
        notificationText: msg
      });
    });

    connection.on("ReceiveFeedback", (user, feedback, notes) => {
      this.setState({ message: feedback });

      var feedbackLevel = "";
      var feedbackText = "";

      if (feedback === 1) { feedbackLevel = "success";feedbackText = "Good";}
      else if (feedback === -1) { feedbackLevel = "error"; feedbackText = "Bad";}
      else { feedbackLevel = "warning"; feedbackText = "Neutral";}

      var d = new Date();
      var n = d.toLocaleTimeString();
      feedbackText = user + " Feedback: " + feedbackText + " at " + n;

      this.setState({
        notificationLevel: feedbackLevel,
        notificationText: feedbackText,
        patientFeedback: feedback,
        patientFeedbackNotes: notes
      });
    });

    connection.on("GroupEnded", (message) => {
      var msg = message.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
      this.setState({
        sessionStarted: false,
        sessionPatientConnected:false,
        groupID: "Inactive"
      })
    });

    connection.start()
      .then(function (val) {
        
    }).then(res => this.verifyConnection())
      .catch(function (err) {
        setTimeout(() => connection.start(), 5000);
        return console.error(err.toString());

    });

  } //End Start Connection to SignalR Client hub


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
  }

  stopGroup() {
    connection.invoke("EndGroup", this.state.groupID).catch(function (err) {
      return console.error(err.toString());
    });
    this.setState({ sessionStarted: false,groupID:"" });
  }

  sendFeedbackRequestToServer() {
    connection.invoke("RequestFeedback", this.state.user, this.state.groupID).catch(function (err) {
      return console.error(err.toString());
    });
  }

  doNothing() {

  } 

  render() {

    function disableIfNotChosen(choice:number|null,itemNumber:number) {
      if (choice === itemNumber) {
        return false;
      }
      else {
        return true;
      }
    }

    function feedbackUI(props: DoctorView, state: IState) {
      
      return (
        <Modal.Dialog className="">
          <Modal.Header>
            <Modal.Title>Patient Feedback</Modal.Title>
            <div className="flex-right">
              <Button
                onClick={props.sendFeedbackRequestToServer}
                className="btn-simple btn-icon"
              >
                <i className="fa fa-pencil-square-o large-icon" />
              </Button>
              <Button
                variant="primary"
                className="float-right btn-simple btn-icon"
                onClick={props.handleDownloadDemosJSON}>
                <i className="fa fa-save large-icon" />
              </Button>
              <FileUploaderPresentationalComponent
                dragging={props.state.dragging}
                file={props.state.file}
                onSelectFileClick={props.onSelectFileClick}
                onDrag={props.overrideEventDefaults}
                onDragStart={props.overrideEventDefaults}
                onDragEnd={props.overrideEventDefaults}
                onDragOver={props.overrideEventDefaults}
                onDragEnter={props.dragenterListener}
                onDragLeave={props.dragleaveListener}
                onDrop={props.dropListener}
              >
                <input
                  ref={el => (props.fileUploaderInput = el)}
                  type="file"
                  className="file-uploader-hidden file-uploader__input"
                  onChange={props.onFileChanged}
                />
              </FileUploaderPresentationalComponent>
            </div></Modal.Header>
          <Form className = "display-em">
            <FormControl
              className="patient-first-name"
              placeholder="First name"
              value={state.patientFirstName}
              onChange={props.handlePatientFirstNameChange}
              />
            <FormControl
              className="patient-last-name"
              placeholder="Last name"
              value={state.patientLastName}
              onChange={props.handlePatientLastNameChange}
            />
          </Form>
          <div className="patient-feedback-interface">
            <Button
              variant="light"
              disabled={disableIfNotChosen(state.patientFeedback,1)}
              className="btn-simple btn-icon btn-success"
            >
              <i className="fa fa-smile-o large-icon" />
            </Button>
            <Button
              variant="light"
              disabled={disableIfNotChosen(state.patientFeedback, 0)}
              className="btn-simple btn-icon btn-warning"
            >
              <i className="far fa-meh large-icon" />
            </Button>
            <Button
              variant="light"
              disabled={disableIfNotChosen(state.patientFeedback, -1)}
              className="btn-simple btn-icon btn-danger"
            >
              <i className="far fa-frown large-icon" />
            </Button>
          </div>
          <div>
            <InputGroup>
              <InputGroup.Prepend>
                <InputGroup.Text>Patient Notes</InputGroup.Text>
              </InputGroup.Prepend>
              <FormControl
                value={state.patientFeedbackNotes}
                disabled
                as="textarea"
                aria-label="With textarea" />
            </InputGroup>
            <InputGroup>
              <InputGroup.Prepend>
                <InputGroup.Text>Doctor Notes</InputGroup.Text>
              </InputGroup.Prepend>
              <FormControl
                value={state.doctorNotes}
                onChange={props.handleNotesChange}
                as="textarea"
                aria-label="With textarea" />
            </InputGroup>
          </div>

        </Modal.Dialog>
      );
    }

    function isSessionActive(state: IState){
      var sessionClassName = "doctor-session ";
      if (state.sessionStarted) {
        sessionClassName += ("session-active");
      }
      else {
        sessionClassName += ("session-inactive");
      }
      return sessionClassName;
    }

    function getSessionButton(props: DoctorView, state: IState) {
      if (state.sessionStarted && state.connectedToServer) {
        return (
          <Button
            className="flex-right btn-simple btn-icon"
            onClick={props.stopGroup}
          ><i className="fa fa-stop large-icon" />
          </Button>);
      }
      else if (!state.sessionStarted && state.connectedToServer) {
        return (
          <Button
            className="flex-right btn-simple btn-icon"
            onClick={props.startGroup}
          ><i className="fa fa-play large-icon" />
          </Button>);
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
        />
        <Container fluid>
          <Row>
            <Modal.Dialog>
              <Modal.Header className={isSessionActive(this.state)}>
                <Modal.Title className="float-left">
                  Session
                </Modal.Title>
                {getSessionButton(this, this.state)}
              </Modal.Header>
              <Row>
                <h4 className="centered-header">{this.state.groupID}</h4>
              </Row>
            </Modal.Dialog>
          </Row>
          <Row>{feedbackUI(this,this.state)}</Row>
          <ControlPanel
            {...this.props}
          />
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
)(DoctorView as any);     
