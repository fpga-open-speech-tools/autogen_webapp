import * as React from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps } from 'react-router';
import * as OpenSpeechDataStore from '../../Store/OpenSpeechToolsData';
import { ApplicationState } from '../..';
import {
  Container, Row, Button, Jumbotron, Modal, Form
} from "react-bootstrap";
import NotificationWrapper from "../../Components/Notifications/NotificationWrapper.jsx";
import ControlCard from "../../Components/Autogen/Containers/ControlCard.jsx";
import { ModelDataClient } from '../../SignalR/ModelDataClient';
import { GetAutogenObjectFromData, Components } from '../../Components/Autogen/Inputs/Manager/MapifyComponents.jsx';

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

interface Notification {
  text: string,
  level: string
}

let modelDataClient = new ModelDataClient();

export class ControlPanel extends React.Component<OpenSpeechProps, AutoGenState>{

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
      newAutogen: false,
      dataUpdated: false

    };

    this.handleRequestUI = this.handleRequestUI.bind(this);
    this.handleInputCommand = this.handleInputCommand.bind(this);

    this.setNotification = this.setNotification.bind(this);
    this.sendDataPackets = this.sendDataPackets.bind(this);
    this.updateModelData = this.updateModelData.bind(this);
    this.receiveDataPackets = this.receiveDataPackets.bind(this);
    this.handleMessage = this.handleMessage.bind(this);


    this.updateModelFromProps = this.updateModelFromProps.bind(this);
    this.createControlPanel = this.createControlPanel.bind(this);

    this.controlEditable = this.controlEditable.bind(this);
    this.saveEdit = this.saveEdit.bind(this);
    this.cancelEdit = this.cancelEdit.bind(this);
    this.fixEdit = this.fixEdit.bind(this);
    this.moveContainer = this.moveContainer.bind(this);
    this.deleteContainer = this.deleteContainer.bind(this);
    this.updateControlCardName = this.updateControlCardName.bind(this);
    this.updateControlPanelName = this.updateControlPanelName.bind(this);

    this.modifyContainer = this.modifyContainer.bind(this);
    this.modifyView = this.modifyView.bind(this);

  }

  componentWillReceiveProps() {
    this.updateModelFromProps();
  }

  shouldComponentUpdate(nextProps: OpenSpeechProps, nextState: AutoGenState) {
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

  componentWillUpdate() {
    if (this.props.autogen && modelData) {
      if (modelData != this.props.autogen.data) {
        this.updateModelFromProps();
      }
    }
    if (this.props.autogen) {
      if (this.props.autogen.name === 'Demo Upload Failed' && this.props.autogen.name != this.state.autogen.name) {
        this.setNotification('error', 'Demo Upload Failed');
        this.setState({ autogen: this.props.autogen });
      }
      else if (this.props.autogen.name === "ERROR" && this.props.autogen.name != this.state.autogen.name) {
        this.setNotification('error', 'Control Generation Failed');
        this.setState({ autogen: this.props.autogen });
      }
      else if (this.props.autogen.name != this.state.autogen.name) {
        this.setNotification('success', 'New Controls Generated');
        this.setState({ autogen: this.props.autogen });
      }
    }
  }

  sendDataPackets(dataPackets: OpenSpeechDataStore.DataPacket[]) {
    modelDataClient.sendObject(dataPackets);
  }

  receiveDataPackets(object: any) {
    this.updateModelData(object as OpenSpeechDataStore.DataPacket[]);
  }

  updateModelFromProps = () => {
    async function overwriteModel(controls: ControlPanel) {
      modelData = controls.props.autogen.data;
    }

    async function updateModel(controls: ControlPanel) {
      controls.setState({ newAutogen: true });
    }

    async function modelUpdated(controls: ControlPanel) {
      controls.setState({ newAutogen: false });
    }

    async function update(controls: ControlPanel) {
      await overwriteModel(controls);
      await updateModel(controls);
      await modelUpdated(controls);
    }
    update(this);
  }

  updateModelData = (dataPackets: OpenSpeechDataStore.DataPacket[]) => {
    dataPackets.map((packet) => {
      process(this, packet, modelData);
    });
  }


  handleRequestUI() {
    this.props.requestAutogenConfiguration(this.props.deviceAddress);
  }

  handleInputCommand = (command: OpenSpeechDataStore.DataPacket[]) => {
    this.updateModelData(command);
    if (!this.props.isLoading) {
      if (modelDataClient.state.connected && this.props.rtcEnabled) {
        this.sendDataPackets(command);
      }
      else {
        this.props.requestSendModelData(command, this.props.deviceAddress);
      }
    }
  }

  handleMessage(text: string) {
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
        level: level,
        text: text
      }
    });
  }


  makeEditable = () => {
    if (this.props.autogen.containers.length === 0) {
      //Generate new Autogen.
    }
    else {
      this.setState({
        editable: true
      });
    }
  }

  cancelEdit = () => {
    this.setState({ editable: false }); //Stop editing
    this.handleRequestUI();
  }

  saveEdit = () => {
    this.setState({ editable: false });
    this.props.requestSendAutogenConfiguration(this.props.deviceAddress, this.props.autogen);
    this.handleRequestUI();
  }

  fixEdit = () => {
    this.setState({ editable: false });
    this.props.requestSendAutogenConfiguration(this.props.deviceAddress, GetAutogenObjectFromData(this.props.autogen.data, this.props.autogen.name));
    this.handleRequestUI();
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
          <Button
            variant="primary"
            className="btn-simple btn-icon"
            onClick={this.fixEdit}
          >
            <i className="fa fa-wrench large-icon" />
          </Button>
        </div>
      );
    }
  }

  updateControlCardName = (title: string, index: number) => {
    var autogen = this.props.autogen;
    autogen.containers[index].name = title;
    this.props.updateAutogenProps(autogen);
    this.forceUpdate();
  }

  updateControlPanelName = (name: string) => {
    var autogen = this.props.autogen;
    autogen.name = name;
    this.props.updateAutogenProps(autogen);
    this.forceUpdate();
  }

  deleteContainer = (index: number) => {
    var autogen = this.props.autogen;
    autogen.containers.splice(index, 1);
    this.props.updateAutogenProps(autogen);
    this.forceUpdate();
  }

  removeViewFromContainer = (containerIndex: number, viewIndex: number) => {
    var autogen = this.props.autogen;
    autogen.containers[containerIndex].views.splice(viewIndex, 1);
    this.props.updateAutogenProps(autogen);
    this.forceUpdate();
  }

  modifyView = (index: number, view: OpenSpeechDataStore.ComponentView) =>{
    var autogen = this.props.autogen;
    autogen.views[index] = view;
    this.props.updateAutogenProps(autogen);
    this.forceUpdate();
  }

  modifyContainer = (index: number, container: OpenSpeechDataStore.AutogenContainer)=>{
    var autogen = this.props.autogen;
    autogen.containers[index] = container;
    this.props.updateAutogenProps(autogen);
    this.forceUpdate();
  }

  moveContainer = (index: number, direction: number) => {
    var autogen = this.props.autogen;

    //moving first element left(to end of array)
    if (direction < 1 && index === 0) {
      var currentContainer = autogen.containers.shift() as OpenSpeechDataStore.AutogenContainer;
      autogen.containers.push(currentContainer);
    }
    //moving last element right(to start of array)
    else if (direction > 0 && index === autogen.containers.length-1) {
      var currentContainer = autogen.containers.pop();
      autogen.containers.unshift(currentContainer);
    }
    //swapping indexed container with the component at the desired direction's index.
    else {
      var currentContainer = autogen.containers[index] as OpenSpeechDataStore.AutogenContainer;
      autogen.containers[index] = autogen.containers[index + direction];
      autogen.containers[index + direction] = currentContainer;
    }
    this.props.updateAutogenProps(autogen);
    this.forceUpdate();
  }

  controlPanelHeaderTitleControl = (name:string) => {
    if (this.state.editable) {
      return (
        <Form>
          <Form.Control
            size="lg" type="text"
            value={name}
            onChange={(x: React.FormEvent<HTMLInputElement>) =>
            { this.updateControlPanelName(x.currentTarget.value); }}
            />
        </Form>
        );
    }
    else {
      return (
        <Jumbotron className="autogen-effect-name">{name}</Jumbotron>
        );
    }
  }

  createControlPanel = () => {
    if (this.props.autogen && modelData) {
      if (
        this.props.autogen.containers.length > 0 &&
        modelData.length > 0 &&
        this.props.autogen.views.length > 0) {
        var effectName = this.props.autogen.name ? this.props.autogen.name : "";
        effectName = (effectName === "ERROR") ? "" : effectName;
        return (
          <div className="autogen autogen-effectContainer modal-body">
            {this.controlPanelHeaderTitleControl(effectName)}
            <Row className="autogen-pages row">
              {this.props.autogen.containers.map((container,index) =>
                <React.Fragment key={index}>
                  <ControlCard
                    references={container.views}
                    title={container.name}
                    views={this.props.autogen.views}
                    data={modelData}
                    callback={this.handleInputCommand}
                    editable={this.state.editable}
                    moveLeft={this.moveContainer}
                    moveRight={this.moveContainer}
                    delete={this.deleteContainer}
                    updateTitle={this.updateControlCardName}
                    index={index}
                    updateView={this.modifyView}
                    updateContainer={this.modifyContainer}
                    components={components}
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
            {this.createControlPanel()}
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

async function updateModel(controls: ControlPanel) {
  controls.setState({ dataUpdated: true });
}

async function modelUpdated(controls: ControlPanel) {
  controls.setState({ dataUpdated: false });
}

async function process(controls: ControlPanel, packet: OpenSpeechDataStore.DataPacket, oldModel: OpenSpeechDataStore.ModelData[]) {
  await updateModelData(packet, oldModel);
  await updateModel(controls);
  await modelUpdated(controls);
}

const components = Components().components;

export default connect(
  (state: ApplicationState) => state.openSpeechData,
  OpenSpeechDataStore.openSpeechDataActionCreators
)(ControlPanel as any);    
