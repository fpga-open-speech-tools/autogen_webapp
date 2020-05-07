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

  deviceIP?: string;
  devicePort?: string;
  command?: Command;
}


export interface Command {
  linkerName: string;
  value: string;
}

export interface Demo {
  name: string;
  downloadurl: string;
  imageurl: string;
  videourl: string;
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
  command: string;
}

interface ReceiveSendCommandResponse {
  type: 'RECEIVE_SEND_COMMAND_RESPONSE';
  uiConfig: EffectContainer;
}

// Declare a 'discriminated union' type. This guarantees that all references to 'type' properties contain one of the
// declared type strings (and not any other arbitrary string).
type KnownAction =
  RequestOpenSpeechUIConfig | ReceiveOpenSpeechUIConfig |
  RequestOpenSpeechS3DemosAction | ReceiveOpenSpeechS3DemosAction |
  RequestSendCommand | ReceiveSendCommandResponse;

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
  requestSendCommand: (command: Command, deviceIPRequested: string, devicePortRequested: string): AppThunkAction<KnownAction> => (dispatch, getState) => {
    fetch(`command/${deviceIPRequested}/${devicePortRequested}`)
      .then(response => response.json() as Promise<EffectContainer>)
      .then(data => {
        dispatch({
          type: 'RECEIVE_OPENSPEECH_UI', uiConfig: data
        });
      });
    dispatch({ type: 'REQUEST_OPENSPEECH_UI', deviceIP: deviceIPRequested, devicePort: devicePortRequested });
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
        uiConfig: action.uiConfig,
        isLoading: false
      };
    case 'REQUEST_OPENSPEECH_DEMOS':
      return {
        testPanel: state.testPanel,
        availableDemos: state.availableDemos,
        uiConfig: state.uiConfig,
        isLoading: false
      };
    case 'RECEIVE_OPENSPEECH_DEMOS':
      return {
        testPanel: state.testPanel,
        availableDemos: action.availableDemos,
        uiConfig: state.uiConfig,
        isLoading: false
      };
    default:
      return state as OpenSpeechToolsState;

  }

};
