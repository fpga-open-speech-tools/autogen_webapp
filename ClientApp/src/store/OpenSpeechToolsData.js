"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// ----------------
// ACTION CREATORS - These are functions exposed to UI components that will trigger a state transition.
// They don't directly mutate state, but they can have external side-effects (such as loading data).
exports.openSpeechDataActionCreators = {
    requestOpenSpeechS3Demos: function () { return function (dispatch) {
        fetch("availabledemos")
            .then(function (response) { return response.json(); })
            .then(function (data) {
            dispatch({
                type: 'RECEIVE_OPENSPEECH_DEMOS', availableDemos: data
            });
        });
        dispatch({ type: 'REQUEST_OPENSPEECH_DEMOS' });
    }; },
    requestOpenSpeechUI: function (deviceIPRequested, devicePortRequested) { return function (dispatch, getState) {
        fetch("uiconfig/" + deviceIPRequested + "/" + devicePortRequested)
            .then(function (response) { return response.json(); })
            .then(function (data) {
            dispatch({
                type: 'RECEIVE_OPENSPEECH_UI', uiConfig: data
            });
        });
        dispatch({ type: 'REQUEST_OPENSPEECH_UI', deviceIP: deviceIPRequested, devicePort: devicePortRequested });
    }; },
    requestSendCommand: function (command, deviceIPRequested, devicePortRequested) { return function (dispatch, getState) {
        fetch("command/" + deviceIPRequested + "/" + devicePortRequested)
            .then(function (response) { return response.json(); })
            .then(function (data) {
            dispatch({
                type: 'RECEIVE_OPENSPEECH_UI', uiConfig: data
            });
        });
        dispatch({ type: 'REQUEST_OPENSPEECH_UI', deviceIP: deviceIPRequested, devicePort: devicePortRequested });
    }; }
};
// ----------------
// REDUCER - For a given state and action, returns the new state. To support time travel, this must not mutate the old state.
var unloadedState = {
    availableDemos: [], isLoading: false,
    testPanel: {
        name: "testEffect",
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
        ]
    }
};
exports.reducer = function (state, incomingAction) {
    if (state === undefined) {
        return unloadedState;
    }
    var action = incomingAction;
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
            return state;
    }
};
//# sourceMappingURL=OpenSpeechToolsData.js.map