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
        return (React.createElement("div", { className: "content" },
            React.createElement(NotificationWrapper_jsx_1.default, { pushText: this.state.notification.text, level: this.state.notification.level }),
            React.createElement(react_bootstrap_1.Container, { fluid: true },
                React.createElement(react_bootstrap_1.Row, null,
                    React.createElement(react_bootstrap_1.Modal.Dialog, null,
                        React.createElement(react_bootstrap_1.Modal.Header, null,
                            React.createElement(react_bootstrap_1.Modal.Title, null, "Connection")),
                        React.createElement(react_bootstrap_1.Col, { lg: 12, md: 12, sm: 12 },
                            React.createElement(react_bootstrap_1.InputGroup, { className: "mb-2" },
                                React.createElement(react_bootstrap_1.InputGroup.Prepend, null,
                                    React.createElement(react_bootstrap_1.InputGroup.Text, { id: "inputGroup-sizing-default" }, "IP")),
                                React.createElement(react_bootstrap_1.FormControl, { name: "ip1", defaultValue: this.props.deviceAddress.ipAddress.ip1, onChange: this.handleChangeIP1, "aria-label": "IP1", "aria-describedby": "inputGroup-sizing-default" }),
                                React.createElement(react_bootstrap_1.FormControl, { name: "ip2", defaultValue: this.props.deviceAddress.ipAddress.ip2, onChange: this.handleChangeIP2, "aria-label": "IP2", "aria-describedby": "inputGroup-sizing-default" }),
                                React.createElement(react_bootstrap_1.FormControl, { name: "ip3", defaultValue: this.props.deviceAddress.ipAddress.ip3, onChange: this.handleChangeIP3, "aria-label": "IP3", "aria-describedby": "inputGroup-sizing-default" }),
                                React.createElement(react_bootstrap_1.FormControl, { name: "ip4", defaultValue: this.props.deviceAddress.ipAddress.ip4, onChange: this.handleChangeIP4, "aria-label": "IP4", "aria-describedby": "inputGroup-sizing-default" }))),
                        React.createElement(react_bootstrap_1.Col, { lg: 12, md: 12, sm: 12 },
                            React.createElement(react_bootstrap_1.InputGroup, { className: "mb-3" },
                                React.createElement(react_bootstrap_1.InputGroup.Prepend, null,
                                    React.createElement(react_bootstrap_1.InputGroup.Text, { id: "inputGroup-sizing-default" }, "Port")),
                                React.createElement(react_bootstrap_1.FormControl, { name: "port", defaultValue: this.props.deviceAddress.port, onChange: this.handleChangePort, "aria-label": "Port", "aria-describedby": "inputGroup-sizing-default" }))))))));
    };
    return AddressManager;
}(React.PureComponent));
exports.AddressManager = AddressManager;
exports.default = react_redux_1.connect(function (state) { return state.openSpeechData; }, OpenSpeechDataStore.openSpeechDataActionCreators)(AddressManager);
//# sourceMappingURL=AutoGenDeviceAddress.js.map