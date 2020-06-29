
import * as React from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps } from 'react-router';
import * as OpenSpeechDataStore from '../../Store/OpenSpeechToolsData';
import { ApplicationState } from '../..';
import {
  Container, Row, Col, InputGroup,
  FormControl, Button, Spinner,
  Card, Jumbotron, Modal
} from "react-bootstrap";
import { EffectPageDiv } from "../../Components/Autogen/Containers/EffectPageDiv.jsx";
import NotificationWrapper from "../../Components/Notifications/NotificationWrapper.jsx";


// At runtime, Redux will merge together...
type OpenSpeechProps =
  OpenSpeechDataStore.OpenSpeechToolsState // ... state we've requested from the Redux store
  & typeof OpenSpeechDataStore.openSpeechDataActionCreators // ... plus action creators we've requested
  & RouteComponentProps<{}>; // ... plus incoming routing parameters

export interface AutoGenState {
  notification: Notification
}

interface Notification {
  text: string,
  level: string
}

export class AddressManager extends React.PureComponent<OpenSpeechProps,AutoGenState>{

  constructor(props: OpenSpeechProps) {
    super(props);

    this.state = {
      notification: {
        text: "",
        level: ""
      }
    };

    this.handleDeviceAddressChange = this.handleDeviceAddressChange.bind(this);
    this.handleChangeIP1 = this.handleChangeIP1.bind(this);
    this.handleChangeIP2 = this.handleChangeIP2.bind(this);
    this.handleChangeIP3 = this.handleChangeIP3.bind(this);
    this.handleChangeIP4 = this.handleChangeIP4.bind(this);
    this.handleChangePort = this.handleChangePort.bind(this);

    this.setNotification = this.setNotification.bind(this);
  }


  componentDidMount() {
  }
  componentDidUpdate() {
  }

  handleChangeIP1(e: React.ChangeEvent<HTMLInputElement>){
    this.handleDeviceAddressChange(e, 'ip1');
  }
  handleChangeIP2(e: React.ChangeEvent<HTMLInputElement>) {
    this.handleDeviceAddressChange(e, 'ip2');
  }
  handleChangeIP3(e: React.ChangeEvent<HTMLInputElement>) {
    this.handleDeviceAddressChange(e, 'ip3');
  }
  handleChangeIP4(e: React.ChangeEvent<HTMLInputElement>) {
    this.handleDeviceAddressChange(e, 'ip4');
  }
  handleChangePort(e: React.ChangeEvent<HTMLInputElement>) {
    this.handleDeviceAddressChange(e, 'port');
  }

  handleDeviceAddressChange(e: React.ChangeEvent<HTMLInputElement>, key: string) {
    var deviceAddress = this.props.deviceAddress;
    switch (key) {
      case 'ip1': 
        deviceAddress.ipAddress.ip1 = e.target.value;
        break;
      
      case 'ip2': 
          deviceAddress.ipAddress.ip2 = e.target.value;
        break;
      
      case 'ip3': 
          deviceAddress.ipAddress.ip3 = e.target.value;
        break;
      
      case 'ip4': 
        deviceAddress.ipAddress.ip4 = e.target.value;
        break;
      
      case 'port': 
        deviceAddress.port = e.target.value;
        break;
      
      default:
        break;
    }
    this.props.setDeviceAddress(deviceAddress);
  }


  setNotification(level: string, text: string) {
    this.setState({
      notification: {
        level:level,
        text:text
      }
    });
  }

  render() {
    return (
      <div className="content">
        <NotificationWrapper
          pushText={this.state.notification.text}
          level={this.state.notification.level}
        />
        <Container fluid>
          <Row>
            <Modal.Dialog>
              <Modal.Header>
                <Modal.Title>Connection</Modal.Title>
              </Modal.Header>
              <Col lg={12} md={12} sm={12}>
              <InputGroup className="mb-2">
                <InputGroup.Prepend>
                <InputGroup.Text id="inputGroup-sizing-default">IP</InputGroup.Text>
                </InputGroup.Prepend>
                <FormControl
                  name="ip1"
                    defaultValue={this.props.deviceAddress.ipAddress.ip1}
                    onChange={this.handleChangeIP1}
                  aria-label="IP1"
                  aria-describedby="inputGroup-sizing-default"
                />
                <FormControl
                    name="ip2"
                    defaultValue={this.props.deviceAddress.ipAddress.ip2}
                  onChange={this.handleChangeIP2}
                  aria-label="IP2"
                  aria-describedby="inputGroup-sizing-default"
                />
                <FormControl
                  name="ip3"
                    defaultValue={this.props.deviceAddress.ipAddress.ip3}
                  onChange={this.handleChangeIP3}
                  aria-label="IP3"
                  aria-describedby="inputGroup-sizing-default"
                />
                <FormControl
                  name="ip4"
                    defaultValue={this.props.deviceAddress.ipAddress.ip4}
                    onChange={this.handleChangeIP4}
                  aria-label="IP4"
                  aria-describedby="inputGroup-sizing-default"
                />
              </InputGroup>
              </Col>
              <Col lg={12} md={12} sm={12}>
              <InputGroup className="mb-3">
                <InputGroup.Prepend>
                  <InputGroup.Text id="inputGroup-sizing-default">Port</InputGroup.Text>
                </InputGroup.Prepend>
                <FormControl
                  name="port"
                    value={this.props.deviceAddress.port}
                  onChange={this.handleChangePort}
                  aria-label="Port"
                  aria-describedby="inputGroup-sizing-default"
                />
              </InputGroup>
              </Col>
              </Modal.Dialog>
          </Row>
        </Container>
      </div>
    );
  }
  
}

export default connect(
  (state: ApplicationState) => state.openSpeechData,
  OpenSpeechDataStore.openSpeechDataActionCreators
)(AddressManager as any);    
