import React, { Component } from "react";
import { Button, Form, Table, Modal } from "react-bootstrap";

export class ControlCard extends Component {
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
                  data={this.props.data}
                  callback={this.props.callback}
                />
                <EditViewButton
                  editable={this.props.editable}
                  view={this.props.views[reference]}
                  viewIndex={reference}
                  components={this.props.components}
                  openViewEditor={this.props.setTargetView}
                  setTargetView={this.props.startViewEditor}
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
  components.map((component) => {
    if (component.name === view.type.component) {
      match = component;
    }
  });
  return match;
}

var EditViewButton = (props) => {
  if (props.editable) {
    return (
      <div>
        <Button
          variant="primary"
          className="btn-simple btn-icon"
          onClick={() => {
            props.setTargetView(
              true,
              props.view,
              props.viewIndex,
              FetchViewComponentProps(props.view, props.components),
              InputComponent
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
    return (<h1 className="open-speech-accent-font">{props.title}</h1>);
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

const InputComponent = (props) => {
  const dataList = [];
  props.view.references.map((reference) => {
    dataList.push(props.data[reference]);
  });

  try {
    let Component = require('../Inputs/' + props.view.type.component).default;
    
    return (
      <Component
        view={props.view}
        data={dataList}
        callback={props.callback}
      />
    );
  }
  catch{
    return (<div>Component Not Recognized!</div>);
  }
}

export default ControlCard;


