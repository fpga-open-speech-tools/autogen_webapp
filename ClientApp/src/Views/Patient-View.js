"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var React = __importStar(require("react"));
var react_redux_1 = require("react-redux");
var OpenSpeechDataStore = __importStar(require("../Store/OpenSpeechToolsData"));
var react_bootstrap_1 = require("react-bootstrap");
var NotificationWrapper_jsx_1 = __importDefault(require("../Components/Notifications/NotificationWrapper.jsx"));
var signalR = __importStar(require("@microsoft/signalr"));
var react_pin_input_1 = __importDefault(require("react-pin-input"));
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
            groupID: "-----",
            pinEntry: "-----",
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
        _this.leaveGroupByID = _this.leaveGroupByID.bind(_this);
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
    PatientView.prototype.handlePinEntryUpdate = function (value) {
        this.setState({ pinEntry: value });
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
        connection.on("Disconnected", function () {
            _this.setState({
                connectedToServer: false,
                notificationLevel: "error",
                notificationText: "Disconnected."
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
            if (msg === "Session Ended") {
                _this.setState({
                    userFeedback: null,
                    userFeedbackNotes: "",
                    feedbackRequested: false
                });
                window.location.reload(false);
            }
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
        connection.invoke("RequestToJoinGroup", this.state.pinEntry).catch(function (err) {
            //Add Handling for SessionJoinFailure
            return console.error(err.toString());
        });
    };
    PatientView.prototype.leaveGroupByID = function () {
        connection.invoke("RemoveFromGroup", this.state.pinEntry).catch(function (err) {
            //Add Handling for SessionJoinFailure
            return console.error(err.toString());
        });
    };
    PatientView.prototype.render = function () {
        var _this = this;
        function feedbackUI(props, state) {
            var disabled = !state.feedbackRequested;
            return (<react_bootstrap_1.Modal.Dialog className="patient-feedback-modal">
            <react_bootstrap_1.Modal.Header><react_bootstrap_1.Modal.Title>Feedback</react_bootstrap_1.Modal.Title></react_bootstrap_1.Modal.Header>
            <div className="patient-feedback-interface">
              <react_bootstrap_1.Button variant="light" disabled={disabled} onClick={function () { return props.setFeedback(1, state.userFeedbackNotes); }} className="btn-simple btn-icon btn-success">
                <i className="fa fa-smile-o large-icon patient-feedback-lg"/>
              </react_bootstrap_1.Button>
              <react_bootstrap_1.Button variant="light" disabled={disabled} onClick={function () { return props.setFeedback(0, state.userFeedbackNotes); }} className="btn-simple btn-icon btn-warning">
                <i className="far fa-meh large-icon patient-feedback-lg"/>
              </react_bootstrap_1.Button>
              <react_bootstrap_1.Button variant="light" disabled={disabled} className="btn-simple btn-icon btn-danger" onClick={function () { return props.setFeedback(-1, state.userFeedbackNotes); }}>
                <i className="far fa-frown large-icon patient-feedback-lg"/>
              </react_bootstrap_1.Button>
            </div>
            <div>
              <react_bootstrap_1.InputGroup>
                <react_bootstrap_1.InputGroup.Prepend>
                  <react_bootstrap_1.InputGroup.Text className="patient-notes">Notes</react_bootstrap_1.InputGroup.Text>
                </react_bootstrap_1.InputGroup.Prepend>
                <react_bootstrap_1.FormControl name="Note-Entry" defaultValue={state.userFeedbackNotes} onChange={props.setFeedbackNotes} as="textarea" className="patient-notes" aria-label="With textarea"/>
              </react_bootstrap_1.InputGroup>
            </div>

          </react_bootstrap_1.Modal.Dialog>);
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
        function getJoinSessionButton(props, state) {
            if (state.connectedToServer && !state.sessionIsActive) {
                return (<react_bootstrap_1.Button onClick={props.joinGroupByID} className="btn-simple btn-icon float-right patient-button">
            <i className="fa fa-sign-in icon-large"/>
          </react_bootstrap_1.Button>);
            }
            else if (state.connectedToServer && state.sessionIsActive) {
                return (<react_bootstrap_1.Button onClick={props.leaveGroupByID} className="btn-simple btn-icon float-right patient-button">
            <i className="fa fa-sign-out icon-large"/>
          </react_bootstrap_1.Button>);
            }
            else {
                return (<react_bootstrap_1.Button className="flex-right btn-simple btn-icon">
            <react_bootstrap_1.Spinner animation="border" variant="primary"/>
          </react_bootstrap_1.Button>);
            }
        }
        return (<div className="content">
        <NotificationWrapper_jsx_1.default pushText={this.state.notificationText} level={this.state.notificationLevel} position="bc"/>
        <react_bootstrap_1.Container fluid>
          <div>
            <react_bootstrap_1.Modal.Dialog className="patient-session">
              <react_bootstrap_1.Modal.Header className={isSessionActive(this.state)}>
                <react_bootstrap_1.Modal.Title>Session</react_bootstrap_1.Modal.Title>
                {getJoinSessionButton(this, this.state)}
              </react_bootstrap_1.Modal.Header>
              <react_pin_input_1.default length={4} initialValue={this.state.groupID} onChange={function (value, index) { _this.handlePinEntryUpdate(value); }} type="numeric" style={{ padding: '10px' }} inputStyle={{ borderColor: 'gray' }} inputFocusStyle={{ borderColor: 'blue' }} onComplete={function (value, index) { }}/>
            </react_bootstrap_1.Modal.Dialog>
            {feedbackUI(this, this.state)}

          </div>
          <script src="~/js/signalr/dist/browser/signalr.js"></script>
          <script src="~/js/chat.js"></script>
        </react_bootstrap_1.Container>
      </div>);
    };
    return PatientView;
}(React.PureComponent));
exports.default = react_redux_1.connect(function (state) { return state.openSpeechData; }, OpenSpeechDataStore.openSpeechDataActionCreators)(PatientView);
