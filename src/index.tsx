import "bootstrap/dist/css/bootstrap.min.css";
import "./assets/css/input-moment.min.css";
import "./assets/sass/light-bootstrap-dashboard-react.scss?v=1.3.0";
import "./assets/css/pe-icon-7-stroke.css";

import { Provider } from 'react-redux';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";
import { createBrowserHistory } from 'history';
import configureStore from './Store/configureStore';
import registerServiceWorker from './registerServiceWorker';
import AdminLayout from "./Layouts/Tools.jsx";
import AutoGen from './Views/Auto-Gen-View';
import * as OpenSpeechData from './Store/OpenSpeechToolsData';
import 'bootstrap';
import 'react-bootstrap';


// The top-level state object
export interface ApplicationState {
  openSpeechData: OpenSpeechData.OpenSpeechToolsState | undefined;
}

// Whenever an action is dispatched, Redux will update each top-level application state property using
// the reducer with the matching name. It's important that the names match exactly, and that the reducer
// acts on the corresponding ApplicationState property type.
export const reducers = {
  openSpeechData: OpenSpeechData.reducer
};

// This type can be used as a hint on action creators so that its 'dispatch' and 'getState' params are
// correctly typed to match your store.
export interface AppThunkAction<TAction> {
  (dispatch: (action: TAction) => void, getState: () => ApplicationState): void;
}
// Create browser history to use in the Redux store
const baseUrl = document.getElementsByTagName('base')[0].getAttribute('href') as string;
const history = createBrowserHistory({ basename: baseUrl });

// Get the application-wide store instance, prepopulating with state from the server where available.
const store = configureStore(history);

ReactDOM.render(
  <Provider store={store}>
  <BrowserRouter>
    <Switch>
      <Route path="/tools" render={props => <AdminLayout {...props} />} />
      <Redirect from="/" to="/tools/auto-gen" />
      <Route path="/tools/auto-gen" component={AutoGen}/>
    </Switch>
    </BrowserRouter>
   </Provider>, 
      document.getElementById('root'));
  
  registerServiceWorker();
