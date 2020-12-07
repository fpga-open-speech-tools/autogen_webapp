import React, { Component } from "react";
import { Button, Form, Table } from "react-bootstrap";

export class ControlCard extends Component {

  shouldComponentUpdate(nextProps) {
    if (this.props.data.indices.includes(nextProps.indexTrigger)) {
      return true;
    }
    else if (this.props.editable) {
      return true;
    }
    else if (nextProps.title !== this.props.title) {
      return true;
    }
    else if (nextProps.references !== this.props.references) {
      return true;
    }
    else if (nextProps.views !== this.props.views) {
      return true;
    }
    else if (nextProps.components !== this.props.components) {
      return true;
    }
    else {
      return false;
    }
  }

  render() {
    return (
      <div className={"autogen + autogen-panel card"}>
        <div className="open-speech-header open-speech-header-std open-speech-accent-color">
          <EditTitle
            title={this.props.title}
            index={this.props.index}
            updateTitle={this.props.updateTitle}
            editable={this.props.editable}
          />
          <EditPanel
            editable={this.props.editable}
            moveLeft={this.props.moveLeft}
            moveRight={this.props.moveRight}
            delete={this.props.delete}
            index={this.props.index}
          />
        </div>
        <div className={"content" + " autogen" + " autogen-panel"}>
          {this.props.references.map((reference,index) =>
            <React.Fragment key={"r-"+ reference + "i-" +index}>
              <div className="autogen autogen-control">
                <InputComponent
                  view={this.props.views[reference]}
                  data={this.props.data.views[index]}
                  callback={this.props.callback}
                  indexTrigger={this.props.indexTrigger}
                  editing={getEditInputComponentState(reference)}
                  options={this.props.options}
                />
                <EditViewButton
                  editable={this.props.editable}
                  view={this.props.views[reference]}
                  viewIndex={reference}
                  components={this.props.components}
                  data={this.props.data.views[index]}
                  setTargetView={this.props.startViewEditor}
                  options={this.props.options}
                />
                <EditContainerViews
                  editable={this.props.editable}
                  updateContainer={this.props.updateContainer}
                  viewReferenceIndex={index}
                  title={this.props.title}
                  viewReferences={this.props.references}
                  containerIndex={this.props.index}
                />
              </div>
            </React.Fragment>
          )}
          <div className="footer">
          </div>
        </div>
      </div>
    );
  }
}

const FetchViewComponentProps = (view, components) => {
  var match = components[0];
  components.forEach((component) => {
    if (component.name === view.type.component) {
      match = component;
    }
  });
  return match;
}

var editReference = -1;
const getEditInputComponentState = (index) => {
  if (index === editReference) {
    return true;
  }
  else {
    return false;
  }
}

var EditViewButton = (props) => {

  var options = null;
  var optionsIndex = null;
  if (props.view.optionsIndex !== undefined) {
    options = props.options[props.view.optionsIndex];
    optionsIndex = props.view.optionsIndex;
  }

  if (props.editable) {
    return (
      <div>
        <Button
          variant="primary"
          className="btn-simple btn-icon"
          onClick={() => {
            editReference = props.viewIndex;
            props.setTargetView(
              true,
              props.view,
              props.viewIndex,
              FetchViewComponentProps(props.view, props.components),
              InputComponent,
              props.data,
              options,
              optionsIndex
            );
          }}
        >
          <i className="fa fa-cog large-icon" />
        </Button>
      </div>
    );
  }
  else {
    return (<div></div>);
  }
}

const EditTitle = (props) => {
  if (props.editable) {
    return (
      <Form>
        <Form.Control
          size="lg" type="text"
          value={props.title}
          onChange={
            changeEvent => {
              props.updateTitle(changeEvent.target.value, props.index);
            }
          } />
      </Form>
    );
  }
  else {
    return (<h1 className="open-speech-accent-font-widget">{props.title}</h1>);
  }
}

const ShiftItemUpward = (array, itemIndex) => {
  var a;
  if (itemIndex === 0) {
    var item = array.shift();
    array.push(item);
  }
  else {
    var item = array[itemIndex];
    array[itemIndex] = array[itemIndex-1];
    array[itemIndex - 1] = item;
  }
  return array;
}

const ShiftItemDownward = (array, itemIndex) => {
  var a; 
  if (itemIndex === array.length - 1) {
    var item = array.pop();
    array.unshift(item);
  }
  else {
    var item = array[itemIndex];
    array[itemIndex] = array[itemIndex+1];
    array[itemIndex + 1] = item;
  }
  return array;
}

const EditContainerViews = props => {
  if (props.editable) {
    return (
      <div className="float-right">
        <Table>
          <thead>
            <tr></tr>
          </thead>
          <tbody>
            <tr className="center-flex"><td className="no-padding no-border center-flex">
            <Button
              variant="primary"
              className="btn-simple btn-icon"
              onClick={() => {
                props.updateContainer(
                  {
                    name: props.title,
                    views: ShiftItemUpward(props.viewReferences,props.viewReferenceIndex)
                  },
                  props.containerIndex);
              }}
            >
              <i className="fa fa-arrow-up large-icon" />
              </Button>
            </td></tr>
            <tr className="center-flex"><td className="no-padding no-border center-flex">
            <Button
              variant="primary"
              className="btn-simple btn-icon"
              onClick={() => {
                props.updateContainer(
                  {
                    name: props.title,
                    views: props.viewReferences.splice(props.viewReferenceIndex, 1)
                  },
                  props.containerIndex);
              }}
            >
              <i className="fa fa-times large-icon" />
            </Button>
          </td></tr>
            <tr className="center-flex"><td className="no-padding no-border center-flex">
            <Button
              variant="primary"
                className="btn-simple btn-icon"
                onClick={() => {
                  props.updateContainer(
                    {
                      name: props.title,
                      views: ShiftItemDownward(props.viewReferences, props.viewReferenceIndex)
                    },
                    props.containerIndex);
                }}
            >
             <i className="fa fa-arrow-down large-icon" />
            </Button>
            </td></tr>
            </tbody>
        </Table>
      </div>
    );
  }
  else {
    return (<div></div>);
  }
}


const EditPanel = (props) => {
  if (props.editable) {
    return (
      <div className="float-right">
        <Button
          variant="white"
          className="btn-simple btn-icon"
          onClick={() => props.moveLeft(props.index,-1)}
        >
            <i className="fa fa-arrow-left large-icon" />
          </Button>
        <Button
          variant="white"
          className="btn-simple btn-icon"
          onClick={() => {props.delete(props.index)}}
        >
          <i className="fa fa-times large-icon" />
          </Button>
        <Button
          variant="white"
          className="btn-simple btn-icon"
          onClick={() => props.moveRight(props.index, 1)}
        >
          <i className="fa fa-arrow-right large-icon" />
          </Button>
      </div>
      );
  }
  else {
    return (<div></div>);
  }
}

export class InputComponent extends Component {

  mergeProps = (a, b) => {
    if (!b || !a || b === {}) {
      return;
    }
    var merge = a.properties;
    Object.keys(b).forEach((key) => {
      if (b[key] && key !== "data") {
        merge[key] = b[key];
      }
    });
  }

  shouldComponentUpdate(nextProps) {
    if (this.props.data.indices.includes(nextProps.indexTrigger)) {
      return true;
    }
    else if (nextProps.editing) {
      return true;
    }
    else if (this.props.view !== nextProps.view) {
      return true;
    }
    else {
      return false;
    }
  }

  getComponent = () => {
    try {
      const dataList = 
      this.props.data.data.map((data) => {
        return(JSON.parse(JSON.stringify(data.packet)));
      });

      let noDisplay = false;
      if(this.props.view.noDisplay){
        noDisplay = true;
      }
      var forwardOptions;
      if (this.props.options) {
        forwardOptions = this.props.options[this.props.view.optionsIndex];
        this.mergeProps(dataList[0], forwardOptions);
      }
      else if(this.props.indexedOptions){
        this.mergeProps(dataList[0],this.props.indexedOptions);
        forwardOptions=this.props.indexedOptions;
      }
      let Component = require('../Inputs/' + this.props.view.type.component).default;

      if(noDisplay){
        return (
          <div className = "d-none">
            <Component
            view={this.props.view}
            data={dataList}
            callback={this.props.callback}
            options={forwardOptions}
          />
          </div>
          );
      }
      else{
      return (
        <Component
          view={this.props.view}
          data={dataList}
          callback={this.props.callback}
          options={forwardOptions}
        />
      );
      }
    }
    catch{
      return (<div>Component Not Recognized!</div>);
    }
  }

  render() {
    return ({...this.getComponent()});
  }

}



export default ControlCard;


