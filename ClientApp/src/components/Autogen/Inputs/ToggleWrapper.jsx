import React, { Component } from "react";
import { ButtonGroup,ToggleButton, ToggleButtonGroup } from "react-bootstrap";


export class ToggleWrapper extends Component {

  constructor(props) {
    super(props);
    this.state = {
      currentValue: 1,
    };
  }

  render() {
    return (
      <div className="autogen autogen-toggle">
        <ToggleButtonGroup
          type="radio" name="options"
          defaultValue={1}>
          <ToggleButton
            onClick={
              () => this.props.callback(this.props.module, this.props.link, "1")
            }
            value={1}>
            Enabled
          </ToggleButton>
          <ToggleButton
            onClick={
              () => this.props.callback(this.props.module, this.props.link, "0")
            }
            value={2}>
            Disabled
         </ToggleButton>
        </ToggleButtonGroup>
        </div>
    );
  }
}

export default ToggleWrapper;
