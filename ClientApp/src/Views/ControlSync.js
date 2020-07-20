"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
var react_redux_1 = require("react-redux");
var OpenSpeechDataStore = require("../Store/OpenSpeechToolsData");
var react_bootstrap_1 = require("react-bootstrap");
var NotificationWrapper_jsx_1 = require("../Components/Notifications/NotificationWrapper.jsx");
var ControlWrapperTest_jsx_1 = require("./ControlWrapperTest.jsx");
var signalR = require("@microsoft/signalr");
var connection = new signalR.HubConnectionBuilder().withUrl("/model-data").build();
var ControlSyncView = /** @class */ (function (_super) {
    __extends(ControlSyncView, _super);
    function ControlSyncView(props) {
        var _this = _super.call(this, props) || this;
        _this.state = {
            connectedToServer: false,
            sessionStarted: false,
            sessionPatientConnected: false,
            groupID: "",
            user: "Test",
            message: "",
            value1: 1,
            value2: 5,
            value3: 9,
            notificationText: "",
            notificationLevel: ""
        };
        _this.setNotificationText = _this.setNotificationText.bind(_this);
        _this.setNotificationLevel = _this.setNotificationLevel.bind(_this);
        _this.startSession = _this.startSession.bind(_this);
        _this.verifyConnection = _this.verifyConnection.bind(_this);
        _this.sendFeedbackRequestToServer = _this.sendFeedbackRequestToServer.bind(_this);
        _this.handleChange = _this.handleChange.bind(_this);
        _this.doNothing = _this.doNothing.bind(_this);
        return _this;
    } //End Constructor 
    ControlSyncView.prototype.componentDidMount = function () {
        this.startSession();
    }; // End ComponentDidMount
    ControlSyncView.prototype.componentDidUpdate = function () {
    }; //End ComponentDidUpdate
    ControlSyncView.prototype.componentWillMount = function () {
    };
    ControlSyncView.prototype.setNotificationText = function (text) {
        this.setState({ notificationText: text });
    };
    ControlSyncView.prototype.setNotificationLevel = function (level) {
        this.setState({ notificationLevel: level });
    };
    ControlSyncView.prototype.handleChange = function (index, value) {
        if (index === 1) {
            this.setState({ value1: value });
        }
        else if (index === 2) {
            this.setState({ value2: value });
        }
        else {
            this.setState({ value3: value });
        }
        var obj = { index: index, value: value };
        connection.invoke("SendDataPacket", obj).catch(function (err) {
            return console.error(err.toString());
        });
    };
    ControlSyncView.prototype.verifyConnection = function () {
        connection.invoke("AfterConnected").catch(function (err) {
            return console.error(err.toString());
        });
    };
    ControlSyncView.prototype.startSession = function () {
        var _this = this;
        connection.on("Connected", function (message) {
            var msg = message.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
            _this.setState({
                connectedToServer: true,
                notificationLevel: "success",
                notificationText: msg
            });
        });
        connection.on("Update", function (obj) {
            var msg = "index: " + obj.index + " value: " + obj.value;
            if (obj.index === 1) {
                _this.setState({ value1: obj.value });
            }
            else if (obj.index === 2) {
                _this.setState({ value2: obj.value });
            }
            else {
                _this.setState({ value3: obj.value });
            }
            _this.setState({ message: msg });
        });
        connection.start()
            .then(function (val) {
        }).then(function (res) { return _this.verifyConnection(); })
            .catch(function (err) {
            setTimeout(function () { return connection.start(); }, 5000);
            return console.error(err.toString());
        });
    }; //End Start Connection to SignalR Client hub
    ControlSyncView.prototype.sendFeedbackRequestToServer = function () {
        connection.invoke("SendDataPacket", this.state.user, this.state.groupID).catch(function (err) {
            return console.error(err.toString());
        });
    };
    ControlSyncView.prototype.doNothing = function () {
    };
    ControlSyncView.prototype.render = function () {
        return (React.createElement("div", { className: "content" },
            React.createElement(NotificationWrapper_jsx_1.default, { pushText: this.state.notificationText, level: this.state.notificationLevel }),
            React.createElement(react_bootstrap_1.Container, { fluid: true },
                React.createElement(react_bootstrap_1.Row, null,
                    React.createElement(react_bootstrap_1.Modal.Dialog, null,
                        React.createElement(react_bootstrap_1.Modal.Header, null,
                            React.createElement(react_bootstrap_1.Modal.Title, { className: "float-left" }, "Session")),
                        React.createElement(react_bootstrap_1.Row, null,
                            React.createElement("h4", { className: "centered-header" }, this.state.groupID)))),
                React.createElement(react_bootstrap_1.Row, null, this.state.message),
                React.createElement(react_bootstrap_1.Row, null,
                    React.createElement("span", null,
                        "value: ",
                        this.state.value1),
                    React.createElement(ControlWrapperTest_jsx_1.default, { value: this.state.value1, index: 1, callback: this.handleChange })),
                React.createElement(react_bootstrap_1.Row, null,
                    React.createElement("span", null,
                        "value: ",
                        this.state.value2),
                    React.createElement(ControlWrapperTest_jsx_1.default, { value: this.state.value2, index: 2, callback: this.handleChange })),
                React.createElement(react_bootstrap_1.Row, null,
                    React.createElement("span", null,
                        "value: ",
                        this.state.value3),
                    React.createElement(ControlWrapperTest_jsx_1.default, { value: this.state.value3, index: 3, callback: this.handleChange })),
                React.createElement("script", { src: "~/js/signalr/dist/browser/signalr.js" }),
                React.createElement("script", { src: "~/js/chat.js" }))));
    }; //End Render
    return ControlSyncView;
}(React.PureComponent));
exports.ControlSyncView = ControlSyncView;
exports.default = react_redux_1.connect(function (state) { return state.openSpeechData; }, OpenSpeechDataStore.openSpeechDataActionCreators)(ControlSyncView);
//# sourceMappingURL=ControlSync.js.map