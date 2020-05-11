
import * as React from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps } from 'react-router';
import * as OpenSpeechDataStore from '../store/OpenSpeechToolsData';
import { ApplicationState } from '../';
import { Container, Row, Col, InputGroup, FormControl, Button} from "react-bootstrap";
import { StatsCard } from "../components/StatsCard/StatsCard.jsx";
import { EffectPanelDiv } from "../components/Autogen/Containers/EffectPanelDiv.jsx";
import { EffectPageDiv } from "../components/Autogen/Containers/EffectPageDiv.jsx";


// At runtime, Redux will merge together...
type OpenSpeechProps =
  OpenSpeechDataStore.OpenSpeechToolsState // ... state we've requested from the Redux store
  & typeof OpenSpeechDataStore.openSpeechDataActionCreators // ... plus action creators we've requested
  & RouteComponentProps<{}>; // ... plus incoming routing parameters

interface IState {
  ipAddress: string,
  port:string
}

class Dashboard extends React.PureComponent<OpenSpeechProps, IState> {

  constructor(props: OpenSpeechProps) {
    super(props);

    this.state = {
      ipAddress: '192168001002',
      port: '3355'
    };
    this.handleIPChange = this.handleIPChange.bind(this);
    this.handlePortChange = this.handlePortChange.bind(this);
    this.handleRequestUI = this.handleRequestUI.bind(this);
    this.handleInputCommand = this.handleInputCommand.bind(this);
    this.handleDownloadDemo = this.handleDownloadDemo.bind(this);
  }


  componentDidMount() {

    this.props.requestOpenSpeechS3Demos();

  }

  handleIPChange(e: React.ChangeEvent<HTMLInputElement>) {
    // No longer need to cast to any - hooray for react!
    this.setState({ ipAddress: e.target.value });
  }

  handlePortChange(e: React.ChangeEvent<HTMLInputElement>) {
    // No longer need to cast to any - hooray for react!
    this.setState({ port: e.target.value });
  }

  handleRequestUI() {
    this.props.requestOpenSpeechUI(this.state.ipAddress, this.state.port);
  }

  handleInputCommand(module: string, link: string, value: string) {
    if (!this.props.isLoading) {
      this.props.requestSendCommand(link, value, module, this.state.ipAddress, this.state.port)
    }
  }

  handleDownloadDemo(downloadurl:string) {
    if (!this.props.isLoading) {
      this.props.requestDownloadS3Demo(downloadurl, this.state.ipAddress, this.state.port)
    }
  }

  render() {
    return (
      <div className="content">
        <Container fluid>
            <Row>
              <Col lg={4} md={4}>
              <InputGroup className="mb-3">
                <InputGroup.Prepend>
                  <InputGroup.Text id="inputGroup-sizing-default">IP</InputGroup.Text>
                </InputGroup.Prepend>
                <FormControl
                  name="ip"
                  defaultValue={this.state.ipAddress}
                  onChange={this.handleIPChange}
                  aria-label="IP"
                  aria-describedby="inputGroup-sizing-default"
                />
              </InputGroup>
              </Col>
            <Col lg={2} md={2}>
              <InputGroup className="mb-3">
                <InputGroup.Prepend>
                  <InputGroup.Text id="inputGroup-sizing-default">Port</InputGroup.Text>
                </InputGroup.Prepend>
                <FormControl
                  name="port"
                  defaultValue={this.state.port}
                  onChange={this.handlePortChange}
                  aria-label="Port"
                  aria-describedby="inputGroup-sizing-default"
                />
              </InputGroup>
              </Col>
            </Row>
          <h1>Available Demos</h1>
          <Row>
            {this.props.availableDemos.map((d: OpenSpeechDataStore.Demo) => 
              <React.Fragment key = { d.name }>
                <StatsCard
                  downloadurl={d.downloadurl}
                  callback={this.handleDownloadDemo}
                  statsText={d.name}
                  statsValue={(d.filesize/1000000).toFixed(2) + "MB"}
                  statsIcon={<i className="fa fa-folder-o" />}
                  statsIconText={d.downloadurl}
                />
              </React.Fragment>
            )} 
          </Row>
            <div><h1>Auto-gen</h1>
              <Button
              variant="primary"
              onClick={this.handleRequestUI}
              >
              Auto-gen from {this.state.ipAddress}:{this.state.port}
              </Button>
            </div>
             <div className = "autogen autogen-effectContainer">
                <h1>{"Autogen Effect: " + this.props.uiConfig.module}</h1>
              {this.props.uiConfig.pages.map((page) =>
                <React.Fragment key={page.name}>
                <div className={page.name}>
                    <h1>{"Page: " + page.name}</h1>
                    <EffectPageDiv
                      callback={this.handleInputCommand}
                      module={this.props.uiConfig.module}
                      page={page} /> 
                  </div>
                </React.Fragment>)
                }
               </div>

        </Container>
      </div>
    );
  }
  

}

export default connect(
  (state: ApplicationState) => state.openSpeechData,
  OpenSpeechDataStore.openSpeechDataActionCreators 
)(Dashboard as any);     
