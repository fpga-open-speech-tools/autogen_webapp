import React, { Component } from "react";
import RangeSlider  from 'react-bootstrap-range-slider';
import { Row, Col } from "react-bootstrap";


export class SliderWrapper extends Component {

  constructor(props) {
    super(props);
    this.state = {
      currentValue:  0,
    };
  }

  componentDidMount() {
    this.setState({ currentValue: this.props.data.value });
  }

  render() {

    function dataPacket(dataReference,value) {
      return (
        [{
          reference: dataReference,
          value:value
        }]
        );
    }

    return (
      <div className="autogen autogen-slider">
        <Row className ="centered-row">
          <Col sm={12} md={12} lg={12} className="autogen-control-name">
            {this.props.title}
          </Col>
        </Row>
        <Row className="autogen-value-row">
          <div className="autogen-value">{this.state.currentValue}</div>
          <div className="autogen-units">{this.props.data.properties.units}</div>
        </Row>
        <RangeSlider
          tooltip="off"
          step={this.props.data.properties.step}
          min={this.props.data.properties.min}
          max={this.props.data.properties.max}
          value={this.state.currentValue}
          onChange={
            changeEvent => {
              { this.props.callback(dataPacket(this.props.data.references[0], changeEvent.target.value)) }
              this.setState({
                currentValue: changeEvent.target.value
              })
            }
          }
      />
      </div>
    );
  }
}


export default SliderWrapper;
