
import * as React from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps } from 'react-router';
import * as OpenSpeechDataStore from '../../Store/OpenSpeechToolsData';
import { ApplicationState } from '../..';
import {
  Container, Row, Col, InputGroup,
  FormControl, Button, Spinner,
  Card, Jumbotron, Modal
} from "react-bootstrap";
import { OpenSpeechDemoCard } from "../../Components/OpenSpeechDemos/OpenSpeechDemoCard.jsx";
import { EffectPageDiv } from "../../Components/Autogen/Containers/EffectPageDiv.jsx";
import NotificationWrapper from "../../Components/Notifications/NotificationWrapper.jsx";


// At runtime, Redux will merge together...
type OpenSpeechProps =
  OpenSpeechDataStore.OpenSpeechToolsState // ... state we've requested from the Redux store
  & typeof OpenSpeechDataStore.openSpeechDataActionCreators // ... plus action creators we've requested
  & RouteComponentProps<{}>; // ... plus incoming routing parameters

export interface AutoGenState {
  downloadStatus: DownloadStatus,
  uiConfig: UIConfig,
  notification: Notification
}


interface DownloadStatus {
  lastDownloadProgressRequestTime: number,
  lastDownloadProgress: number,
}

interface UIConfig {
  name: string,
  projectID: string,
}

interface Notification {
  text: string,
  level: string
}

export class AutoGenStates extends React.PureComponent<OpenSpeechProps,AutoGenState>{

  constructor(props: OpenSpeechProps) {
    super(props);

    this.state = {
      downloadStatus: {
        lastDownloadProgressRequestTime: 0,
        lastDownloadProgress: 0,
      },

      notification: {
        text: "",
        level: ""
      },

      uiConfig: {
        name: "",
        projectID: "Example",
      }

    };

    this.handleDeviceAddressChange = this.handleDeviceAddressChange.bind(this);

    this.handleRequestUI = this.handleRequestUI.bind(this);
    this.handleInputCommand = this.handleInputCommand.bind(this);

    this.handlelastDownloadProgressRequestTimeChange = this.handlelastDownloadProgressRequestTimeChange.bind(this);
    this.handleDownloadDemo = this.handleDownloadDemo.bind(this);
    this.handleRequestDownloadProgress = this.handleRequestDownloadProgress.bind(this);

    this.setNotification = this.setNotification.bind(this);
  }


  componentDidMount() {
    this.props.requestOpenSpeechS3Demos();
    this.handleRequestUI();

    if (this.props.downloadProgress) {
      if (this.state.downloadStatus.lastDownloadProgress !== this.props.downloadProgress.progress) {
        this.setState({
          downloadStatus: {
            lastDownloadProgress: this.props.downloadProgress.progress,
            lastDownloadProgressRequestTime: this.state.downloadStatus.lastDownloadProgressRequestTime
          }
        });
        this.forceUpdate();
      }
    }
  }
  componentDidUpdate() {

    if (this.props.uiConfig) {
      if (this.props.uiConfig.name === 'Demo Upload Failed' && this.props.uiConfig.name != this.state.uiConfig.name) {
        this.setNotification('error', 'Demo Upload Failed');
        this.setState({
          uiConfig: {
            name: this.props.uiConfig.name,
            projectID: this.state.uiConfig.projectID
          }
        });
      }
      else if (this.props.uiConfig.name === "ERROR" && this.props.uiConfig.name != this.state.uiConfig.name) {
        this.setNotification('error', 'Control Generation Failed')
        this.setState({
          uiConfig: {
            name: this.props.uiConfig.name,
            projectID: this.state.uiConfig.projectID
          }
        });
      }
      else if (this.props.uiConfig.name != this.state.uiConfig.name) {
        this.setNotification('success', 'New Controls Generated');
        this.setState({
          uiConfig: {
            name: this.props.uiConfig.name,
            projectID: this.state.uiConfig.projectID
          }
        });
      }
    }
  }

  handlePollDownloadProgress() {
    if (this.props.isDeviceDownloading) {
      var date = new Date();
      var currentDateInMS = date.getTime();
      var requestRateInMS = 100;

      //if the current datetime in milliseconds is greater the last request log plus the request rate,
      //Then set the new request datetime in milliseconds, and request the download progress.
      if (currentDateInMS > (this.state.downloadStatus.lastDownloadProgressRequestTime + requestRateInMS)) {
        this.handlelastDownloadProgressRequestTimeChange(currentDateInMS);
        this.handleRequestDownloadProgress();
      }
    }
  }

  handleChangeIP1(e: React.ChangeEvent<HTMLInputElement>){
    this.handleDeviceAddressChange(e, 'ip1');
  }
  handleChangeIP2(e: React.ChangeEvent<HTMLInputElement>) {
    this.handleDeviceAddressChange(e, 'ip2');
  }
  handleChangeIP3(e: React.ChangeEvent<HTMLInputElement>) {
    this.handleDeviceAddressChange(e, 'ip3');
  }
  handleChangeIP4(e: React.ChangeEvent<HTMLInputElement>) {
    this.handleDeviceAddressChange(e, 'ip4');
  }
  handleChangePort(e: React.ChangeEvent<HTMLInputElement>) {
    this.handleDeviceAddressChange(e, 'port');
  }

  handleDeviceAddressChange(e: React.ChangeEvent<HTMLInputElement>,key:string) {
    switch (key) {
      case 'ip1': {

        this.setState({
          deviceAddress: {
            ipFragment1: e.target.value,
            ipFragment2: this.state.deviceAddress.ipFragment2,
            ipFragment3: this.state.deviceAddress.ipFragment3,
            ipFragment4: this.state.deviceAddress.ipFragment4,
            port: this.state.deviceAddress.port
          }
        });
        break;
      }
      case 'ip2': {
        this.setState({
          deviceAddress: {
            ipFragment1: this.state.deviceAddress.ipFragment1,
            ipFragment2: e.target.value,
            ipFragment3: this.state.deviceAddress.ipFragment3,
            ipFragment4: this.state.deviceAddress.ipFragment4,
            port: this.state.deviceAddress.port
          }
        });
        break;
      }
      case 'ip3': {
        this.setState({
          deviceAddress: {
            ipFragment1: this.state.deviceAddress.ipFragment1,
            ipFragment2: this.state.deviceAddress.ipFragment2,
            ipFragment3: e.target.value,
            ipFragment4: this.state.deviceAddress.ipFragment4,
            port: this.state.deviceAddress.port
          }
        });
        break;
      }
      case 'ip4': {
        this.setState({
          deviceAddress: {
            ipFragment1: this.state.deviceAddress.ipFragment1,
            ipFragment2: this.state.deviceAddress.ipFragment2,
            ipFragment3: this.state.deviceAddress.ipFragment3,
            ipFragment4: e.target.value,
            port: this.state.deviceAddress.port
          }
        });
        break;
      }
      case 'port': {
        this.setState({
          deviceAddress: {
            ipFragment1: this.state.deviceAddress.ipFragment1,
            ipFragment2: this.state.deviceAddress.ipFragment2,
            ipFragment3: this.state.deviceAddress.ipFragment3,
            ipFragment4: this.state.deviceAddress.ipFragment4,
            port: e.target.value
          }
        });
        break;
      }
      default:
        break;
    }
  }

  handlelastDownloadProgressRequestTimeChange(n: number) {
    this.setState({
      downloadStatus: {
        lastDownloadProgress: n,
        lastDownloadProgressRequestTime: this.state.downloadStatus.lastDownloadProgressRequestTime
      }
    });
  }

  handleRequestUI() {
    this.props.requestOpenSpeechUI(
      this.state.deviceAddress.ipFragment1,
      this.state.deviceAddress.ipFragment2,
      this.state.deviceAddress.ipFragment3,
      this.state.deviceAddress.ipFragment4,
      this.state.deviceAddress.port);
  }

  handleInputCommand(module: string, link: string, value: string) {
    if (!this.props.isLoading) {
      this.props.requestSendCommand(link, value, module,
        this.state.deviceAddress.ipFragment1,
        this.state.deviceAddress.ipFragment2,
        this.state.deviceAddress.ipFragment3,
        this.state.deviceAddress.ipFragment4,
        this.state.deviceAddress.port);
    }
  }

  handleDownloadDemo(device:string,project:string) {
    if (!this.props.isLoading) {
      this.setState({
        uiConfig: {
          projectID: project,
          name: this.state.uiConfig.name
        }
      });
      this.props.requestDownloadS3Demo(device, project,
        this.state.deviceAddress.ipFragment1,
        this.state.deviceAddress.ipFragment2,
        this.state.deviceAddress.ipFragment3,
        this.state.deviceAddress.ipFragment4,
        this.state.deviceAddress.port);
    }
  }

  handleRequestDownloadProgress() {
    this.props.requestS3DownloadProgress(
      this.state.deviceAddress.ipFragment1,
      this.state.deviceAddress.ipFragment2,
      this.state.deviceAddress.ipFragment3,
      this.state.deviceAddress.ipFragment4,
      this.state.deviceAddress.port);
  }


  setNotification(level: string, text: string) {
    this.setState({
      notification: {
        level:level,
        text:text
      }
    });
  }

  render() {

    function getAutogen(state: AutoGenStates, props: OpenSpeechProps) {
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
                        callback={state.handleInputCommand}
                        module={module}
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
    }


      function animateDownloadStatus(state: AutoGenState, props:OpenSpeechProps, projectID: string) {
      if (props.isDeviceDownloading === true) {
        if (state.uiConfig.projectID === projectID) {
          return (
            <Spinner animation="border" variant="light" className="open-speech-loading-anim"/>
            );
        }
        else {
          return (
            <i className="fas fa-info large-icon open-speech-accent-icon" />);
        }
      }
      if (props.uiConfig && props.currentDemo) {
        if (props.uiConfig.name === "Demo Upload Failed" && props.currentDemo === projectID) {
          return (< i className="fa fa-times open-speech-accent-font" />);
        }
        else {
          return (<i className="fas fa-info  open-speech-accent-icon" />);
        }
      }
      else {
        return (<i className="fas fa-info open-speech-accent-icon" />);
      }
    }


    //Would like to rewrite this to better consider properties of selection. 
    //Currently, takes into account ui return, selected projectID and object, as well as determines if downloading.
     function highlightIfDownloaded(state: AutoGenState, props: OpenSpeechProps, projectID: string) {
      if (!props.isDeviceDownloading) {
        if (props.currentDemo === projectID) {
          if (props.uiConfig) {
            if (props.uiConfig.name === "Demo Upload Failed") {
              return ("card card-stats open-speech-is-error-highlighted");
            }//[End]If Demo upload failed
            else {
              return ("card card-stats open-speech-is-highlighted");
            }//[End]Demo upload Succeeded
          }//[End]UI Config Exists
          else {return ("card card-stats open-speech-is-highlighted");}
        }//[End] currentDemo downloaded is the entered objectID
        else {
          return ("card card-stats");
        }//[End] currentDemo downloaded is not the entered objectID
      }//[End] Device is NOT downloading
      else {
        return ("card card-stats");
      }//[End] Device IS downloading
    }//[end]highlightIfDownloaded

    return (
      <div className="content">
        <NotificationWrapper
          pushText={this.state.notification.text}
          level={this.state.notification.level}
        />
        <Container fluid>
          <Row>
            <Modal.Dialog>
              <Modal.Header>
                <Modal.Title>Connection</Modal.Title>
              </Modal.Header>
              <Col lg={12} md={12} sm={12}>
              <InputGroup className="mb-2">
                <InputGroup.Prepend>
                <InputGroup.Text id="inputGroup-sizing-default">IP</InputGroup.Text>
                </InputGroup.Prepend>
                <FormControl
                  name="ip1"
                    defaultValue={this.state.deviceAddress.ipFragment1}
                    onChange={this.handleChangeIP1}
                  aria-label="IP1"
                  aria-describedby="inputGroup-sizing-default"
                />
                <FormControl
                    name="ip2"
                    defaultValue={this.state.deviceAddress.ipFragment2}
                  onChange={this.handleChangeIP2}
                  aria-label="IP2"
                  aria-describedby="inputGroup-sizing-default"
                />
                <FormControl
                  name="ip3"
                  defaultValue={this.state.deviceAddress.ipFragment3}
                  onChange={this.handleChangeIP3}
                  aria-label="IP3"
                  aria-describedby="inputGroup-sizing-default"
                />
                <FormControl
                  name="ip4"
                    defaultValue={this.state.deviceAddress.ipFragment4}
                    onChange={this.handleChangeIP4}
                  aria-label="IP4"
                  aria-describedby="inputGroup-sizing-default"
                />
              </InputGroup>
              </Col>
              <Col lg={12} md={12} sm={12}>
              <InputGroup className="mb-3">
                <InputGroup.Prepend>
                  <InputGroup.Text id="inputGroup-sizing-default">Port</InputGroup.Text>
                </InputGroup.Prepend>
                <FormControl
                  name="port"
                    value={this.props.deviceAddress.port}
                  onChange={this.handleChangePort}
                  aria-label="Port"
                  aria-describedby="inputGroup-sizing-default"
                />
              </InputGroup>
              </Col>
              </Modal.Dialog>
          </Row>
          <Row>
          <Modal.Dialog>
              <Modal.Header>
                <Modal.Title>Available Demos</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <Row>
            {this.props.availableDemos.map((d: OpenSpeechDataStore.Demo) => 
              <React.Fragment key = { d.name }>
                <OpenSpeechDemoCard
                  isSelected={highlightIfDownloaded(this.state,this.props,d.name)}
                  isDownloading={animateDownloadStatus(this.state,this.props,d.name)}
                  downloadDevice={d.downloadurl.devicename}
                  downloadProject={d.downloadurl.projectname}
                  headerTitle={d.name}
                  callback={this.handleDownloadDemo}
                  statsValue={(d.filesize/1000000).toFixed(2) + "MB"}
                  statsIcon={<i className="fa fa-folder-o" />}
                  statsIconText={d.downloadurl.devicename + "/" + d.downloadurl.projectname}
                />
              </React.Fragment>
            )} 
          </Row>
                </Modal.Body>
            </Modal.Dialog>
          </Row>
          <Row>
            <Modal.Dialog>
              <Modal.Header><Modal.Title className="float-left">Controls</Modal.Title>
                <div className="float-right">
                <Button
                  variant="primary"
                  className="btn-simple btn-icon"
                  onClick={this.handleRequestUI}
                >
                  <i className="fa fa-refresh large-icon" />
                </Button>
              </div></Modal.Header>

            {getAutogen(this, this.props)}
            </Modal.Dialog>
            </Row>
        </Container>
      </div>
    );
  }
  
}

export default connect(
  (state: ApplicationState) => state.openSpeechData,
  OpenSpeechDataStore.openSpeechDataActionCreators
)(AutoGenStates as any);    
