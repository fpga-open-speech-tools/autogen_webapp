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
exports.SandboxView = void 0;
var React = require("react");
var react_redux_1 = require("react-redux");
var OpenSpeechDataStore = require("../Store/OpenSpeechToolsData");
var react_bootstrap_1 = require("react-bootstrap");
var MapifyComponents_jsx_1 = require("../Components/Autogen/Inputs/Manager/MapifyComponents.jsx");
var SandboxView = /** @class */ (function (_super) {
    __extends(SandboxView, _super);
    function SandboxView(props) {
        var _this = _super.call(this, props) || this;
        _this.getComponents = function () {
            if (_this.props.autogen) {
                return (React.createElement(MapifyComponents_jsx_1.default, { data: _this.props.autogen.data, name: _this.props.autogen.name }));
            }
            else {
                return (React.createElement("div", null, "No Autogen"));
            }
        };
        _this.handleRequestUI = _this.handleRequestUI.bind(_this);
        _this.getComponents = _this.getComponents.bind(_this);
        return _this;
    } //End Constructor 
    SandboxView.prototype.componentDidMount = function () {
        this.handleRequestUI();
    }; // End ComponentDidMount
    SandboxView.prototype.handleRequestUI = function () {
        this.props.requestAutogenConfiguration(this.props.deviceAddress);
    };
    SandboxView.prototype.render = function () {
        return (React.createElement("div", { className: "content" },
            React.createElement(react_bootstrap_1.Container, { fluid: true },
                React.createElement(react_bootstrap_1.Row, null,
                    React.createElement(react_bootstrap_1.Modal.Dialog, null,
                        React.createElement(react_bootstrap_1.Modal.Header, null,
                            React.createElement(react_bootstrap_1.Modal.Title, { className: "float-left" }, "Session")),
                        React.createElement(react_bootstrap_1.Row, null,
                            React.createElement("h4", { className: "centered-header" })))),
                React.createElement(react_bootstrap_1.Row, null, this.getComponents()))));
    }; //End Render
    return SandboxView;
}(React.Component));
exports.SandboxView = SandboxView;
exports.default = react_redux_1.connect(function (state) { return state.openSpeechData; }, OpenSpeechDataStore.openSpeechDataActionCreators)(SandboxView);
//# sourceMappingURL=Sandbox-View.js.map