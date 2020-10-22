"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SandboxView = void 0;
var React = __importStar(require("react"));
var react_redux_1 = require("react-redux");
var OpenSpeechDataStore = __importStar(require("../Store/OpenSpeechToolsData"));
var react_bootstrap_1 = require("react-bootstrap");
var MapifyComponents_jsx_1 = __importDefault(require("../Components/Autogen/Inputs/Manager/MapifyComponents.jsx"));
var SandboxView = /** @class */ (function (_super) {
    __extends(SandboxView, _super);
    function SandboxView(props) {
        var _this = _super.call(this, props) || this;
        _this.getComponents = function () {
            if (_this.props.autogen) {
                return (<MapifyComponents_jsx_1.default data={_this.props.autogen.data} name={_this.props.autogen.name}>
        </MapifyComponents_jsx_1.default>);
            }
            else {
                return (<div>No Autogen</div>);
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
        return (<div className="content">
        <react_bootstrap_1.Container fluid>
          <react_bootstrap_1.Row>
            <react_bootstrap_1.Modal.Dialog>
              <react_bootstrap_1.Modal.Header>
                <react_bootstrap_1.Modal.Title className="float-left">
                  Session
                </react_bootstrap_1.Modal.Title>
              </react_bootstrap_1.Modal.Header>
              <react_bootstrap_1.Row>
                <h4 className="centered-header"></h4>
              </react_bootstrap_1.Row>
            </react_bootstrap_1.Modal.Dialog>
          </react_bootstrap_1.Row>
          <react_bootstrap_1.Row>{this.getComponents()}</react_bootstrap_1.Row>
        </react_bootstrap_1.Container>
      </div>);
    }; //End Render
    return SandboxView;
}(React.Component));
exports.SandboxView = SandboxView;
exports.default = react_redux_1.connect(function (state) { return state.openSpeechData; }, OpenSpeechDataStore.openSpeechDataActionCreators)(SandboxView);
