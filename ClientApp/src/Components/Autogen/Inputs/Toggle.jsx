import React, { Component } from "react";
import { ToggleButton, ToggleButtonGroup } from "react-bootstrap";


export class Toggle extends Component {

  constructor(props) {
    super(props);
    this.state = {
      currentValue: 0,
    };

    this.generatePayload = this.generatePayload.bind(this);
  }

  componentDidMount() {
    this.setState({ currentValue: this.props.data[0].value });
  }
  componentWillReceiveProps() {
    if (this.state.currentValue != this.props.data[0].value) {
      this.setState({ currentValue: this.props.data[0].value });
      this.forceUpdate();
    }
  }

  generatePayload = (value) => {
  const payload = [];
  this.props.view.references.map((reference) => {
    (payload.push({
      index: reference,
      value: value
    }));
  });
  return payload;
}

  render() {

    return (
      <div className="autogen autogen-toggle">
        <ToggleButtonGroup
          type="radio" name="options"
          value={this.state.currentValue}>
          <ToggleButton
            onClick={
              () => {
                this.setState({ currentValue: 1 });
                this.props.callback(this.generatePayload(1));
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
                this.props.callback(this.generatePayload(0));
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
