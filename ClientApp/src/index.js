"use strict";
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
require("bootstrap/dist/css/bootstrap.min.css");
require("./assets/css/input-moment.min.css");
require("./assets/sass/light-bootstrap-dashboard-react.scss?v=1.3.0");
require("./assets/css/pe-icon-7-stroke.css");
var react_redux_1 = require("react-redux");
var React = require("react");
var ReactDOM = require("react-dom");
var react_router_dom_1 = require("react-router-dom");
var history_1 = require("history");
var configureStore_1 = require("./store/configureStore");
var registerServiceWorker_1 = require("./registerServiceWorker");
var Admin_jsx_1 = require("./layouts/Admin.jsx");
var Dashboard_1 = require("./views/Dashboard");
var OpenSpeechData = require("./store/OpenSpeechToolsData");
require("bootstrap");
require("react-bootstrap");
// Whenever an action is dispatched, Redux will update each top-level application state property using
// the reducer with the matching name. It's important that the names match exactly, and that the reducer
// acts on the corresponding ApplicationState property type.
exports.reducers = {
    openSpeechData: OpenSpeechData.reducer
};
// Create browser history to use in the Redux store
var baseUrl = document.getElementsByTagName('base')[0].getAttribute('href');
var history = history_1.createBrowserHistory({ basename: baseUrl });
// Get the application-wide store instance, prepopulating with state from the server where available.
var store = configureStore_1.default(history);
ReactDOM.render(React.createElement(react_redux_1.Provider, { store: store },
    React.createElement(react_router_dom_1.BrowserRouter, null,
        React.createElement(react_router_dom_1.Switch, null,
            React.createElement(react_router_dom_1.Route, { path: "/admin", render: function (props) { return React.createElement(Admin_jsx_1.default, __assign({}, props)); } }),
            React.createElement(react_router_dom_1.Redirect, { from: "/", to: "/admin/dashboard" }),
            React.createElement(react_router_dom_1.Route, { path: "/admin/dashboard", component: Dashboard_1.default })))), document.getElementById('root'));
registerServiceWorker_1.default();
//# sourceMappingURL=index.js.map