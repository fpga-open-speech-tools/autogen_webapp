
import React, { Component } from "react";
import { Row, Col, Dropdown, DropdownButton, Button } from "react-bootstrap";

export class StatsCard extends Component {
  render() {
    return (
      <div className="card card-stats" key={this.props.key}>
        <div className="content">
          <Row>
            <Col>
              <Button
                onClick={
                  () => this.props.callback(this.props.downloadDevice,this.props.downloadProject)
                }
                variant="primary"
                size="md" block>
                {this.props.statsText}
              </Button>
              <div className="numbers">
                <Row>
                  <Col>Size:</Col>
                  <Col><div id="filesize">{this.props.statsValue}</div></Col>
                </Row>
              </div>
              </Col>
          </Row>
          <div className="footer">
            <hr />
            <div className="stats">
              {this.props.statsIcon} {this.props.statsIconText}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default StatsCard;
