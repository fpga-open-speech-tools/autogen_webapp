
import * as React from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps } from 'react-router';
import * as OpenSpeechDataStore from '../Store/OpenSpeechToolsData';
import { ApplicationState } from '../..';
import {Container, Row, Modal} from "react-bootstrap";
import ComponentLibary from "../Components/Autogen/Autogen/Inputs/Manager/MapifyComponents.jsx";

// At runtime, Redux will merge together...
type OpenSpeechProps =
  OpenSpeechDataStore.OpenSpeechToolsState // ... state we've requested from the Redux store
  & typeof OpenSpeechDataStore.openSpeechDataActionCreators // ... plus action creators we've requested
  & RouteComponentProps<{}>; // ... plus incoming routing parameters


export class SandboxView extends React.Component<OpenSpeechProps> {

  constructor(props: OpenSpeechProps) {
    super(props);

    this.handleRequestUI = this.handleRequestUI.bind(this);
    this.getComponents = this.getComponents.bind(this);
  }//End Constructor 



  componentDidMount() {
    this.handleRequestUI();
  } // End ComponentDidMount

  handleRequestUI() {
    this.props.requestAutogenConfiguration();
  }


  getComponents = () => {
    if (this.props.autogen) {
      return (
        <ComponentLibary
          data={this.props.autogen.data}
          name={this.props.autogen.name}>
        </ComponentLibary>
      );
    }
    else {
      return (<div>No Autogen</div>);
    }
  }

  render() {
    return (
      <div className="content">
        <Container fluid>
          <Row>
            <Modal.Dialog>
              <Modal.Header>
                <Modal.Title className="float-left">
                  Session
                </Modal.Title>
              </Modal.Header>
              <Row>
                <h4 className="centered-header"></h4>
              </Row>
            </Modal.Dialog>
          </Row>
          <Row>{this.getComponents()}</Row>
        </Container>
      </div>
    );
  }//End Render
}

export default connect(
  (state: ApplicationState) => state.openSpeechData,
  OpenSpeechDataStore.openSpeechDataActionCreators 
)(SandboxView as any);     
