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
var OpenSpeechDataStore = require("../../Store/OpenSpeechToolsData");
var signalR = require("@microsoft/signalr");
var NotificationWrapper_jsx_1 = require("../Notifications/NotificationWrapper.jsx");
var react_bootstrap_1 = require("react-bootstrap");
var connection = new signalR.HubConnectionBuilder().withUrl("/controls").build();
var SandboxView = /** @class */ (function (_super) {
    __extends(SandboxView, _super);
    function SandboxView(props) {
        var _this = _super.call(this, props) || this;
        _this.state = {
            connectedToServer: false,
            shadowObject: {
                value: 3,
                name: "default"
            },
            notificationText: "",
            notificationLevel: ""
        };
        _this.setNotificationText = _this.setNotificationText.bind(_this);
        _this.setNotificationLevel = _this.setNotificationLevel.bind(_this);
        _this.sendObject = _this.sendObject.bind(_this);
        _this.startSession = _this.startSession.bind(_this);
        _this.verifyConnection = _this.verifyConnection.bind(_this);
        return _this;
    } //End Constructor 
    SandboxView.prototype.componentDidMount = function () {
        this.startSession();
    }; // End ComponentDidMount
    SandboxView.prototype.componentDidUpdate = function () {
    }; //End ComponentDidUpdate
    SandboxView.prototype.handleRequestGetRegisterConfig = function (callback) {
        this.props.requestGetRegisterConfig(this.props.deviceAddress, callback);
    };
    SandboxView.prototype.handleRequestSetRegisterConfig = function (registerConfig) {
        this.props.requestSendRegisterConfig(registerConfig, this.props.deviceAddress);
    };
    SandboxView.prototype.setNotificationText = function (text) {
        this.setState({ notificationText: text });
    };
    SandboxView.prototype.setNotificationLevel = function (level) {
        this.setState({ notificationLevel: level });
    };
    SandboxView.prototype.verifyConnection = function () {
        connection.invoke("AfterConnected").catch(function (err) {
            return console.error(err.toString());
        });
    };
    SandboxView.prototype.sendObject = function () {
        var num = Math.floor(Math.random() * 10);
        var shadow = {
            value: num,
            name: "Name"
        };
        this.setState({
            shadowObject: shadow
        });
        connection.invoke("SendControl", shadow).catch(function (err) {
            return console.error(err.toString());
        });
    };
    SandboxView.prototype.startSession = function () {
        var _this = this;
        connection.on("Connected", function (message) {
            var msg = message.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
            _this.setState({
                connectedToServer: true,
                notificationLevel: "success",
                notificationText: msg
            });
        });
        connection.on("ReceiveControl", function (obj) {
            _this.setState({
                shadowObject: obj
            });
        });
        connection.start()
            .then(function (val) {
        }).then(function (res) { return _this.verifyConnection(); })
            .catch(function (err) {
            setTimeout(function () { return connection.start(); }, 5000);
            return console.error(err.toString());
        });
    }; //End Start Connection to SignalR Client hub
    SandboxView.prototype.render = function () {
        return (React.createElement("div", { className: "content" },
            React.createElement(NotificationWrapper_jsx_1.default, { pushText: this.state.notificationText, level: this.state.notificationLevel }),
            React.createElement(react_bootstrap_1.Container, { fluid: true },
                React.createElement(react_bootstrap_1.Row, null,
                    React.createElement(react_bootstrap_1.Modal.Dialog, null,
                        React.createElement(react_bootstrap_1.Modal.Header, null,
                            React.createElement(react_bootstrap_1.Modal.Title, { className: "float-left" }, "Session")))),
                React.createElement(react_bootstrap_1.Row, null,
                    React.createElement(react_bootstrap_1.Button, { onClick: this.sendObject })),
                React.createElement(react_bootstrap_1.Row, null, this.state.shadowObject.value),
                React.createElement("script", { src: "~/js/signalr/dist/browser/signalr.js" }),
                React.createElement("script", { src: "~/js/chat.js" }))));
    };
    return SandboxView;
}(React.PureComponent));
exports.SandboxView = SandboxView;
exports.default = react_redux_1.connect(function (state) { return state.openSpeechData; }, OpenSpeechDataStore.openSpeechDataActionCreators)(SandboxView);
//# sourceMappingURL=SandboxController.js.map