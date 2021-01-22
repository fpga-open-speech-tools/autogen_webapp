import React, { Component } from "react";
import { Button, Modal, ListGroup, Col, Form, Card } from "react-bootstrap";

export class EnumerationCreator extends Component {
  constructor(props) {
    super(props);
    //this.enums = [];
    this.state = {enums:[]}

    this.editEnumByIndex = this.editEnumByIndex.bind(this);
    this.addNewEnum = this.addNewEnum.bind(this);
  }

  componentDidMount() {
    if (this.props.enums) {
      //this.enums = this.props.enums;
      this.setState({enums:this.props.enums});
    }
  }

  editEnumByIndex = (key,value,index) => {
    //this.enums[index] = { key: key, value: value };
    var enums = this.state.enums;
    enums[index] = {key:key,value:value};
    this.setState({enums:enums});
    this.triggerCallback();
    this.forceUpdate();
  }

  addNewEnum = (key, value) => {
    var enums = this.state.enums;
    enums.push({ key: key, value: value });
    this.setState({enums:enums});
    this.triggerCallback();
    this.forceUpdate();
  }

  triggerCallback = () => {
    this.props.callback("enumerations",this.state.enums);
  }


  render() {
      return (
        <Card>
          {this.state.enums.map((kv, index) => {
            return (
              <EnumForm
                key={index}// this.props.name + "-v-" + this.props.value}
                name={kv.key}
                value={kv.value}
                index={index}
                callback={this.editEnumByIndex}
              />
            );
          })}
          <Button
            variant="primary"
            className="btn-simple btn-icon"
            onClick={() => {
              this.addNewEnum("", "");
            }}
          >
            <i className="fas fa-plus large-icon" />

          </Button>
        </Card>
      );
    }
}

class EnumForm extends Component {
  render() {
    return (
      <Form>
        <div className="enumeration-editor-form">
          <div className="enumeration-editor-key">
            Key
            <Form.Control
              size="sm" type="text"
              value={this.props.name}
              onChange={changeEvent => {
                this.props.callback(changeEvent.target.value, this.props.value, this.props.index);
              }}
            />
          </div>
          <div className="enumeration-editor-value">
            Value
            <Form.Control
              size="sm" type="text"
              value={this.props.value}
              onChange={changeEvent => {
                this.props.callback(this.props.name, changeEvent.target.value, this.props.index);
              }}
            />
          </div>
        </div>
      </Form>
    );
  }
}

export default EnumerationCreator;