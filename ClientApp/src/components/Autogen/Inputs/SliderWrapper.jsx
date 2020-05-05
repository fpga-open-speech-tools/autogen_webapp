import React, { Component, usestate } from "react";
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
      <div>
      <RangeSliqder
          value={this.state.currentValue}
          onChange={
            changeEvent => {
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
