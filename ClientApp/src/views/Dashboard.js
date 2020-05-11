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
var OpenSpeechDataStore = require("../store/OpenSpeechToolsData");
var react_bootstrap_1 = require("react-bootstrap");
var StatsCard_jsx_1 = require("../components/StatsCard/StatsCard.jsx");
var EffectPageDiv_jsx_1 = require("../components/Autogen/Containers/EffectPageDiv.jsx");
var Dashboard = /** @class */ (function (_super) {
    __extends(Dashboard, _super);
    function Dashboard(props) {
        var _this = _super.call(this, props) || this;
        _this.state = {
            ipAddress: '192168001002',
            port: '3355'
        };
        _this.handleIPChange = _this.handleIPChange.bind(_this);
        _this.handlePortChange = _this.handlePortChange.bind(_this);
        _this.handleRequestUI = _this.handleRequestUI.bind(_this);
        return _this;
    }
    Dashboard.prototype.componentDidMount = function () {
        this.props.requestOpenSpeechS3Demos();
    };
    Dashboard.prototype.handleIPChange = function (e) {
        // No longer need to cast to any - hooray for react!
        this.setState({ ipAddress: e.target.value });
    };
    Dashboard.prototype.handlePortChange = function (e) {
        // No longer need to cast to any - hooray for react!
        this.setState({ port: e.target.value });
    };
    Dashboard.prototype.handleRequestUI = function () {
        this.props.requestOpenSpeechUI(this.state.ipAddress, this.state.port);
    };
    Dashboard.prototype.render = function () {
        return (React.createElement("div", { className: "content" },
            React.createElement(react_bootstrap_1.Container, { fluid: true },
                React.createElement(react_bootstrap_1.Row, null,
                    React.createElement(react_bootstrap_1.Col, { lg: 4, md: 4 },
                        React.createElement(react_bootstrap_1.InputGroup, { className: "mb-3" },
                            React.createElement(react_bootstrap_1.InputGroup.Prepend, null,
                                React.createElement(react_bootstrap_1.InputGroup.Text, { id: "inputGroup-sizing-default" }, "IP")),
                            React.createElement(react_bootstrap_1.FormControl, { name: "ip", defaultValue: this.state.ipAddress, onChange: this.handleIPChange, "aria-label": "IP", "aria-describedby": "inputGroup-sizing-default" }))),
                    React.createElement(react_bootstrap_1.Col, { lg: 2, md: 2 },
                        React.createElement(react_bootstrap_1.InputGroup, { className: "mb-3" },
                            React.createElement(react_bootstrap_1.InputGroup.Prepend, null,
                                React.createElement(react_bootstrap_1.InputGroup.Text, { id: "inputGroup-sizing-default" }, "Port")),
                            React.createElement(react_bootstrap_1.FormControl, { name: "port", defaultValue: this.state.port, onChange: this.handlePortChange, "aria-label": "Port", "aria-describedby": "inputGroup-sizing-default" })))),
                React.createElement("h1", null, "Available Demos"),
                React.createElement(react_bootstrap_1.Row, null, this.props.availableDemos.map(function (d) {
                    return React.createElement(React.Fragment, { key: d.name },
                        React.createElement(StatsCard_jsx_1.StatsCard, { statsText: d.name, statsValue: (d.filesize / 1000000).toFixed(2) + "MB", statsIcon: React.createElement("i", { className: "fa fa-folder-o" }), statsIconText: d.downloadurl }));
                })),
                React.createElement("div", null,
                    React.createElement("h1", null, "Auto-gen"),
                    React.createElement(react_bootstrap_1.Button, { variant: "primary", onClick: this.handleRequestUI },
                        "Auto-gen from ",
                        this.state.ipAddress,
                        ":",
                        this.state.port)),
                React.createElement("div", { className: "autogen autogen-effectContainer" },
                    React.createElement("h1", null, "Autogen Effect: " + this.props.uiConfig.module),
                    this.props.uiConfig.pages.map(function (page) {
                        return React.createElement(React.Fragment, { key: page.name },
                            React.createElement("div", { className: page.name },
                                React.createElement("h1", null, "Page: " + page.name),
                                React.createElement(EffectPageDiv_jsx_1.EffectPageDiv, { page: page })));
                    })))));
    };
    return Dashboard;
}(React.PureComponent));
exports.default = react_redux_1.connect(function (state) { return state.openSpeechData; }, OpenSpeechDataStore.openSpeechDataActionCreators)(Dashboard);
//# sourceMappingURL=Dashboard.js.map