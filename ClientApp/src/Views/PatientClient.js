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
var signalR = require("@microsoft/signalr");
var connection = new signalR.HubConnectionBuilder().withUrl("/chathub").build();
var Patient = /** @class */ (function (_super) {
    __extends(Patient, _super);
    function Patient(props) {
        var _this = _super.call(this, props) || this;
        _this.state = {
            messages: ["Message1", "Message2"],
            testString: "test",
            outboundMessage: "message",
            user: "user",
            groupID: "",
            userFeedback: null,
            feedbackRequested: false,
            pinEntry: "",
            notificationText: "",
            notificationLevel: ""
        };
        _this.setNotificationText = _this.setNotificationText.bind(_this);
        _this.setNotificationLevel = _this.setNotificationLevel.bind(_this);
        _this.setFeedback = _this.setFeedback.bind(_this);
        _this.handleOutboutMessageUpdate = _this.handleOutboutMessageUpdate.bind(_this);
        _this.addMessageToMessageList = _this.addMessageToMessageList.bind(_this);
        _this.handleUserUpdate = _this.handleUserUpdate.bind(_this);
        _this.sendMessageToServer = _this.sendMessageToServer.bind(_this);
        _this.handlePinEntryUpdate = _this.handlePinEntryUpdate.bind(_this);
        _this.handleGroupUpdate = _this.handleGroupUpdate.bind(_this);
        _this.joinGroupByID = _this.joinGroupByID.bind(_this);
        return _this;
    }
    Patient.prototype.componentDidMount = function () {
        this.startConnection();
    };
    Patient.prototype.componentDidUpdate = function () {
    };
    Patient.prototype.setFeedback = function (feedback) {
        this.setState({
            userFeedback: feedback,
            notificationLevel: "success",
            notificationText: "Feedback Sent."
        });
        this.sendFeedbackToServer(feedback);
    };
    Patient.prototype.setNotificationText = function (text) {
        this.setState({ notificationText: text });
    };
    Patient.prototype.setNotificationLevel = function (level) {
        this.setState({ notificationLevel: level });
    };
    Patient.prototype.handleOutboutMessageUpdate = function (e) {
        this.setState({ outboundMessage: e.target.value });
    };
    Patient.prototype.handleUserUpdate = function (e) {
        this.setState({ user: e.target.value });
    };
    Patient.prototype.handleGroupUpdate = function () {
        this.setState({ groupID: this.state.pinEntry });
    };
    Patient.prototype.handlePinEntryUpdate = function (e) {
        this.setState({ pinEntry: e.target.value });
    };
    Patient.prototype.addMessageToMessageList = function (incomingMessage) {
        var newList = this.state.messages;
        newList.push(incomingMessage);
        this.setState({ messages: newList });
    };
    Patient.prototype.startConnection = function () {
        var _this = this;
        connection.on("ReceiveMessage", function (user, message) {
            var msg = message.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
            var encodedMsg = user + ": " + msg;
            _this.setState({ testString: encodedMsg });
            _this.addMessageToMessageList(encodedMsg);
        });
        connection.on("FeedbackRequested", function (user) {
            _this.setNotificationLevel("success");
            _this.setNotificationText("Feedback Requested from " + user);
            _this.setState({ feedbackRequested: true });
        });
        connection.start().then(function () {
        }).catch(function (err) {
            return console.error(err.toString());
        });
    };
    Patient.prototype.sendMessageToServer = function () {
        connection.invoke("SendMessage", this.state.user, this.state.outboundMessage).catch(function (err) {
            return console.error(err.toString());
        });
    };
    Patient.prototype.sendFeedbackToServer = function (feedback) {
        connection.invoke("SendFeedback", this.state.user, feedback, this.state.groupID).catch(function (err) {
            return console.error(err.toString());
        });
        this.setState({ feedbackRequested: false });
    };
    Patient.prototype.joinGroupByID = function () {
        this.handleGroupUpdate();
        connection.invoke("AddToGroup", this.state.pinEntry).catch(function (err) {
            return console.error(err.toString());
        });
    };
    Patient.prototype.render = function () {
        function feedbackUI(props, state) {
            if (state.feedbackRequested) {
                return (React.createElement("div", null,
                    React.createElement(react_bootstrap_1.Button, { onClick: function () { return props.setFeedback(true); } }, "Good"),
                    React.createElement(react_bootstrap_1.Button, { onClick: function () { return props.setFeedback(false); } }, "Bad")));
            }
            else {
                return (React.createElement("div", null));
            }
        }
        return (React.createElement("div", { className: "content" },
            React.createElement(NotificationWrapper_jsx_1.default, { pushText: this.state.notificationText, level: this.state.notificationLevel }),
            React.createElement(react_bootstrap_1.Container, { fluid: true },
                React.createElement("div", null,
                    React.createElement(react_bootstrap_1.Modal.Dialog, null,
                        React.createElement(react_bootstrap_1.Modal.Header, null),
                        React.createElement(react_bootstrap_1.InputGroup, { className: "mb-3" },
                            React.createElement(react_bootstrap_1.InputGroup.Prepend, null,
                                React.createElement(react_bootstrap_1.InputGroup.Text, { id: "inputGroup-sizing-default" }, "Pin")),
                            React.createElement(react_bootstrap_1.FormControl, { name: "PinEntry", defaultValue: this.state.groupID, onChange: this.handlePinEntryUpdate, "aria-label": "Pin", "aria-describedby": "inputGroup-sizing-default" }),
                            React.createElement(react_bootstrap_1.Button, { onClick: this.joinGroupByID }, "Join"))),
                    feedbackUI(this, this.state)),
                React.createElement("script", { src: "~/js/signalr/dist/browser/signalr.js" }),
                React.createElement("script", { src: "~/js/chat.js" }))));
    };
    return Patient;
}(React.PureComponent));
function downloadObjectAsJson(exportObj, exportName) {
    var dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(exportObj, null, 4));
    var downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", exportName + ".json");
    document.body.appendChild(downloadAnchorNode); // required for firefox
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
}
exports.default = react_redux_1.connect(function (state) { return state.openSpeechData; }, OpenSpeechDataStore.openSpeechDataActionCreators)(Patient);
//# sourceMappingURL=PatientClient.js.map