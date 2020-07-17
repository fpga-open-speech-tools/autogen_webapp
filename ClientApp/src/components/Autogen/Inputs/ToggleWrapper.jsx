import React, { Component } from "react";
import { ButtonGroup,ToggleButton, ToggleButtonGroup } from "react-bootstrap";


export class ToggleWrapper extends Component {

  constructor(props) {
    super(props);
    this.state = {
      currentValue: 1,
    };
  }
  componentDidMount() {
    this.setState({ currentValue: this.props.data.value });
  }
  render() {

    function dataPacket(dataReference, value) {
      return (
        [{
          reference: dataReference,
          value: value
        }]
      );
    }

    return (
      <div className="autogen autogen-toggle">
        <ToggleButtonGroup
          type="radio" name="options"
          defaultValue={this.state.currentValue}>
          <ToggleButton
            onClick={
              () => this.props.callback(dataPacket(this.props.data.references[0], 1))
            }
            value={1}>
            {this.props.data.properties.enumeration[1]}
          </ToggleButton>
          <ToggleButton
            onClick={
              () => this.props.callback(dataPacket(this.props.data.references[0], 0))
            }
            value={2}>
            {this.props.data.properties.enumeration[0]}
         </ToggleButton>
        </ToggleButtonGroup>
        </div>
    );
  }
}

export default ToggleWrapper;
