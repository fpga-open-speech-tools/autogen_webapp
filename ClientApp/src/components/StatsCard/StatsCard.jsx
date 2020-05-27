
import React, { Component } from "react";
import { Row, Col, Button, Accordion, Card } from "react-bootstrap";

export class StatsCard extends Component {
  render() {
    return (
      <div className={this.props.isSelected} key={this.props.key}>
        <Row>

          <div className="open-speech-header open-speech-header-std open-speech-accent-color">
            <Col lg={10} md={10} sm={10}>
            <h1 className="open-speech-accent-font">{this.props.headerTitle}</h1>
            </Col>
            {this.props.isDownloading}
          </div>
        </Row>
        <div className="content">
          <Row className = "centered-row fullwidth-row">
              <div className="numbers">
                <Row className = "centered-row">
                  <Col className="text-column-left"><div id="filesize">{this.props.statsValue}</div></Col>
                </Row>
              </div>
            <Col>
              <Button
                className="btn-icon"
                onClick={
                  () => this.props.callback(this.props.downloadDevice,this.props.downloadProject)
                }
                variant="primary"
                size="md" block>
                <i className="fa fa-cloud-download large-icon"/>
              </Button>
            </Col>
          </Row>
          <Row className="paragraph-row">
           </Row>
        </div>
        <div className="footer">
          <hr />
          <div className="stats">
            {this.props.statsIcon} {this.props.statsIconText}
          </div>
        </div>
      </div>
    );
  }
}

export default StatsCard;
