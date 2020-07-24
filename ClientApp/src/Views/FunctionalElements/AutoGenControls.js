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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
var react_redux_1 = require("react-redux");
var OpenSpeechDataStore = require("../../Store/OpenSpeechToolsData");
var react_bootstrap_1 = require("react-bootstrap");
var NotificationWrapper_jsx_1 = require("../../Components/Notifications/NotificationWrapper.jsx");
var AutogenContainer_jsx_1 = require("../../Components/Autogen/Containers/AutogenContainer.jsx");
var ModelDataClient_1 = require("../../SignalR/ModelDataClient");
var modelDataClient = new ModelDataClient_1.ModelDataClient();
var AutoGenControls = /** @class */ (function (_super) {
    __extends(AutoGenControls, _super);
    function AutoGenControls(props) {
        var _this = _super.call(this, props) || this;
        _this.updateModelFromProps = function () {
            function overwriteModel(controls) {
                return __awaiter(this, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        modelData = controls.props.autogen.data;
                        return [2 /*return*/];
                    });
                });
            }
            function updateModel(controls) {
                return __awaiter(this, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        controls.setState({ newAutogen: true });
                        return [2 /*return*/];
                    });
                });
            }
            function modelUpdated(controls) {
                return __awaiter(this, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        controls.setState({ newAutogen: false });
                        return [2 /*return*/];
                    });
                });
            }
            function update(controls) {
                return __awaiter(this, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, overwriteModel(controls)];
                            case 1:
                                _a.sent();
                                return [4 /*yield*/, updateModel(controls)];
                            case 2:
                                _a.sent();
                                return [4 /*yield*/, modelUpdated(controls)];
                            case 3:
                                _a.sent();
                                return [2 /*return*/];
                        }
                    });
                });
            }
            update(_this);
        };
        _this.updateModelData = function (dataPackets) {
            dataPackets.map(function (packet) {
                process(_this, packet, modelData);
            });
        };
        _this.handleInputCommand = function (command) {
            _this.updateModelData(command);
            if (!_this.props.isLoading) {
                if (modelDataClient.state.connected) {
                    _this.sendDataPackets(command);
                }
                else {
                    _this.props.requestSendModelData(command, _this.props.deviceAddress);
                }
            }
        };
        _this.getAutogen = function (controls, props) {
            if (props.autogen && modelData) {
                if (props.autogen.containers.length > 0 &&
                    modelData.length > 0 &&
                    props.autogen.views.length > 0) {
                    var effectName = props.autogen.name ? props.autogen.name : "";
                    effectName = (effectName === "ERROR") ? "" : effectName;
                    return (React.createElement("div", { className: "autogen autogen-effectContainer modal-body" },
                        React.createElement(react_bootstrap_1.Jumbotron, { className: "autogen-effect-name" }, effectName),
                        React.createElement(react_bootstrap_1.Row, { className: "autogen-pages row" }, props.autogen.containers.map(function (container) {
                            return React.createElement(React.Fragment, { key: container.name },
                                React.createElement(AutogenContainer_jsx_1.default, { references: container.views, headerTitle: container.name, views: _this.props.autogen.views, data: modelData, callback: controls.handleInputCommand }));
                        }))));
                }
                else if (props.autogen.name) {
                    var effectName = props.autogen.name ? props.autogen.name : "";
                    effectName = (effectName === "ERROR") ? "" : effectName;
                    return (React.createElement("div", { className: "autogen autogen-effectContainer autogen-error" }));
                }
            }
        };
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
            //data: []
            newAutogen: false,
            dataUpdated: false
        };
        _this.handleRequestUI = _this.handleRequestUI.bind(_this);
        _this.handleInputCommand = _this.handleInputCommand.bind(_this);
        _this.setNotification = _this.setNotification.bind(_this);
        _this.sendDataPackets = _this.sendDataPackets.bind(_this);
        _this.updateModelData = _this.updateModelData.bind(_this);
        _this.receiveDataPackets = _this.receiveDataPackets.bind(_this);
        _this.handleMessage = _this.handleMessage.bind(_this);
        _this.updateModelFromProps = _this.updateModelFromProps.bind(_this);
        _this.getAutogen = _this.getAutogen.bind(_this);
        return _this;
    }
    AutoGenControls.prototype.componentWillReceiveProps = function () {
        this.updateModelFromProps();
    };
    AutoGenControls.prototype.shouldComponentUpdate = function (nextProps) {
        if (nextProps.autogen.data.length > 0) {
            return true;
        }
        return false;
    };
    AutoGenControls.prototype.componentDidMount = function () {
        this.handleRequestUI();
        modelDataClient.callbacks.incomingMessageListener = this.handleMessage;
        modelDataClient.callbacks.incomingDataListener = this.receiveDataPackets;
        modelDataClient.startSession();
    };
    AutoGenControls.prototype.componentDidUpdate = function () {
        if (this.props.autogen && modelData) {
            if (modelData != this.props.autogen.data) {
                this.updateModelFromProps();
            }
        }
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
        modelDataClient.sendObject(dataPackets);
    };
    AutoGenControls.prototype.receiveDataPackets = function (object) {
        this.updateModelData(object);
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
    AutoGenControls.prototype.handleMessage = function (text) {
        this.setState({
            notification: {
                level: "success",
                text: text
            }
        });
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
                        this.getAutogen(this, this.props))))));
    };
    return AutoGenControls;
}(React.Component));
exports.AutoGenControls = AutoGenControls;
var modelData = [];
function updateModelData(packet, oldModel) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            oldModel[packet.index].value = packet.value;
            return [2 /*return*/];
        });
    });
}
function updateModel(controls) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            controls.setState({ dataUpdated: true });
            return [2 /*return*/];
        });
    });
}
function modelUpdated(controls) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            controls.setState({ dataUpdated: false });
            return [2 /*return*/];
        });
    });
}
function process(controls, packet, oldModel) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, updateModelData(packet, oldModel)];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, updateModel(controls)];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, modelUpdated(controls)];
                case 3:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
exports.default = react_redux_1.connect(function (state) { return state.openSpeechData; }, OpenSpeechDataStore.openSpeechDataActionCreators)(AutoGenControls);
//# sourceMappingURL=AutoGenControls.js.map