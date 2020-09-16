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
exports.ControlPanel = void 0;
var React = require("react");
var react_redux_1 = require("react-redux");
var OpenSpeechDataStore = require("../../Store/OpenSpeechToolsData");
var react_bootstrap_1 = require("react-bootstrap");
var NotificationWrapper_jsx_1 = require("../../Components/Notifications/NotificationWrapper.jsx");
var ControlCard_jsx_1 = require("../../Components/Autogen/Containers/ControlCard.jsx");
var ModelDataClient_1 = require("../../SignalR/ModelDataClient");
var MapifyComponents_jsx_1 = require("../../Components/Autogen/Inputs/Manager/MapifyComponents.jsx");
var PopupViewEditor_jsx_1 = require("../../Components/Autogen/Containers/PopupViewEditor.jsx");
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
                        mappedModelData = createDataSubsets(controls.props.autogen, controls.props.autogen.data);
                        return [2 /*return*/];
                    });
                });
            }
            function updateModel(controls) {
                return __awaiter(this, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        controls.setState({ autogenUpdateTrigger: !controls.state.autogenUpdateTrigger });
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
                                return [2 /*return*/];
                        }
                    });
                });
            }
            update(_this);
        };
        _this.updateModelData = function (dataPackets) {
            dataPackets.forEach(function (packet) {
                return (process(_this, packet, modelData));
            });
        };
        _this.handleInputCommand = function (command) {
            _this.updateModelData(command);
            if (!_this.props.isLoading) {
                if (modelDataClient.state.connected && _this.props.rtcEnabled) {
                    return (_this.sendDataPackets(command));
                }
                else {
                    return (_this.props.requestSendModelData(command, _this.props.deviceAddress));
                }
            }
            return (function () { });
        };
        _this.makeEditable = function () {
            _this.handleRequestUI();
            _this.setState({
                editable: true
            });
        };
        _this.cancelEdit = function () {
            _this.setState({ editable: false }); //Stop editing
            _this.handleRequestUI();
        };
        _this.saveEdit = function () {
            _this.setState({ editable: false });
            _this.props.requestSendAutogenConfiguration(_this.props.deviceAddress, _this.props.autogen, _this.handleRequestUI);
        };
        _this.fixEdit = function () {
            _this.setState({ editable: false });
            _this.props.requestSendAutogenConfiguration(_this.props.deviceAddress, MapifyComponents_jsx_1.GetAutogenObjectFromData(_this.props.autogen.data, _this.props.autogen.name), _this.handleRequestUI);
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
            mappedModelData = createDataSubsets(autogen, _this.props.autogen.data);
            _this.props.updateAutogenProps(autogen);
            _this.forceUpdate();
        };
        _this.removeViewFromContainer = function (containerIndex, viewIndex) {
            var autogen = _this.props.autogen;
            autogen.containers[containerIndex].views.splice(viewIndex, 1);
            mappedModelData = createDataSubsets(autogen, _this.props.autogen.data);
            _this.props.updateAutogenProps(autogen);
            _this.forceUpdate();
        };
        _this.modifyView = function (index, view) {
            var autogen = _this.props.autogen;
            autogen.views[index] = view;
            mappedModelData = createDataSubsets(autogen, _this.props.autogen.data);
            _this.props.updateAutogenProps(autogen);
            _this.forceUpdate();
        };
        _this.modifyOption = function (options, index) {
            var autogen = _this.props.autogen;
            if (autogen.options) {
                autogen.options[index] = options;
            }
            if (options === {}) {
                _this.removeOptions(index);
            }
            _this.props.updateAutogenProps(autogen);
            _this.forceUpdate();
        };
        _this.addOptions = function (options, viewIndex) {
            var autogen = _this.props.autogen;
            if (autogen.options) {
                if (autogen.views[viewIndex].optionsIndex) {
                    console.log("Editing view's existing options");
                    _this.modifyOption(options, autogen.views[viewIndex].optionsIndex);
                }
                else {
                    console.log("adding new options set to view.");
                    console.log("Options: " + JSON.stringify(options));
                    var optionsIndex = (autogen.options.push(options) - 1);
                    autogen.views[viewIndex].optionsIndex = optionsIndex;
                }
            }
            else {
                console.log("no options detected. Creating object!");
                autogen.options = [options];
                autogen.views[viewIndex].optionsIndex = 0;
            }
            _this.props.updateAutogenProps(autogen);
            _this.forceUpdate();
            if (autogen.views[viewIndex].optionsIndex) {
                if (autogen.options[autogen.views[viewIndex].optionsIndex])
                    console.log(JSON.stringify(autogen.options[autogen.views[viewIndex].optionsIndex]));
            }
        };
        _this.modifyContainer = function (index, container) {
            var autogen = _this.props.autogen;
            autogen.containers[index] = container;
            mappedModelData = createDataSubsets(autogen, _this.props.autogen.data);
            _this.props.updateAutogenProps(autogen);
            _this.forceUpdate();
        };
        _this.moveContainer = function (index, direction) {
            var autogen = _this.props.autogen;
            var currentContainer;
            //moving first element left(to end of array)
            if (direction < 1 && index === 0) {
                currentContainer = autogen.containers.shift();
                autogen.containers.push(currentContainer);
            }
            //moving last element right(to start of array)
            else if (direction > 0 && index === autogen.containers.length - 1) {
                currentContainer = autogen.containers.pop();
                autogen.containers.unshift(currentContainer);
            }
            //swapping indexed container with the component at the desired direction's index.
            else {
                currentContainer = autogen.containers[index];
                autogen.containers[index] = autogen.containers[index + direction];
                autogen.containers[index + direction] = currentContainer;
            }
            mappedModelData = createDataSubsets(autogen, _this.props.autogen.data);
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
        _this.startViewEditor = function (enabled, view, index, properties, component, functionalData, options, optionsIndex) {
            _this.setState({
                viewEditor: {
                    enabled: enabled,
                    view: view,
                    index: index,
                    properties: properties,
                    component: component,
                    functionalData: functionalData,
                    options: options,
                    optionsIndex: optionsIndex
                }
            });
            console.log("Starting View Editor. ");
            if (_this.state.viewEditor.optionsIndex) {
                console.log("Options Attached to Current View. View[" + index + "] -> options[" + optionsIndex + "] -> " + JSON.stringify(options));
            }
        };
        _this.closeViewEditor = function () {
            _this.setState({
                viewEditor: {
                    enabled: false,
                    view: _this.state.viewEditor.view,
                    index: _this.state.viewEditor.index,
                    properties: _this.state.viewEditor.properties,
                    component: _this.state.viewEditor.component,
                    functionalData: _this.state.viewEditor.functionalData,
                    options: _this.state.viewEditor.options,
                    optionsIndex: _this.state.viewEditor.optionsIndex
                }
            });
        };
        _this.state = {
            connected: false,
            editable: false,
            notification: {
                text: "",
                level: ""
            },
            autogen: _this.props.autogen,
            autogenUpdateTrigger: false,
            dataUpdateTrigger: false,
            dataIndexTrigger: -1,
            viewEditor: {
                enabled: false,
                view: null,
                index: -1,
                properties: null,
                component: null,
                functionalData: null,
                optionsIndex: null,
                options: null
            }
        };
        //ActionStore send-handlers.
        _this.handleRequestUI = _this.handleRequestUI.bind(_this);
        _this.handleInputCommand = _this.handleInputCommand.bind(_this);
        _this.setNotification = _this.setNotification.bind(_this);
        _this.sendDataPackets = _this.sendDataPackets.bind(_this);
        _this.updateModelData = _this.updateModelData.bind(_this);
        //Receipt Callback Functions
        _this.updateModelFromProps = _this.updateModelFromProps.bind(_this);
        _this.receiveDataPackets = _this.receiveDataPackets.bind(_this);
        _this.handleMessage = _this.handleMessage.bind(_this);
        //UI Control and population
        _this.setNotification = _this.setNotification.bind(_this);
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
        _this.modifyOption = _this.modifyOption.bind(_this);
        _this.addOptions = _this.addOptions.bind(_this);
        _this.startViewEditor = _this.startViewEditor.bind(_this);
        _this.closeViewEditor = _this.closeViewEditor.bind(_this);
        _this.moveContainer = _this.moveContainer.bind(_this);
        _this.removeViewFromContainer = _this.removeViewFromContainer.bind(_this);
        return _this;
    }
    ControlPanel.prototype.shouldComponentUpdate = function (nextProps, nextState) {
        if (nextProps.autogen.data && nextProps.autogen.data.length > 0) {
            return true;
        }
        else if (nextProps.deviceAddress !== this.props.deviceAddress) {
            return true;
        }
        else if (nextState.editable !== this.state.editable) {
            return true;
        }
        else {
            return false;
        }
    };
    ControlPanel.prototype.componentDidMount = function () {
        this.handleRequestUI();
        this.props.requestRTCEnable(this.props.deviceAddress);
        modelDataClient.callbacks.incomingMessageListener = this.handleMessage;
        modelDataClient.callbacks.incomingDataListener = this.receiveDataPackets;
        modelDataClient.startSession();
    };
    ControlPanel.prototype.componentWillUpdate = function () {
        if (this.props.autogen !== this.state.autogen) {
            if (this.props.autogen.data !== modelData) {
                this.updateModelFromProps();
            }
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
    ControlPanel.prototype.removeOptions = function (optionsIndex) {
        var autogen = this.props.autogen;
        if (autogen.options) {
            autogen.options.splice(optionsIndex, 1);
        }
        this.props.updateAutogenProps(autogen);
        this.forceUpdate();
    };
    ControlPanel.prototype.createControlPanel = function () {
        var _this = this;
        if (mappedModelData.length < 1) {
            mappedModelData = createDataSubsets(this.props.autogen, this.props.autogen.data);
        }
        else if (this.props.autogen !== this.state.autogen) {
            mappedModelData = createDataSubsets(this.props.autogen, this.props.autogen.data);
        }
        var effectName = this.props.autogen.name ? this.props.autogen.name : "";
        effectName = (effectName === "ERROR") ? "" : effectName;
        return (React.createElement("div", { className: "autogen autogen-effectContainer modal-body" },
            this.controlPanelHeaderTitleControl(effectName),
            React.createElement(react_bootstrap_1.Row, { className: "autogen-pages row" }, this.props.autogen.containers.map(function (container, index) {
                return React.createElement(React.Fragment, { key: "container-" + index },
                    React.createElement(ControlCard_jsx_1.default, { indexTrigger: _this.state.dataIndexTrigger, references: container.views, title: container.name, views: _this.props.autogen.views, options: _this.props.autogen.options, data: mappedModelData[index], callback: _this.handleInputCommand, editable: _this.state.editable, moveLeft: _this.moveContainer, moveRight: _this.moveContainer, delete: _this.deleteContainer, updateTitle: _this.updateControlCardName, index: index, updateContainer: _this.modifyContainer, components: components, startViewEditor: _this.startViewEditor }));
            })),
            React.createElement(PopupViewEditor_jsx_1.PopupViewEditor, { viewProps: this.state.viewEditor.properties, data: modelData, functionalData: this.state.viewEditor.functionalData, show: this.state.viewEditor.enabled, index: this.state.viewEditor.index, view: this.state.viewEditor.view, updateView: this.modifyView, component: this.state.viewEditor.component, handleClose: this.closeViewEditor, updateOptions: this.modifyOption, addOptions: this.addOptions, options: this.state.viewEditor.options, componentLibs: components })));
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
//Local copy of the model data for editing/displaying purposes. (strip from whole autogen)
var modelData = [];
//1:1 Index map of each container -> views -> data.
var mappedModelData = [];
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
            controls.setState({ dataUpdateTrigger: !controls.state.dataUpdateTrigger });
            return [2 /*return*/];
        });
    });
}
function updateSpecific(controls, index) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            controls.setState({ dataIndexTrigger: index });
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
                    return [4 /*yield*/, updateDataSubsetValues(packet, mappedModelData)];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, updateSpecific(controls, packet.index)];
                case 3:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
function createDataSubsets(autogen, modelData) {
    var map = [];
    autogen.containers.forEach(function (container) {
        var subset = { indices: [], views: [] }; //assign a data subset for each container.
        container.views.forEach(function (viewIndex) {
            var viewData = { indices: [], data: [] }; //Assign empty data array for each view.
            autogen.views[viewIndex].references.forEach(function (dataIndex) {
                var currentData = { index: dataIndex, packet: modelData[dataIndex] };
                viewData.data.push(currentData);
                viewData.indices.push(dataIndex);
                subset.indices.push(dataIndex);
            });
            subset.views.push(viewData);
        });
        map.push(subset);
    });
    return map;
}
function updateDataSubsetValues(packet, map) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            map.forEach(function (subset) {
                if (subset.indices.includes(packet.index)) {
                    subset.views.forEach(function (view) {
                        if (view.indices.includes(packet.index)) {
                            view.data.forEach(function (data) {
                                if (data.index === packet.index) {
                                    data.packet.value = packet.value;
                                }
                            });
                        }
                    });
                }
            });
            return [2 /*return*/];
        });
    });
}
var components = MapifyComponents_jsx_1.Components().components;
exports.default = react_redux_1.connect(function (state) { return state.openSpeechData; }, OpenSpeechDataStore.openSpeechDataActionCreators)(ControlPanel);
//# sourceMappingURL=ControlPanel.js.map