import React, { Component } from "react";
import { Row, Col } from "react-bootstrap";


export class Text extends Component {

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
        <Row className="centered-row">
          <Col sm={12} md={12} lg={12} className="autogen-control-name">
            {this.props.view.name}
          </Col>
          {this.props.data[0].value}
        </Row>
      </div>
    );
  }

}

export default Text;
