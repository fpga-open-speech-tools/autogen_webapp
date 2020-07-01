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
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
var react_redux_1 = require("react-redux");
var OpenSpeechDataStore = require("../Store/OpenSpeechToolsData");
var AutoGenControls_1 = require("./FunctionalElements/AutoGenControls");
var AutoGenDemos_1 = require("./FunctionalElements/AutoGenDemos");
var AutoGenDeviceAddress_1 = require("./FunctionalElements/AutoGenDeviceAddress");
var AutogenView = /** @class */ (function (_super) {
    __extends(AutogenView, _super);
    function AutogenView(props) {
        return _super.call(this, props) || this;
    }
    AutogenView.prototype.render = function () {
        return (React.createElement("div", null,
            React.createElement(AutoGenDeviceAddress_1.AddressManager, __assign({}, this.props)),
            React.createElement(AutoGenDemos_1.AvailableDemos, __assign({}, this.props)),
            React.createElement(AutoGenControls_1.AutoGenControls, __assign({}, this.props))));
    };
    return AutogenView;
}(React.PureComponent));
exports.default = react_redux_1.connect(function (state) { return state.openSpeechData; }, OpenSpeechDataStore.openSpeechDataActionCreators)(AutogenView);
//# sourceMappingURL=Auto-Gen-View.js.map