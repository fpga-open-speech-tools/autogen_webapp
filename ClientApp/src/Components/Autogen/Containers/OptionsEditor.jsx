import React, { Component } from "react";
import { Button, Modal, ListGroup, Col, Row, Form } from "react-bootstrap";

import EnumerationCreator from "./EnumerationCreator";


export class OptionsEditor extends Component{
  constructor(props) {
    super(props);
    this.keys = ["min", "max", "step", "units"];
    this.types = ["float", "float", "float", "string", "kvp"];
    this.state = {
      options: null,
      viewOptionsIndex:null
    };

    this.handleUpdateOption = this.handleUpdateOption.bind(this);
    this.handleRemoveOption = this.handleRemoveOption.bind(this);
  }

  componentWillReceiveProps() {
    if (this.props.viewOptionsIndex !== undefined && this.props.viewOptionsIndex !== null) {
      if (this.props.options) {
        if (this.props.options != this.state.options) {
          this.setState({ options: this.props.options });
        }
        if (this.props.viewOptionsIndex != this.state.viewOptionsIndex) {
          this.setState({ viewOptionsIndex: this.props.viewOptionsIndex });
        }
      }
    }
  }

  handleUpdateOption(newOptionKey, newOptionValue) {
    if (this.props.options && this.props.viewOptionsIndex !== undefined && this.props.viewOptionsIndex !== null) {
      var optionUpdate = this.props.options;
      optionUpdate[newOptionKey] = newOptionValue;
      this.setState({ options: optionUpdate });
      this.props.modifyOptionCallback(optionUpdate, this.props.viewOptionsIndex);
    }
    else {
      var optionUpdate = {};
      optionUpdate[newOptionKey] = newOptionValue;
      this.setState({ options: optionUpdate });;
      this.props.addOptionsCallback(optionUpdate, this.props.viewIndex);
    }
    this.forceUpdate();
  }

  handleRemoveOption(optionKey) {
    if (this.props.options && this.props.viewOptionsIndex !== undefined && this.props.viewOptionsIndex !== null) {
      var optionUpdate = this.props.options;
      delete optionUpdate[optionKey];
      this.setState({ options: optionUpdate });
      this.props.modifyOptionCallback(optionUpdate, this.props.viewOptionsIndex);
    }
  }

 


  render = () => {
    return (
      <div className="option-editor">
        <Form>
          <PopulateOptions
          keys={this.keys}
          types={this.types}
          viewIndex={this.props.viewIndex}
          optionsIndex={this.props.viewOptionsIndex}
          handleUpdate={this.handleUpdateOption}
          handleRemove={this.handleRemoveOption}
          options={this.props.options}
        />
        </Form>
        <EnumerationPopulator 
          key={this.props.viewIndex + "-enums"}
          callback={this.handleUpdateOption} 
          options={this.props.options}
        />
      </div>
    );
  }
}

class EnumerationPopulator extends Component {
  constructor(props){
    super(props);
    this.state = {enums:[], renderAddButton:true};
  }

  componentDidUpdate(){
    if(this.props.options){
      if(this.props.options.enumerations){
        if(this.state.renderAddButton){
          this.setState({renderAddButton:false});
        }
        if(this.state.enums !== this.props.options.enumerations){
          this.setState({
            enums:this.props.options.enumerations,
            renderAddButton: false
          });

        }
      }
    }
    else{
      if(!this.state.renderAddButton){
        this.setState({renderAddButton:true});
      }
    }
  }

  render(){
    if(this.state.renderAddButton){
      return(
        <div>
          <Button
            variant="primary"
            className="btn-simple btn-icon"
            onClick={() => {
              this.props.callback("enumerations", [{key:"",value:""}]);
              this.setState({enums:[{key:"",value:""}]});
            }}
          >
            <i className="fas fa-plus large-icon" />

          </Button>
            Add Enumerations
        </div>
      );
    }
    else{
      return(
      <EnumerationCreator 
        enums={this.state.enums} 
        callback={this.props.callback}
      />);
    }
  }
}

class OptionField extends Component {

  parseValue = (type, value) => {
    var parsedValue;
    if (type === "float") {
      parsedValue = parseFloat(value);
    }
    else if (type === "int") {
      parsedValue = parseInt(value);
    }
    else if (type === "string") {
      parsedValue = value;
    }
    else {
      parsedValue = value;
    }
    if (!parsedValue) {
      parsedValue = "";
    }
    return parsedValue;
  }

  render() {
    if (this.props.options) {
      if (this.props.options[this.props.option] !== undefined) {
        if (this.props.option === "enumerations") {
          return (
            <></>
            );
        }
        else {
          return (
            <>
              {this.props.option}
              <Row>
                <Col lg={9} md={10} sm={10}>
                <Form.Control
                  className="fit-left"
                  size="lg" type="text"
                  value={this.props.options[this.props.option]}
                  onChange={changeEvent => {
                    this.props.handleUpdate(this.props.option, this.parseValue(this.props.type, changeEvent.target.value));
                  }}
                  />
                </Col>
                <Col lg={3} md={2} sm={2}>
                <Button
                  variant="primary"
                  className="btn-simple btn-icon fit-right"
                  onClick={() => {
                    this.props.handleRemove(this.props.option);
                  }}
                >
                  <i className="fas fa-times large-icon" />
                  </Button>
                  </Col>
              </Row>
             </>
          );
        }
      }
      else {
        return (
          <div>
            <Button
              variant="primary"
              className="btn-simple btn-icon"
              onClick={() => {
                this.props.handleUpdate(this.props.option, "");
              }}
            >
              <i className="fas fa-plus large-icon" />

            </Button>
          Add {this.props.option}
          </div>
        );
      }
    }
    else {
      return (
        <div>
          <Button
            variant="primary"
            className="btn-simple btn-icon"
            onClick={() => {
              this.props.handleUpdate(this.props.option, "");
            }}
          >
            <i className="fas fa-plus large-icon" />

          </Button>
            Add {this.props.option}
        </div>
      );
    }
  }
}

class PopulateOptions extends Component{
  render() {
    return (
      this.props.keys.map((key,index) => {
        return (
          <OptionField
            key={key}
            type={this.props.types[index]}
            option={key}
            viewIndex={this.props.viewIndex}
            optionsIndex={this.props.optionsIndex}
            handleUpdate={this.props.handleUpdate}
            handleRemove={this.props.handleRemove}
            options={this.props.options}
        />);
      })
    );
  }
}

export default OptionsEditor;