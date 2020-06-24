import { Action, Reducer } from 'redux';
import { AppThunkAction } from '../';

// -----------------
// STATE - This defines the type of data maintained in the Redux store.

export interface OpenSpeechToolsState {
  isLoading: boolean;
  isDeviceDownloading: boolean;
  currentDemo?: string;
  //Interface for UI JSON
  uiConfig?: EffectContainer;
  currentRegisterConfig?: RegisterConfig;
  //Interface for Demos Array[]
  availableDemos: Demo[];

  //For Downloading Demos
  downloadProgress?: S3DownloadProgress;

  //S3Bucket Download info
  deviceFamily?: string;
  projectName?: string;

  //Device Controls info
  ip1?: string;
  ip2?: string;
  ip3?: string;
  ip4?: string;
  devicePort?: string;

  command?: Command;
}

export interface RegisterConfig {
  registers: Register[]
}

export interface Register {
  module: string
  link: string,
  value: string
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

interface RequestOpenSpeechS3DemosAction {
  type: 'REQUEST_OPENSPEECH_DEMOS';
}

interface ReceiveOpenSpeechS3DemosAction {
  type: 'RECEIVE_OPENSPEECH_DEMOS';
  availableDemos: Demo[];
}

interface RequestOpenSpeechS3DownloadAction {
  type: 'REQUEST_OPENSPEECH_DOWNLOAD_DEMO';
  ip1: string;
  ip2: string;
  ip3: string;
  ip4: string;
  devicePort:   string;
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
  ip1: string;
  ip2: string;
  ip3: string;
  ip4: string;
  devicePort: string;
}

interface ReceiveS3DownloadProgressAction {
  type: 'RECEIVE_S3_DOWNLOAD_PROGRESS';
  downloadProgress: S3DownloadProgress;
}

interface RequestOpenSpeechUIConfig {
  type: 'REQUEST_OPENSPEECH_UI';
  ip1: string;
  ip2: string;
  ip3: string;
  ip4: string;
  devicePort: string;
}

interface ReceiveOpenSpeechUIConfig {
  type: 'RECEIVE_OPENSPEECH_UI';
  uiConfig: EffectContainer;
}

interface RequestSetRegisterConfigAction {
  type: 'REQUEST_SET_REGISTER_CONFIG';
  ip1: string;
  ip2: string;
  ip3: string;
  ip4: string;
  devicePort: string;
  registerConfigString: string;
}


interface RequestGetRegisterConfigAction {
  type: 'REQUEST_GET_REGISTER_CONFIG_ACTION';
  ip1: string;
  ip2: string;
  ip3: string;
  ip4: string;
  devicePort: string;
}

interface ReceiveGetRegisterConfigResponse {
  type: 'RECEIVE_GET_REGISTER_CONFIG_RESPONSE';
  currentRegisterConfig: RegisterConfig;
}


interface RequestSendCommand {
  type: 'REQUEST_SEND_COMMAND';
  ip1: string;
  ip2: string;
  ip3: string;
  ip4: string;
  devicePort: string;
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
  RequestSetRegisterConfigAction | RequestGetRegisterConfigAction | ReceiveGetRegisterConfigResponse;

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

  requestS3DownloadProgress: (
    ip1Requested: string, ip2Requested: string, ip3Requested: string, ip4Requested: string,
    devicePortRequested: string): AppThunkAction<KnownAction> => (dispatch) => {
    fetch(`downloadprogress/${ip1Requested}/${ip2Requested}/${ip3Requested}/${ip4Requested}/${devicePortRequested}`)
      .then(response => response.json() as Promise<S3DownloadProgress>)
      .then(data => {
        dispatch({
          type: 'RECEIVE_S3_DOWNLOAD_PROGRESS', downloadProgress: data
        });
      });
    dispatch({
      type: 'REQUEST_S3_DOWNLOAD_PROGRESS',
      ip1: ip1Requested, ip2: ip2Requested, ip3: ip3Requested, ip4: ip4Requested,
      devicePort: devicePortRequested
    });
  },

  requestOpenSpeechUI: (
    ip1Requested: string, ip2Requested: string, ip3Requested: string, ip4Requested: string,
    devicePortRequested: string): AppThunkAction<KnownAction> => (dispatch, getState) => {
      fetch(`uiconfig/${ip1Requested}/${ip2Requested}/${ip3Requested}/${ip4Requested}/${devicePortRequested}`)
      .then(response => response.json() as Promise<EffectContainer>)
      .then(data => {
        dispatch({
          type: 'RECEIVE_OPENSPEECH_UI', uiConfig: data
        });
      });
      dispatch({
        type: 'REQUEST_OPENSPEECH_UI',
        ip1: ip1Requested, ip2: ip2Requested, ip3: ip3Requested, ip4: ip4Requested,
        devicePort: devicePortRequested
      });
    },

  requestSendCommand: (
    link: string, value: string, module: string,
    ip1Requested: string, ip2Requested: string, ip3Requested: string, ip4Requested: string,
    devicePortRequested: string): AppThunkAction<KnownAction> => (dispatch, getState) => {
      fetch(`command/${ip1Requested}/${ip2Requested}/${ip3Requested}/${ip4Requested}/${devicePortRequested}/${link}/${value}/${module}`)
      .then(() => {
        dispatch({
          type: 'RECEIVE_SEND_COMMAND_RESPONSE'
        });
      });
      dispatch({
        type: 'REQUEST_SEND_COMMAND',
        ip1: ip1Requested, ip2: ip2Requested, ip3: ip3Requested, ip4: ip4Requested,
        devicePort: devicePortRequested, command: { link: link, value: value, module: module }
      });
    },

  requestSendRegisterConfig: (
      registers:RegisterConfig,
      ip1Requested: string, ip2Requested: string, ip3Requested: string, ip4Requested: string,
    devicePortRequested: string): AppThunkAction<KnownAction> => (dispatch, getState) => {
      var data = new FormData();
      data.append("json", ip1Requested);
      data.append("json", ip2Requested);
      data.append("json", ip3Requested);
      data.append("json", ip4Requested);
      data.append("json", devicePortRequested);
      var registersAsString = JSON.stringify(registers);
        data.append("json", JSON.stringify(registers));
        //fetch(`setregisterconfig/${ip1Requested}/${ip2Requested}/${ip3Requested}/${ip4Requested}/${devicePortRequested}`, { method: "POST", body: data })
        fetch(`setregisterconfig/${ip1Requested}/${ip2Requested}/${ip3Requested}/${ip4Requested}/${devicePortRequested}`, { method: "POST", body: data })
          .then(response => response.json() as Promise<EffectContainer>)
          .then(data => {
            dispatch({
              type: 'RECEIVE_OPENSPEECH_UI', uiConfig: data
            });
          });
        dispatch({
          type: 'REQUEST_SET_REGISTER_CONFIG',
          ip1: ip1Requested, ip2: ip2Requested, ip3: ip3Requested, ip4: ip4Requested,
          devicePort: devicePortRequested, registerConfigString: registersAsString
        });
    },

  requestGetRegisterConfig: (
    ip1Requested: string, ip2Requested: string, ip3Requested: string, ip4Requested: string,
    devicePortRequested: string): AppThunkAction<KnownAction> => (dispatch, getState) => {
      fetch(`getregisterconfig/${ip1Requested}/${ip2Requested}/${ip3Requested}/${ip4Requested}/${devicePortRequested}`)
        .then(response => response.json() as Promise<RegisterConfig>)
        .then(data => {
          dispatch({
            type: 'RECEIVE_GET_REGISTER_CONFIG_RESPONSE', currentRegisterConfig: data
          });
        });
      dispatch({
        type: 'REQUEST_GET_REGISTER_CONFIG_ACTION',
        ip1: ip1Requested, ip2: ip2Requested, ip3: ip3Requested, ip4: ip4Requested,
        devicePort: devicePortRequested
      });
    },

  requestDownloadS3Demo: (devicename: string, projectname: string,
    ip1Requested: string, ip2Requested: string, ip3Requested: string, ip4Requested: string,
    devicePortRequested: string): AppThunkAction<KnownAction> => (dispatch, getState) => {
      fetch(`downloads3bucket/${ip1Requested}/${ip2Requested}/${ip3Requested}/${ip4Requested}/${devicePortRequested}/${devicename}/${projectname}`)
      .then(response => response.json() as Promise<EffectContainer>)
      .then(data => {
        dispatch({
          type: 'RECEIVE_OPENSPEECH_DOWNLOAD_DEMO',uiConfig:data, isDeviceDownloading: false,currentDemo:projectname
        });
      });
      dispatch({
        type: 'REQUEST_OPENSPEECH_DOWNLOAD_DEMO',
        ip1: ip1Requested, ip2: ip2Requested, ip3: ip3Requested, ip4: ip4Requested, devicePort: devicePortRequested,
        deviceFamily: devicename, projectName: projectname, isDeviceDownloading: true, currentDemo:projectname
      });
  }
};

// ----------------
// REDUCER - For a given state and action, returns the new state. To support time travel, this must not mutate the old state.

const unloadedState: OpenSpeechToolsState = {
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
        uiConfig: state.uiConfig,
        availableDemos: state.availableDemos,
        isDeviceDownloading: state.isDeviceDownloading,
        isLoading: true
      };
    case 'RECEIVE_OPENSPEECH_UI':
      return {
        availableDemos: state.availableDemos,
        uiConfig: action.uiConfig,
        isDeviceDownloading: state.isDeviceDownloading,
        isLoading: false
      };
    case 'REQUEST_SEND_COMMAND':
      return {
        currentDemo: state.currentDemo,
        uiConfig: state.uiConfig,
        availableDemos: state.availableDemos,
        command: state.command,
        isDeviceDownloading: state.isDeviceDownloading,
        isLoading: true
      };
    case 'RECEIVE_SEND_COMMAND_RESPONSE':
      return {
        currentDemo: state.currentDemo,
        availableDemos: state.availableDemos,
        uiConfig: state.uiConfig,
        isDeviceDownloading: state.isDeviceDownloading,
        isLoading: false
      };
    case 'REQUEST_OPENSPEECH_DEMOS':  
      return {
        currentDemo: state.currentDemo,
        availableDemos: state.availableDemos,
        uiConfig: state.uiConfig,
        isDeviceDownloading: state.isDeviceDownloading,
        isLoading: true
      };
    case 'RECEIVE_OPENSPEECH_DEMOS':
      return {
        currentDemo: state.currentDemo,
        availableDemos: action.availableDemos,
        uiConfig: state.uiConfig,
        isDeviceDownloading: state.isDeviceDownloading,
        isLoading: false
      };
    case 'REQUEST_OPENSPEECH_DOWNLOAD_DEMO':
      return {
        deviceFamily: action.deviceFamily,
        availableDemos: state.availableDemos,
        isDeviceDownloading: true,
        uiConfig: state.uiConfig,
        currentDemo: action.currentDemo,
        isLoading: true
      };
    case 'RECEIVE_OPENSPEECH_DOWNLOAD_DEMO':
      return {
        availableDemos: state.availableDemos,
        currentDemo: action.currentDemo,
        uiConfig: action.uiConfig,
        isDeviceDownloading: false,
        isLoading: false
      };
    case 'REQUEST_S3_DOWNLOAD_PROGRESS':
      return {
        currentDemo: state.currentDemo,
        availableDemos: state.availableDemos,
        uiConfig: state.uiConfig,
        isDeviceDownloading: state.isDeviceDownloading,
        isLoading: false
      };
    case 'REQUEST_SET_REGISTER_CONFIG':
      return {
        currentRegisterConfig: state.currentRegisterConfig,
        currentDemo: state.currentDemo,
        availableDemos: state.availableDemos,
        uiConfig: state.uiConfig,
        isDeviceDownloading: state.isDeviceDownloading,
        isLoading: false
      };

    case 'REQUEST_GET_REGISTER_CONFIG_ACTION':
      return {
        currentDemo: state.currentDemo,
        availableDemos: state.availableDemos,
        uiConfig: state.uiConfig,
        isDeviceDownloading: state.isDeviceDownloading,
        isLoading: false
      };

    case 'RECEIVE_GET_REGISTER_CONFIG_RESPONSE':
      return {
        currentRegisterConfig: action.currentRegisterConfig,
        currentDemo: state.currentDemo,
        availableDemos: state.availableDemos,
        uiConfig: state.uiConfig,
        isDeviceDownloading: state.isDeviceDownloading,
        isLoading: false
      };

    case 'RECEIVE_S3_DOWNLOAD_PROGRESS':  
      return {
        currentDemo: state.currentDemo,
        downloadProgress: action.downloadProgress,
        availableDemos: state.availableDemos,
        uiConfig: state.uiConfig,
        isDeviceDownloading: state.isDeviceDownloading,
        isLoading: false
      };
    default:
      return state as OpenSpeechToolsState;

  }

};
