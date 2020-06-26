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
var connection = new signalR.HubConnectionBuilder().withUrl("/doctor-patient").build();
var PatientView = /** @class */ (function (_super) {
    __extends(PatientView, _super);
    function PatientView(props) {
        var _this = _super.call(this, props) || this;
        _this.state = {
            messages: ["Message1", "Message2"],
            testString: "test",
            outboundMessage: "message",
            user: "user",
            groupID: "",
            pinEntry: "",
            sessionIsActive: false,
            userFeedback: null,
            userFeedbackNotes: "",
            feedbackRequested: false,
            connectedToServer: false,
            notificationText: "",
            notificationLevel: ""
        };
        _this.setNotificationText = _this.setNotificationText.bind(_this);
        _this.setNotificationLevel = _this.setNotificationLevel.bind(_this);
        _this.setFeedback = _this.setFeedback.bind(_this);
        _this.setFeedbackNotes = _this.setFeedbackNotes.bind(_this);
        _this.handleOutboutMessageUpdate = _this.handleOutboutMessageUpdate.bind(_this);
        _this.addMessageToMessageList = _this.addMessageToMessageList.bind(_this);
        _this.handleUserUpdate = _this.handleUserUpdate.bind(_this);
        _this.sendMessageToServer = _this.sendMessageToServer.bind(_this);
        _this.handlePinEntryUpdate = _this.handlePinEntryUpdate.bind(_this);
        _this.handleGroupUpdate = _this.handleGroupUpdate.bind(_this);
        _this.joinGroupByID = _this.joinGroupByID.bind(_this);
        return _this;
    }
    PatientView.prototype.componentDidMount = function () {
        this.startConnection();
    };
    PatientView.prototype.componentDidUpdate = function () {
    };
    PatientView.prototype.setFeedback = function (feedback, feedbackNotes) {
        this.setState({
            userFeedback: feedback,
            notificationLevel: "success",
            notificationText: "Feedback Sent."
        });
        this.sendFeedbackToServer(feedback, feedbackNotes);
    };
    PatientView.prototype.setFeedbackNotes = function (e) {
        this.setState({
            userFeedbackNotes: e.target.value
        });
    };
    PatientView.prototype.setNotificationText = function (text) {
        this.setState({ notificationText: text });
    };
    PatientView.prototype.setNotificationLevel = function (level) {
        this.setState({ notificationLevel: level });
    };
    PatientView.prototype.handleOutboutMessageUpdate = function (e) {
        this.setState({ outboundMessage: e.target.value });
    };
    PatientView.prototype.handleUserUpdate = function (e) {
        this.setState({ user: e.target.value });
    };
    PatientView.prototype.handleGroupUpdate = function () {
        this.setState({ groupID: this.state.pinEntry });
    };
    PatientView.prototype.handlePinEntryUpdate = function (e) {
        this.setState({ pinEntry: e.target.value });
    };
    PatientView.prototype.addMessageToMessageList = function (incomingMessage) {
        var newList = this.state.messages;
        newList.push(incomingMessage);
        this.setState({ messages: newList });
    };
    PatientView.prototype.startConnection = function () {
        var _this = this;
        connection.on("Connected", function (message) {
            var msg = message.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
            _this.setState({
                connectedToServer: true,
                notificationLevel: "success",
                notificationText: msg
            });
        });
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
        connection.start()
            .then(function (val) {
        }).then(function (res) { return _this.verifyConnection(); })
            .catch(function (err) {
            return console.error(err.toString());
        });
        connection.on("AddedToGroup", function (message) {
            _this.setState({
                sessionIsActive: true,
                notificationLevel: "info",
                notificationText: message
            });
        });
        connection.on("LeftGroup", function (message) {
            _this.setState({
                sessionIsActive: false,
                notificationLevel: "info",
                notificationText: message
            });
        });
        connection.on("GroupMessage", function (message) {
            var msg = message.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
            var encodedMsg = msg;
            _this.setState({
                notificationLevel: "info",
                notificationText: msg
            });
        });
        connection.on("GroupEnded", function (message) {
            var msg = message.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
            _this.setState({
                sessionIsActive: false,
                groupID: "Inactive"
            });
        });
    }; //End Start Connection
    PatientView.prototype.verifyConnection = function () {
        connection.invoke("AfterConnected").catch(function (err) {
            return console.error(err.toString());
        });
        return true;
    };
    PatientView.prototype.sendMessageToServer = function () {
        connection.invoke("SendMessage", this.state.user, this.state.outboundMessage).catch(function (err) {
            return console.error(err.toString());
        });
    };
    PatientView.prototype.sendFeedbackToServer = function (feedback, feedbackNotes) {
        connection.invoke("SendFeedback", this.state.user, feedback, feedbackNotes, this.state.groupID).catch(function (err) {
            //Add Handling for FeedbackSendFailure
            return console.error(err.toString());
        });
        this.setState({ feedbackRequested: false });
    };
    PatientView.prototype.joinGroupByID = function () {
        this.handleGroupUpdate();
        connection.invoke("AddToGroup", this.state.pinEntry).catch(function (err) {
            //Add Handling for SessionJoinFailure
            return console.error(err.toString());
        });
    };
    PatientView.prototype.render = function () {
        function feedbackUI(props, state) {
            var disabled = !state.feedbackRequested;
            return (React.createElement(react_bootstrap_1.Modal.Dialog, { className: "patient-feedback-modal" },
                React.createElement(react_bootstrap_1.Modal.Header, null,
                    React.createElement(react_bootstrap_1.Modal.Title, null, "Feedback")),
                React.createElement("div", { className: "patient-feedback-interface" },
                    React.createElement(react_bootstrap_1.Button, { variant: "light", disabled: disabled, onClick: function () { return props.setFeedback(1, state.userFeedbackNotes); }, className: "btn-simple btn-icon btn-success" },
                        React.createElement("i", { className: "fa fa-smile-o large-icon" })),
                    React.createElement(react_bootstrap_1.Button, { variant: "light", disabled: disabled, onClick: function () { return props.setFeedback(0, state.userFeedbackNotes); }, className: "btn-simple btn-icon btn-warning" },
                        React.createElement("i", { className: "far fa-meh large-icon" })),
                    React.createElement(react_bootstrap_1.Button, { variant: "light", disabled: disabled, className: "btn-simple btn-icon btn-danger", onClick: function () { return props.setFeedback(-1, state.userFeedbackNotes); } },
                        React.createElement("i", { className: "far fa-frown large-icon" }))),
                React.createElement("div", null,
                    React.createElement(react_bootstrap_1.InputGroup, null,
                        React.createElement(react_bootstrap_1.InputGroup.Prepend, null,
                            React.createElement(react_bootstrap_1.InputGroup.Text, null, "Notes")),
                        React.createElement(react_bootstrap_1.FormControl, { name: "Note-Entry", defaultValue: state.userFeedbackNotes, onChange: props.setFeedbackNotes, as: "textarea", "aria-label": "With textarea" })))));
        }
        function isSessionActive(state) {
            var sessionClassName = "";
            if (state.sessionIsActive) {
                sessionClassName += ("session-active");
            }
            else {
                sessionClassName += ("session-inactive");
            }
            return sessionClassName;
        }
        return (React.createElement("div", { className: "content" },
            React.createElement(NotificationWrapper_jsx_1.default, { pushText: this.state.notificationText, level: this.state.notificationLevel }),
            React.createElement(react_bootstrap_1.Container, { fluid: true },
                React.createElement("div", null,
                    React.createElement(react_bootstrap_1.Modal.Dialog, { className: "patient-session" },
                        React.createElement(react_bootstrap_1.Modal.Header, { className: isSessionActive(this.state) },
                            React.createElement(react_bootstrap_1.Modal.Title, null, "Session")),
                        React.createElement(react_bootstrap_1.InputGroup, { className: "mb-3" },
                            React.createElement(react_bootstrap_1.InputGroup.Prepend, null,
                                React.createElement(react_bootstrap_1.InputGroup.Text, { id: "inputGroup-sizing-default" }, "Pin")),
                            React.createElement(react_bootstrap_1.FormControl, { name: "PinEntry", defaultValue: this.state.groupID, onChange: this.handlePinEntryUpdate, "aria-label": "Pin", "aria-describedby": "inputGroup-sizing-default" }),
                            React.createElement(react_bootstrap_1.Button, { onClick: this.joinGroupByID, className: "btn-simple btn-icon" },
                                React.createElement("i", { className: "fa fa-sign-in icon-large" })))),
                    feedbackUI(this, this.state)),
                React.createElement("script", { src: "~/js/signalr/dist/browser/signalr.js" }),
                React.createElement("script", { src: "~/js/chat.js" }))));
    };
    return PatientView;
}(React.PureComponent));
exports.default = react_redux_1.connect(function (state) { return state.openSpeechData; }, OpenSpeechDataStore.openSpeechDataActionCreators)(PatientView);
//# sourceMappingURL=Patient-View.js.map