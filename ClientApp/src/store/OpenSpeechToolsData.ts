import { Action, Reducer } from 'redux';
import { AppThunkAction } from '../';
import * as uicfg from './EffectContainer.json';

// -----------------
// STATE - This defines the type of data maintained in the Redux store.

export interface OpenSpeechToolsState {
  isLoading: boolean;
  //Interface for UI JSON
  uiConfig: EffectContainer;
  //Interface for Demos Array[]
  availableDemos: Demo[];
  testPanel: Panel;

  downloadURL?: string;
  deviceIP?: string;
  devicePort?: string;
  command?: Command;
}


export interface Command {
  link: string;
  value: string;
  module: string;
}

export interface Demo {
  name: string;
  downloadurl: string;
  imageurl: string;
  videourl: string;
  filesize: number;
}

export interface EffectContainer {
  module: string;
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
  deviceIP: string;
  devicePort: string;
  downloadURL: string;
}

interface ReceiveOpenSpeechS3DownloadAction {
  type: 'RECEIVE_OPENSPEECH_DOWNLOAD_DEMO';
  uiConfig: EffectContainer;
}

interface RequestOpenSpeechUIConfig {
  type: 'REQUEST_OPENSPEECH_UI';
  deviceIP: string;
  devicePort: string;
}

interface ReceiveOpenSpeechUIConfig {
  type: 'RECEIVE_OPENSPEECH_UI';
  uiConfig: EffectContainer;
}

interface RequestSendCommand {
  type: 'REQUEST_SEND_COMMAND';
  deviceIP: string;
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
  RequestOpenSpeechS3DownloadAction | ReceiveOpenSpeechS3DownloadAction;

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
  requestOpenSpeechUI: (deviceIPRequested: string, devicePortRequested: string): AppThunkAction<KnownAction> => (dispatch, getState) => {
    fetch(`uiconfig/${deviceIPRequested}/${devicePortRequested}`)
      .then(response => response.json() as Promise<EffectContainer>)
      .then(data => {
        dispatch({
          type: 'RECEIVE_OPENSPEECH_UI', uiConfig: data
        });
      });
    dispatch({ type: 'REQUEST_OPENSPEECH_UI', deviceIP: deviceIPRequested, devicePort: devicePortRequested});
  },
  requestSendCommand: (link:string, value:string, module:string, deviceIPRequested: string, devicePortRequested: string): AppThunkAction<KnownAction> => (dispatch, getState) => {
    fetch(`command/${deviceIPRequested}/${devicePortRequested}/${link}/${value}/${module}`)
      .then(() => {
        dispatch({
          type: 'RECEIVE_SEND_COMMAND_RESPONSE'
        });
      });
    dispatch({ type: 'REQUEST_SEND_COMMAND', deviceIP: deviceIPRequested, devicePort: devicePortRequested, command: {link:link,value:value,module:module}});
  },
  requestDownloadS3Demo: (downloadurl:string, deviceIPRequested: string, devicePortRequested: string): AppThunkAction<KnownAction> => (dispatch, getState) => {
    fetch(`downloads3bucket/${deviceIPRequested}/${devicePortRequested}/${downloadurl}`)
      .then(response => response.json() as Promise<EffectContainer>)
      .then(data => {
        dispatch({
          type: 'RECEIVE_OPENSPEECH_DOWNLOAD_DEMO',uiConfig:data
        });
      });
    dispatch({ type: 'REQUEST_OPENSPEECH_DOWNLOAD_DEMO', deviceIP: deviceIPRequested, devicePort: devicePortRequested, downloadURL: downloadurl });
  }
};

// ----------------
// REDUCER - For a given state and action, returns the new state. To support time travel, this must not mutate the old state.

const unloadedState: OpenSpeechToolsState = {
  availableDemos: [],
  isLoading: false,
  uiConfig: {
    pages: uicfg.pages,
    module: uicfg.module
  },

  testPanel: {
    name: "ManualTestPanel",
    controls: [
    {
      style: "default",
      linkerName: "control1",
      min: 0,
      max: 100,
      title: "control1",
      dataType: "float",
      defaultValue: 1,
      units: "freedomUnits",
      type: "slider"
    },
    {
      style: "default",
      linkerName: "control2",
      min: 0,
      max: 200,
      title: "control2",
      dataType: "float",
      defaultValue: 2,
      units: "freedomUnits",
      type: "slider"
    }
    ]}
  };

export const reducer: Reducer<OpenSpeechToolsState> = (state: OpenSpeechToolsState | undefined, incomingAction: Action): OpenSpeechToolsState => {
  if (state === undefined) {
    return unloadedState;
  }

  const action = incomingAction as KnownAction;
  switch (action.type) {
    case 'REQUEST_OPENSPEECH_UI':
      return {
        testPanel: state.testPanel,
        uiConfig: state.uiConfig,
        availableDemos: state.availableDemos,
        isLoading: true
      };
    case 'RECEIVE_OPENSPEECH_UI':
      return {
        testPanel: state.testPanel,
        availableDemos: state.availableDemos,
        uiConfig: action.uiConfig,
        isLoading: false
      };
    case 'REQUEST_SEND_COMMAND':
      return {
        testPanel: state.testPanel,
        uiConfig: state.uiConfig,
        availableDemos: state.availableDemos,
        command: state.command,
        isLoading: true
      };
    case 'RECEIVE_SEND_COMMAND_RESPONSE':
      return {
        testPanel: state.testPanel,
        availableDemos: state.availableDemos,
        uiConfig: state.uiConfig,
        isLoading: false
      };
    case 'REQUEST_OPENSPEECH_DEMOS':
      return {
        testPanel: state.testPanel,
        availableDemos: state.availableDemos,
        uiConfig: state.uiConfig,
        isLoading: true
      };
    case 'RECEIVE_OPENSPEECH_DEMOS':
      return {
        testPanel: state.testPanel,
        availableDemos: action.availableDemos,
        uiConfig: state.uiConfig,
        isLoading: false
      };
    case 'REQUEST_OPENSPEECH_DOWNLOAD_DEMO':
      return {
        downloadURL: action.downloadURL,
        testPanel: state.testPanel,
        availableDemos: state.availableDemos,
        uiConfig: state.uiConfig,
        isLoading: true
      };
    case 'RECEIVE_OPENSPEECH_DOWNLOAD_DEMO':
      return {
        testPanel: state.testPanel,
        availableDemos: state.availableDemos,
        uiConfig: action.uiConfig,
        isLoading: false
      };
    default:
      return state as OpenSpeechToolsState;

  }

};
