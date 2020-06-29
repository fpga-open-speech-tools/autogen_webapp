
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

export class AutoGenControls extends React.PureComponent<OpenSpeechProps,AutoGenState>{

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

    this.handleRequestUI = this.handleRequestUI.bind(this);
    this.handleInputCommand = this.handleInputCommand.bind(this);

    this.setNotification = this.setNotification.bind(this);
  }


  componentDidMount() {
    this.handleRequestUI();
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

  handleDeviceAddressChange(e: React.ChangeEvent<HTMLInputElement>, key: string) {
    var deviceAddress = this.props.deviceAddress;
    switch (key) {
      case 'ip1': 
        deviceAddress.ipAddress.ip1 = e.target.value;
        break;
      
      case 'ip2': 
          deviceAddress.ipAddress.ip2 = e.target.value;
        break;
      
      case 'ip3': 
          deviceAddress.ipAddress.ip3 = e.target.value;
        break;
      
      case 'ip4': 
        deviceAddress.ipAddress.ip4 = e.target.value;
        break;
      
      case 'port': 
        deviceAddress.port = e.target.value;
        break;
      
      default:
        break;
    }
    this.props.setDeviceAddress(deviceAddress);
  }

  handleRequestUI() {
    this.props.requestOpenSpeechUI(this.props.deviceAddress);
  }

  handleInputCommand(module: string, link: string, value: string) {
    if (!this.props.isLoading) {
      this.props.requestSendCommand(link, value, module,this.props.deviceAddress);
    }
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

    function getAutogen(state: AutoGenControls, props: OpenSpeechProps) {
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


    return (
      <div className="content">
        <NotificationWrapper
          pushText={this.state.notification.text}
          level={this.state.notification.level}
        />
        <Container fluid>
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
)(AutoGenControls as any);    
