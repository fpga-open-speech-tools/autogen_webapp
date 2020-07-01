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
var EffectPageDiv_jsx_1 = require("../../Components/Autogen/Containers/EffectPageDiv.jsx");
var NotificationWrapper_jsx_1 = require("../../Components/Notifications/NotificationWrapper.jsx");
var AutoGenControls = /** @class */ (function (_super) {
    __extends(AutoGenControls, _super);
    function AutoGenControls(props) {
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
            uiConfig: {
                name: "",
                projectID: "Example",
            }
        };
        _this.handleRequestUI = _this.handleRequestUI.bind(_this);
        _this.handleInputCommand = _this.handleInputCommand.bind(_this);
        _this.setNotification = _this.setNotification.bind(_this);
        return _this;
    }
    AutoGenControls.prototype.componentDidMount = function () {
        this.handleRequestUI();
    };
    AutoGenControls.prototype.componentDidUpdate = function () {
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
    AutoGenControls.prototype.handleDeviceAddressChange = function (e, key) {
        var deviceAddress = this.props.deviceAddress;
        switch (key) {
            case 'ip1':
                deviceAddress.ipAddress.ip1 = e.target.value;
                break;
            case 'ip2':
                deviceAddress.ipAddress.ip2 = e.target.value;
                break;
            case 'ip3':
                deviceAddress.ipAddress.ip3 = e.target.value;
                break;
            case 'ip4':
                deviceAddress.ipAddress.ip4 = e.target.value;
                break;
            case 'port':
                deviceAddress.port = e.target.value;
                break;
            default:
                break;
        }
        this.props.setDeviceAddress(deviceAddress);
    };
    AutoGenControls.prototype.handleRequestUI = function () {
        this.props.requestOpenSpeechUI(this.props.deviceAddress);
    };
    AutoGenControls.prototype.handleInputCommand = function (module, link, value) {
        if (!this.props.isLoading) {
            this.props.requestSendCommand(link, value, module, this.props.deviceAddress);
        }
    };
    AutoGenControls.prototype.setNotification = function (level, text) {
        this.setState({
            notification: {
                level: level,
                text: text
            }
        });
    };
    AutoGenControls.prototype.render = function () {
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
        return (React.createElement("div", { className: "content" },
            React.createElement(NotificationWrapper_jsx_1.default, { pushText: this.state.notification.text, level: this.state.notification.level }),
            React.createElement(react_bootstrap_1.Container, { fluid: true },
                React.createElement(react_bootstrap_1.Row, null,
                    React.createElement(react_bootstrap_1.Modal.Dialog, null,
                        React.createElement(react_bootstrap_1.Modal.Header, null,
                            React.createElement(react_bootstrap_1.Modal.Title, { className: "float-left" }, "Controls"),
                            React.createElement("div", { className: "float-right" },
                                React.createElement(react_bootstrap_1.Button, { variant: "primary", className: "btn-simple btn-icon", onClick: this.handleRequestUI },
                                    React.createElement("i", { className: "fa fa-refresh large-icon" })))),
                        getAutogen(this, this.props))))));
    };
    return AutoGenControls;
}(React.PureComponent));
exports.AutoGenControls = AutoGenControls;
exports.default = react_redux_1.connect(function (state) { return state.openSpeechData; }, OpenSpeechDataStore.openSpeechDataActionCreators)(AutoGenControls);
//# sourceMappingURL=AutoGenControls.js.map