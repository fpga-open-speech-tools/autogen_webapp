import { Action, Reducer } from 'redux';
import { AppThunkAction } from '../';

// -----------------
// STATE - This defines the type of data maintained in the Redux store.

export interface OpenSpeechToolsState {
  isLoading: boolean;
  isDeviceDownloading: boolean;
  currentDemo?: string;
  //Interface for UI JSON
  uiConfig?: EffectContainer | null;
  currentRegisterConfig?: RegisterConfig;
  //Interface for Demos Array[]
  availableDemos: Demo[];

  //For Downloading Demos
  downloadProgress?: S3DownloadProgress;

  //S3Bucket Download info
  deviceFamily?: string;
  projectName?: string;

  //Device Controls info
  deviceAddress: DeviceAddress;

  command?: Command;
}

export interface DeviceAddress {
  ipAddress: {
    ip1: string;
    ip2: string;
    ip3: string;
    ip4: string;
  };
  port: string;
}

export interface RegisterConfig {
  registers: Register[];
}

export interface Register {
  module: string;
  link: string;
  value: string;
}

export interface S3DownloadProgress {
  name: string;
  progress: number;
  status: string;
}

export interface Command {
  link: string;
  value: string;
  module: string;
}

export interface Demo {
  name: string;
  downloadurl: s3bucketurl;
  imageurl: string;
  videourl: string;
  filesize: number;
}

//S3 bucket takes form "{devicename}/{projectname}"
export interface s3bucketurl {
  devicename: string;
  projectname: string;
}

export interface EffectContainer {
  name: string;
  pages: Page[];
}

export interface Page {
  name: string;
  panels: Panel[];

}

export interface Panel {
  name: string;
  controls: Control[];
}

export interface Control {
  module:       string;
  style:        string;
  linkerName:   string;
  min:          number;
  max:          number;
  title:        string;
  dataType:     string;
  defaultValue: number;
  units:        string;
  type:         string;
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
  uiConfig: EffectContainer;
  currentDemo: string;
  isDeviceDownloading: boolean;
}

interface RequestS3DownloadProgressAction {
  type: 'REQUEST_S3_DOWNLOAD_PROGRESS';
  deviceAddress: DeviceAddress;
}

interface ReceiveS3DownloadProgressAction {
  type: 'RECEIVE_S3_DOWNLOAD_PROGRESS';
  downloadProgress: S3DownloadProgress;
}

interface RequestOpenSpeechUIConfig {
  type: 'REQUEST_OPENSPEECH_UI';
  deviceAddress: DeviceAddress;
}

interface ReceiveOpenSpeechUIConfig {
  type: 'RECEIVE_OPENSPEECH_UI';
  uiConfig: EffectContainer;
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
  command: Command;
}

interface ReceiveSendCommandResponse {
  type: 'RECEIVE_SEND_COMMAND_RESPONSE';
}

// Declare a 'discriminated union' type. This guarantees that all references to 'type' properties contain one of the
// declared type strings (and not any other arbitrary string).
type KnownAction =
  RequestOpenSpeechUIConfig | ReceiveOpenSpeechUIConfig |
  RequestOpenSpeechS3DemosAction | ReceiveOpenSpeechS3DemosAction |
  RequestSendCommand | ReceiveSendCommandResponse | 
  RequestOpenSpeechS3DownloadAction | ReceiveOpenSpeechS3DownloadAction |
  RequestS3DownloadProgressAction | ReceiveS3DownloadProgressAction |
  RequestSetRegisterConfigAction | RequestGetRegisterConfigAction | ReceiveGetRegisterConfigResponse |
  SetDeviceAddress;

// ----------------
// ACTION CREATORS - These are functions exposed to UI components that will trigger a state transition.
// They don't directly mutate state, but they can have external side-effects (such as loading data).

export const openSpeechDataActionCreators = {

  requestOpenSpeechS3Demos: (): AppThunkAction<KnownAction> => (dispatch) => {
    fetch(`availabledemos`)
      .then(response => response.json() as Promise<Demo[]>)
      .then(data => {
        dispatch({
          type: 'RECEIVE_OPENSPEECH_DEMOS', availableDemos: data
        });
      });
    dispatch({ type: 'REQUEST_OPENSPEECH_DEMOS' });
  },

  requestS3DownloadProgress: (address:DeviceAddress): AppThunkAction<KnownAction> => (dispatch) => {
      fetch(`downloadprogress/${address.ipAddress.ip1}/${address.ipAddress.ip2}/${address.ipAddress.ip3}/${address.ipAddress.ip4}/${address.port}`)
        .then(response => response.json() as Promise<S3DownloadProgress>)
        .then(data => {
          dispatch({
            type: 'RECEIVE_S3_DOWNLOAD_PROGRESS', downloadProgress: data
          });
        });
      dispatch({
        type: 'REQUEST_S3_DOWNLOAD_PROGRESS',
        deviceAddress:address
      });
    },

  requestOpenSpeechUI: (address:DeviceAddress): AppThunkAction<KnownAction> => (dispatch, getState) => {
      fetch(`uiconfig/${address.ipAddress.ip1}/${address.ipAddress.ip2}/${address.ipAddress.ip3}/${address.ipAddress.ip4}/${address.port}`)
        .then(response => response.json() as Promise<EffectContainer>)
        .then(data => {
          dispatch({
            type: 'RECEIVE_OPENSPEECH_UI', uiConfig: data
          });
        });
      dispatch({
        type: 'REQUEST_OPENSPEECH_UI',
        deviceAddress:address
      });
    },

  requestSendCommand: (
    link: string, value: string, module: string,
    address:DeviceAddress,
    devicePortRequested: string): AppThunkAction<KnownAction> => (dispatch, getState) => {
      fetch(`command/${address.ipAddress.ip1}/${address.ipAddress.ip2}/${address.ipAddress.ip3}/${address.ipAddress.ip4}/${address.port}/${link}/${value}/${module}`)
        .then(() => {
          dispatch({
            type: 'RECEIVE_SEND_COMMAND_RESPONSE'
          });
        });
      dispatch({
        type: 'REQUEST_SEND_COMMAND',
        deviceAddress:address, command: { link: link, value: value, module: module }
      });
    },

  requestSendRegisterConfig: (
    registers: RegisterConfig,address:DeviceAddress): AppThunkAction<KnownAction> => (dispatch, getState) => {
      var data = new FormData();
      data.append('ip1', address.ipAddress.ip1);
      data.append('ip2', address.ipAddress.ip2);
      data.append('ip3', address.ipAddress.ip3);
      data.append('ip4', address.ipAddress.ip4);
      data.append('port', address.port);
      var registersAsString = JSON.stringify(registers);
      data.append('registers', JSON.stringify(registers));
      fetch(`setregisterconfig`, { method: "PUT", body: data })
        .then(response => response.json() as Promise<EffectContainer>)
        .then(data => {
          dispatch({
            type: 'RECEIVE_OPENSPEECH_UI', uiConfig: data
          });
        });
      dispatch({
        type: 'REQUEST_SET_REGISTER_CONFIG',
        deviceAddress:address, registerConfigString: registersAsString
      });
    },

  requestGetRegisterConfig: (address: DeviceAddress, callback: Function): AppThunkAction<KnownAction> => (dispatch, getState) => {
    fetch(`getregisterconfig/${address.ipAddress.ip1}/${address.ipAddress.ip2}/${address.ipAddress.ip3}/${address.ipAddress.ip4}/${address.port}`)
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

  requestDownloadS3Demo: (address:DeviceAddress,devicename: string, projectname: string): AppThunkAction<KnownAction> => (dispatch, getState) => {
    fetch(`downloads3bucket/${address.ipAddress.ip1}/${address.ipAddress.ip2}/${address.ipAddress.ip3}/${address.ipAddress.ip4}/${address.port}/${devicename}/${projectname}`)
      .then(response => response.json() as Promise<EffectContainer>)
      .then(data => {
        dispatch({
          type: 'RECEIVE_OPENSPEECH_DOWNLOAD_DEMO',uiConfig:data, isDeviceDownloading: false,currentDemo:projectname
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

// ----------------
// REDUCER - For a given state and action, returns the new state. To support time travel, this must not mutate the old state.

const unloadedState: OpenSpeechToolsState = {
  deviceAddress: { ipAddress: {ip1:'127',ip2:'0',ip3:'0',ip4:'1'},port:'3355' },
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
    case 'REQUEST_OPENSPEECH_UI':
      return {
        deviceAddress:state.deviceAddress,
        uiConfig: null,
        availableDemos: state.availableDemos,
        isDeviceDownloading: state.isDeviceDownloading,
        isLoading: true
      };
    case 'RECEIVE_OPENSPEECH_UI':
      return {
        deviceAddress: state.deviceAddress,
        availableDemos: state.availableDemos,
        uiConfig: action.uiConfig,
        isDeviceDownloading: state.isDeviceDownloading,
        isLoading: false
      };
    case 'REQUEST_SEND_COMMAND':
      return {
        deviceAddress: state.deviceAddress,
        currentRegisterConfig: state.currentRegisterConfig,
        currentDemo: state.currentDemo,
        uiConfig: state.uiConfig,
        availableDemos: state.availableDemos,
        command: state.command,
        isDeviceDownloading: state.isDeviceDownloading,
        isLoading: true
      };
    case 'RECEIVE_SEND_COMMAND_RESPONSE':
      return {
        deviceAddress: state.deviceAddress,
        currentRegisterConfig: state.currentRegisterConfig,
        currentDemo: state.currentDemo,
        availableDemos: state.availableDemos,
        uiConfig: state.uiConfig,
        isDeviceDownloading: state.isDeviceDownloading,
        isLoading: false
      };
    case 'REQUEST_OPENSPEECH_DEMOS':  
      return {
        deviceAddress: state.deviceAddress,
        currentDemo: state.currentDemo,
        availableDemos: state.availableDemos,
        uiConfig: state.uiConfig,
        isDeviceDownloading: state.isDeviceDownloading,
        isLoading: true
      };
    case 'RECEIVE_OPENSPEECH_DEMOS':
      return {
        deviceAddress: state.deviceAddress,
        currentDemo: state.currentDemo,
        availableDemos: action.availableDemos,
        uiConfig: state.uiConfig,
        isDeviceDownloading: state.isDeviceDownloading,
        isLoading: false
      };
    case 'REQUEST_OPENSPEECH_DOWNLOAD_DEMO':
      return {
        deviceAddress: state.deviceAddress,
        deviceFamily: action.deviceFamily,
        availableDemos: state.availableDemos,
        isDeviceDownloading: true,
        uiConfig: state.uiConfig,
        currentDemo: action.currentDemo,
        isLoading: true
      };
    case 'RECEIVE_OPENSPEECH_DOWNLOAD_DEMO':
      return {
        deviceAddress: state.deviceAddress,
        availableDemos: state.availableDemos,
        currentDemo: action.currentDemo,
        uiConfig: action.uiConfig,
        isDeviceDownloading: false,
        isLoading: false
      };
    case 'REQUEST_S3_DOWNLOAD_PROGRESS':
      return {
        deviceAddress: state.deviceAddress,
        currentDemo: state.currentDemo,
        availableDemos: state.availableDemos,
        uiConfig: state.uiConfig,
        isDeviceDownloading: state.isDeviceDownloading,
        isLoading: false
      };
    case 'REQUEST_SET_REGISTER_CONFIG':
      return {
        deviceAddress: state.deviceAddress,
        currentRegisterConfig: state.currentRegisterConfig,
        currentDemo: state.currentDemo,
        availableDemos: state.availableDemos,
        uiConfig: null,
        isDeviceDownloading: state.isDeviceDownloading,
        isLoading: false
      };

    case 'REQUEST_GET_REGISTER_CONFIG_ACTION':
      return {
        deviceAddress: state.deviceAddress,
        currentDemo: state.currentDemo,
        availableDemos: state.availableDemos,
        uiConfig: state.uiConfig,
        isDeviceDownloading: state.isDeviceDownloading,
        isLoading: false
      };

    case 'RECEIVE_GET_REGISTER_CONFIG_RESPONSE':
      return {
        deviceAddress: state.deviceAddress,
        currentRegisterConfig: action.currentRegisterConfig,
        currentDemo: state.currentDemo,
        availableDemos: state.availableDemos,
        uiConfig: state.uiConfig,
        isDeviceDownloading: state.isDeviceDownloading,
        isLoading: false
      };

    case 'RECEIVE_S3_DOWNLOAD_PROGRESS':  
      return {
        deviceAddress: state.deviceAddress,
        currentDemo: state.currentDemo,
        downloadProgress: action.downloadProgress,
        availableDemos: state.availableDemos,
        uiConfig: state.uiConfig,
        isDeviceDownloading: state.isDeviceDownloading,
        isLoading: false
      };
    case 'SET_DEVICE_ADDRESS':
      return {
        deviceAddress: action.address,
        availableDemos: state.availableDemos,
        uiConfig: state.uiConfig,
        isDeviceDownloading: state.isDeviceDownloading,
        isLoading: false
      }
    default:
      return state as OpenSpeechToolsState;

  }

};
