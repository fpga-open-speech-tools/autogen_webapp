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
    this.setState({ currentValue: this.props.defaultValue });
  }

  render() {

    return (
      <div className="autogen autogen-slider">
        <Row className ="centered-row">
          <Col sm={12} md={12} lg={12} className="autogen-control-name">
            {this.props.controlTitle}
          </Col>
        </Row>
        <Row className="autogen-value-row">
          <div className="autogen-value">{this.state.currentValue}</div>
          <div className="autogen-units">{this.props.units}</div>
        </Row>
        <RangeSlider
          step={this.props.step}
          min={this.props.min}
          max={this.props.max}
          value={this.state.currentValue}
          onChange={
            changeEvent => {
              {this.props.callback(this.props.module,this.props.link,changeEvent.target.value) }
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
