import React, { Component } from "react";
import { ToggleButton, ToggleButtonGroup, Row, Col } from "react-bootstrap";


export class Toggle extends Component {

  constructor(props) {
    super(props);
    this.state = {
      currentValue: 0,
    };

    this.generatePayload = this.generatePayload.bind(this);
    this.generateButton = this.generateButton.bind(this);
    this.generateButtons = this.generateButtons.bind(this);
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

  generateButtons = (enumerations) => {
    return enumerations.map((e) => {
      return this.generateButton(e.key,e.value);
    });
  }

  generateButton = (key, val) => {
    return (
      <ToggleButton
        key={key}
        onClick={() => {
          this.setState({ currentValue: val });
          this.props.callback(this.generatePayload(val));
          this.forceUpdate();
        }}
        value={val}>
        {key}
      </ToggleButton >
    );
  }


  render() {

    return (
      <div className="autogen autogen-toggle">
        <Row className="centered-row">
          <Col sm={12} md={12} lg={12} className="autogen-control-name">
            {this.props.view.name}
          </Col>
        </Row>
        <ToggleButtonGroup
          type="radio" name="options"
          value={this.state.currentValue}>
          {this.generateButtons(this.props.options.enumerations)}
        </ToggleButtonGroup>
      </div>
    );
  }
}

export default Toggle;
