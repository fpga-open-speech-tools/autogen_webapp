import React from "react";
import { Row, Col, Form } from "react-bootstrap";
import ReactBootstrapSlider from "react-bootstrap-slider";

export class Slider extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      currentValue:  
        this.props.data[0].value ? 
          parseFloat(this.props.data[0].value) : this.props.data[0].properties.min,
      formValue: 
        this.props.data[0].value ? 
          this.props.data[0].value.toString(): this.props.data[0].properties.min.toString(),
      formValid: true,
      formHighlight: "autogen-form-row autogen-value-row autogen-form-valid"
    };

    this.handleChange = this.handleChange.bind(this);
    this.generatePayload = this.generatePayload.bind(this);
    this.createSlider = this.createSlider.bind(this);
  }

  componentWillReceiveProps() {
    if (this.state.currentValue !== this.props.data[0].value) {
      this.setState({ 
        currentValue: parseFloat(this.props.data[0].value)
      });
      if(parseFloat(this.state.formValue) !== this.props.data[0].value){
        this.setState({ 
          formValue: this.props.data[0].value.toString()
        });
      }
      if(!this.state.formValid){
        this.setState({formValid:true,formHighlight: "autogen-form-row autogen-value-row autogen-form-valid"});
      }
    }
  }

  componentDidMount() {
    this.setState({ 
            currentValue:  
        this.props.data[0].value ? 
          parseFloat(this.props.data[0].value) : this.props.data[0].properties.min,
      formValue: 
        this.props.data[0].value ? 
          this.props.data[0].value.toString(): this.props.data[0].properties.min.toString(),
    });
  }

  generatePayload = (value) => {
    const payload = [];
    this.props.view.references.forEach((reference) => {
      (payload.push({
        index: reference,
        value: value
      }));
    });
    return payload;
  }

  handleChange = (value) => {
    return(this.props.callback(this.generatePayload(value)));
  }


  handleFormInput = (value) => {
    this.setState({formValue:value.toString()});
    const isValid = this.validateInput(value);
    if(isValid){
      this.setState({
        formValid:true,
        formHighlight:"autogen-form-row autogen-value-row  autogen-form-valid"
      });
      this.handleChange(parseFloat(value));
    }
    else{
      this.setState({
        formValid:false,
        formHighlight:"autogen-form-row autogen-value-row autogen-form-invalid"
      });
    }
  }

  validateInput = (value) => {
    if (isNaN(value)) {
      return false;
    }
    else if(value.length===0){return false;}
    else {
    var mod = value % this.props.data[0].properties.step;
      if (value <= this.props.data[0].properties.max &&
        value >= this.props.data[0].properties.min &&
        (mod <= 0.01*this.props.data[0].properties.step || mod >= 0.999*this.props.data[0].properties.step)){
        return true;
      }
      else {
        return false;
      }
    }
  }

  createSlider = () => {
    if (this.props.view.type.variant === "vertical") {
      return (
        <React.Fragment>
          <Row className="centered-row">
            <Col sm={12} md={12} lg={12} className="autogen-control-name">
              {this.props.view.name}
            </Col>
          </Row>
          <Row className="vertical-slider-row">
            <Col className="vertical-slider-col grid align-end">
              <Row className="stacked-row">
              <div className="autogen-units full-width justify-start flex">
                {this.props.data[0].properties.units}
                </div>
              <Row className="autogen-value-row full-width justify-start">
             <Row className={this.state.formHighlight}>
              <Form className="autogen-form">
                <Form.Control
                  className="autogen-form-control float-left"
                  name="val"
                  value={this.state.formValue}
                  onChange={changeEvent =>{this.handleFormInput(changeEvent.target.value);}}
                >
                </Form.Control>
              </Form>
              </Row>
                </Row>
               </Row>
            </Col>
            <Col sm={3} md={3} lg={3} className="vertical-slider-col">
              <ReactBootstrapSlider
                orientation={this.props.view.type.variant}
                tooltip="hide"
                reversed={true}
                step={this.props.data[0].properties.step}
                min={this.props.data[0].properties.min}
                max={this.props.data[0].properties.max}
                value={this.state.currentValue}
                change={
                  changeEvent => {
                    this.handleChange(changeEvent.target.value);
                  }
                }
              />
            </Col>
          </Row>
        </React.Fragment>);
    }
    else {
      return (
        <React.Fragment>
          <Row className="centered-row">
            <Col sm={12} md={12} lg={12} className="autogen-control-name">
              {this.props.view.name}
            </Col>
          </Row>
          <Row className={this.state.formHighlight}>
            <Form className="autogen-form">
              <Form.Control
                className="autogen-form-control float-left"
                name="val"
                value={this.state.formValue}
                onChange={changeEvent =>{this.handleFormInput(changeEvent.target.value);}}
              >
              </Form.Control>
            </Form>
            <div className="autogen-units">{this.props.data[0].properties.units}</div>
          </Row>
          <ReactBootstrapSlider
            orientation={this.props.view.type.variant}
            tooltip="hide"
            step={this.props.data[0].properties.step}
            min={this.props.data[0].properties.min}
            max={this.props.data[0].properties.max}
            value={this.state.currentValue}
            change={
              changeEvent => {
                this.handleChange(changeEvent.target.value);
              }
            }
          />
        </React.Fragment>);
    }
  }

  //<div className="autogen-value">{this.state.currentValue}</div>

  render() {
    return (
      <div className="autogen autogen-slider">
        {this.createSlider()}
      </div>
    );
  }
}


export default Slider;
