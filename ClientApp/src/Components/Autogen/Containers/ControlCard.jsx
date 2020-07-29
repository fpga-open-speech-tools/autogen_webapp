import React, { Component } from "react";
import { Button, Form } from "react-bootstrap";

export class ControlCard extends Component {

  render = () => {
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
          {this.props.references.map((reference) =>
            <React.Fragment key={reference}>
              <div className="autogen autogen-control" key={reference}>
                <InputComponent
                  view={this.props.views[reference]}
                  data={this.props.data}
                  callback={this.props.callback}
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


