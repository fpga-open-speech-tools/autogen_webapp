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
var NotificationWrapper_jsx_1 = require("../../Components/Notifications/NotificationWrapper.jsx");
var AvailableDemos = /** @class */ (function (_super) {
    __extends(AvailableDemos, _super);
    function AvailableDemos(props) {
        var _this = _super.call(this, props) || this;
        _this.state = {
            downloadStatus: {
                lastDownloadProgressRequestTime: 0,
                lastDownloadProgress: 0,
            },
            notification: {
                text: "",
                level: ""
            },
            autogen: {
                name: ""
            }
        };
        _this.handleDownloadDemo = _this.handleDownloadDemo.bind(_this);
        _this.setNotification = _this.setNotification.bind(_this);
        return _this;
    }
    AvailableDemos.prototype.componentDidMount = function () {
        this.props.requestOpenSpeechS3Demos();
    };
    AvailableDemos.prototype.componentDidUpdate = function () {
        if (this.props.autogen) {
            if (this.props.autogen.name === 'Demo Upload Failed' && this.props.autogen.name != this.state.autogen.name) {
                this.setNotification('error', 'Demo Upload Failed');
                this.setState({
                    autogen: {
                        name: this.props.autogen.name,
                    }
                });
            }
            else if (this.props.autogen.name === "ERROR" && this.props.autogen.name != this.state.autogen.name) {
                this.setNotification('error', 'Control Generation Failed');
                this.setState({
                    autogen: {
                        name: this.props.autogen.name
                    }
                });
            }
            else if (this.props.autogen.name != this.state.autogen.name) {
                this.setNotification('success', 'New Controls Generated');
                this.setState({
                    autogen: {
                        name: this.props.autogen.name
                    }
                });
            }
        }
    };
    AvailableDemos.prototype.handleDownloadDemo = function (device, project) {
        if (!this.props.isLoading) {
            this.setState({
                autogen: {
                    name: project
                }
            });
            this.props.requestDownloadS3Demo(this.props.deviceAddress, device, project);
        }
    };
    AvailableDemos.prototype.setNotification = function (level, text) {
        this.setState({
            notification: {
                level: level,
                text: text
            }
        });
    };
    AvailableDemos.prototype.render = function () {
        var _this = this;
        function animateDownloadStatus(state, props, projectID) {
            if (props.isDeviceDownloading === true) {
                if (state.autogen.name === projectID) {
                    return (React.createElement(react_bootstrap_1.Spinner, { animation: "border", variant: "light", className: "open-speech-loading-anim" }));
                }
                else {
                    return (React.createElement("i", { className: "fas fa-info large-icon open-speech-accent-icon" }));
                }
            }
            if (props.autogen && props.currentDemo) {
                if (props.autogen.name === "Demo Upload Failed" && props.currentDemo === projectID) {
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
                    if (props.autogen) {
                        if (props.autogen.name === "Demo Upload Failed") {
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
                            React.createElement(react_bootstrap_1.Modal.Title, null, "Available Demos")),
                        React.createElement(react_bootstrap_1.Modal.Body, null,
                            React.createElement(react_bootstrap_1.Row, null, this.props.availableDemos.map(function (d) {
                                return React.createElement(React.Fragment, { key: d.name },
                                    React.createElement(OpenSpeechDemoCard_jsx_1.OpenSpeechDemoCard, { isSelected: highlightIfDownloaded(_this.state, _this.props, d.name), isDownloading: animateDownloadStatus(_this.state, _this.props, d.name), downloadDevice: d.downloadurl.devicename, downloadProject: d.downloadurl.projectname, headerTitle: d.name, callback: _this.handleDownloadDemo, statsValue: (d.filesize / 1000000).toFixed(2) + "MB", statsIcon: React.createElement("i", { className: "fa fa-folder-o" }), statsIconText: d.downloadurl.devicename + "/" + d.downloadurl.projectname }));
                            }))))))));
    };
    return AvailableDemos;
}(React.PureComponent));
exports.AvailableDemos = AvailableDemos;
exports.default = react_redux_1.connect(function (state) { return state.openSpeechData; }, OpenSpeechDataStore.openSpeechDataActionCreators)(AvailableDemos);
//# sourceMappingURL=AutoGenDemos.js.map