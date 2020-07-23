import React, { Component } from "react";
import { ToggleButton, ToggleButtonGroup } from "react-bootstrap";


export class Toggle extends Component {

  constructor(props) {
    super(props);
    this.state = {
      currentValue: 1,
    };
  }

  componentDidMount() {
    this.setState({ currentValue: this.props.data[0].value });
  }
  componentWillReceiveProps() {
    this.setState({ currentValue: this.props.data[0].value });
  }

  render() {

    function getPayload(props, value) {
      return (
        {
          dataPackets: formDataPackets(props.view.references, value)
        }
      );
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

    return (
      <div className="autogen autogen-toggle">
        <ToggleButtonGroup
          type="radio" name="options"
          value={this.state.currentValue}>
          <ToggleButton
            onClick={
              () => {
                this.setState({ currentValue: 1 });
                this.props.callback(getPayload(this.props, 1));
                this.forceUpdate();
              }
            }
            value={1}>
            {this.props.data[0].properties.enumeration[1]}
          </ToggleButton>
          <ToggleButton
            onClick={
              () => {
                this.setState({ currentValue: 0 });
                this.props.callback(getPayload(this.props, 0));
                this.forceUpdate();
              }
            }
            value={0}>
            {this.props.data[0].properties.enumeration[0]}
         </ToggleButton>
        </ToggleButtonGroup>
        </div>
    );
  }
}

export default Toggle;
