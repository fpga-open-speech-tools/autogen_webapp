import React, { Component } from "react";
import { Row, Col } from "react-bootstrap";
import ReactBootstrapSlider from "react-bootstrap-slider";

export class Slider extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      currentValue:  0,
    };

    this.handleChange = this.handleChange.bind(this);
    this.generatePayload = this.generatePayload.bind(this);
    this.createSlider = this.createSlider.bind(this);
  }

  componentWillReceiveProps() {
    if (this.state.currentValue != this.props.data[0].value) {
      this.setState({ currentValue: this.props.data[0].value });
    }
  }

  componentDidMount() {
    this.setState({ currentValue: this.props.data[0].value });
  }

  generatePayload = (value) => {
    const payload = [];
    this.props.view.references.map((reference) => {
      (payload.push({
        index: reference,
        value: value
      }));
    });
    return payload;
  }

  handleChange = (value) => {
    this.props.callback(this.generatePayload(value));
  }

  createSlider = () => {
    if (this.props.view.type.variant === "vertical") {
      return (
        <React.Fragment>
          <Row className="vertical-slider-row">
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
            <Col sm={9} md={9} lg={9} className="vertical-slider-col">
              <Row className="centered-row">
                <Col sm={12} md={12} lg={12} className="autogen-control-name">
                  {this.props.view.name}
                </Col>
              </Row>
              <Row sm={1} md={1} lg={1}><div className="empty-medium"></div></Row>
              <Row className="autogen-value-row">
                <div className="autogen-value">{this.state.currentValue}</div>
                <div className="autogen-units">{this.props.data[0].properties.units}</div>
              </Row>
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
          <Row className="autogen-value-row">
            <div className="autogen-value">{this.state.currentValue}</div>
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

  render() {
    return (
      <div className="autogen autogen-slider">
        {this.createSlider()}
      </div>
    );
  }
}


export default Slider;
