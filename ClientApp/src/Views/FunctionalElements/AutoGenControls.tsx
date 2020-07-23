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
import update from 'immutability-helper';
import {ModelDataClient} from '../../SignalR/ModelDataClient';

// At runtime, Redux will merge together...
type OpenSpeechProps =
  OpenSpeechDataStore.OpenSpeechToolsState // ... state we've requested from the Redux store
  & typeof OpenSpeechDataStore.openSpeechDataActionCreators // ... plus action creators we've requested
  & RouteComponentProps<{}>; // ... plus incoming routing parameters

export interface AutoGenState {
  autogen: Autogen,
  notification: Notification,
  data: OpenSpeechDataStore.ModelData[],
  connected: boolean,
}

interface Autogen {
  name: string,
  projectID: string,
}

interface Notification {
  text: string,
  level: string
}

let modelDataClient = new ModelDataClient();

export class AutoGenControls extends React.PureComponent<OpenSpeechProps,AutoGenState>{
  
  constructor(props: OpenSpeechProps) {
    super(props);

    this.state = {

      connected: false,

      notification: {
        text: "",
        level: ""
      },

      autogen: {
        name: "",
        projectID: "Example",
      },
      data:[]

    };

    this.handleRequestUI = this.handleRequestUI.bind(this);
    this.handleInputCommand = this.handleInputCommand.bind(this);

    this.setNotification = this.setNotification.bind(this);
    this.sendDataPackets = this.sendDataPackets.bind(this);
    this.updateModelData = this.updateModelData.bind(this);
    this.receiveDataPackets = this.receiveDataPackets.bind(this);
    this.handleMessage = this.handleMessage.bind(this);
  }

  componentWillReceiveProps() {
    if (this.props.newAutogen) {
      this.setState({ data: this.props.autogen.data });
      this.forceUpdate();
    }
  }
  
  componentDidMount() {
    this.handleRequestUI();
    modelDataClient.callbacks.incomingMessageListener = this.handleMessage;
    modelDataClient.callbacks.incomingDataListener = this.receiveDataPackets;
    modelDataClient.startSession();
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

  sendDataPackets(dataPackets: OpenSpeechDataStore.DataPacketArray) {
    modelDataClient.sendObject(dataPackets);
  }

  receiveDataPackets(object:any) {
    this.updateModelData(object);
    this.forceUpdate();
  }

  updateModelData (dataPackets: OpenSpeechDataStore.DataPacketArray) {
    for (var i = 0; i < dataPackets.dataPackets.length; i++) {

      const index = dataPackets.dataPackets[i].index;
      const value = dataPackets.dataPackets[i].value;

      let model = update(this.state.data,
        {
          [index]: {
            value: { $set: value }
          }
        }
      );
      this.setState({ data: model });
    }
    //this.forceUpdate();
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

  handleInputCommand(command: OpenSpeechDataStore.DataPacketArray) {
    this.updateModelData(command);
    if(!this.props.isLoading){
      if (modelDataClient.state.connected) {
        this.sendDataPackets(command);
      }
      else {
        this.props.requestSendModelData(command, this.props.deviceAddress);
      }
    }
  }

  handleMessage(text:string) {
    this.setState({
      notification: {
        level: "success",
        text: text
      }
    });
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

    function getAutogen(controls: AutoGenControls, props: OpenSpeechProps, state:AutoGenState) {
      if (props.autogen && state.data) {
        if (
          props.autogen.containers.length > 0 &&
          state.data.length > 0 &&
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
                      data={...state.data}
                      callback={controls.handleInputCommand}
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
            {getAutogen(this, this.props,this.state)}
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
