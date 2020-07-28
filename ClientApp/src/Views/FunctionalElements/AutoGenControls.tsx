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
import {ModelDataClient} from '../../SignalR/ModelDataClient';

// At runtime, Redux will merge together...
type OpenSpeechProps =
  OpenSpeechDataStore.OpenSpeechToolsState // ... state we've requested from the Redux store
  & typeof OpenSpeechDataStore.openSpeechDataActionCreators // ... plus action creators we've requested
  & RouteComponentProps<{}>; // ... plus incoming routing parameters

export interface AutoGenState {
  autogen: OpenSpeechDataStore.Autogen,
  notification: Notification,
  //data: OpenSpeechDataStore.ModelData[],
  newAutogen: boolean;
  dataUpdated: boolean;
  connected: boolean,
  editable: boolean,
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

export class AutoGenControls extends React.Component<OpenSpeechProps,AutoGenState>{
  
  constructor(props: OpenSpeechProps) {
    super(props);

    this.state = {

      connected: false,
      editable: false,
      notification: {
        text: "",
        level: ""
      },

      autogen: this.props.autogen,
      //data: []
      newAutogen: false,
      dataUpdated:false

    };

    this.handleRequestUI = this.handleRequestUI.bind(this);
    this.handleInputCommand = this.handleInputCommand.bind(this);

    this.setNotification = this.setNotification.bind(this);
    this.sendDataPackets = this.sendDataPackets.bind(this);
    this.updateModelData = this.updateModelData.bind(this);
    this.receiveDataPackets = this.receiveDataPackets.bind(this);
    this.handleMessage = this.handleMessage.bind(this);

    this.updateModelFromProps = this.updateModelFromProps.bind(this);
    this.getAutogen = this.getAutogen.bind(this);

    this.controlEditable = this.controlEditable.bind(this);
    this.saveEdit = this.saveEdit.bind(this);
    this.cancelEdit = this.cancelEdit.bind(this);
  }

  componentWillReceiveProps() {
    this.updateModelFromProps();
  }
 
  shouldComponentUpdate(nextProps: OpenSpeechProps,nextState:AutoGenState) {
    if (nextProps.autogen.data.length > 0) {
      return true;
    }
    else if (nextProps.deviceAddress !== this.props.deviceAddress) {
      return true;
    }
    else if (nextState.editable != this.state.editable) {
      return true;
    }

    return false;
  }

  componentDidMount() {
    this.handleRequestUI();
    this.props.requestRTCEnable(this.props.deviceAddress);
    modelDataClient.callbacks.incomingMessageListener = this.handleMessage;
    modelDataClient.callbacks.incomingDataListener = this.receiveDataPackets;
    modelDataClient.startSession();
  }

  componentDidUpdate() {
    if (this.props.autogen && modelData) {
      if (modelData != this.props.autogen.data) {
        this.updateModelFromProps();
      }
    }
    if (this.props.autogen) {
      if (this.props.autogen.name === 'Demo Upload Failed' && this.props.autogen.name != this.state.autogen.name) {
        this.setNotification('error', 'Demo Upload Failed');

      }
      else if (this.props.autogen.name === "ERROR" && this.props.autogen.name != this.state.autogen.name) {
        this.setNotification('error', 'Control Generation Failed');
      }
      else if (this.props.autogen.name != this.state.autogen.name) {
        this.setNotification('success', 'New Controls Generated');
      }
    }
  }

  sendDataPackets(dataPackets: OpenSpeechDataStore.DataPacket[]) {
    modelDataClient.sendObject(dataPackets);
  }

  receiveDataPackets(object:any) {
    this.updateModelData(object as OpenSpeechDataStore.DataPacket[]);
  }

  updateModelFromProps = () =>{
    async function overwriteModel(controls: AutoGenControls) {
      modelData = controls.props.autogen.data; 
    }

    async function updateModel(controls: AutoGenControls) {
      controls.setState({ newAutogen: true });
    }

    async function modelUpdated(controls: AutoGenControls) {
      controls.setState({ newAutogen: false });
    }

    async function update(controls: AutoGenControls) {
      await overwriteModel(controls);
      await updateModel(controls);
      await modelUpdated(controls);
    }
    update(this);
  }

  updateModelData = (dataPackets: OpenSpeechDataStore.DataPacket[]) => {
    dataPackets.map((packet) => {
      process(this,packet,modelData);
    });
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

  handleInputCommand = (command: OpenSpeechDataStore.DataPacket[]) =>{
    this.updateModelData(command);
    if(!this.props.isLoading){
      if (modelDataClient.state.connected && this.props.rtcEnabled) {
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

  makeEditable = () => {
    this.setState({ editable: true });
  }

  cancelEdit = () => {
    this.setState({ editable: false });
  }

  saveEdit = () => {
    this.props.requestSendAutogenConfiguration(this.props.deviceAddress, this.state.autogen);
    this.setState({ editable: false });
  }

  controlEditable = () => {
    if (!this.state.editable) {
      return (
        <div className="float-right">
          <Button
            variant="primary"
            className="btn-simple btn-icon"
            onClick={this.makeEditable}
          >
            <i className="fa fa-pencil-square-o large-icon" />
          </Button>
        </div>);
    }
    else {
      return (
        <div className="float-right">
          <Button
            variant="primary"
            className="btn-simple btn-icon"
            onClick={this.saveEdit}
          >
            <i className="fa fa-save large-icon" />
          </Button>
          <Button
            variant="primary"
            className="btn-simple btn-icon"
            onClick={this.cancelEdit}
          >
            <i className="fa fa-times large-icon" />
          </Button>
        </div>);
    }

  }

  getAutogen = () => {
    if (this.props.autogen && modelData) {
      if (
        this.props.autogen.containers.length > 0 &&
        modelData.length > 0 &&
        this.props.autogen.views.length > 0) {
        var effectName = this.props.autogen.name ? this.props.autogen.name : "";
        effectName = (effectName === "ERROR") ? "" : effectName;
        return (
          <div className="autogen autogen-effectContainer modal-body">
            <Jumbotron className="autogen-effect-name">{effectName}</Jumbotron>
            <Row className="autogen-pages row">
              {this.props.autogen.containers.map((container) =>
                <React.Fragment key={container.name}>
                  <AutogenContainer
                    references={container.views}
                    headerTitle={container.name}
                    views={this.props.autogen.views}
                    data={modelData}
                    callback={this.handleInputCommand}
                    editable={this.state.editable}
                  />
                </React.Fragment>)
              }
            </Row>
          </div>);
      }
      else if (this.props.autogen.name) {
        var effectName = this.props.autogen.name ? this.props.autogen.name : "";
        effectName = (effectName === "ERROR") ? "" : effectName;
        return (
          <div className="autogen autogen-effectContainer autogen-error">
          </div>);
      }
    }
  }

  render() {
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
                {this.controlEditable()}
                <div className="float-right">
                <Button
                  variant="primary"
                  className="btn-simple btn-icon"
                  onClick={this.handleRequestUI}
                >
                  <i className="fa fa-refresh large-icon" />
                </Button>
                </div>
              </Modal.Header>
            {this.getAutogen()}
            </Modal.Dialog>
          </Row>
        </Container>
      </div>
    );
  }
  
}

var modelData = [] as OpenSpeechDataStore.ModelData[];

async function updateModelData(packet: OpenSpeechDataStore.DataPacket, oldModel: OpenSpeechDataStore.ModelData[]) {
  oldModel[packet.index].value = packet.value;
}

async function updateModel(controls: AutoGenControls) {
  controls.setState({ dataUpdated: true });
}

async function modelUpdated(controls: AutoGenControls) {
  controls.setState({ dataUpdated: false });
}

async function process(controls: AutoGenControls, packet: OpenSpeechDataStore.DataPacket, oldModel: OpenSpeechDataStore.ModelData[]) {
  await updateModelData(packet, oldModel);
  await updateModel(controls);
  await modelUpdated(controls);
}

export default connect(
  (state: ApplicationState) => state.openSpeechData,
  OpenSpeechDataStore.openSpeechDataActionCreators
)(AutoGenControls as any);    
