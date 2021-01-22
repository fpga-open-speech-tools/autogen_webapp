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
exports.reducers = void 0;
require("bootstrap/dist/css/bootstrap.min.css");
require("./assets/css/input-moment.min.css");
require("./assets/sass/light-bootstrap-dashboard-react.scss?v=1.3.0");
require("./assets/css/pe-icon-7-stroke.css");
var react_redux_1 = require("react-redux");
var React = __importStar(require("react"));
var ReactDOM = __importStar(require("react-dom"));
var react_router_dom_1 = require("react-router-dom");
var history_1 = require("history");
var configureStore_1 = __importDefault(require("./Store/configureStore"));
var registerServiceWorker_1 = __importDefault(require("./registerServiceWorker"));
var Tools_jsx_1 = __importDefault(require("./Layouts/Tools.jsx"));
var Auto_Gen_View_1 = __importDefault(require("./Views/Auto-Gen-View"));
var OpenSpeechData = __importStar(require("./Store/OpenSpeechToolsData"));
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
ReactDOM.render(<react_redux_1.Provider store={store}>
  <react_router_dom_1.BrowserRouter>
    <react_router_dom_1.Switch>
      <react_router_dom_1.Route path="/tools" render={function (props) { return <Tools_jsx_1.default {...props}/>; }}/>
      <react_router_dom_1.Redirect from="/" to="/tools/auto-gen"/>
      <react_router_dom_1.Route path="/tools/auto-gen" component={Auto_Gen_View_1.default}/>
    </react_router_dom_1.Switch>
    </react_router_dom_1.BrowserRouter>
   </react_redux_1.Provider>, document.getElementById('root'));
registerServiceWorker_1.default();
