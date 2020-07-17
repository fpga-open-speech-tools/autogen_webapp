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
import NotificationWrapper from "../../Components/Notifications/NotificationWrapper.jsx";
import AutogenContainer from "../../Components/Autogen/Containers/AutogenContainer.jsx";

// At runtime, Redux will merge together...
type OpenSpeechProps =
  OpenSpeechDataStore.OpenSpeechToolsState // ... state we've requested from the Redux store
  & typeof OpenSpeechDataStore.openSpeechDataActionCreators // ... plus action creators we've requested
  & RouteComponentProps<{}>; // ... plus incoming routing parameters

export interface AutoGenState {
  autogen: Autogen,
  notification: Notification
}

interface Autogen {
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

      notification: {
        text: "",
        level: ""
      },

      autogen: {
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

    if (this.props.autogen) {
      if (this.props.autogen.name === 'Demo Upload Failed' && this.props.autogen.name != this.state.autogen.name) {
        this.setNotification('error', 'Demo Upload Failed');
        this.setState({
          autogen: {
            name: this.props.autogen.name,
            projectID: this.state.autogen.projectID
          }
        });
      }
      else if (this.props.autogen.name === "ERROR" && this.props.autogen.name != this.state.autogen.name) {
        this.setNotification('error', 'Control Generation Failed')
        this.setState({
          autogen: {
            name: this.props.autogen.name,
            projectID: this.state.autogen.projectID
          }
        });
      }
      else if (this.props.autogen.name != this.state.autogen.name) {
        this.setNotification('success', 'New Controls Generated');
        this.setState({
          autogen: {
            name: this.props.autogen.name,
            projectID: this.state.autogen.projectID
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
    this.props.requestAutogenConfiguration(this.props.deviceAddress);
  }

  handleInputCommand(command:OpenSpeechDataStore.DataPacket[]) {
    if (!this.props.isLoading) {
      this.props.requestSendModelData(command, this.props.deviceAddress);
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
      if (props.autogen) {
        if (
          props.autogen.containers.length > 0 &&
          props.autogen.data.length > 0 &&
          props.autogen.views.length > 0) {
          var effectName = props.autogen.name ? props.autogen.name : "";
          effectName = (effectName === "ERROR") ? "" : effectName;
          return (
            <div className="autogen autogen-effectContainer modal-body">
              <Jumbotron className="autogen-effect-name">{effectName}</Jumbotron>
              <Row className="autogen-pages row">
                {props.autogen.containers.map((container) =>
                  <React.Fragment key={container.name}>
                    <AutogenContainer
                      references={container.views}
                      headerTitle={container.name}
                      views={...props.autogen.views}
                      data={...props.autogen.data}
                      callback={state.handleInputCommand}
                    />
                  </React.Fragment>)
                }
              </Row>
            </div>);
        }
        else if (props.autogen.name) {
          var effectName = props.autogen.name ? props.autogen.name : "";
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
