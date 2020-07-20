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
var NotificationWrapper_jsx_1 = require("../../Components/Notifications/NotificationWrapper.jsx");
var AutogenContainer_jsx_1 = require("../../Components/Autogen/Containers/AutogenContainer.jsx");
var signalR = require("@microsoft/signalr");
var connection = new signalR.HubConnectionBuilder().withUrl("/model-data").build();
var AutoGenControls = /** @class */ (function (_super) {
    __extends(AutoGenControls, _super);
    function AutoGenControls(props) {
        var _this = _super.call(this, props) || this;
        _this.state = {
            connected: false,
            notification: {
                text: "",
                level: ""
            },
            autogen: {
                name: "",
                projectID: "Example",
            },
            data: []
        };
        _this.handleRequestUI = _this.handleRequestUI.bind(_this);
        _this.handleInputCommand = _this.handleInputCommand.bind(_this);
        _this.setNotification = _this.setNotification.bind(_this);
        _this.sendDataPackets = _this.sendDataPackets.bind(_this);
        _this.updateModelData = _this.updateModelData.bind(_this);
        return _this;
    }
    AutoGenControls.prototype.componentWillReceiveProps = function () {
        this.setState({ data: this.props.autogen.data });
    };
    AutoGenControls.prototype.componentDidMount = function () {
        this.handleRequestUI();
        this.startSession();
    };
    AutoGenControls.prototype.componentDidUpdate = function () {
        if (this.props.autogen) {
            if (this.props.autogen.name === 'Demo Upload Failed' && this.props.autogen.name != this.state.autogen.name) {
                this.setNotification('error', 'Demo Upload Failed');
                this.setState({
                    autogen: {
                        name: this.props.autogen.name,
                        projectID: this.state.autogen.projectID
                    }
                });
            }
            else if (this.props.autogen.name === "ERROR" && this.props.autogen.name != this.state.autogen.name) {
                this.setNotification('error', 'Control Generation Failed');
                this.setState({
                    autogen: {
                        name: this.props.autogen.name,
                        projectID: this.state.autogen.projectID
                    }
                });
            }
            else if (this.props.autogen.name != this.state.autogen.name) {
                this.setNotification('success', 'New Controls Generated');
                this.setState({
                    autogen: {
                        name: this.props.autogen.name,
                        projectID: this.state.autogen.projectID
                    }
                });
            }
        }
    };
    AutoGenControls.prototype.sendDataPackets = function (dataPackets) {
        if (this.state.connected) {
            connection.invoke("SendDataPacket", dataPackets).catch(function (err) {
                return console.error(err.toString());
            });
        }
    };
    AutoGenControls.prototype.verifyConnection = function () {
        connection.invoke("AfterConnected").catch(function (err) {
            return console.error(err.toString());
        });
    };
    AutoGenControls.prototype.startSession = function () {
        var _this = this;
        connection.on("Connected", function (message) {
            var msg = message.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
            _this.setState({
                connected: true,
                notification: {
                    level: "success",
                    text: msg
                }
            });
        });
        connection.on("Update", function (obj) {
            _this.updateModelData(obj);
            _this.forceUpdate();
        });
        connection.start()
            .then(function (val) {
        }).then(function (res) { return _this.verifyConnection(); })
            .catch(function (err) {
            setTimeout(function () { return connection.start(); }, 5000);
            return console.error(err.toString());
        });
    }; //End Start Connection to SignalR Client hub
    AutoGenControls.prototype.updateModelData = function (dataPackets) {
        var model = this.state.data;
        for (var p = 0; p < dataPackets.length; p++) {
            model[dataPackets[p].index].value = dataPackets[p].value;
        }
        this.setState({ data: model });
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
        this.props.requestAutogenConfiguration(this.props.deviceAddress);
    };
    AutoGenControls.prototype.handleInputCommand = function (command) {
        if (!this.props.isLoading) {
            this.updateModelData(command);
            this.props.requestSendModelData(command, this.props.deviceAddress);
            this.sendDataPackets(command);
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
        function getAutogen(controls, props, state) {
            if (props.autogen && state.data) {
                if (props.autogen.containers.length > 0 &&
                    state.data.length > 0 &&
                    props.autogen.views.length > 0) {
                    var effectName = props.autogen.name ? props.autogen.name : "";
                    effectName = (effectName === "ERROR") ? "" : effectName;
                    return (React.createElement("div", { className: "autogen autogen-effectContainer modal-body" },
                        React.createElement(react_bootstrap_1.Jumbotron, { className: "autogen-effect-name" }, effectName),
                        React.createElement(react_bootstrap_1.Row, { className: "autogen-pages row" }, props.autogen.containers.map(function (container) {
                            return React.createElement(React.Fragment, { key: container.name },
                                React.createElement(AutogenContainer_jsx_1.default, { references: container.views, headerTitle: container.name, views: props.autogen.views, data: state.data, callback: controls.handleInputCommand }));
                        }))));
                }
                else if (props.autogen.name) {
                    var effectName = props.autogen.name ? props.autogen.name : "";
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
                        getAutogen(this, this.props, this.state))))));
    };
    return AutoGenControls;
}(React.PureComponent));
exports.AutoGenControls = AutoGenControls;
exports.default = react_redux_1.connect(function (state) { return state.openSpeechData; }, OpenSpeechDataStore.openSpeechDataActionCreators)(AutoGenControls);
//# sourceMappingURL=AutoGenControls.js.map