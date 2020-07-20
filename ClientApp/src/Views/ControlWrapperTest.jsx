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
    this.setState({ currentValue: this.props.value });
  }

  componentWillReceiveProps() {
    this.setState({ currentValue: this.props.value });
  }

  render() {
    return (
      <div className="autogen autogen-slider">
        <Row className ="centered-row">
          <Col sm={12} md={12} lg={12} className="autogen-control-name">
          </Col>
        </Row>
        <Row className="autogen-value-row">
        </Row>
        <RangeSlider
          tooltip="off"
          step={1}
          min={0}
          max={10}
          value={this.state.currentValue}
          onChange={
            changeEvent => {
              { this.props.callback(this.props.index, changeEvent.target.value) }
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
