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
var OpenSpeechDemoCard_jsx_1 = require("../Components/OpenSpeechDemos/OpenSpeechDemoCard.jsx");
var EffectPageDiv_jsx_1 = require("../Components/Autogen/Containers/EffectPageDiv.jsx");
var NotificationWrapper_jsx_1 = require("../Components/Notifications/NotificationWrapper.jsx");
var Dashboard = /** @class */ (function (_super) {
    __extends(Dashboard, _super);
    function Dashboard(props) {
        var _this = _super.call(this, props) || this;
        _this.handleDownloadDemosJSON = function () {
            downloadObjectAsJson(_this.props.availableDemos, "demos");
        };
        _this.state = {
            ipFragment1: '127',
            ipFragment2: '0',
            ipFragment3: '0',
            ipFragment4: '1',
            port: '3355',
            lastDownloadProgressRequestTime: 0,
            lastDownloadProgress: 0,
            projectID: "Example",
            notificationText: "",
            notificationLevel: ""
        };
        _this.handleIP1Change = _this.handleIP1Change.bind(_this);
        _this.handleIP2Change = _this.handleIP2Change.bind(_this);
        _this.handleIP3Change = _this.handleIP3Change.bind(_this);
        _this.handleIP4Change = _this.handleIP4Change.bind(_this);
        _this.handlePortChange = _this.handlePortChange.bind(_this);
        _this.handlelastDownloadProgressRequestTimeChange = _this.handlelastDownloadProgressRequestTimeChange.bind(_this);
        _this.handleRequestUI = _this.handleRequestUI.bind(_this);
        _this.handleInputCommand = _this.handleInputCommand.bind(_this);
        _this.handleDownloadDemo = _this.handleDownloadDemo.bind(_this);
        _this.handleRequestDownloadProgress = _this.handleRequestDownloadProgress.bind(_this);
        _this.setNotificationText = _this.setNotificationText.bind(_this);
        _this.setNotificationLevel = _this.setNotificationLevel.bind(_this);
        return _this;
    }
    Dashboard.prototype.componentDidMount = function () {
        this.props.requestOpenSpeechS3Demos();
        this.handleRequestUI();
        if (this.props.downloadProgress) {
            if (this.state.lastDownloadProgress !== this.props.downloadProgress.progress) {
                this.setState({
                    lastDownloadProgress: this.props.downloadProgress.progress
                });
                this.forceUpdate();
            }
        }
    };
    Dashboard.prototype.componentDidUpdate = function () {
        if (this.props.uiConfig) {
            if (this.props.uiConfig.name === 'Demo Upload Failed') {
                this.setNotificationLevel('error');
                this.setNotificationText('Demo Upload Failed');
            }
            else if (this.props.uiConfig.name === "ERROR") {
                this.setNotificationLevel('error');
                this.setNotificationText('Control Generation Failed');
            }
            else {
                this.setNotificationLevel('success');
                this.setNotificationText('New Controls Generated: ' + this.props.uiConfig.name);
            }
        }
    };
    Dashboard.prototype.handlePollDownloadProgress = function () {
        if (this.props.isDeviceDownloading) {
            var date = new Date();
            var currentDateInMS = date.getTime();
            var requestRateInMS = 100;
            //if the current datetime in milliseconds is greater the last request log plus the request rate,
            //Then set the new request datetime in milliseconds, and request the download progress.
            if (currentDateInMS > (this.state.lastDownloadProgressRequestTime + requestRateInMS)) {
                this.handlelastDownloadProgressRequestTimeChange(currentDateInMS);
                this.handleRequestDownloadProgress();
            }
        }
    };
    Dashboard.prototype.handleIP1Change = function (e) {
        this.setState({ ipFragment1: e.target.value });
    };
    Dashboard.prototype.handleIP2Change = function (e) {
        this.setState({ ipFragment2: e.target.value });
    };
    Dashboard.prototype.handleIP3Change = function (e) {
        this.setState({ ipFragment3: e.target.value });
    };
    Dashboard.prototype.handleIP4Change = function (e) {
        this.setState({ ipFragment4: e.target.value });
    };
    Dashboard.prototype.handlePortChange = function (e) {
        this.setState({ port: e.target.value });
    };
    Dashboard.prototype.handlelastDownloadProgressRequestTimeChange = function (n) {
        this.setState({ lastDownloadProgressRequestTime: n });
    };
    Dashboard.prototype.handleRequestUI = function () {
        this.props.requestOpenSpeechUI(this.state.ipFragment1, this.state.ipFragment2, this.state.ipFragment3, this.state.ipFragment4, this.state.port);
    };
    Dashboard.prototype.handleInputCommand = function (module, link, value) {
        if (!this.props.isLoading) {
            this.props.requestSendCommand(link, value, module, this.state.ipFragment1, this.state.ipFragment2, this.state.ipFragment3, this.state.ipFragment4, this.state.port);
        }
    };
    Dashboard.prototype.handleDownloadDemo = function (device, project) {
        if (!this.props.isLoading) {
            this.setState({ projectID: project });
            this.props.requestDownloadS3Demo(device, project, this.state.ipFragment1, this.state.ipFragment2, this.state.ipFragment3, this.state.ipFragment4, this.state.port);
        }
    };
    Dashboard.prototype.handleRequestDownloadProgress = function () {
        this.props.requestS3DownloadProgress(this.state.ipFragment1, this.state.ipFragment2, this.state.ipFragment3, this.state.ipFragment4, this.state.port);
    };
    Dashboard.prototype.setNotificationText = function (text) {
        this.setState({ notificationText: text });
    };
    Dashboard.prototype.setNotificationLevel = function (level) {
        this.setState({ notificationLevel: level });
    };
    Dashboard.prototype.render = function () {
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
                                    React.createElement(EffectPageDiv_jsx_1.EffectPageDiv, { callback: board.handleInputCommand, module: module, page: page })));
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
                if (state.projectID === projectID) {
                    return (React.createElement(react_bootstrap_1.Spinner, { animation: "border", variant: "light", className: "open-speech-loading-anim" }));
                }
                else {
                    return (React.createElement("i", { className: "fa fa-info large-icon open-speech-accent-font" }));
                }
            }
            if (props.uiConfig && props.currentDemo) {
                if (props.uiConfig.name === "Demo Upload Failed" && props.currentDemo === projectID) {
                    return (React.createElement("i", { className: "fa fa-times large-icon open-speech-accent-font" }));
                }
                else {
                    return (React.createElement("i", { className: "fa fa-info large-icon open-speech-accent-font" }));
                }
            }
            else {
                return (React.createElement("i", { className: "fa fa-info large-icon open-speech-accent-font" }));
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
            React.createElement(NotificationWrapper_jsx_1.default, { pushText: this.state.notificationText, level: this.state.notificationLevel }),
            React.createElement(react_bootstrap_1.Container, { fluid: true },
                React.createElement(react_bootstrap_1.Row, null,
                    React.createElement(react_bootstrap_1.Modal.Dialog, null,
                        React.createElement(react_bootstrap_1.Modal.Header, null,
                            React.createElement(react_bootstrap_1.Modal.Title, null, "Connection")),
                        React.createElement(react_bootstrap_1.Col, { lg: 12, md: 12, sm: 12 },
                            React.createElement(react_bootstrap_1.InputGroup, { className: "mb-2" },
                                React.createElement(react_bootstrap_1.InputGroup.Prepend, null,
                                    React.createElement(react_bootstrap_1.InputGroup.Text, { id: "inputGroup-sizing-default" }, "IP")),
                                React.createElement(react_bootstrap_1.FormControl, { name: "ip1", defaultValue: this.state.ipFragment1, onChange: this.handleIP1Change, "aria-label": "IP1", "aria-describedby": "inputGroup-sizing-default" }),
                                React.createElement(react_bootstrap_1.FormControl, { name: "ip2", defaultValue: this.state.ipFragment2, onChange: this.handleIP2Change, "aria-label": "IP2", "aria-describedby": "inputGroup-sizing-default" }),
                                React.createElement(react_bootstrap_1.FormControl, { name: "ip3", defaultValue: this.state.ipFragment3, onChange: this.handleIP3Change, "aria-label": "IP3", "aria-describedby": "inputGroup-sizing-default" }),
                                React.createElement(react_bootstrap_1.FormControl, { name: "ip4", defaultValue: this.state.ipFragment4, onChange: this.handleIP4Change, "aria-label": "IP4", "aria-describedby": "inputGroup-sizing-default" }))),
                        React.createElement(react_bootstrap_1.Col, { lg: 12, md: 12, sm: 12 },
                            React.createElement(react_bootstrap_1.InputGroup, { className: "mb-3" },
                                React.createElement(react_bootstrap_1.InputGroup.Prepend, null,
                                    React.createElement(react_bootstrap_1.InputGroup.Text, { id: "inputGroup-sizing-default" }, "Port")),
                                React.createElement(react_bootstrap_1.FormControl, { name: "port", defaultValue: this.state.port, onChange: this.handlePortChange, "aria-label": "Port", "aria-describedby": "inputGroup-sizing-default" }))))),
                React.createElement(react_bootstrap_1.Row, null,
                    React.createElement(react_bootstrap_1.Modal.Dialog, null,
                        React.createElement(react_bootstrap_1.Modal.Header, null,
                            React.createElement(react_bootstrap_1.Modal.Title, null, "Available Demos"),
                            React.createElement(react_bootstrap_1.Button, { variant: "primary", className: "flex-right btn=simple btn-icon", onClick: this.handleDownloadDemosJSON },
                                React.createElement("i", { className: "fa fa-download large-icon" }))),
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
    return Dashboard;
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
exports.default = react_redux_1.connect(function (state) { return state.openSpeechData; }, OpenSpeechDataStore.openSpeechDataActionCreators)(Dashboard);
//# sourceMappingURL=Auto-Gen.js.map