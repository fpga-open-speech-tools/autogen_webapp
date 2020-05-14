import React, { Component } from "react";
import RangeSlider from 'react-bootstrap-range-slider';


export class SliderWrapper extends Component {

  constructor(props) {
    super(props);
    this.state = {
      currentValue: 0,
    };
  }

  render() {
    return (
      <div className="autogen autogen-slider">
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
