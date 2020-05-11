import React, { Component } from "react";
import { ButtonGroup,ToggleButton, ToggleButtonGroup } from "react-bootstrap";


export class ToggleWrapper extends Component {

  constructor(props) {
    super(props);
    this.state = {
      currentValue: 0,
    };
  }

  render() {
    return (
      <div className="autogen autogen-toggle">
        <ToggleButtonGroup type="radio" name="options" defaultValue={1}>
          <ToggleButton value={1}>
            Enabled
          </ToggleButton>
          <ToggleButton value={2}>
            Disabled
         </ToggleButton>
        </ToggleButtonGroup>
        </div>
    );
  }
}

export default ToggleWrapper;
