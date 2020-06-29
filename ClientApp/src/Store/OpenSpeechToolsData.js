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
    requestS3DownloadProgress: function (address) { return function (dispatch) {
        fetch("downloadprogress/" + address.ipAddress.ip1 + "/" + address.ipAddress.ip2 + "/" + address.ipAddress.ip3 + "/" + address.ipAddress.ip4 + "/" + address.port)
            .then(function (response) { return response.json(); })
            .then(function (data) {
            dispatch({
                type: 'RECEIVE_S3_DOWNLOAD_PROGRESS', downloadProgress: data
            });
        });
        dispatch({
            type: 'REQUEST_S3_DOWNLOAD_PROGRESS',
            deviceAddress: address
        });
    }; },
    requestOpenSpeechUI: function (address) { return function (dispatch, getState) {
        fetch("uiconfig/" + address.ipAddress.ip1 + "/" + address.ipAddress.ip2 + "/" + address.ipAddress.ip3 + "/" + address.ipAddress.ip4 + "/" + address.port)
            .then(function (response) { return response.json(); })
            .then(function (data) {
            dispatch({
                type: 'RECEIVE_OPENSPEECH_UI', uiConfig: data
            });
        });
        dispatch({
            type: 'REQUEST_OPENSPEECH_UI',
            deviceAddress: address
        });
    }; },
    requestSendCommand: function (link, value, module, address) { return function (dispatch, getState) {
        fetch("command/" + address.ipAddress.ip1 + "/" + address.ipAddress.ip2 + "/" + address.ipAddress.ip3 + "/" + address.ipAddress.ip4 + "/" + address.port + "/" + link + "/" + value + "/" + module)
            .then(function () {
            dispatch({
                type: 'RECEIVE_SEND_COMMAND_RESPONSE'
            });
        });
        dispatch({
            type: 'REQUEST_SEND_COMMAND',
            deviceAddress: address, command: { link: link, value: value, module: module }
        });
    }; },
    requestSendRegisterConfig: function (registers, address) { return function (dispatch, getState) {
        var data = new FormData();
        data.append('ip1', address.ipAddress.ip1);
        data.append('ip2', address.ipAddress.ip2);
        data.append('ip3', address.ipAddress.ip3);
        data.append('ip4', address.ipAddress.ip4);
        data.append('port', address.port);
        var registersAsString = JSON.stringify(registers);
        data.append('registers', JSON.stringify(registers));
        fetch("setregisterconfig", { method: "PUT", body: data })
            .then(function (response) { return response.json(); })
            .then(function (data) {
            dispatch({
                type: 'RECEIVE_OPENSPEECH_UI', uiConfig: data
            });
        });
        dispatch({
            type: 'REQUEST_SET_REGISTER_CONFIG',
            deviceAddress: address, registerConfigString: registersAsString
        });
    }; },
    requestGetRegisterConfig: function (address, callback) { return function (dispatch, getState) {
        fetch("getregisterconfig/" + address.ipAddress.ip1 + "/" + address.ipAddress.ip2 + "/" + address.ipAddress.ip3 + "/" + address.ipAddress.ip4 + "/" + address.port)
            .then(function (response) { return response.json(); })
            .then(function (data) {
            dispatch({
                type: 'RECEIVE_GET_REGISTER_CONFIG_RESPONSE', currentRegisterConfig: data
            });
            callback();
        });
        dispatch({
            type: 'REQUEST_GET_REGISTER_CONFIG_ACTION',
            deviceAddress: address
        });
    }; },
    requestDownloadS3Demo: function (address, devicename, projectname) { return function (dispatch, getState) {
        fetch("downloads3bucket/" + address.ipAddress.ip1 + "/" + address.ipAddress.ip2 + "/" + address.ipAddress.ip3 + "/" + address.ipAddress.ip4 + "/" + address.port + "/" + devicename + "/" + projectname)
            .then(function (response) { return response.json(); })
            .then(function (data) {
            dispatch({
                type: 'RECEIVE_OPENSPEECH_DOWNLOAD_DEMO', uiConfig: data, isDeviceDownloading: false, currentDemo: projectname
            });
        });
        dispatch({
            type: 'REQUEST_OPENSPEECH_DOWNLOAD_DEMO',
            deviceAddress: address,
            deviceFamily: devicename, projectName: projectname, isDeviceDownloading: true, currentDemo: projectname
        });
    }; },
    setDeviceAddress: function (address) { return function (dispatch, getState) {
        dispatch({
            type: 'SET_DEVICE_ADDRESS',
            address: address
        });
    }; },
};
// ----------------
// REDUCER - For a given state and action, returns the new state. To support time travel, this must not mutate the old state.
var unloadedState = {
    deviceAddress: { ipAddress: { ip1: '127', ip2: '0', ip3: '0', ip4: '1' }, port: '3355' },
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
                deviceAddress: state.deviceAddress,
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
            };
        default:
            return state;
    }
};
//# sourceMappingURL=OpenSpeechToolsData.js.map