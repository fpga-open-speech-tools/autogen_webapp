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
    requestS3DownloadProgress: function (ip1Requested, ip2Requested, ip3Requested, ip4Requested, devicePortRequested) { return function (dispatch) {
        fetch("downloadprogress/" + ip1Requested + "/" + ip2Requested + "/" + ip3Requested + "/" + ip4Requested + "/" + devicePortRequested)
            .then(function (response) { return response.json(); })
            .then(function (data) {
            dispatch({
                type: 'RECEIVE_S3_DOWNLOAD_PROGRESS', downloadProgress: data
            });
        });
        dispatch({
            type: 'REQUEST_S3_DOWNLOAD_PROGRESS',
            ip1: ip1Requested, ip2: ip2Requested, ip3: ip3Requested, ip4: ip4Requested,
            devicePort: devicePortRequested
        });
    }; },
    requestOpenSpeechUI: function (ip1Requested, ip2Requested, ip3Requested, ip4Requested, devicePortRequested) { return function (dispatch, getState) {
        fetch("uiconfig/" + ip1Requested + "/" + ip2Requested + "/" + ip3Requested + "/" + ip4Requested + "/" + devicePortRequested)
            .then(function (response) { return response.json(); })
            .then(function (data) {
            dispatch({
                type: 'RECEIVE_OPENSPEECH_UI', uiConfig: data
            });
        });
        dispatch({
            type: 'REQUEST_OPENSPEECH_UI',
            ip1: ip1Requested, ip2: ip2Requested, ip3: ip3Requested, ip4: ip4Requested,
            devicePort: devicePortRequested
        });
    }; },
    requestSendCommand: function (link, value, module, ip1Requested, ip2Requested, ip3Requested, ip4Requested, devicePortRequested) { return function (dispatch, getState) {
        fetch("command/" + ip1Requested + "/" + ip2Requested + "/" + ip3Requested + "/" + ip4Requested + "/" + devicePortRequested + "/" + link + "/" + value + "/" + module)
            .then(function () {
            dispatch({
                type: 'RECEIVE_SEND_COMMAND_RESPONSE'
            });
        });
        dispatch({
            type: 'REQUEST_SEND_COMMAND',
            ip1: ip1Requested, ip2: ip2Requested, ip3: ip3Requested, ip4: ip4Requested,
            devicePort: devicePortRequested, command: { link: link, value: value, module: module }
        });
    }; },
    requestDownloadS3Demo: function (devicename, projectname, ip1Requested, ip2Requested, ip3Requested, ip4Requested, devicePortRequested) { return function (dispatch, getState) {
        fetch("downloads3bucket/" + ip1Requested + "/" + ip2Requested + "/" + ip3Requested + "/" + ip4Requested + "/" + devicePortRequested + "/" + devicename + "/" + projectname)
            .then(function (response) { return response.json(); })
            .then(function (data) {
            dispatch({
                type: 'RECEIVE_OPENSPEECH_DOWNLOAD_DEMO', uiConfig: data, isDeviceDownloading: false, currentDemo: projectname
            });
        });
        dispatch({
            type: 'REQUEST_OPENSPEECH_DOWNLOAD_DEMO',
            ip1: ip1Requested, ip2: ip2Requested, ip3: ip3Requested, ip4: ip4Requested, devicePort: devicePortRequested,
            deviceFamily: devicename, projectName: projectname, isDeviceDownloading: true, currentDemo: projectname
        });
    }; }
};
// ----------------
// REDUCER - For a given state and action, returns the new state. To support time travel, this must not mutate the old state.
var unloadedState = {
    availableDemos: [],
    isLoading: false,
    isDeviceDownloading: false
};
exports.reducer = function (state, incomingAction) {
    if (state === undefined) {
        return unloadedState;
    }
    var action = incomingAction;
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
            return state;
    }
};
//# sourceMappingURL=OpenSpeechToolsData.js.map