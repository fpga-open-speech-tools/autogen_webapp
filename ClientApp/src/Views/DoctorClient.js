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
var EffectPageDiv_jsx_1 = require("../Components/Autogen/Containers/EffectPageDiv.jsx");
var NotificationWrapper_jsx_1 = require("../Components/Notifications/NotificationWrapper.jsx");
var FileUploaderPresentationalComponent_1 = require("../Components/FileManagement/FileUploaderPresentationalComponent");
var signalR = require("@microsoft/signalr");
var connection = new signalR.HubConnectionBuilder().withUrl("/doctor-patient").build();
var Doctor = /** @class */ (function (_super) {
    __extends(Doctor, _super);
    function Doctor(props) {
        var _this = _super.call(this, props) || this;
        _this.fileUploaderInput = null;
        _this.dragEventCounter = 0;
        _this.dragenterListener = function (event) {
            _this.overrideEventDefaults(event);
            _this.dragEventCounter++;
            if (event.dataTransfer.items && event.dataTransfer.items[0]) {
                _this.setState({ dragging: true });
            }
            else if (event.dataTransfer.types &&
                event.dataTransfer.types[0] === "Files") {
                // This block handles support for IE - if you're not worried about
                // that, you can omit this
                _this.setState({ dragging: true });
            }
        };
        _this.dragleaveListener = function (event) {
            _this.overrideEventDefaults(event);
            _this.dragEventCounter--;
            if (_this.dragEventCounter === 0) {
                _this.setState({ dragging: false });
            }
        };
        _this.dropListener = function (event) {
            _this.overrideEventDefaults(event);
            _this.dragEventCounter = 0;
            _this.setState({ dragging: false });
            if (event.dataTransfer.files && event.dataTransfer.files[0]) {
                _this.setState({ file: event.dataTransfer.files[0] });
            }
        };
        _this.overrideEventDefaults = function (event) {
            event.preventDefault();
            event.stopPropagation();
        };
        _this.onSelectFileClick = function () {
            _this.fileUploaderInput && _this.fileUploaderInput.click();
        };
        _this.onFileChanged = function (event) {
            if (event.target.files && event.target.files[0]) {
                _this.setState({ file: event.target.files[0], newFile: true });
                _this.handleNewPatientConfigFile(event.target.files[0]);
            }
        };
        _this.handleDownloadDemosJSON = function () {
            _this.handleRequestGetRegisterConfig(_this.downloadPatientConfig);
        };
        _this.state = {
            ipFragment1: '192',
            ipFragment2: '168',
            ipFragment3: '0',
            ipFragment4: '120',
            port: '3355',
            uiConfigName: "",
            dragging: false,
            file: null,
            newFile: false,
            connectedToServer: false,
            sessionStarted: false,
            sessionPatientConnected: false,
            groupID: "",
            user: "Doctor",
            message: "",
            patientFirstName: "",
            patientLastName: "",
            patientFeedback: -2,
            patientFeedbackNotes: "",
            doctorNotes: "",
            notificationText: "",
            notificationLevel: ""
        };
        _this.handleIP1Change = _this.handleIP1Change.bind(_this);
        _this.handleIP2Change = _this.handleIP2Change.bind(_this);
        _this.handleIP3Change = _this.handleIP3Change.bind(_this);
        _this.handleIP4Change = _this.handleIP4Change.bind(_this);
        _this.handlePortChange = _this.handlePortChange.bind(_this);
        _this.handleNotesChange = _this.handleNotesChange.bind(_this);
        _this.handleRequestUI = _this.handleRequestUI.bind(_this);
        _this.handleInputCommand = _this.handleInputCommand.bind(_this);
        _this.setNotificationText = _this.setNotificationText.bind(_this);
        _this.setNotificationLevel = _this.setNotificationLevel.bind(_this);
        _this.startSession = _this.startSession.bind(_this);
        _this.verifyConnection = _this.verifyConnection.bind(_this);
        _this.startGroup = _this.startGroup.bind(_this);
        _this.stopGroup = _this.stopGroup.bind(_this);
        _this.sendFeedbackRequestToServer = _this.sendFeedbackRequestToServer.bind(_this);
        _this.handleRequestGetRegisterConfig = _this.handleRequestGetRegisterConfig.bind(_this);
        _this.handleRequestSetRegisterConfig = _this.handleRequestSetRegisterConfig.bind(_this);
        _this.handlePatientFirstNameChange = _this.handlePatientFirstNameChange.bind(_this);
        _this.handlePatientLastNameChange = _this.handlePatientLastNameChange.bind(_this);
        _this.handleDownloadDemosJSON = _this.handleDownloadDemosJSON.bind(_this);
        _this.downloadPatientConfig = _this.downloadPatientConfig.bind(_this);
        _this.handleNewPatientConfigFile = _this.handleNewPatientConfigFile.bind(_this);
        _this.doNothing = _this.doNothing.bind(_this);
        return _this;
    } //End Constructor 
    Doctor.prototype.componentDidMount = function () {
        var _this = this;
        this.handleRequestUI();
        this.startSession();
        window.addEventListener("dragover", function (event) {
            _this.overrideEventDefaults(event);
        });
        window.addEventListener("drop", function (event) {
            _this.overrideEventDefaults(event);
        });
    }; // End ComponentDidMount
    Doctor.prototype.componentDidUpdate = function () {
        if (this.props.uiConfig) {
            if (this.props.uiConfig.name === 'Demo Upload Failed' && this.props.uiConfig.name != this.state.uiConfigName) {
                this.setNotificationLevel('error');
                this.setNotificationText('Demo Upload Failed');
                this.setState({ uiConfigName: this.props.uiConfig.name });
            }
            else if (this.props.uiConfig.name === "ERROR" && this.props.uiConfig.name != this.state.uiConfigName) {
                this.setNotificationLevel('error');
                this.setNotificationText('Control Generation Failed');
                this.setState({ uiConfigName: this.props.uiConfig.name });
            }
            else if (this.props.uiConfig.name != this.state.uiConfigName) {
                this.setNotificationLevel('success');
                this.setNotificationText('New Controls Generated: ' + this.props.uiConfig.name);
                this.setState({ uiConfigName: this.props.uiConfig.name });
            }
        }
    }; //End ComponentDidUpdate
    Doctor.prototype.componentWillMount = function () {
        window.removeEventListener("dragover", this.overrideEventDefaults);
        window.removeEventListener("drop", this.overrideEventDefaults);
    };
    Doctor.prototype.handleIP1Change = function (e) {
        this.setState({ ipFragment1: e.target.value });
    };
    Doctor.prototype.handleIP2Change = function (e) {
        this.setState({ ipFragment2: e.target.value });
    };
    Doctor.prototype.handleIP3Change = function (e) {
        this.setState({ ipFragment3: e.target.value });
    };
    Doctor.prototype.handleIP4Change = function (e) {
        this.setState({ ipFragment4: e.target.value });
    };
    Doctor.prototype.handlePortChange = function (e) {
        this.setState({ port: e.target.value });
    };
    Doctor.prototype.handleNotesChange = function (e) {
        if (!this.state.newFile) {
            this.setState({ doctorNotes: e.target.value });
        }
    };
    Doctor.prototype.handlePatientFirstNameChange = function (e) {
        this.setState({ patientFirstName: e.target.value });
    };
    Doctor.prototype.handlePatientLastNameChange = function (e) {
        this.setState({ patientLastName: e.target.value });
    };
    Doctor.prototype.handleRequestGetRegisterConfig = function (callback) {
        this.props.requestGetRegisterConfig(this.state.ipFragment1, this.state.ipFragment2, this.state.ipFragment3, this.state.ipFragment4, this.state.port, callback);
    };
    Doctor.prototype.handleRequestSetRegisterConfig = function (registerConfig) {
        this.props.requestSendRegisterConfig(registerConfig, this.state.ipFragment1, this.state.ipFragment2, this.state.ipFragment3, this.state.ipFragment4, this.state.port);
    };
    Doctor.prototype.handleNewPatientConfigFile = function (configFile) {
        var _this = this;
        if (configFile) {
            var text;
            text = "";
            var reader = new FileReader();
            reader.readAsBinaryString(configFile);
            reader.onloadend = (function () {
                text = reader.result;
                var obj = JSON.parse(text);
                var config = {
                    patientFeedback: obj.patientFeedback,
                    patientFeedbackNotes: obj.patientFeedbackNotes,
                    doctorNotes: obj.doctorNotes,
                    patientFirstName: obj.patientFirstName,
                    patientLastName: obj.patientLastName,
                    registerConfiguration: obj.registerConfiguration,
                };
                _this.setState({
                    patientFeedback: config.patientFeedback,
                    patientFeedbackNotes: config.patientFeedbackNotes,
                    doctorNotes: config.doctorNotes,
                    patientFirstName: config.patientFirstName,
                    patientLastName: config.patientLastName,
                    newFile: false
                });
                _this.handleRequestSetRegisterConfig(config.registerConfiguration);
            });
        }
    };
    Doctor.prototype.handleRequestUI = function () {
        this.props.requestOpenSpeechUI(this.state.ipFragment1, this.state.ipFragment2, this.state.ipFragment3, this.state.ipFragment4, this.state.port);
    };
    Doctor.prototype.downloadPatientConfig = function () {
        var config = {
            patientFeedback: this.state.patientFeedback,
            patientFeedbackNotes: this.state.patientFeedbackNotes,
            doctorNotes: this.state.doctorNotes,
            patientFirstName: this.state.patientFirstName,
            patientLastName: this.state.patientLastName,
            registerConfiguration: this.props.currentRegisterConfig,
        };
        downloadObjectAsJson(config, "patient_config");
    };
    Doctor.prototype.handleInputCommand = function (module, link, value) {
        if (!this.props.isLoading) {
            this.props.requestSendCommand(link, value, module, this.state.ipFragment1, this.state.ipFragment2, this.state.ipFragment3, this.state.ipFragment4, this.state.port);
        }
    };
    Doctor.prototype.setNotificationText = function (text) {
        this.setState({ notificationText: text });
    };
    Doctor.prototype.setNotificationLevel = function (level) {
        this.setState({ notificationLevel: level });
    };
    Doctor.prototype.verifyConnection = function () {
        connection.invoke("AfterConnected").catch(function (err) {
            return console.error(err.toString());
        });
    };
    Doctor.prototype.startSession = function () {
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
            _this.setState({ message: encodedMsg });
        });
        connection.on("GroupMessage", function (message) {
            var msg = message.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
            var encodedMsg = msg;
            _this.setState({
                notificationLevel: "info",
                notificationText: msg
            });
        });
        connection.on("AddedToGroup", function (message) {
            _this.setState({
                sessionStarted: true,
                notificationLevel: "info",
                notificationText: message
            });
        });
        connection.on("LeftGroup", function (message) {
            _this.setState({
                sessionStarted: false,
                notificationLevel: "info",
                notificationText: message
            });
        });
        connection.on("UserDisconnected", function (user) {
            var msg = "User " + user + " has disconnected";
            _this.setState({
                notificationLevel: "warning",
                notificationText: msg
            });
        });
        connection.on("ReceiveFeedback", function (user, feedback, notes) {
            _this.setState({ message: feedback });
            var feedbackLevel = "";
            var feedbackText = "";
            if (feedback === 1) {
                feedbackLevel = "success";
                feedbackText = "Good";
            }
            else if (feedback === -1) {
                feedbackLevel = "error";
                feedbackText = "Bad";
            }
            else {
                feedbackLevel = "warning";
                feedbackText = "Neutral";
            }
            var d = new Date();
            var n = d.toLocaleTimeString();
            feedbackText = user + " Feedback: " + feedbackText + " at " + n;
            _this.setState({
                notificationLevel: feedbackLevel,
                notificationText: feedbackText,
                patientFeedback: feedback,
                patientFeedbackNotes: notes
            });
        });
        connection.on("GroupEnded", function (message) {
            var msg = message.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
            _this.setState({
                sessionStarted: false,
                sessionPatientConnected: false,
                groupID: "Inactive"
            });
        });
        connection.start()
            .then(function (val) {
        }).then(function (res) { return _this.verifyConnection(); })
            .catch(function (err) {
            return console.error(err.toString());
        });
    }; //End Start Connection to SignalR Client hub
    Doctor.prototype.startGroup = function () {
        var nums = "0123456789";
        var result = "";
        for (var i = 4; i > 0; --i) {
            result += nums[Math.round(Math.random() * (nums.length - 1))];
        }
        this.setState({ groupID: result });
        connection.invoke("AddToGroup", result).catch(function (err) {
            return console.error(err.toString());
        });
    };
    Doctor.prototype.stopGroup = function () {
        connection.invoke("EndGroup", this.state.groupID).catch(function (err) {
            return console.error(err.toString());
        });
        this.setState({ sessionStarted: false, groupID: "" });
    };
    Doctor.prototype.sendFeedbackRequestToServer = function () {
        connection.invoke("RequestFeedback", this.state.user, this.state.groupID).catch(function (err) {
            return console.error(err.toString());
        });
    };
    Doctor.prototype.doNothing = function () {
    };
    Doctor.prototype.render = function () {
        var _this = this;
        function getAutogen(board, props) {
            if (props.uiConfig) {
                if (props.uiConfig.pages) {
                    var effectName = props.uiConfig.name ? props.uiConfig.name : "";
                    effectName = (effectName === "ERROR") ? "" : effectName;
                    return (React.createElement("div", { className: "autogen autogen-effectContainer" },
                        React.createElement(react_bootstrap_1.Jumbotron, { className: "autogen-effect-name" }, effectName),
                        React.createElement(react_bootstrap_1.Card, null, props.uiConfig.pages.map(function (page) {
                            return React.createElement(React.Fragment, { key: page.name },
                                React.createElement("div", { className: page.name },
                                    React.createElement(react_bootstrap_1.Jumbotron, { className: "autogen-page-name" }, page.name),
                                    React.createElement(EffectPageDiv_jsx_1.EffectPageDiv, { callback: board.handleInputCommand, page: page })));
                        }))));
                }
                else if (props.uiConfig.name) {
                    var effectName = props.uiConfig.name ? props.uiConfig.name : "";
                    effectName = (effectName === "ERROR") ? "" : effectName;
                    return (React.createElement("div", { className: "autogen autogen-effectContainer autogen-error" }));
                }
            }
        } // End Get Autogen
        function getUploadIcon() {
            return (React.createElement(react_bootstrap_1.Button, { variant: "primary", className: "float-right btn-simple btn-icon" },
                React.createElement("i", { className: "fa fa-upload large-icon" })));
        }
        function disableIfNotChosen(choice, itemNumber) {
            if (choice === itemNumber) {
                return false;
            }
            else {
                return true;
            }
        }
        function feedbackUI(props, state) {
            return (React.createElement(react_bootstrap_1.Modal.Dialog, { className: "" },
                React.createElement(react_bootstrap_1.Modal.Header, null,
                    React.createElement(react_bootstrap_1.Modal.Title, null, "Patient Feedback"),
                    React.createElement(react_bootstrap_1.Button, { onClick: props.sendFeedbackRequestToServer, className: "btn-simple btn-icon" },
                        React.createElement("i", { className: "fa fa-pencil-square-o large-icon" }))),
                React.createElement(react_bootstrap_1.Form, { className: "display-em" },
                    React.createElement(react_bootstrap_1.FormControl, { className: "patient-first-name", placeholder: "First name", value: state.patientFirstName, onChange: props.handlePatientFirstNameChange }),
                    React.createElement(react_bootstrap_1.FormControl, { className: "patient-last-name", placeholder: "Last name", value: state.patientLastName, onChange: props.handlePatientLastNameChange })),
                React.createElement("div", { className: "patient-feedback-interface" },
                    React.createElement(react_bootstrap_1.Button, { variant: "light", disabled: disableIfNotChosen(state.patientFeedback, 1), className: "btn-simple btn-icon btn-success" },
                        React.createElement("i", { className: "fa fa-smile-o large-icon" })),
                    React.createElement(react_bootstrap_1.Button, { variant: "light", disabled: disableIfNotChosen(state.patientFeedback, 0), className: "btn-simple btn-icon btn-warning" },
                        React.createElement("i", { className: "far fa-meh large-icon" })),
                    React.createElement(react_bootstrap_1.Button, { variant: "light", disabled: disableIfNotChosen(state.patientFeedback, -1), className: "btn-simple btn-icon btn-danger" },
                        React.createElement("i", { className: "far fa-frown large-icon" }))),
                React.createElement("div", null,
                    React.createElement(react_bootstrap_1.InputGroup, null,
                        React.createElement(react_bootstrap_1.InputGroup.Prepend, null,
                            React.createElement(react_bootstrap_1.InputGroup.Text, null, "Patient Notes")),
                        React.createElement(react_bootstrap_1.FormControl, { value: state.patientFeedbackNotes, disabled: true, as: "textarea", "aria-label": "With textarea" })),
                    React.createElement(react_bootstrap_1.InputGroup, null,
                        React.createElement(react_bootstrap_1.InputGroup.Prepend, null,
                            React.createElement(react_bootstrap_1.InputGroup.Text, null, "Doctor Notes")),
                        React.createElement(react_bootstrap_1.FormControl, { value: state.doctorNotes, onChange: props.handleNotesChange, as: "textarea", "aria-label": "With textarea" })))));
        }
        function isSessionActive(state) {
            var sessionClassName = "doctor-session ";
            if (state.sessionStarted) {
                sessionClassName += ("session-active");
            }
            else {
                sessionClassName += ("session-inactive");
            }
            return sessionClassName;
        }
        function getSessionButton(props, state) {
            if (state.sessionStarted && state.connectedToServer) {
                return (React.createElement(react_bootstrap_1.Button, { className: "flex-right btn-simple btn-icon", onClick: props.stopGroup },
                    React.createElement("i", { className: "fa fa-stop large-icon" })));
            }
            else if (!state.sessionStarted && state.connectedToServer) {
                return (React.createElement(react_bootstrap_1.Button, { className: "flex-right btn-simple btn-icon", onClick: props.startGroup },
                    React.createElement("i", { className: "fa fa-play large-icon" })));
            }
            else {
                return (React.createElement(react_bootstrap_1.Button, { className: "flex-right btn-simple btn-icon" },
                    React.createElement(react_bootstrap_1.Spinner, { animation: "border", variant: "primary" })));
            }
        }
        return (React.createElement("div", { className: "content" },
            React.createElement(NotificationWrapper_jsx_1.default, { pushText: this.state.notificationText, level: this.state.notificationLevel }),
            React.createElement(react_bootstrap_1.Container, { fluid: true },
                React.createElement(react_bootstrap_1.Row, null,
                    React.createElement(react_bootstrap_1.Modal.Dialog, null,
                        React.createElement(react_bootstrap_1.Modal.Header, { className: isSessionActive(this.state) },
                            React.createElement(react_bootstrap_1.Modal.Title, { className: "float-left" }, "Session"),
                            getSessionButton(this, this.state)),
                        React.createElement(react_bootstrap_1.Row, null,
                            React.createElement("h4", { className: "centered-header" }, this.state.groupID)))),
                React.createElement(react_bootstrap_1.Row, null, feedbackUI(this, this.state)),
                React.createElement(react_bootstrap_1.Row, null,
                    React.createElement(react_bootstrap_1.Modal.Dialog, { id: "controls" },
                        React.createElement(react_bootstrap_1.Modal.Header, null,
                            React.createElement(react_bootstrap_1.Modal.Title, { className: "float-left" }, "Controls"),
                            React.createElement("div", { className: "flex-right" },
                                React.createElement(react_bootstrap_1.Button, { variant: "primary", className: "btn-simple btn-icon", onClick: this.handleRequestUI },
                                    React.createElement("i", { className: "fa fa-refresh large-icon" })),
                                React.createElement(react_bootstrap_1.Button, { variant: "primary", className: "float-right btn-simple btn-icon", onClick: this.handleDownloadDemosJSON },
                                    React.createElement("i", { className: "fa fa-save large-icon" })),
                                React.createElement(FileUploaderPresentationalComponent_1.FileUploaderPresentationalComponent, { dragging: this.state.dragging, file: this.state.file, onSelectFileClick: this.onSelectFileClick, onDrag: this.overrideEventDefaults, onDragStart: this.overrideEventDefaults, onDragEnd: this.overrideEventDefaults, onDragOver: this.overrideEventDefaults, onDragEnter: this.dragenterListener, onDragLeave: this.dragleaveListener, onDrop: this.dropListener },
                                    React.createElement("input", { ref: function (el) { return (_this.fileUploaderInput = el); }, type: "file", className: "file-uploader-hidden file-uploader__input", onChange: this.onFileChanged })))),
                        getAutogen(this, this.props))),
                React.createElement("script", { src: "~/js/signalr/dist/browser/signalr.js" }),
                React.createElement("script", { src: "~/js/chat.js" }))));
    }; //End Render
    Doctor.counter = 0;
    return Doctor;
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
exports.default = react_redux_1.connect(function (state) { return state.openSpeechData; }, OpenSpeechDataStore.openSpeechDataActionCreators)(Doctor);
//# sourceMappingURL=DoctorClient.js.map