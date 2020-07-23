import React, { Component } from "react";
import { Row, Col } from "react-bootstrap";
import ReactBootstrapSlider from "react-bootstrap-slider";




export class Slider extends Component {

  constructor(props) {
    super(props);
    this.state = {
      currentValue:  0,
    };
  }

  componentDidMount() {
    this.setState({ currentValue: this.props.data[0].value });
  }

  componentWillReceiveProps() {
    this.setState({currentValue:this.props.data[0].value});
  }

  render() {

    function getDataPacketArray(references, value) {
      return ({ dataPackets: formDataPackets(references, value) });
    }

    function formDataPackets(references, value) {
      return (
        references.map((reference) => {
          return ({
            index: reference,
            value: value
          });
        }));
    }

    function getClassName(props) {
      return ( "range-slider range-slider-" + props.view.type.variant);
    } 

    function createSlider(props,state,comp) {
      if (props.view.type.variant === "vertical") {
        return (
          <React.Fragment>
            <Row>
              <Col sm={3} md={3} lg={3}>
          <ReactBootstrapSlider
            orientation={props.view.type.variant}
            tooltip="hide"
            reversed={true}
            step={props.data[0].properties.step}
            min={props.data[0].properties.min}
            max={props.data[0].properties.max}
            value={state.currentValue}
            change={
              changeEvent => {
                { props.callback(getDataPacketArray(props.view.references, changeEvent.target.value)) }
                comp.setState({
                  currentValue: changeEvent.target.value
                })
              }
            }
                />
                </Col>
           <Col>
              <Row className="centered-row">
                <Col sm={12} md={12} lg={12} className="autogen-control-name">
                  {props.view.name}
                </Col>
                </Row>
                <Row sm={4} md={4} lg={4}><div className="empty-medium"></div></Row>
            <Row className="autogen-value-row">
              <div className="autogen-value">{state.currentValue}</div>
              <div className="autogen-units">{props.data[0].properties.units}</div>
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
              {props.view.name}
            </Col>
          </Row>
          <Row className="autogen-value-row">
            <div className="autogen-value">{state.currentValue}</div>
            <div className="autogen-units">{props.data[0].properties.units}</div>
          </Row>
          <ReactBootstrapSlider
            orientation={props.view.type.variant}
            tooltip="hide"
            step={props.data[0].properties.step}
            min={props.data[0].properties.min}
            max={props.data[0].properties.max}
            value={state.currentValue}
            change={
              changeEvent => {
                { props.callback(getDataPacketArray(props.view.references, changeEvent.target.value)) }
                comp.setState({
                  currentValue: changeEvent.target.value
                })
              }
            }
          />
        </React.Fragment>);
      }
    }

    return (
      <div className="autogen autogen-slider">
        {createSlider(this.props,this.state,this)}
      </div>
    );
  }
}


export default Slider;
