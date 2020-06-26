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
var react_bootstrap_1 = require("react-bootstrap");
var OpenSpeechDemoCard_jsx_1 = require("../../Components/OpenSpeechDemos/OpenSpeechDemoCard.jsx");
var EffectPageDiv_jsx_1 = require("../../Components/Autogen/Containers/EffectPageDiv.jsx");
var NotificationWrapper_jsx_1 = require("../../Components/Notifications/NotificationWrapper.jsx");
var AutoGenStates = /** @class */ (function (_super) {
    __extends(AutoGenStates, _super);
    function AutoGenStates(props) {
        var _this = _super.call(this, props) || this;
        _this.state = {
            deviceAddress: {
                ipFragment1: '192',
                ipFragment2: '168',
                ipFragment3: '0',
                ipFragment4: '120',
                port: '3355'
            },
            downloadStatus: {
                lastDownloadProgressRequestTime: 0,
                lastDownloadProgress: 0,
            },
            notification: {
                text: "",
                level: ""
            },
            uiConfig: {
                name: "",
                projectID: "Example",
            }
        };
        _this.handleDeviceAddressChange = _this.handleDeviceAddressChange.bind(_this);
        _this.handleChangeIP1 = _this.handleChangeIP1.bind(_this);
        _this.handleChangeIP2 = _this.handleChangeIP2.bind(_this);
        _this.handleChangeIP3 = _this.handleChangeIP3.bind(_this);
        _this.handleChangeIP4 = _this.handleChangeIP4.bind(_this);
        _this.handleChangePort = _this.handleChangePort.bind(_this);
        _this.handleRequestUI = _this.handleRequestUI.bind(_this);
        _this.handleInputCommand = _this.handleInputCommand.bind(_this);
        _this.handlelastDownloadProgressRequestTimeChange = _this.handlelastDownloadProgressRequestTimeChange.bind(_this);
        _this.handleDownloadDemo = _this.handleDownloadDemo.bind(_this);
        _this.handleRequestDownloadProgress = _this.handleRequestDownloadProgress.bind(_this);
        _this.setNotification = _this.setNotification.bind(_this);
        return _this;
    }
    AutoGenStates.prototype.componentDidMount = function () {
        this.props.requestOpenSpeechS3Demos();
        this.handleRequestUI();
        if (this.props.downloadProgress) {
            if (this.state.downloadStatus.lastDownloadProgress !== this.props.downloadProgress.progress) {
                this.setState({
                    downloadStatus: {
                        lastDownloadProgress: this.props.downloadProgress.progress,
                        lastDownloadProgressRequestTime: this.state.downloadStatus.lastDownloadProgressRequestTime
                    }
                });
                this.forceUpdate();
            }
        }
    };
    AutoGenStates.prototype.componentDidUpdate = function () {
        if (this.props.uiConfig) {
            if (this.props.uiConfig.name === 'Demo Upload Failed' && this.props.uiConfig.name != this.state.uiConfig.name) {
                this.setNotification('error', 'Demo Upload Failed');
                this.setState({
                    uiConfig: {
                        name: this.props.uiConfig.name,
                        projectID: this.state.uiConfig.projectID
                    }
                });
            }
            else if (this.props.uiConfig.name === "ERROR" && this.props.uiConfig.name != this.state.uiConfig.name) {
                this.setNotification('error', 'Control Generation Failed');
                this.setState({
                    uiConfig: {
                        name: this.props.uiConfig.name,
                        projectID: this.state.uiConfig.projectID
                    }
                });
            }
            else if (this.props.uiConfig.name != this.state.uiConfig.name) {
                this.setNotification('success', 'New Controls Generated');
                this.setState({
                    uiConfig: {
                        name: this.props.uiConfig.name,
                        projectID: this.state.uiConfig.projectID
                    }
                });
            }
        }
    };
    AutoGenStates.prototype.handlePollDownloadProgress = function () {
        if (this.props.isDeviceDownloading) {
            var date = new Date();
            var currentDateInMS = date.getTime();
            var requestRateInMS = 100;
            //if the current datetime in milliseconds is greater the last request log plus the request rate,
            //Then set the new request datetime in milliseconds, and request the download progress.
            if (currentDateInMS > (this.state.downloadStatus.lastDownloadProgressRequestTime + requestRateInMS)) {
                this.handlelastDownloadProgressRequestTimeChange(currentDateInMS);
                this.handleRequestDownloadProgress();
            }
        }
    };
    AutoGenStates.prototype.handleChangeIP1 = function (e) {
        this.handleDeviceAddressChange(e, 'ip1');
    };
    AutoGenStates.prototype.handleChangeIP2 = function (e) {
        this.handleDeviceAddressChange(e, 'ip2');
    };
    AutoGenStates.prototype.handleChangeIP3 = function (e) {
        this.handleDeviceAddressChange(e, 'ip3');
    };
    AutoGenStates.prototype.handleChangeIP4 = function (e) {
        this.handleDeviceAddressChange(e, 'ip4');
    };
    AutoGenStates.prototype.handleChangePort = function (e) {
        this.handleDeviceAddressChange(e, 'port');
    };
    AutoGenStates.prototype.handleDeviceAddressChange = function (e, key) {
        switch (key) {
            case 'ip1': {
                this.setState({
                    deviceAddress: {
                        ipFragment1: e.target.value,
                        ipFragment2: this.state.deviceAddress.ipFragment2,
                        ipFragment3: this.state.deviceAddress.ipFragment3,
                        ipFragment4: this.state.deviceAddress.ipFragment4,
                        port: this.state.deviceAddress.port
                    }
                });
                break;
            }
            case 'ip2': {
                this.setState({
                    deviceAddress: {
                        ipFragment1: this.state.deviceAddress.ipFragment1,
                        ipFragment2: e.target.value,
                        ipFragment3: this.state.deviceAddress.ipFragment3,
                        ipFragment4: this.state.deviceAddress.ipFragment4,
                        port: this.state.deviceAddress.port
                    }
                });
                break;
            }
            case 'ip3': {
                this.setState({
                    deviceAddress: {
                        ipFragment1: this.state.deviceAddress.ipFragment1,
                        ipFragment2: this.state.deviceAddress.ipFragment2,
                        ipFragment3: e.target.value,
                        ipFragment4: this.state.deviceAddress.ipFragment4,
                        port: this.state.deviceAddress.port
                    }
                });
                break;
            }
            case 'ip4': {
                this.setState({
                    deviceAddress: {
                        ipFragment1: this.state.deviceAddress.ipFragment1,
                        ipFragment2: this.state.deviceAddress.ipFragment2,
                        ipFragment3: this.state.deviceAddress.ipFragment3,
                        ipFragment4: e.target.value,
                        port: this.state.deviceAddress.port
                    }
                });
                break;
            }
            case 'port': {
                this.setState({
                    deviceAddress: {
                        ipFragment1: this.state.deviceAddress.ipFragment1,
                        ipFragment2: this.state.deviceAddress.ipFragment2,
                        ipFragment3: this.state.deviceAddress.ipFragment3,
                        ipFragment4: this.state.deviceAddress.ipFragment4,
                        port: e.target.value
                    }
                });
                break;
            }
            default:
                break;
        }
    };
    AutoGenStates.prototype.handlelastDownloadProgressRequestTimeChange = function (n) {
        this.setState({
            downloadStatus: {
                lastDownloadProgress: n,
                lastDownloadProgressRequestTime: this.state.downloadStatus.lastDownloadProgressRequestTime
            }
        });
    };
    AutoGenStates.prototype.handleRequestUI = function () {
        this.props.requestOpenSpeechUI(this.state.deviceAddress.ipFragment1, this.state.deviceAddress.ipFragment2, this.state.deviceAddress.ipFragment3, this.state.deviceAddress.ipFragment4, this.state.deviceAddress.port);
    };
    AutoGenStates.prototype.handleInputCommand = function (module, link, value) {
        if (!this.props.isLoading) {
            this.props.requestSendCommand(link, value, module, this.state.deviceAddress.ipFragment1, this.state.deviceAddress.ipFragment2, this.state.deviceAddress.ipFragment3, this.state.deviceAddress.ipFragment4, this.state.deviceAddress.port);
        }
    };
    AutoGenStates.prototype.handleDownloadDemo = function (device, project) {
        if (!this.props.isLoading) {
            this.setState({
                uiConfig: {
                    projectID: project,
                    name: this.state.uiConfig.name
                }
            });
            this.props.requestDownloadS3Demo(device, project, this.state.deviceAddress.ipFragment1, this.state.deviceAddress.ipFragment2, this.state.deviceAddress.ipFragment3, this.state.deviceAddress.ipFragment4, this.state.deviceAddress.port);
        }
    };
    AutoGenStates.prototype.handleRequestDownloadProgress = function () {
        this.props.requestS3DownloadProgress(this.state.deviceAddress.ipFragment1, this.state.deviceAddress.ipFragment2, this.state.deviceAddress.ipFragment3, this.state.deviceAddress.ipFragment4, this.state.deviceAddress.port);
    };
    AutoGenStates.prototype.setNotification = function (level, text) {
        this.setState({
            notification: {
                level: level,
                text: text
            }
        });
    };
    AutoGenStates.prototype.render = function () {
        var _this = this;
        function getAutogen(state, props) {
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
                                    React.createElement(EffectPageDiv_jsx_1.EffectPageDiv, { callback: state.handleInputCommand, module: module, page: page })));
                        }))));
                }
                else if (props.uiConfig.name) {
                    var effectName = props.uiConfig.name ? props.uiConfig.name : "";
                    effectName = (effectName === "ERROR") ? "" : effectName;
                    return (React.createElement("div", { className: "autogen autogen-effectContainer autogen-error" }));
                }
            }
        }
        function animateDownloadStatus(state, props, projectID) {
            if (props.isDeviceDownloading === true) {
                if (state.uiConfig.projectID === projectID) {
                    return (React.createElement(react_bootstrap_1.Spinner, { animation: "border", variant: "light", className: "open-speech-loading-anim" }));
                }
                else {
                    return (React.createElement("i", { className: "fas fa-info large-icon open-speech-accent-icon" }));
                }
            }
            if (props.uiConfig && props.currentDemo) {
                if (props.uiConfig.name === "Demo Upload Failed" && props.currentDemo === projectID) {
                    return (React.createElement("i", { className: "fa fa-times open-speech-accent-font" }));
                }
                else {
                    return (React.createElement("i", { className: "fas fa-info  open-speech-accent-icon" }));
                }
            }
            else {
                return (React.createElement("i", { className: "fas fa-info open-speech-accent-icon" }));
            }
        }
        //Would like to rewrite this to better consider properties of selection. 
        //Currently, takes into account ui return, selected projectID and object, as well as determines if downloading.
        function highlightIfDownloaded(state, props, projectID) {
            if (!props.isDeviceDownloading) {
                if (props.currentDemo === projectID) {
                    if (props.uiConfig) {
                        if (props.uiConfig.name === "Demo Upload Failed") {
                            return ("card card-stats open-speech-is-error-highlighted");
                        } //[End]If Demo upload failed
                        else {
                            return ("card card-stats open-speech-is-highlighted");
                        } //[End]Demo upload Succeeded
                    } //[End]UI Config Exists
                    else {
                        return ("card card-stats open-speech-is-highlighted");
                    }
                } //[End] currentDemo downloaded is the entered objectID
                else {
                    return ("card card-stats");
                } //[End] currentDemo downloaded is not the entered objectID
            } //[End] Device is NOT downloading
            else {
                return ("card card-stats");
            } //[End] Device IS downloading
        } //[end]highlightIfDownloaded
        return (React.createElement("div", { className: "content" },
            React.createElement(NotificationWrapper_jsx_1.default, { pushText: this.state.notification.text, level: this.state.notification.level }),
            React.createElement(react_bootstrap_1.Container, { fluid: true },
                React.createElement(react_bootstrap_1.Row, null,
                    React.createElement(react_bootstrap_1.Modal.Dialog, null,
                        React.createElement(react_bootstrap_1.Modal.Header, null,
                            React.createElement(react_bootstrap_1.Modal.Title, null, "Connection")),
                        React.createElement(react_bootstrap_1.Col, { lg: 12, md: 12, sm: 12 },
                            React.createElement(react_bootstrap_1.InputGroup, { className: "mb-2" },
                                React.createElement(react_bootstrap_1.InputGroup.Prepend, null,
                                    React.createElement(react_bootstrap_1.InputGroup.Text, { id: "inputGroup-sizing-default" }, "IP")),
                                React.createElement(react_bootstrap_1.FormControl, { name: "ip1", defaultValue: this.state.deviceAddress.ipFragment1, onChange: this.handleChangeIP1, "aria-label": "IP1", "aria-describedby": "inputGroup-sizing-default" }),
                                React.createElement(react_bootstrap_1.FormControl, { name: "ip2", defaultValue: this.state.deviceAddress.ipFragment2, onChange: this.handleChangeIP2, "aria-label": "IP2", "aria-describedby": "inputGroup-sizing-default" }),
                                React.createElement(react_bootstrap_1.FormControl, { name: "ip3", defaultValue: this.state.deviceAddress.ipFragment3, onChange: this.handleChangeIP3, "aria-label": "IP3", "aria-describedby": "inputGroup-sizing-default" }),
                                React.createElement(react_bootstrap_1.FormControl, { name: "ip4", defaultValue: this.state.deviceAddress.ipFragment4, onChange: this.handleChangeIP4, "aria-label": "IP4", "aria-describedby": "inputGroup-sizing-default" }))),
                        React.createElement(react_bootstrap_1.Col, { lg: 12, md: 12, sm: 12 },
                            React.createElement(react_bootstrap_1.InputGroup, { className: "mb-3" },
                                React.createElement(react_bootstrap_1.InputGroup.Prepend, null,
                                    React.createElement(react_bootstrap_1.InputGroup.Text, { id: "inputGroup-sizing-default" }, "Port")),
                                React.createElement(react_bootstrap_1.FormControl, { name: "port", defaultValue: this.state.deviceAddress.port, onChange: this.handleChangePort, "aria-label": "Port", "aria-describedby": "inputGroup-sizing-default" }))))),
                React.createElement(react_bootstrap_1.Row, null,
                    React.createElement(react_bootstrap_1.Modal.Dialog, null,
                        React.createElement(react_bootstrap_1.Modal.Header, null,
                            React.createElement(react_bootstrap_1.Modal.Title, null, "Available Demos")),
                        React.createElement(react_bootstrap_1.Modal.Body, null,
                            React.createElement(react_bootstrap_1.Row, null, this.props.availableDemos.map(function (d) {
                                return React.createElement(React.Fragment, { key: d.name },
                                    React.createElement(OpenSpeechDemoCard_jsx_1.OpenSpeechDemoCard, { isSelected: highlightIfDownloaded(_this.state, _this.props, d.name), isDownloading: animateDownloadStatus(_this.state, _this.props, d.name), downloadDevice: d.downloadurl.devicename, downloadProject: d.downloadurl.projectname, headerTitle: d.name, callback: _this.handleDownloadDemo, statsValue: (d.filesize / 1000000).toFixed(2) + "MB", statsIcon: React.createElement("i", { className: "fa fa-folder-o" }), statsIconText: d.downloadurl.devicename + "/" + d.downloadurl.projectname }));
                            }))))),
                React.createElement(react_bootstrap_1.Row, null,
                    React.createElement(react_bootstrap_1.Modal.Dialog, null,
                        React.createElement(react_bootstrap_1.Modal.Header, null,
                            React.createElement(react_bootstrap_1.Modal.Title, { className: "float-left" }, "Controls"),
                            React.createElement("div", { className: "float-right" },
                                React.createElement(react_bootstrap_1.Button, { variant: "primary", className: "btn-simple btn-icon", onClick: this.handleRequestUI },
                                    React.createElement("i", { className: "fa fa-refresh large-icon" })))),
                        getAutogen(this, this.props))))));
    };
    return AutoGenStates;
}(React.PureComponent));
exports.AutoGenStates = AutoGenStates;
exports.default = react_redux_1.connect(function (state) { return state.openSpeechData; }, OpenSpeechDataStore.openSpeechDataActionCreators)(AutoGenStates);
//# sourceMappingURL=Auto-Gen-Elements.js.map