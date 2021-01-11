import { Action, Reducer } from 'redux';
import { AppThunkAction } from '../';
import * as DemoFetcher from './data-helpers/demo-fetcher.js';

// -----------------
// STATE - This defines the type of data maintained in the Redux store.

export interface OpenSpeechToolsState {
  isLoading: boolean;
  isDeviceDownloading: boolean;
  currentDemo?: string;
  //Interface for UI JSON
  autogen: Autogen;
  newAutogen: boolean;
  //Interface for Demos Array[]
  availableDemos: DemoDevice[];

  //S3Bucket Download info
  deviceFamily?: string;
  projectName?: string;

  //Device Controls info
  deviceAddress: DeviceAddress;
  rtcEnabled: boolean;

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

export interface DemoDevice {
  name:string;
  projects:DemoProject[];
}

export interface DemoProject {
  name:string;
  files:DemoFile[];
  size:number;
}

export interface DemoFile {
  name:string;
  size:number;
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
  options?: Options[];
  description?: string;
  //properties: ViewProperties;
}

export interface AutogenContainer {
  name: string;
  views: number[];
}

export interface ComponentView {
  name: string;
  type: AutogenComponent;
  references: number[];
  optionsIndex?: number;
}

export interface AutogenComponent {
  component: string; 
  variant: string; 
  callback: string | undefined | null; 
}

export interface ModelData {
  type: string;
  name: string;
  device: string;
  properties: DataProperties | any;
  value: number | number[] | string | string[];
}


export interface DataProperties {
  min: number | undefined | null;
  max: number | undefined | null;
  step: number | undefined | null;
  units: string | undefined | null;
  enumeration: string[] | number[] | undefined | null;
}

export interface DataPacket {
  index: number;
  value: number | number[] | string | string[];
}

export interface Options {
  data?: number[];
  min?: number | undefined | null;
  max?: number | undefined | null;
  step?: number | undefined | null;
  units?: string | undefined | null;
  enumerations?: EnumerationOption[];
}

export interface EnumerationOption {
  key: any;
  value: any;
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
  availableDemos: DemoDevice[];
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

interface RequestSendCommand {
  type: 'REQUEST_SEND_COMMAND';
  deviceAddress: DeviceAddress;
  command: DataPacket[];
}

interface ReceiveSendCommandResponse {
  type: 'RECEIVE_SEND_COMMAND_RESPONSE';
}

interface UpdateAutogen {
  type: 'UPDATE_AUTOGEN_PROPS';
  autogen: Autogen;
}

interface ConnectRTC {
  type: 'REQUEST_RTC_ENABLE';
  rtcEnabled: boolean;
}

interface SetAutogenConfiguration {
  type: 'REQUEST_SEND_AUTOGEN_CONFIGURATION';
  autogen: Autogen;
  deviceAddress: DeviceAddress;
}

// Declare a 'discriminated union' type. This guarantees that all references to 'type' properties contain one of the
// declared type strings (and not any other arbitrary string).
type KnownAction =
  RequestOpenSpeechAutogenConfig | ReceiveOpenSpeechAutogenConfig |
  RequestOpenSpeechS3DemosAction | ReceiveOpenSpeechS3DemosAction |
  RequestSendCommand | ReceiveSendCommandResponse | 
  RequestOpenSpeechS3DownloadAction | ReceiveOpenSpeechS3DownloadAction |
  SetDeviceAddress | UpdateAutogen | ConnectRTC | SetAutogenConfiguration;


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
  updateAutogenProps: (autogen: Autogen):
    AppThunkAction<KnownAction> => (dispatch) => {
      dispatch({ type: 'UPDATE_AUTOGEN_PROPS', autogen});
    },

  requestSendAutogenConfiguration: (address: DeviceAddress, input: Autogen, callback: Function):
    AppThunkAction<KnownAction> => (dispatch, getState) => {
      var data = new FormData();
      appendAddressToForm(data, address);
      var inputString = JSON.stringify(input);
      data.append('configuration', JSON.stringify(inputString));

      fetch(`configuration`, { method: "PUT", body: data })
        .then(response => response.json() as Promise<any>)
        .then(data => {
          dispatch({
            type: 'RECEIVE_OPENSPEECH_AUTOGEN', autogen: data
          });
          callback();
        });
      dispatch({
        type: 'REQUEST_SEND_AUTOGEN_CONFIGURATION',
        deviceAddress: address,autogen:input
      });
    },

  requestRTCEnable: (address:DeviceAddress):
    AppThunkAction<KnownAction> => (dispatch) => {
      var data = new FormData();
      appendAddressToForm(data, address);
      fetch(`connect-rtc`, { method: "PUT", body: data })
        .then(response => response.json() as Promise<boolean>)
        .then(data => {
          dispatch({
            type: 'REQUEST_RTC_ENABLE', rtcEnabled: data
          });
        });
      dispatch({ type: 'REQUEST_RTC_ENABLE', rtcEnabled:false });
    },

  requestOpenSpeechS3Demos: (bucket_name:string):
    AppThunkAction<KnownAction> => (dispatch) => {
      var url = DemoFetcher.getBucketURL(bucket_name);
      fetch(url)
      .then(response => response.text())
      .then(str => (new window.DOMParser()).parseFromString(str, "text/xml"))
      .then(data => {
        var bucket_data = DemoFetcher.JSONFromXMLDocumentObject(data);
        var demos_array = DemoFetcher.updateDevicesList(JSON.parse(bucket_data));
        dispatch({
          type: 'RECEIVE_OPENSPEECH_DEMOS', availableDemos: demos_array
        });
      });
    dispatch({ type: 'REQUEST_OPENSPEECH_DEMOS' });
  },

  requestAutogenConfiguration: (address: DeviceAddress):
    AppThunkAction<KnownAction> => (dispatch, getState) => {
      var data = new FormData();
      data.append("configuration", "");
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

  requestDownloadS3Demo: (address: DeviceAddress, bucketName:string, devicename: string, projectname: string):
    AppThunkAction<KnownAction> => (dispatch, getState) => {
    fetch(`downloads3bucket/${address.ipAddress.ip1}/${address.ipAddress.ip2}/${address.ipAddress.ip3}/${address.ipAddress.ip4}/${address.port}/${bucketName}/${devicename}/${projectname}`)
      .then(response => response.json() as Promise<Autogen>)
      .then(data => {
        dispatch({
          type: 'RECEIVE_OPENSPEECH_DOWNLOAD_DEMO',autogen:data, isDeviceDownloading: false, currentDemo:projectname
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
  containers: [],
  data: [],
  views: [],
  name: ""
} as Autogen
// ----------------
// REDUCER - For a given state and action, returns the new state. To support time travel, this must not mutate the old state.

const unloadedState: OpenSpeechToolsState = {
  deviceAddress: { ipAddress: { ip1: '127', ip2: '0', ip3: '0', ip4: '1' }, port: '3355' },
  autogen: emptyAutogen,
  newAutogen: false,
  availableDemos: [],
  isLoading: false,
  isDeviceDownloading: false,
  rtcEnabled:false
  };

export const reducer: Reducer<OpenSpeechToolsState> = (state: OpenSpeechToolsState | undefined, incomingAction: Action): OpenSpeechToolsState => {
  if (state === undefined) {
    return unloadedState;
  }

  const action = incomingAction as KnownAction;
  switch (action.type) {
    case 'REQUEST_SEND_AUTOGEN_CONFIGURATION':
      return {
        deviceAddress: state.deviceAddress,
        autogen: state.autogen,
        availableDemos: state.availableDemos,
        isDeviceDownloading: state.isDeviceDownloading,
        isLoading: true,
        newAutogen: false,
        rtcEnabled: state.rtcEnabled
      };
    case 'REQUEST_OPENSPEECH_AUTOGEN':
      return {
        deviceAddress:state.deviceAddress,
        autogen: state.autogen,
        availableDemos: state.availableDemos,
        isDeviceDownloading: state.isDeviceDownloading,
        isLoading: true,
        newAutogen: false,
        rtcEnabled: state.rtcEnabled
      };
    case 'RECEIVE_OPENSPEECH_AUTOGEN':
      return {
        deviceAddress: state.deviceAddress,
        availableDemos: state.availableDemos,
        autogen: action.autogen,
        isDeviceDownloading: state.isDeviceDownloading,
        newAutogen: true,
        isLoading: false,
        rtcEnabled: state.rtcEnabled
      };
    case 'REQUEST_SEND_COMMAND':
      return {
        deviceAddress: state.deviceAddress,
        currentDemo: state.currentDemo,
        autogen: state.autogen,
        availableDemos: state.availableDemos,
        command: state.command,
        isDeviceDownloading: state.isDeviceDownloading,
        newAutogen: false,
        isLoading: true,
        rtcEnabled: state.rtcEnabled
      };
    case 'RECEIVE_SEND_COMMAND_RESPONSE':
      return {
        deviceAddress: state.deviceAddress,
        currentDemo: state.currentDemo,
        availableDemos: state.availableDemos,
        autogen: state.autogen,
        isDeviceDownloading: state.isDeviceDownloading,
        newAutogen: false,
        isLoading: false,
        rtcEnabled: state.rtcEnabled
      };
    case 'REQUEST_OPENSPEECH_DEMOS':  
      return {
        deviceAddress: state.deviceAddress,
        currentDemo: state.currentDemo,
        availableDemos: state.availableDemos,
        autogen: state.autogen,
        isDeviceDownloading: state.isDeviceDownloading,
        newAutogen: false,
        isLoading: true,
        rtcEnabled: state.rtcEnabled
      };
    case 'RECEIVE_OPENSPEECH_DEMOS':
      return {
        deviceAddress: state.deviceAddress,
        currentDemo: state.currentDemo,
        availableDemos: action.availableDemos,
        autogen: state.autogen,
        isDeviceDownloading: state.isDeviceDownloading,
        newAutogen: false,
        isLoading: false,
        rtcEnabled: state.rtcEnabled
      };
    case 'REQUEST_OPENSPEECH_DOWNLOAD_DEMO':
      return {
        deviceAddress: state.deviceAddress,
        deviceFamily: action.deviceFamily,
        availableDemos: state.availableDemos,
        isDeviceDownloading: true,
        autogen: state.autogen,
        currentDemo: action.currentDemo,
        newAutogen: false,
        isLoading: true,
        rtcEnabled: state.rtcEnabled
      };
    case 'RECEIVE_OPENSPEECH_DOWNLOAD_DEMO':
      return {
        deviceAddress: state.deviceAddress,
        availableDemos: state.availableDemos,
        currentDemo: action.currentDemo,
        autogen: action.autogen,
        isDeviceDownloading: false,
        newAutogen: false,
        isLoading: false,
        rtcEnabled: state.rtcEnabled
      };

    case 'SET_DEVICE_ADDRESS':
      return {
        deviceAddress: action.address,
        availableDemos: state.availableDemos,
        autogen: state.autogen,
        isDeviceDownloading: state.isDeviceDownloading,
        newAutogen: false,
        isLoading: false,
        rtcEnabled: state.rtcEnabled
      };
    case 'UPDATE_AUTOGEN_PROPS':
      return {
        deviceAddress: state.deviceAddress,
        availableDemos: state.availableDemos,
        autogen: action.autogen,
        isDeviceDownloading: state.isDeviceDownloading,
        newAutogen: false,
        isLoading: false,
        rtcEnabled: state.rtcEnabled
      };
    case 'REQUEST_RTC_ENABLE':
      return {
        deviceAddress: state.deviceAddress,
        availableDemos: state.availableDemos,
        autogen: state.autogen,
        isDeviceDownloading: state.isDeviceDownloading,
        newAutogen: false,
        isLoading: false,
        rtcEnabled: action.rtcEnabled
      };
    default:
      return state as OpenSpeechToolsState;

  }

};
