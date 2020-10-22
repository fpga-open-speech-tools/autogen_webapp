import * as React from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps } from 'react-router';
import * as OpenSpeechDataStore from '../../Store/OpenSpeechToolsData';
import { ApplicationState } from '../..';
import {
  Container, Row, Button, Jumbotron, Modal, Form
} from "react-bootstrap";
import NotificationWrapper from "../../Components/Notifications/NotificationWrapper.jsx";
import ControlCard  from "../../Components/Autogen/Containers/ControlCard.jsx";
import { ModelDataClient } from '../../SignalR/ModelDataClient';
import { GetAutogenObjectFromData, Components } from '../../Components/Autogen/Inputs/Manager/MapifyComponents.jsx';
import { PopupViewEditor } from "../../Components/Autogen/Containers/PopupViewEditor.jsx";


// At runtime, Redux will merge together...
type OpenSpeechProps =
  OpenSpeechDataStore.OpenSpeechToolsState // ... state we've requested from the Redux store
  & typeof OpenSpeechDataStore.openSpeechDataActionCreators // ... plus action creators we've requested
  & RouteComponentProps<{}>; // ... plus incoming routing parameters

export interface AutoGenState {
  autogen: OpenSpeechDataStore.Autogen;
  notification: Notification;
  autogenUpdateTrigger: boolean;
  dataUpdateTrigger: boolean;
  dataIndexTrigger: number;
  connected: boolean;
  editable: boolean;
  viewEditor: ViewEditor;
}

interface Notification {
  text: string;
  level: string;
}

interface ViewEditor {
  enabled: boolean;
  view: OpenSpeechDataStore.AutogenComponent | null;
  index: number;
  properties: any;
  component: any;
  functionalData: any;
  options: OpenSpeechDataStore.Options | null;
  optionsIndex: number | null;
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
      autogenUpdateTrigger: false,
      dataUpdateTrigger: false,
      dataIndexTrigger: -1,
      viewEditor: {
        enabled: false,
        view: null,
        index: -1,
        properties: null,
        component: null,
        functionalData: null,
        optionsIndex: null,
        options:null
      }

    };

    //ActionStore send-handlers.
    this.handleRequestUI = this.handleRequestUI.bind(this);
    this.handleInputCommand = this.handleInputCommand.bind(this);
    this.setNotification = this.setNotification.bind(this);
    this.sendDataPackets = this.sendDataPackets.bind(this);
    this.updateModelData = this.updateModelData.bind(this);

    //Receipt Callback Functions
    this.updateModelFromProps = this.updateModelFromProps.bind(this);
    this.receiveDataPackets = this.receiveDataPackets.bind(this);
    this.handleMessage = this.handleMessage.bind(this);

    //UI Control and population
    this.setNotification = this.setNotification.bind(this);
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

    this.modifyOption = this.modifyOption.bind(this);
    this.addOptions = this.addOptions.bind(this);

    this.startViewEditor = this.startViewEditor.bind(this);
    this.closeViewEditor = this.closeViewEditor.bind(this);

    this.moveContainer = this.moveContainer.bind(this);
    this.removeViewFromContainer = this.removeViewFromContainer.bind(this);

  }

  shouldComponentUpdate(nextProps: OpenSpeechProps, nextState: AutoGenState) {
    if (nextProps.autogen.data && nextProps.autogen.data.length > 0) {
      return true;
    }
    else if (nextProps.deviceAddress !== this.props.deviceAddress) {
      return true;
    }
    else if (nextState.editable !== this.state.editable) {
      return true;
    }
    else{
      return false;
    }
  }

  componentDidMount() {
    this.handleRequestUI();
    this.props.requestRTCEnable(this.props.deviceAddress);
    modelDataClient.callbacks.incomingMessageListener = this.handleMessage;
    modelDataClient.callbacks.incomingDataListener = this.receiveDataPackets;
    modelDataClient.startSession();
  }

  componentWillUpdate() {
    if (this.props.autogen !== this.state.autogen) {
      if (this.props.autogen.data !== modelData) {
        this.updateModelFromProps();
      }
      this.setState({ autogen: this.props.autogen });
      if(this.props.autogen.views.length === 0 && this.props.autogen.containers.length === 0){
        if(this.props.autogen.data.length !== 0){
          this.fixEdit();
        }
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
      mappedModelData = createDataSubsets(controls.props.autogen, controls.props.autogen.data);
    }

    async function updateModel(controls: ControlPanel) {
      controls.setState({ autogenUpdateTrigger: !controls.state.autogenUpdateTrigger });
    }

    async function update(controls: ControlPanel) {
      await overwriteModel(controls);
      await updateModel(controls);
    }
    update(this);
  }

  updateModelData = (dataPackets: OpenSpeechDataStore.DataPacket[]) => {
    dataPackets.forEach((packet) => {
      return(process(this, packet, modelData));
    });
  }


  handleRequestUI() {
    this.props.requestAutogenConfiguration(this.props.deviceAddress);
  }

  handleInputCommand = (command: OpenSpeechDataStore.DataPacket[]) => {
    this.updateModelData(command);
    if (!this.props.isLoading) {
      if (modelDataClient.state.connected && this.props.rtcEnabled) {
        return(this.sendDataPackets(command));
      }
      else {
        return(this.props.requestSendModelData(command, this.props.deviceAddress));
      }
    }
    return (() => { });
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
    this.handleRequestUI();
    this.setState({
      editable: true
    });

  }

  cancelEdit = () => {
    this.setState({ editable: false }); //Stop editing
    this.handleRequestUI();
  }

  saveEdit = () => {
    this.setState({ editable: false });
    this.props.requestSendAutogenConfiguration(this.props.deviceAddress, this.props.autogen, this.handleRequestUI);
  }

  fixEdit = () => {
    this.setState({ editable: false });
    this.props.requestSendAutogenConfiguration(this.props.deviceAddress, GetAutogenObjectFromData(this.props.autogen.data, this.props.autogen.options, this.props.autogen.name), this.handleRequestUI);
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
    mappedModelData = createDataSubsets(autogen, this.props.autogen.data);
    this.props.updateAutogenProps(autogen);
    this.forceUpdate();
  }

  removeViewFromContainer = (containerIndex: number, viewIndex: number) => {
    var autogen = this.props.autogen;
    autogen.containers[containerIndex].views.splice(viewIndex, 1);
    mappedModelData = createDataSubsets(autogen, this.props.autogen.data);
    this.props.updateAutogenProps(autogen);
    this.forceUpdate();
  }

  modifyView = (index: number, view: OpenSpeechDataStore.ComponentView) => {
    var autogen = this.props.autogen;
    autogen.views[index] = view;
    mappedModelData = createDataSubsets(autogen, this.props.autogen.data);
    this.props.updateAutogenProps(autogen);
    this.forceUpdate();
  }

  modifyOption = (options: OpenSpeechDataStore.Options, index: number) =>{
    var autogen = this.props.autogen;
    if (autogen.options) {
      autogen.options[index] = options;
    }
    if (options === {}) {
      this.removeOptions(index);
    }
    this.props.updateAutogenProps(autogen);
    this.forceUpdate();
  }

  removeOptions(optionsIndex: number) {
    var autogen = this.props.autogen;
    if (autogen.options) {
      autogen.options.splice(optionsIndex, 1);
    }
    this.props.updateAutogenProps(autogen);
    this.forceUpdate();
  }

  addOptions = (options: OpenSpeechDataStore.Options, viewIndex: number) => {
    var autogen = this.props.autogen;
    if (autogen.options) {
      if (autogen.views[viewIndex].optionsIndex) {
        console.log("Editing view's existing options");
        this.modifyOption(options, autogen.views[viewIndex].optionsIndex as number);
      }
      else {
        console.log("adding new options set to view.");
        var optionsIndex = (autogen.options.push(options) - 1) as number;
        autogen.views[viewIndex].optionsIndex = optionsIndex;
      }
    }
    else {
      console.log("no options detected. Creating object!");
      autogen.options = [options];
      autogen.views[viewIndex].optionsIndex = 0;
    }

    this.props.updateAutogenProps(autogen);
    this.forceUpdate();
    if (autogen.views[viewIndex].optionsIndex) {
      if (autogen.options[autogen.views[viewIndex].optionsIndex as number])
        console.log(JSON.stringify(autogen.options[autogen.views[viewIndex].optionsIndex as number]));
    }
  }

  modifyContainer = (index: number, container: OpenSpeechDataStore.AutogenContainer)=>{
    var autogen = this.props.autogen;
    autogen.containers[index] = container;
    mappedModelData = createDataSubsets(autogen, this.props.autogen.data);
    this.props.updateAutogenProps(autogen);
    this.forceUpdate();
  }

  moveContainer = (index: number, direction: number) => {
    var autogen = this.props.autogen;
    var currentContainer: OpenSpeechDataStore.AutogenContainer;
    //moving first element left(to end of array)
    if (direction < 1 && index === 0) {
      currentContainer = autogen.containers.shift() as OpenSpeechDataStore.AutogenContainer;
      autogen.containers.push(currentContainer);
    }
    //moving last element right(to start of array)
    else if (direction > 0 && index === autogen.containers.length-1) {
      currentContainer = autogen.containers.pop() as OpenSpeechDataStore.AutogenContainer;
      autogen.containers.unshift(currentContainer);
    }
    //swapping indexed container with the component at the desired direction's index.
    else {
      currentContainer = autogen.containers[index] as OpenSpeechDataStore.AutogenContainer;
      autogen.containers[index] = autogen.containers[index + direction];
      autogen.containers[index + direction] = currentContainer;
    }
    mappedModelData = createDataSubsets(autogen, this.props.autogen.data);
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

  startViewEditor = (enabled: boolean, view: OpenSpeechDataStore.AutogenComponent, index: number, properties: any, component: any, functionalData:any,options:any,optionsIndex:any) => {
    this.setState({
      viewEditor: {
        enabled: enabled,
        view: view,
        index: index,
        properties: properties,
        component: component,
        functionalData: functionalData,
        options: options,
        optionsIndex:optionsIndex
      }
    });
    console.log("Starting View Editor. ");
    if (this.state.viewEditor.optionsIndex) {
      console.log("Options Attached to Current View. View[" + index +"] -> options["+optionsIndex +"] -> " + JSON.stringify(options));
    }
  }

  closeViewEditor = () => {
    this.setState({
      viewEditor: {
        enabled: false,
        view: this.state.viewEditor.view,
        index: this.state.viewEditor.index,
        properties: this.state.viewEditor.properties,
        component: this.state.viewEditor.component,
        functionalData: this.state.viewEditor.functionalData,
        options: this.state.viewEditor.options,
        optionsIndex: this.state.viewEditor.optionsIndex
      }
    });
  }


  createControlPanel() {

    if (mappedModelData.length < 1) {
      mappedModelData = createDataSubsets(this.props.autogen, this.props.autogen.data);
    }
    else if (this.props.autogen !== this.state.autogen) {
      mappedModelData = createDataSubsets(this.props.autogen, this.props.autogen.data);
    }
    
    var effectName = this.props.autogen.name ? this.props.autogen.name : "";
    effectName = (effectName === "ERROR") ? "" : effectName;
    return (
      <div className="autogen autogen-effectContainer modal-body">
        {this.controlPanelHeaderTitleControl(effectName)}
        <Row className="autogen-pages row">
          {this.props.autogen.containers.map((container,index) =>
            <React.Fragment key={"container-" + index}>
              <ControlCard
                indexTrigger={this.state.dataIndexTrigger}
                references={container.views}
                title={container.name}
                views={this.props.autogen.views}
                options={this.props.autogen.options}
                data={mappedModelData[index]}
                callback={this.handleInputCommand}
                editable={this.state.editable}
                moveLeft={this.moveContainer}
                moveRight={this.moveContainer}
                delete={this.deleteContainer}
                updateTitle={this.updateControlCardName}
                index={index}
                updateContainer={this.modifyContainer}
                components={components}
                startViewEditor={this.startViewEditor}
              />
            </React.Fragment>)
          }
        </Row>
        <PopupViewEditor
          viewProps={this.state.viewEditor.properties}
          data={modelData}
          functionalData={this.state.viewEditor.functionalData}
          show={this.state.viewEditor.enabled}
          index={this.state.viewEditor.index}
          view={this.state.viewEditor.view}
          updateView={this.modifyView}
          component={this.state.viewEditor.component}
          handleClose={this.closeViewEditor}
          updateOptions={this.modifyOption}
          addOptions={this.addOptions}
          options={this.state.viewEditor.options}
          componentLibs={components}
        />
      </div>);

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
              <Modal.Header><Modal.Title className="float-left">22Controls22</Modal.Title>
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


//Local copy of the model data for editing/displaying purposes. (strip from whole autogen)
var modelData = [] as OpenSpeechDataStore.ModelData[];

//1:1 Index map of each container -> views -> data.
var mappedModelData = [] as dataSubset[];

//Data Subset for a container.
interface dataSubset {
  indices: number[]; //data indexes to listen to
  views: viewData[]; //views inside container
}

interface viewData {
  indices: number[];
  data: indexedData[];
}

interface indexedData {
  index: number;
  packet: OpenSpeechDataStore.ModelData;
}

async function updateModelData
  (packet: OpenSpeechDataStore.DataPacket, oldModel: OpenSpeechDataStore.ModelData[]) {
  oldModel[packet.index].value = packet.value;
}

async function updateModel(controls: ControlPanel) {
  controls.setState({dataUpdateTrigger: !controls.state.dataUpdateTrigger});
}

async function updateSpecific(controls: ControlPanel, index:number) {
  controls.setState({ dataIndexTrigger: index });
}

async function process
  (controls: ControlPanel, packet: OpenSpeechDataStore.DataPacket, oldModel: OpenSpeechDataStore.ModelData[]) {
  await updateModelData(packet, oldModel);
  await updateDataSubsetValues(packet, mappedModelData);
  await updateSpecific(controls, packet.index);
  //await updateModel(controls);
}


function createDataSubsets
  (autogen: OpenSpeechDataStore.Autogen, modelData: OpenSpeechDataStore.ModelData[]) {
  var map = [] as dataSubset[];
  autogen.containers.forEach((container) => {
    const subset = {indices: [], views: [] } as dataSubset; //assign a data subset for each container.
    container.views.forEach((viewIndex) => {
      const viewData = { indices: [], data:[] } as viewData; //Assign empty data array for each view.
      autogen.views[viewIndex].references.forEach((dataIndex) => {
        const currentData = { index: dataIndex, packet: modelData[dataIndex] };
        viewData.data.push(currentData);
        viewData.indices.push(dataIndex);
        subset.indices.push(dataIndex);
      });
      subset.views.push(viewData);
    });
    map.push(subset);
  });
  return map;
}

async function updateDataSubsetValues(packet: OpenSpeechDataStore.DataPacket, map: dataSubset[]) {
  map.forEach((subset) => {
    if (subset.indices.includes(packet.index)) {
      subset.views.forEach((view) => {
        if (view.indices.includes(packet.index)) {
          view.data.forEach((data) => {
            if (data.index === packet.index) {
              data.packet.value = packet.value;
            }
          });
        }
      });
    }
  });
}


const components = Components().components;

export default connect(
  (state: ApplicationState) => state.openSpeechData,
  OpenSpeechDataStore.openSpeechDataActionCreators
)(ControlPanel as any);    
