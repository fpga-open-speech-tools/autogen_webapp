import React, { Component } from "react";
import { Button, Row, Col } from "react-bootstrap";
import { evaluate,parser } from "mathjs";

export class ProcessingButton extends Component {

  constructor(props) {
    super(props);
    this.state = {
      currentValue: 0,
      data:[],
      parser: parser()
    };
    this.variables = {};
    this.generatePayload = this.generatePayload.bind(this);
    this.generateButton = this.generateButton.bind(this);
    this.processCustomMath = this.processCustomMath.bind(this);
    this.processFormat = this.processFormat.bind(this);
  }

  componentDidMount() {
    this.setState({ currentValue: this.props.data[0].value });
    this.setState({ data:this.props.data });
    this.updateVariables();
  }

  componentWillReceiveProps() {
    if (this.state.currentValue != this.props.data[0].value) {
      this.setState({ currentValue: this.props.data[0].value });
      this.forceUpdate();
    }
    this.props.data.forEach((data,index)=>{
      if(data !== this.props.data[index]){
        this.setState({data:this.props.data});
        this.updateVariables();
        this.forceUpdate();
      }
    });
  }

  updateVariables = () => {
    this.state.parser.clear();
    if(this.props.data){
      if(this.props.data[0].properties.processing){
        if(this.props.data[0].properties.processing.inputs){
          this.props.data[0].properties.processing.inputs.forEach((input,index)=>{
            if(input.type === "pointer"){
              const dataReference = index + 1;
              this.state.parser.set(input.name,this.props.data[dataReference].value);
            }
            else if(input.type === "constant"){
              this.state.parser.set(input.name,input.value);
            }
            else if(input.type === "function"){
              let user_function = new Function(input.value.parameters,input.value.output);
              this.state.parser.set(input.name, user_function);
            }
          });
        }
      }
    }
  }

  generatePayload = (value) => {
    const payload = [];
    payload.push({index:this.props.view.references[0],value:value});
    return payload;
  }

  processCustomMath(){

    let value = "";
    let scope = {};
    this.props.data[0].properties.processing.functions.forEach((func) => {
      scope[func.output_name] = this.state.parser.evaluate(func.function);
      this.state.parser.set(func.output_name,scope[func.output_name]);
    });
    //Note figure out way to get user to define the output form and variables.
    //Ex.  Processing-> Function a, b.  Variables a,b,c.   Function a-> out_a = a+b  function b-> out_b = b+c output-> a + "," + b


    //props -> options -> processing -> | functions, variables, inputs, output |
    //output -> format, variables
    //Ex:
    //  we have some list of functions, ["out1=a+b","out2="b-a"]
    //  we have inputs: a:0 (data[0]), b:1 (data:[1])
    //  inputs generated variables object from data pointers.
    //  From sliders a,b, we generated: variables:{a:7,b:10}
    //  Now, function list is processed.
    //  Values are passed into the variables object (the scope).
    //  output is parsed, and the corect variables are injected into each relevant location.
    //  For showing "a,b,out1,out2\n7,10,17,3"
    //  Output -> Format: "a,b,out1,out2\n%a,%b,%out1,%out2"
    value = this.processFormat(this.props.data[0].properties.processing.output,scope);
    return value;
  }

  processFormat(formatString, scope){
    let output = formatString;
    var keys = Object.keys(scope);
    keys.sort(function(a,b){return b.length - a.length;});
    keys.forEach( (key) => {
      let fmt = output;
      let identifier = "%" + key;
    	output = fmt.replaceAll(identifier,scope[key]);
    });
    return output;
  }

  generateButton = () => {
    return (
      <Button
        name={this.props.view.name}
        onClick={() => {
          let value = this.processCustomMath();
          this.setState({ currentValue: value });
          this.props.callback(this.generatePayload(value));
          this.forceUpdate();
        }}
        >
        {this.props.view.name}
      </Button>
    );
  }


  render() {
    this.updateVariables();
    return (
      <div className="autogen autogen-toggle">
        <Row className="centered-row">
          <Col sm={12} md={12} lg={12} className="autogen-control-name">
          </Col>
        </Row>
      {this.generateButton()}
      </div>
    );
  }
}

export default ProcessingButton;

