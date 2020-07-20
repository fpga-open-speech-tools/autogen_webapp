import { Action, Reducer } from 'redux';
import { AppThunkAction } from '../';

// -----------------
// STATE - This defines the type of data maintained in the Redux store.

export interface OpenSpeechToolsState {
  isLoading: boolean;
  isDeviceDownloading: boolean;
  currentDemo?: string;
  //Interface for UI JSON
  autogen: Autogen;
  //Interface for Demos Array[]
  availableDemos: Demo[];

  //S3Bucket Download info
  deviceFamily?: string;
  projectName?: string;

  //Device Controls info
  deviceAddress: DeviceAddress;

  command?: DataPacket[];
}

export interface DeviceAddress {
  ipAddress: {
    ip1: string;
    ip2: string;
    ip3: string;
    ip4: string;
  }
  port: string;
}

export interface RegisterConfig {
  registers: Register[];
}

export interface Demo {
  name: string;
  downloadurl: s3bucketurl;
  imageurl: string;
  videourl: string;
  filesize: number;
}

//S3 bucket takes the api form "{devicename}/{projectname}"
export interface s3bucketurl {
  devicename: string;
  projectname: string;
}


export interface Autogen {
  name: string;
  views: ComponentView[];
  data: ModelData[];
  containers: AutogenContainer[];
}

export interface AutogenContainer {
  name: string;
  views: number[];
}

export interface ComponentView {
  name: string;
  type: AutogenComponent;
  dataReferences: number[];
}

export interface AutogenComponent {
  component: string;
  variant: string;
  callback: string;
}

export interface ModelData {
  references: DataReference[];
  properties: DataProperties;
  value: number | number[] | string | string[];
}

export interface DataReference {
  type: string;
  reference: Register;
}

export interface DataProperties {
  min: number | undefined | null;
  max: number | undefined | null;
  step: number | undefined | null;
  units: string | undefined | null;
  enumeration: string[] | number[] | undefined | null;
}

export interface Register {
  name: string;
  device: string;
}

export interface DataPacket {
  index: number;
  value: number | number[] | string | string[];
}




// -----------------
// ACTIONS - These are serializable (hence replayable) descriptions of state transitions.
// They do not themselves have any side-effects; they just describe something that is going to happen.

interface SetDeviceAddress {
  type: 'SET_DEVICE_ADDRESS';
  address: DeviceAddress;
}

interface RequestOpenSpeechS3DemosAction {
  type: 'REQUEST_OPENSPEECH_DEMOS';
}

interface ReceiveOpenSpeechS3DemosAction {
  type: 'RECEIVE_OPENSPEECH_DEMOS';
  availableDemos: Demo[];
}

interface RequestOpenSpeechS3DownloadAction {
  type: 'REQUEST_OPENSPEECH_DOWNLOAD_DEMO';
  deviceAddress: DeviceAddress;
  deviceFamily: string;
  projectName:  string;
  isDeviceDownloading: boolean;
  currentDemo: string;
}

interface ReceiveOpenSpeechS3DownloadAction {
  type: 'RECEIVE_OPENSPEECH_DOWNLOAD_DEMO';
  autogen: Autogen;
  currentDemo: string;
  isDeviceDownloading: boolean;
}


interface RequestOpenSpeechAutogenConfig {
  type: 'REQUEST_OPENSPEECH_AUTOGEN';
  deviceAddress: DeviceAddress;
}

interface ReceiveOpenSpeechAutogenConfig {
  type: 'RECEIVE_OPENSPEECH_AUTOGEN';
  autogen: Autogen;
}

interface RequestSetRegisterConfigAction {
  type: 'REQUEST_SET_REGISTER_CONFIG';
  deviceAddress: DeviceAddress;
  registerConfigString: string;
}


interface RequestGetRegisterConfigAction {
  type: 'REQUEST_GET_REGISTER_CONFIG_ACTION';
  deviceAddress: DeviceAddress;
}

interface ReceiveGetRegisterConfigResponse {
  type: 'RECEIVE_GET_REGISTER_CONFIG_RESPONSE';
  currentRegisterConfig: RegisterConfig;
}


interface RequestSendCommand {
  type: 'REQUEST_SEND_COMMAND';
  deviceAddress: DeviceAddress;
  command: DataPacket[];
}

interface ReceiveSendCommandResponse {
  type: 'RECEIVE_SEND_COMMAND_RESPONSE';
}

interface UpdateModelData {
  type: 'UPDATE_MODEL_DATA';
  autogen: Autogen;
}

// Declare a 'discriminated union' type. This guarantees that all references to 'type' properties contain one of the
// declared type strings (and not any other arbitrary string).
type KnownAction =
  RequestOpenSpeechAutogenConfig | ReceiveOpenSpeechAutogenConfig |
  RequestOpenSpeechS3DemosAction | ReceiveOpenSpeechS3DemosAction |
  RequestSendCommand | ReceiveSendCommandResponse | 
  RequestOpenSpeechS3DownloadAction | ReceiveOpenSpeechS3DownloadAction |
  RequestSetRegisterConfigAction | RequestGetRegisterConfigAction | ReceiveGetRegisterConfigResponse |
  SetDeviceAddress | UpdateModelData;


function appendAddressToForm(data: FormData, address:DeviceAddress) {
  data.append('ip1', address.ipAddress.ip1);
  data.append('ip2', address.ipAddress.ip2);
  data.append('ip3', address.ipAddress.ip3);
  data.append('ip4', address.ipAddress.ip4);
  data.append('port', address.port);
}

// ----------------
// ACTION CREATORS - These are functions exposed to UI components that will trigger a state transition.
// They don't directly mutate state, but they can have external side-effects (such as loading data).

export const openSpeechDataActionCreators = {
  updateModelData: (autogen: Autogen):
    AppThunkAction<KnownAction> => (dispatch) => {
      dispatch({ type: 'UPDATE_MODEL_DATA', autogen});
    },
  requestOpenSpeechS3Demos: ():
    AppThunkAction<KnownAction> => (dispatch) => {
    fetch(`demos`)
      .then(response => response.json() as Promise<Demo[]>)
      .then(data => {
        dispatch({
          type: 'RECEIVE_OPENSPEECH_DEMOS', availableDemos: data
        });
      });
    dispatch({ type: 'REQUEST_OPENSPEECH_DEMOS' });
  },

  requestAutogenConfiguration: (address: DeviceAddress):
    AppThunkAction<KnownAction> => (dispatch, getState) => {
    var data = new FormData();
    appendAddressToForm(data, address);
    fetch(`configuration`, { method: "PUT", body: data })
        .then(response => response.json() as Promise<any>)
        .then(data => {
          dispatch({
            type: 'RECEIVE_OPENSPEECH_AUTOGEN', autogen: data
          });
        });
      dispatch({
        type: 'REQUEST_OPENSPEECH_AUTOGEN',
        deviceAddress:address
      });
    },

  requestSendModelData: (input: DataPacket[], address: DeviceAddress):
    AppThunkAction<KnownAction> => (dispatch, getState) => {
      var data = new FormData();
      var inputString = JSON.stringify(input);
      appendAddressToForm(data, address);
      data.append('modelData', JSON.stringify(inputString));
     
      fetch(`model-data`, { method: "PUT", body: data })
        .then(() => {
          dispatch({
            type: 'RECEIVE_SEND_COMMAND_RESPONSE'
          });
        });
      dispatch({
        type: 'REQUEST_SEND_COMMAND',
        deviceAddress:address, command: input 
      });
    },

  requestGetModelData: (address: DeviceAddress, callback: Function): AppThunkAction<KnownAction> => (dispatch, getState) => {
    var data = new FormData();
    appendAddressToForm(data,address);
    data.append('port', address.port);
    fetch(`model-data`, { method: "PUT", body: data })
        .then(response => response.json() as Promise<RegisterConfig>)
        .then(data => {
          dispatch({
            type: 'RECEIVE_GET_REGISTER_CONFIG_RESPONSE', currentRegisterConfig: data
          });
          callback();
        });
      dispatch({
        type: 'REQUEST_GET_REGISTER_CONFIG_ACTION',
        deviceAddress: address
      });
    },

  requestDownloadS3Demo: (address: DeviceAddress, devicename: string, projectname: string):
    AppThunkAction<KnownAction> => (dispatch, getState) => {
    fetch(`downloads3bucket/${address.ipAddress.ip1}/${address.ipAddress.ip2}/${address.ipAddress.ip3}/${address.ipAddress.ip4}/${address.port}/${devicename}/${projectname}`)
      .then(response => response.json() as Promise<Autogen>)
      .then(data => {
        dispatch({
          type: 'RECEIVE_OPENSPEECH_DOWNLOAD_DEMO',autogen:data, isDeviceDownloading: false,currentDemo:projectname
        });
      });
      dispatch({
        type: 'REQUEST_OPENSPEECH_DOWNLOAD_DEMO',
        deviceAddress:address,
        deviceFamily: devicename, projectName: projectname, isDeviceDownloading: true, currentDemo:projectname
      });
    },
  setDeviceAddress: (address: DeviceAddress): AppThunkAction<KnownAction> => (dispatch, getState) => {
      dispatch({
        type: 'SET_DEVICE_ADDRESS',
        address: address
      });
    },
};

const emptyAutogen = {
  containers: {},
  data: {},
  views: {},
  name: ""
} as Autogen
// ----------------
// REDUCER - For a given state and action, returns the new state. To support time travel, this must not mutate the old state.

const unloadedState: OpenSpeechToolsState = {
  deviceAddress: { ipAddress: { ip1: '192', ip2: '168', ip3: '0', ip4: '120' }, port: '3355' },
  autogen: emptyAutogen,
  availableDemos: [],
  isLoading: false,
  isDeviceDownloading: false
  };

export const reducer: Reducer<OpenSpeechToolsState> = (state: OpenSpeechToolsState | undefined, incomingAction: Action): OpenSpeechToolsState => {
  if (state === undefined) {
    return unloadedState;
  }

  const action = incomingAction as KnownAction;
  switch (action.type) {
    case 'REQUEST_OPENSPEECH_AUTOGEN':
      return {
        deviceAddress:state.deviceAddress,
        autogen: emptyAutogen,
        availableDemos: state.availableDemos,
        isDeviceDownloading: state.isDeviceDownloading,
        isLoading: true
      };
    case 'RECEIVE_OPENSPEECH_AUTOGEN':
      return {
        deviceAddress: state.deviceAddress,
        availableDemos: state.availableDemos,
        autogen: action.autogen,
        isDeviceDownloading: state.isDeviceDownloading,
        isLoading: false
      };
    case 'REQUEST_SEND_COMMAND':
      return {
        deviceAddress: state.deviceAddress,
        currentDemo: state.currentDemo,
        autogen: state.autogen,
        availableDemos: state.availableDemos,
        command: state.command,
        isDeviceDownloading: state.isDeviceDownloading,
        isLoading: true
      };
    case 'RECEIVE_SEND_COMMAND_RESPONSE':
      return {
        deviceAddress: state.deviceAddress,
        currentDemo: state.currentDemo,
        availableDemos: state.availableDemos,
        autogen: state.autogen,
        isDeviceDownloading: state.isDeviceDownloading,
        isLoading: false
      };
    case 'REQUEST_OPENSPEECH_DEMOS':  
      return {
        deviceAddress: state.deviceAddress,
        currentDemo: state.currentDemo,
        availableDemos: state.availableDemos,
        autogen: state.autogen,
        isDeviceDownloading: state.isDeviceDownloading,
        isLoading: true
      };
    case 'RECEIVE_OPENSPEECH_DEMOS':
      return {
        deviceAddress: state.deviceAddress,
        currentDemo: state.currentDemo,
        availableDemos: action.availableDemos,
        autogen: state.autogen,
        isDeviceDownloading: state.isDeviceDownloading,
        isLoading: false
      };
    case 'REQUEST_OPENSPEECH_DOWNLOAD_DEMO':
      return {
        deviceAddress: state.deviceAddress,
        deviceFamily: action.deviceFamily,
        availableDemos: state.availableDemos,
        isDeviceDownloading: true,
        autogen: state.autogen,
        currentDemo: action.currentDemo,
        isLoading: true
      };
    case 'RECEIVE_OPENSPEECH_DOWNLOAD_DEMO':
      return {
        deviceAddress: state.deviceAddress,
        availableDemos: state.availableDemos,
        currentDemo: action.currentDemo,
        autogen: action.autogen,
        isDeviceDownloading: false,
        isLoading: false
      };
    case 'REQUEST_SET_REGISTER_CONFIG':
      return {
        deviceAddress: state.deviceAddress,
        currentDemo: state.currentDemo,
        availableDemos: state.availableDemos,
        autogen: emptyAutogen,
        isDeviceDownloading: state.isDeviceDownloading,
        isLoading: false
      };

    case 'REQUEST_GET_REGISTER_CONFIG_ACTION':
      return {
        deviceAddress: state.deviceAddress,
        currentDemo: state.currentDemo,
        availableDemos: state.availableDemos,
        autogen: state.autogen,
        isDeviceDownloading: state.isDeviceDownloading,
        isLoading: false
      };

    case 'RECEIVE_GET_REGISTER_CONFIG_RESPONSE':
      return {
        deviceAddress: state.deviceAddress,
        currentDemo: state.currentDemo,
        availableDemos: state.availableDemos,
        autogen: state.autogen,
        isDeviceDownloading: state.isDeviceDownloading,
        isLoading: false
      };

    case 'SET_DEVICE_ADDRESS':
      return {
        deviceAddress: action.address,
        availableDemos: state.availableDemos,
        autogen: state.autogen,
        isDeviceDownloading: state.isDeviceDownloading,
        isLoading: false
      };
    case 'UPDATE_MODEL_DATA':
      return {
        deviceAddress: state.deviceAddress,
        availableDemos: state.availableDemos,
        autogen: action.autogen,
        isDeviceDownloading: state.isDeviceDownloading,
        isLoading: false
      };
    default:
      return state as OpenSpeechToolsState;

  }

};
