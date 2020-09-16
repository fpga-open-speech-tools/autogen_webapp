import React, { Component } from "react";
import { GetCompatibleViews } from "../Inputs/Manager/MapifyComponents";
import {ListGroup} from "react-bootstrap";


//Props: currentComponent, currentVariant, data, options, updateCallback
export class ViewSelector extends Component {
  constructor(props) {
    super(props);
    this.state = {
      views: [], //Here, view takes the form: {component:string, variant:string} 
      currentView: {
        component: "No-Component",
        variant: "No-Variant"
      }
    }
    this.components = null;
  }

  componentDidMount() {
    if (this.props.data) {
      this.components = this.props.componentLibs;
      this.setState({
        views: GetCompatibleViews(this.props.data, this.props.options)
      })
    }
    if (this.props.currentComponent && this.props.currentVariant) {
      this.setState({
        currentView: {
          component: this.props.currentComponent,
          variant: this.props.currentVariant
        }
      });
    }
  } //ComponentDidMount()



  handleUpdateView = (component,variant) => {
    this.props.updateCallback(component,variant);
  }//HandleUpdateView(component, variant)


  render = () => {
    console.log("Default Active Key: " + this.state.currentView.component);
    if (this.props.data) {//&& this.props.options) {
      return (
        <div>
          <ListGroup defaultActiveKey={this.props.currentComponent}>
            {this.state.views.map((view, index) => {
              return (
                <ListGroup.Item
                  eventKey={view.component}
                  key={"c-" + view.component + "i-" + index}
                  onClick={() => {
                    var currentComp = view.component;
                    var currentVar = view.variant;
                    this.handleUpdateView(currentComp, currentVar);
                  }}
                >
                  {view.component}
                </ListGroup.Item>);
            })}
          </ListGroup>
        </div>
      );
    }
    else {
      return (
          <div>Invalid Properties</div>
        );
    }
  }
}

export default ViewSelector;