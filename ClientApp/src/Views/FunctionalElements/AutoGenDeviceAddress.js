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
exports.AddressManager = void 0;
var React = __importStar(require("react"));
var react_redux_1 = require("react-redux");
var OpenSpeechDataStore = __importStar(require("../../Store/OpenSpeechToolsData"));
var react_bootstrap_1 = require("react-bootstrap");
var NotificationWrapper_jsx_1 = __importDefault(require("../../Components/Notifications/NotificationWrapper.jsx"));
var AddressManager = /** @class */ (function (_super) {
    __extends(AddressManager, _super);
    function AddressManager(props) {
        var _this = _super.call(this, props) || this;
        _this.state = {
            notification: {
                text: "",
                level: ""
            }
        };
        _this.handleDeviceAddressChange = _this.handleDeviceAddressChange.bind(_this);
        _this.handleChangeIP1 = _this.handleChangeIP1.bind(_this);
        _this.handleChangeIP2 = _this.handleChangeIP2.bind(_this);
        _this.handleChangeIP3 = _this.handleChangeIP3.bind(_this);
        _this.handleChangeIP4 = _this.handleChangeIP4.bind(_this);
        _this.handleChangePort = _this.handleChangePort.bind(_this);
        _this.setNotification = _this.setNotification.bind(_this);
        return _this;
    }
    AddressManager.prototype.componentDidMount = function () {
    };
    AddressManager.prototype.componentDidUpdate = function () {
    };
    AddressManager.prototype.handleChangeIP1 = function (e) {
        this.handleDeviceAddressChange(e, 'ip1');
    };
    AddressManager.prototype.handleChangeIP2 = function (e) {
        this.handleDeviceAddressChange(e, 'ip2');
    };
    AddressManager.prototype.handleChangeIP3 = function (e) {
        this.handleDeviceAddressChange(e, 'ip3');
    };
    AddressManager.prototype.handleChangeIP4 = function (e) {
        this.handleDeviceAddressChange(e, 'ip4');
    };
    AddressManager.prototype.handleChangePort = function (e) {
        this.handleDeviceAddressChange(e, 'port');
    };
    AddressManager.prototype.handleDeviceAddressChange = function (e, key) {
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
    AddressManager.prototype.setNotification = function (level, text) {
        this.setState({
            notification: {
                level: level,
                text: text
            }
        });
    };
    AddressManager.prototype.render = function () {
        return (<div className="content">
        <NotificationWrapper_jsx_1.default pushText={this.state.notification.text} level={this.state.notification.level}/>
        <react_bootstrap_1.Container fluid>
          <react_bootstrap_1.Row>
            <react_bootstrap_1.Modal.Dialog>
              <react_bootstrap_1.Modal.Header>
                <react_bootstrap_1.Modal.Title>Connection</react_bootstrap_1.Modal.Title>
              </react_bootstrap_1.Modal.Header>
              <react_bootstrap_1.Col lg={12} md={12} sm={12}>
              <react_bootstrap_1.InputGroup className="mb-2">
                <react_bootstrap_1.InputGroup.Prepend>
                <react_bootstrap_1.InputGroup.Text id="inputGroup-sizing-default">IP</react_bootstrap_1.InputGroup.Text>
                </react_bootstrap_1.InputGroup.Prepend>
                <react_bootstrap_1.FormControl name="ip1" defaultValue={this.props.deviceAddress.ipAddress.ip1} onChange={this.handleChangeIP1} aria-label="IP1" aria-describedby="inputGroup-sizing-default"/>
                <react_bootstrap_1.FormControl name="ip2" defaultValue={this.props.deviceAddress.ipAddress.ip2} onChange={this.handleChangeIP2} aria-label="IP2" aria-describedby="inputGroup-sizing-default"/>
                <react_bootstrap_1.FormControl name="ip3" defaultValue={this.props.deviceAddress.ipAddress.ip3} onChange={this.handleChangeIP3} aria-label="IP3" aria-describedby="inputGroup-sizing-default"/>
                <react_bootstrap_1.FormControl name="ip4" defaultValue={this.props.deviceAddress.ipAddress.ip4} onChange={this.handleChangeIP4} aria-label="IP4" aria-describedby="inputGroup-sizing-default"/>
              </react_bootstrap_1.InputGroup>
              </react_bootstrap_1.Col>
              <react_bootstrap_1.Col lg={12} md={12} sm={12}>
              <react_bootstrap_1.InputGroup className="mb-3">
                <react_bootstrap_1.InputGroup.Prepend>
                  <react_bootstrap_1.InputGroup.Text id="inputGroup-sizing-default">Port</react_bootstrap_1.InputGroup.Text>
                </react_bootstrap_1.InputGroup.Prepend>
                <react_bootstrap_1.FormControl name="port" defaultValue={this.props.deviceAddress.port} onChange={this.handleChangePort} aria-label="Port" aria-describedby="inputGroup-sizing-default"/>
              </react_bootstrap_1.InputGroup>
              </react_bootstrap_1.Col>
              </react_bootstrap_1.Modal.Dialog>
          </react_bootstrap_1.Row>
        </react_bootstrap_1.Container>
      </div>);
    };
    return AddressManager;
}(React.PureComponent));
exports.AddressManager = AddressManager;
exports.default = react_redux_1.connect(function (state) { return state.openSpeechData; }, OpenSpeechDataStore.openSpeechDataActionCreators)(AddressManager);
