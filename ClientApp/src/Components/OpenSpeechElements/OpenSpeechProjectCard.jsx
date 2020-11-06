import React, { Component } from "react";
import { Row, Col, Button} from "react-bootstrap";

export class OpenSpeechProjectCard extends Component {
  render() {

    const removeUnderscore = (title) => {
        return(title.replaceAll('_', ' '));
    }

    return (
      <div className={this.props.isSelected} key={this.props.key}>
        <Row>

          <div className="open-speech-header open-speech-header-std open-speech-accent-color">
            <div className="float-left">
            <h1 className="open-speech-accent-font">{removeUnderscore(this.props.headerTitle)}</h1>
            </div>
            <div className="float-right">
              <div className="btn btn-simple btn-icon btn-white">
                {this.props.isDownloading}
                </div>
            </div>
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

export default OpenSpeechProjectCard;
