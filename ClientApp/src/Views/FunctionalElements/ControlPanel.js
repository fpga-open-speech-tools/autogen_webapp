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
var ControlCard_jsx_1 = require("../../Components/Autogen/Containers/ControlCard.jsx");
var ModelDataClient_1 = require("../../SignalR/ModelDataClient");
var MapifyComponents_jsx_1 = require("../../Components/Autogen/Inputs/Manager/MapifyComponents.jsx");
var modelDataClient = new ModelDataClient_1.ModelDataClient();
var ControlPanel = /** @class */ (function (_super) {
    __extends(ControlPanel, _super);
    function ControlPanel(props) {
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
                if (modelDataClient.state.connected && _this.props.rtcEnabled) {
                    _this.sendDataPackets(command);
                }
                else {
                    _this.props.requestSendModelData(command, _this.props.deviceAddress);
                }
            }
        };
        _this.makeEditable = function () {
            if (_this.props.autogen.containers.length === 0) {
                //Generate new Autogen.
            }
            else {
                _this.setState({
                    editable: true
                });
            }
        };
        _this.cancelEdit = function () {
            _this.setState({ editable: false }); //Stop editing
            _this.handleRequestUI();
        };
        _this.saveEdit = function () {
            _this.setState({ editable: false });
            _this.props.requestSendAutogenConfiguration(_this.props.deviceAddress, _this.props.autogen);
            _this.handleRequestUI();
        };
        _this.fixEdit = function () {
            _this.setState({ editable: false });
            _this.props.requestSendAutogenConfiguration(_this.props.deviceAddress, MapifyComponents_jsx_1.GetAutogenObjectFromData(_this.props.autogen.data, _this.props.autogen.name));
            _this.handleRequestUI();
        };
        _this.controlEditable = function () {
            if (!_this.state.editable) {
                return (React.createElement("div", { className: "float-right" },
                    React.createElement(react_bootstrap_1.Button, { variant: "primary", className: "btn-simple btn-icon", onClick: _this.makeEditable },
                        React.createElement("i", { className: "fa fa-pencil-square-o large-icon" }))));
            }
            else {
                return (React.createElement("div", { className: "float-right" },
                    React.createElement(react_bootstrap_1.Button, { variant: "primary", className: "btn-simple btn-icon", onClick: _this.saveEdit },
                        React.createElement("i", { className: "fa fa-save large-icon" })),
                    React.createElement(react_bootstrap_1.Button, { variant: "primary", className: "btn-simple btn-icon", onClick: _this.cancelEdit },
                        React.createElement("i", { className: "fa fa-times large-icon" })),
                    React.createElement(react_bootstrap_1.Button, { variant: "primary", className: "btn-simple btn-icon", onClick: _this.fixEdit },
                        React.createElement("i", { className: "fa fa-wrench large-icon" }))));
            }
        };
        _this.updateControlCardName = function (title, index) {
            var autogen = _this.props.autogen;
            autogen.containers[index].name = title;
            _this.props.updateAutogenProps(autogen);
            _this.forceUpdate();
        };
        _this.updateControlPanelName = function (name) {
            var autogen = _this.props.autogen;
            autogen.name = name;
            _this.props.updateAutogenProps(autogen);
            _this.forceUpdate();
        };
        _this.deleteContainer = function (index) {
            var autogen = _this.props.autogen;
            autogen.containers.splice(index, 1);
            _this.props.updateAutogenProps(autogen);
            _this.forceUpdate();
        };
        _this.removeViewFromContainer = function (containerIndex, viewIndex) {
            var autogen = _this.props.autogen;
            autogen.containers[containerIndex].views.splice(viewIndex, 1);
            _this.props.updateAutogenProps(autogen);
            _this.forceUpdate();
        };
        _this.modifyView = function (index, view) {
            var autogen = _this.props.autogen;
            autogen.views[index] = view;
            _this.props.updateAutogenProps(autogen);
            _this.forceUpdate();
        };
        _this.modifyContainer = function (index, container) {
            var autogen = _this.props.autogen;
            autogen.containers[index] = container;
            _this.props.updateAutogenProps(autogen);
            _this.forceUpdate();
        };
        _this.moveContainer = function (index, direction) {
            var autogen = _this.props.autogen;
            //moving first element left(to end of array)
            if (direction < 1 && index === 0) {
                var currentContainer = autogen.containers.shift();
                autogen.containers.push(currentContainer);
            }
            //moving last element right(to start of array)
            else if (direction > 0 && index === autogen.containers.length - 1) {
                var currentContainer = autogen.containers.pop();
                autogen.containers.unshift(currentContainer);
            }
            //swapping indexed container with the component at the desired direction's index.
            else {
                var currentContainer = autogen.containers[index];
                autogen.containers[index] = autogen.containers[index + direction];
                autogen.containers[index + direction] = currentContainer;
            }
            _this.props.updateAutogenProps(autogen);
            _this.forceUpdate();
        };
        _this.controlPanelHeaderTitleControl = function (name) {
            if (_this.state.editable) {
                return (React.createElement(react_bootstrap_1.Form, null,
                    React.createElement(react_bootstrap_1.Form.Control, { size: "lg", type: "text", value: name, onChange: function (x) { _this.updateControlPanelName(x.currentTarget.value); } })));
            }
            else {
                return (React.createElement(react_bootstrap_1.Jumbotron, { className: "autogen-effect-name" }, name));
            }
        };
        _this.createControlPanel = function () {
            if (_this.props.autogen && modelData) {
                if (_this.props.autogen.containers.length > 0 &&
                    modelData.length > 0 &&
                    _this.props.autogen.views.length > 0) {
                    var effectName = _this.props.autogen.name ? _this.props.autogen.name : "";
                    effectName = (effectName === "ERROR") ? "" : effectName;
                    return (React.createElement("div", { className: "autogen autogen-effectContainer modal-body" },
                        _this.controlPanelHeaderTitleControl(effectName),
                        React.createElement(react_bootstrap_1.Row, { className: "autogen-pages row" }, _this.props.autogen.containers.map(function (container, index) {
                            return React.createElement(React.Fragment, { key: index },
                                React.createElement(ControlCard_jsx_1.default, { references: container.views, title: container.name, views: _this.props.autogen.views, data: modelData, callback: _this.handleInputCommand, editable: _this.state.editable, moveLeft: _this.moveContainer, moveRight: _this.moveContainer, delete: _this.deleteContainer, updateTitle: _this.updateControlCardName, index: index, updateView: _this.modifyView, updateContainer: _this.modifyContainer, components: components }));
                        }))));
                }
                else if (_this.props.autogen.name) {
                    var effectName = _this.props.autogen.name ? _this.props.autogen.name : "";
                    effectName = (effectName === "ERROR") ? "" : effectName;
                    return (React.createElement("div", { className: "autogen autogen-effectContainer autogen-error" }));
                }
            }
        };
        _this.state = {
            connected: false,
            editable: false,
            notification: {
                text: "",
                level: ""
            },
            autogen: _this.props.autogen,
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
        _this.createControlPanel = _this.createControlPanel.bind(_this);
        _this.controlEditable = _this.controlEditable.bind(_this);
        _this.saveEdit = _this.saveEdit.bind(_this);
        _this.cancelEdit = _this.cancelEdit.bind(_this);
        _this.fixEdit = _this.fixEdit.bind(_this);
        _this.moveContainer = _this.moveContainer.bind(_this);
        _this.deleteContainer = _this.deleteContainer.bind(_this);
        _this.updateControlCardName = _this.updateControlCardName.bind(_this);
        _this.updateControlPanelName = _this.updateControlPanelName.bind(_this);
        _this.modifyContainer = _this.modifyContainer.bind(_this);
        _this.modifyView = _this.modifyView.bind(_this);
        return _this;
    }
    ControlPanel.prototype.componentWillReceiveProps = function () {
        this.updateModelFromProps();
    };
    ControlPanel.prototype.shouldComponentUpdate = function (nextProps, nextState) {
        if (nextProps.autogen.data.length > 0) {
            return true;
        }
        else if (nextProps.deviceAddress !== this.props.deviceAddress) {
            return true;
        }
        else if (nextState.editable != this.state.editable) {
            return true;
        }
        return false;
    };
    ControlPanel.prototype.componentDidMount = function () {
        this.handleRequestUI();
        this.props.requestRTCEnable(this.props.deviceAddress);
        modelDataClient.callbacks.incomingMessageListener = this.handleMessage;
        modelDataClient.callbacks.incomingDataListener = this.receiveDataPackets;
        modelDataClient.startSession();
    };
    ControlPanel.prototype.componentWillUpdate = function () {
        if (this.props.autogen && modelData) {
            if (modelData != this.props.autogen.data) {
                this.updateModelFromProps();
            }
        }
        if (this.props.autogen != this.state.autogen) {
            this.setState({ autogen: this.props.autogen });
        }
    };
    ControlPanel.prototype.sendDataPackets = function (dataPackets) {
        modelDataClient.sendObject(dataPackets);
    };
    ControlPanel.prototype.receiveDataPackets = function (object) {
        this.updateModelData(object);
    };
    ControlPanel.prototype.handleRequestUI = function () {
        this.props.requestAutogenConfiguration(this.props.deviceAddress);
    };
    ControlPanel.prototype.handleMessage = function (text) {
        this.setState({
            notification: {
                level: "success",
                text: text
            }
        });
    };
    ControlPanel.prototype.setNotification = function (level, text) {
        this.setState({
            notification: {
                level: level,
                text: text
            }
        });
    };
    ControlPanel.prototype.render = function () {
        return (React.createElement("div", { className: "content" },
            React.createElement(NotificationWrapper_jsx_1.default, { pushText: this.state.notification.text, level: this.state.notification.level }),
            React.createElement(react_bootstrap_1.Container, { fluid: true },
                React.createElement(react_bootstrap_1.Row, null,
                    React.createElement(react_bootstrap_1.Modal.Dialog, null,
                        React.createElement(react_bootstrap_1.Modal.Header, null,
                            React.createElement(react_bootstrap_1.Modal.Title, { className: "float-left" }, "Controls"),
                            this.controlEditable(),
                            React.createElement("div", { className: "float-right" },
                                React.createElement(react_bootstrap_1.Button, { variant: "primary", className: "btn-simple btn-icon", onClick: this.handleRequestUI },
                                    React.createElement("i", { className: "fa fa-refresh large-icon" })))),
                        this.createControlPanel())))));
    };
    return ControlPanel;
}(React.Component));
exports.ControlPanel = ControlPanel;
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
var components = MapifyComponents_jsx_1.Components().components;
exports.default = react_redux_1.connect(function (state) { return state.openSpeechData; }, OpenSpeechDataStore.openSpeechDataActionCreators)(ControlPanel);
//# sourceMappingURL=ControlPanel.js.map