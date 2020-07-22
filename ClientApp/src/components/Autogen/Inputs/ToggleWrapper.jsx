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
  componentWillReceiveProps() {
    this.setState({ currentValue: this.props.data.value });
  }
  render() {

    function dataPacketArray(index, value) {
      return (
        {dataPackets:
          [{
            index: index,
            value: value
          }]}
      );
    }

    return (
      <div className="autogen autogen-toggle">
        <ToggleButtonGroup
          type="radio" name="options"
          value={this.state.currentValue}>
          <ToggleButton
            onClick={
              () => this.props.callback(dataPacketArray(this.props.index, 1))
            }
            value={1}>
            {this.props.data.properties.enumeration[1]}
          </ToggleButton>
          <ToggleButton
            onClick={
              () => this.props.callback(dataPacketArray(this.props.index, 0))
            }
            value={0}>
            {this.props.data.properties.enumeration[0]}
         </ToggleButton>
        </ToggleButtonGroup>
        </div>
    );
  }
}

export default ToggleWrapper;
