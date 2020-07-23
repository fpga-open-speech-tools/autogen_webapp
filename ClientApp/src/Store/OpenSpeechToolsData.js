"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function appendAddressToForm(data, address) {
    data.append('ip1', address.ipAddress.ip1);
    data.append('ip2', address.ipAddress.ip2);
    data.append('ip3', address.ipAddress.ip3);
    data.append('ip4', address.ipAddress.ip4);
    data.append('port', address.port);
}
// ----------------
// ACTION CREATORS - These are functions exposed to UI components that will trigger a state transition.
// They don't directly mutate state, but they can have external side-effects (such as loading data).
exports.openSpeechDataActionCreators = {
    updateModelData: function (autogen) { return function (dispatch) {
        dispatch({ type: 'UPDATE_MODEL_DATA', autogen: autogen });
    }; },
    requestOpenSpeechS3Demos: function () { return function (dispatch) {
        fetch("demos")
            .then(function (response) { return response.json(); })
            .then(function (data) {
            dispatch({
                type: 'RECEIVE_OPENSPEECH_DEMOS', availableDemos: data
            });
        });
        dispatch({ type: 'REQUEST_OPENSPEECH_DEMOS' });
    }; },
    requestAutogenConfiguration: function (address) { return function (dispatch, getState) {
        var data = new FormData();
        appendAddressToForm(data, address);
        fetch("configuration", { method: "PUT", body: data })
            .then(function (response) { return response.json(); })
            .then(function (data) {
            dispatch({
                type: 'RECEIVE_OPENSPEECH_AUTOGEN', autogen: data
            });
        });
        dispatch({
            type: 'REQUEST_OPENSPEECH_AUTOGEN',
            deviceAddress: address
        });
    }; },
    requestSendModelData: function (input, address) { return function (dispatch, getState) {
        var data = new FormData();
        var inputString = JSON.stringify(input);
        appendAddressToForm(data, address);
        data.append('modelData', JSON.stringify(inputString));
        fetch("model-data", { method: "PUT", body: data })
            .then(function () {
            dispatch({
                type: 'RECEIVE_SEND_COMMAND_RESPONSE'
            });
        });
        dispatch({
            type: 'REQUEST_SEND_COMMAND',
            deviceAddress: address, command: input
        });
    }; },
    requestDownloadS3Demo: function (address, devicename, projectname) { return function (dispatch, getState) {
        fetch("downloads3bucket/" + address.ipAddress.ip1 + "/" + address.ipAddress.ip2 + "/" + address.ipAddress.ip3 + "/" + address.ipAddress.ip4 + "/" + address.port + "/" + devicename + "/" + projectname)
            .then(function (response) { return response.json(); })
            .then(function (data) {
            dispatch({
                type: 'RECEIVE_OPENSPEECH_DOWNLOAD_DEMO', autogen: data, isDeviceDownloading: false, currentDemo: projectname
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
var emptyAutogen = {
    containers: {},
    data: {},
    views: {},
    name: ""
};
// ----------------
// REDUCER - For a given state and action, returns the new state. To support time travel, this must not mutate the old state.
var unloadedState = {
    deviceAddress: { ipAddress: { ip1: '192', ip2: '168', ip3: '0', ip4: '120' }, port: '3355' },
    autogen: emptyAutogen,
    newAutogen: false,
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
        case 'REQUEST_OPENSPEECH_AUTOGEN':
            return {
                deviceAddress: state.deviceAddress,
                autogen: emptyAutogen,
                availableDemos: state.availableDemos,
                isDeviceDownloading: state.isDeviceDownloading,
                isLoading: true,
                newAutogen: false,
            };
        case 'RECEIVE_OPENSPEECH_AUTOGEN':
            return {
                deviceAddress: state.deviceAddress,
                availableDemos: state.availableDemos,
                autogen: action.autogen,
                isDeviceDownloading: state.isDeviceDownloading,
                newAutogen: true,
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
                newAutogen: false,
                isLoading: true
            };
        case 'RECEIVE_SEND_COMMAND_RESPONSE':
            return {
                deviceAddress: state.deviceAddress,
                currentDemo: state.currentDemo,
                availableDemos: state.availableDemos,
                autogen: state.autogen,
                isDeviceDownloading: state.isDeviceDownloading,
                newAutogen: false,
                isLoading: false
            };
        case 'REQUEST_OPENSPEECH_DEMOS':
            return {
                deviceAddress: state.deviceAddress,
                currentDemo: state.currentDemo,
                availableDemos: state.availableDemos,
                autogen: state.autogen,
                isDeviceDownloading: state.isDeviceDownloading,
                newAutogen: false,
                isLoading: true
            };
        case 'RECEIVE_OPENSPEECH_DEMOS':
            return {
                deviceAddress: state.deviceAddress,
                currentDemo: state.currentDemo,
                availableDemos: action.availableDemos,
                autogen: state.autogen,
                isDeviceDownloading: state.isDeviceDownloading,
                newAutogen: false,
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
                newAutogen: false,
                isLoading: true
            };
        case 'RECEIVE_OPENSPEECH_DOWNLOAD_DEMO':
            return {
                deviceAddress: state.deviceAddress,
                availableDemos: state.availableDemos,
                currentDemo: action.currentDemo,
                autogen: action.autogen,
                isDeviceDownloading: false,
                newAutogen: false,
                isLoading: false
            };
        case 'REQUEST_SET_REGISTER_CONFIG':
            return {
                deviceAddress: state.deviceAddress,
                currentDemo: state.currentDemo,
                availableDemos: state.availableDemos,
                autogen: emptyAutogen,
                isDeviceDownloading: state.isDeviceDownloading,
                newAutogen: false,
                isLoading: false
            };
        case 'SET_DEVICE_ADDRESS':
            return {
                deviceAddress: action.address,
                availableDemos: state.availableDemos,
                autogen: state.autogen,
                isDeviceDownloading: state.isDeviceDownloading,
                newAutogen: false,
                isLoading: false
            };
        case 'UPDATE_MODEL_DATA':
            return {
                deviceAddress: state.deviceAddress,
                availableDemos: state.availableDemos,
                autogen: action.autogen,
                isDeviceDownloading: state.isDeviceDownloading,
                newAutogen: false,
                isLoading: false
            };
        default:
            return state;
    }
};
//# sourceMappingURL=OpenSpeechToolsData.js.map