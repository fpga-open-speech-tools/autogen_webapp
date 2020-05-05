/*!

=========================================================
* Light Bootstrap Dashboard React - v1.3.0
=========================================================

* Product Page: https://www.creative-tim.com/product/light-bootstrap-dashboard-react
* Copyright 2019 Creative Tim (https://www.creative-tim.com)
* Licensed under MIT (https://github.com/creativetimofficial/light-bootstrap-dashboard-react/blob/master/LICENSE.md)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
import * as React from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps } from 'react-router';
import * as OpenSpeechDataStore from '../store/OpenSpeechToolsData';
import { ApplicationState } from '../';
import { Container, Row, Col, Form, Button} from "react-bootstrap";
import { StatsCard } from "../components/StatsCard/StatsCard.jsx";
import { EffectDiv } from "../components/Autogen/Containers/EffectDiv.jsx";


// At runtime, Redux will merge together...
type OpenSpeechProps =
  OpenSpeechDataStore.OpenSpeechToolsState // ... state we've requested from the Redux store
  & typeof OpenSpeechDataStore.openSpeechDataActionCreators // ... plus action creators we've requested
  & RouteComponentProps<{}>; // ... plus incoming routing parameters


class Dashboard extends React.PureComponent<OpenSpeechProps> {
  
  componentDidMount() {

    this.props.requestOpenSpeechS3Demos();

  }

  render() {
    return (
      <div className="content">
        <Container fluid>
          <Row>
            {this.props.availableDemos.map((demo) => 
              <StatsCard
                bigIcon={<i className="pe-7s-search text-primary" />}
                statsText="Passthrough"
                statsValue={demo.name}
                statsIcon={<i className="fa fa-clock-o" />}
                statsIconText="DE10-Nano/Passthrough"
              />
            )} 
          </Row>
          <Form>
            <Row>
              <Col lg={3} md={3}>
                <Form.Group controlId="ipAddress">
                  <Form.Label>IP Address</Form.Label>
                  <Form.Control placeholder="192.168.0.1" />
                </Form.Group>
              </Col>
              <Col lg={3} md={3}>
                <Form.Group controlId="port">
                  <Form.Label>Port</Form.Label>
                  <Form.Control placeholder="5050" />
                </Form.Group>
              </Col>
              <Col lg={3} md={3}>
                <Button variant ="primary" >Auto-gen</Button>
              </Col>
            </Row>
            <Row>
              <EffectDiv
                panel={this.props.testPanel}
              />
            </Row>
          </Form>
        </Container>
      </div>
    );
  }
  

}

export default connect(
  (state: ApplicationState) => state.openSpeechData,
  OpenSpeechDataStore.openSpeechDataActionCreators 
)(Dashboard as any);     
