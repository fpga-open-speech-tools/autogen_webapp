
//React Imports
import React, { Component } from "react";
import { Route, Switch } from "react-router-dom";

//Custom JS Imports
import OpenSpeechNavbar from "../Components/Navbars/OpenSpeechNavbar.jsx";
import routes from "../routes.js";


class Tools extends Component {

  getRoutes = routes => {
    return routes.map((prop, key) => {
      if (prop.layout === "/tools") {
        return (
          <Route
            path={prop.layout + prop.path}
            render={props => (
              <prop.component
                {...props}
                handleClick={this.handleNotificationClick}
              />
            )}
            key={key}
          />
        );
      } else {
        return null;
      }
    });
  };


  componentDidUpdate(e) {
    if (e.history.action === "PUSH") {

      document.documentElement.scrollTop = 0;
      document.scrollingElement.scrollTop = 0;

      this.refs.mainPanel.scrollTop = 0;
    }
  }


  render() {
    return (
      <div className="wrapper">
        <div id="main-panel" className="main-panel" ref="mainPanel">
          <OpenSpeechNavbar {...this.props} />
          <Switch>{this.getRoutes(routes)}</Switch>
        </div>
      </div>
    );
  }
}

export default Tools;
