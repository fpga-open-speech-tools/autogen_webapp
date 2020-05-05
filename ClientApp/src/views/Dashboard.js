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
/*!

=========================================================
* Light Bootstrap Dashboard React - v1.3.0
=========================================================

* Product Page: https://www.creative-tim.com/product/light-bootstrap-dashboard-react
* Copyright 2019 Creative Tim (https://www.creative-tim.com)
* Licensed under MIT (https://github.com/creativetimofficial/light-bootstrap-dashboard-react/blob/master/LICENSE.md)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
var React = require("react");
var react_redux_1 = require("react-redux");
var OpenSpeechDataStore = require("../store/OpenSpeechToolsData");
var react_bootstrap_1 = require("react-bootstrap");
var StatsCard_jsx_1 = require("../components/StatsCard/StatsCard.jsx");
var EffectDiv_jsx_1 = require("../components/Autogen/Containers/EffectDiv.jsx");
var Dashboard = /** @class */ (function (_super) {
    __extends(Dashboard, _super);
    function Dashboard() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Dashboard.prototype.componentDidMount = function () {
        this.props.requestOpenSpeechS3Demos();
    };
    Dashboard.prototype.render = function () {
        return (React.createElement("div", { className: "content" },
            React.createElement(react_bootstrap_1.Container, { fluid: true },
                React.createElement(react_bootstrap_1.Row, null, this.props.availableDemos.map(function (demo) {
                    return React.createElement(StatsCard_jsx_1.StatsCard, { bigIcon: React.createElement("i", { className: "pe-7s-search text-primary" }), statsText: "Passthrough", statsValue: demo.name, statsIcon: React.createElement("i", { className: "fa fa-clock-o" }), statsIconText: "DE10-Nano/Passthrough" });
                })),
                React.createElement(react_bootstrap_1.Form, null,
                    React.createElement(react_bootstrap_1.Row, null,
                        React.createElement(react_bootstrap_1.Col, { lg: 3 },
                            React.createElement(react_bootstrap_1.Form.Group, { controlId: "ipAddress" },
                                React.createElement(react_bootstrap_1.Form.Label, null, "IP Address"),
                                React.createElement(react_bootstrap_1.Form.Control, { placeholder: "192.168.0.1" }))),
                        React.createElement(react_bootstrap_1.Col, { lg: 3 },
                            React.createElement(react_bootstrap_1.Form.Group, { controlId: "port" },
                                React.createElement(react_bootstrap_1.Form.Label, null, "Port"),
                                React.createElement(react_bootstrap_1.Form.Control, { placeholder: "5050" }))),
                        React.createElement(react_bootstrap_1.Col, { lg: 3 },
                            React.createElement(react_bootstrap_1.Button, { variant: "primary" }, "Auto-gen"))),
                    React.createElement(react_bootstrap_1.Row, null,
                        React.createElement(EffectDiv_jsx_1.EffectDiv, { panel: this.props.testPanel }))))));
    };
    return Dashboard;
}(React.PureComponent));
exports.default = react_redux_1.connect(function (state) { return state.openSpeechData; }, OpenSpeechDataStore.openSpeechDataActionCreators)(Dashboard);
//# sourceMappingURL=Dashboard.js.map