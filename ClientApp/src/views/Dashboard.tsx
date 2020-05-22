
import * as React from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps } from 'react-router';
import * as OpenSpeechDataStore from '../store/OpenSpeechToolsData';
import { ApplicationState } from '../';
import { Container, Row, Col, InputGroup, FormControl, Button, Spinner} from "react-bootstrap";
import { StatsCard } from "../components/StatsCard/StatsCard.jsx";
import { EffectPageDiv } from "../components/Autogen/Containers/EffectPageDiv.jsx";


// At runtime, Redux will merge together...
type OpenSpeechProps =
  OpenSpeechDataStore.OpenSpeechToolsState // ... state we've requested from the Redux store
  & typeof OpenSpeechDataStore.openSpeechDataActionCreators // ... plus action creators we've requested
  & RouteComponentProps<{}>; // ... plus incoming routing parameters

interface IState {
  ipFragment1: string,
  ipFragment2: string,
  ipFragment3: string,
  ipFragment4: string,
  port: string,
  lastDownloadProgressRequestTime: number,
  lastDownloadProgress: number
}

class Dashboard extends React.PureComponent<OpenSpeechProps, IState> {

  constructor(props: OpenSpeechProps) {
    super(props);

    this.state = {
      ipFragment1: '192',
      ipFragment2: '168',
      ipFragment3: '0',
      ipFragment4: '1',
      port: '3355',
      lastDownloadProgressRequestTime: 0,
      lastDownloadProgress: 0
    };
    this.handleIP1Change = this.handleIP1Change.bind(this);
    this.handleIP2Change = this.handleIP2Change.bind(this);
    this.handleIP3Change = this.handleIP3Change.bind(this);
    this.handleIP4Change = this.handleIP4Change.bind(this);
    this.handlePortChange = this.handlePortChange.bind(this);
    this.handlelastDownloadProgressRequestTimeChange = this.handlelastDownloadProgressRequestTimeChange.bind(this);

    this.handleRequestUI = this.handleRequestUI.bind(this);
    this.handleInputCommand = this.handleInputCommand.bind(this);
    this.handleDownloadDemo = this.handleDownloadDemo.bind(this);
    this.handleRequestDownloadProgress = this.handleRequestDownloadProgress.bind(this);
  }


  componentDidMount() {
    this.props.requestOpenSpeechS3Demos();

    if (this.props.downloadProgress) {
      if (this.state.lastDownloadProgress != this.props.downloadProgress.progress) {
        this.setState({
          lastDownloadProgress: this.props.downloadProgress.progress
        });
        this.forceUpdate();
      }
    }
  }

  componentDidUpdate() {

  }

  handlePollDownloadProgress() {
    if (this.props.isDeviceDownloading) {
      var date = new Date();
      var currentDateInMS = date.getTime();
      var requestRateInMS = 100;

      //if the current datetime in milliseconds is greater the last request log plus the request rate,
      //Then set the new request datetime in milliseconds, and request the download progress.
      if (currentDateInMS > (this.state.lastDownloadProgressRequestTime + requestRateInMS)) {
        this.handlelastDownloadProgressRequestTimeChange(currentDateInMS);
        this.handleRequestDownloadProgress();
      }
    }
  }

  handleIP1Change(e: React.ChangeEvent<HTMLInputElement>) {
    this.setState({ ipFragment1: e.target.value });
  }

  handleIP2Change(e: React.ChangeEvent<HTMLInputElement>) {
    this.setState({ ipFragment2: e.target.value });
  }

  handleIP3Change(e: React.ChangeEvent<HTMLInputElement>) {
    this.setState({ ipFragment3: e.target.value });
  }

  handleIP4Change(e: React.ChangeEvent<HTMLInputElement>) {
    this.setState({ ipFragment4: e.target.value });
  }

  handlePortChange(e: React.ChangeEvent<HTMLInputElement>) {
    this.setState({ port: e.target.value });
  }

  handlelastDownloadProgressRequestTimeChange(n: number) {
    this.setState({ lastDownloadProgressRequestTime: n });
  }

  handleRequestUI() {
    this.props.requestOpenSpeechUI(
      this.state.ipFragment1, this.state.ipFragment2, this.state.ipFragment3, this.state.ipFragment4,
      this.state.port);
  }

  handleInputCommand(module: string, link: string, value: string) {
    if (!this.props.isLoading) {
      this.props.requestSendCommand(link, value, module,
        this.state.ipFragment1, this.state.ipFragment2, this.state.ipFragment3, this.state.ipFragment4,
        this.state.port)
    }
  }

  handleDownloadDemo(device:string,project:string) {
    if (!this.props.isLoading) {
      
      this.props.requestDownloadS3Demo(device, project,
        this.state.ipFragment1, this.state.ipFragment2, this.state.ipFragment3, this.state.ipFragment4,
        this.state.port)
    }
  }

  handleRequestDownloadProgress() {
    this.props.requestS3DownloadProgress(
      this.state.ipFragment1, this.state.ipFragment2, this.state.ipFragment3, this.state.ipFragment4,
      this.state.port);

  }

  render() {

    function getAutogen(board: Dashboard, props: OpenSpeechProps) {
      if (props.uiConfig.pages) {
        return (
          <div className="autogen autogen-effectContainer">
            <h1>{"Autogen Effect: " + props.uiConfig.module}</h1>
            {props.uiConfig.pages.map((page) =>
              <React.Fragment key={page.name}>
                <div className={page.name}>
                  <h1>{"Page: " + page.name}</h1>
                  <EffectPageDiv
                    callback={board.handleInputCommand}
                    module={props.uiConfig.module}
                    page={page} />
                </div>
              </React.Fragment>)
            }
          </div>);
      }
      else if(props.uiConfig.module){
        return (<div className="autogen autogen-effectContainer">
          <h1>{props.uiConfig.module}</h1></div>);
      }
    }

    function updateDownloadProgress(board: Dashboard, props: OpenSpeechProps) {
      var downloadingState = "";
      if (props.isDeviceDownloading == true) {
        downloadingState = "Downloading";       
        return (
          <div>
            <h1>{downloadingState}</h1>
            <Spinner animation="border" variant="primary" />
          </div>
        );
      }
      else {
        if (props.uiConfig.module) {
          downloadingState = props.uiConfig.module + " Loaded";
        }
        return (
          <div>
            <h1>{downloadingState}</h1>
          </div>
        );
      }

    }

    return (
      <div className="content">
        <Container fluid>
            <Row>
              <Col lg={3} md={5}>
              <InputGroup className="mb-2">
                <InputGroup.Prepend>
                <InputGroup.Text id="inputGroup-sizing-default">IP</InputGroup.Text>
                </InputGroup.Prepend>
                <FormControl
                  name="ip1"
                  defaultValue={this.state.ipFragment1}
                  onChange={this.handleIP1Change}
                  aria-label="IP1"
                  aria-describedby="inputGroup-sizing-default"
                />
                <FormControl
                  name="ip2"
                  defaultValue={this.state.ipFragment2}
                  onChange={this.handleIP2Change}
                  aria-label="IP2"
                  aria-describedby="inputGroup-sizing-default"
                />
                <FormControl
                  name="ip3"
                  defaultValue={this.state.ipFragment3}
                  onChange={this.handleIP3Change}
                  aria-label="IP3"
                  aria-describedby="inputGroup-sizing-default"
                />
                <FormControl
                  name="ip4"
                  defaultValue={this.state.ipFragment4}
                  onChange={this.handleIP4Change}
                  aria-label="IP4"
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
              <div className = "mb-2">
              {updateDownloadProgress(this, this.props)}
              </div>
          </Row>
          <Row>
            {this.props.availableDemos.map((d: OpenSpeechDataStore.Demo) => 
              <React.Fragment key = { d.name }>
                <StatsCard
                  downloadDevice={d.downloadurl.devicename}
                  downloadProject={d.downloadurl.projectname}
                  callback={this.handleDownloadDemo}
                  statsText={d.name}
                  statsValue={(d.filesize/1000000).toFixed(2) + "MB"}
                  statsIcon={<i className="fa fa-folder-o" />}
                  statsIconText={d.downloadurl.devicename + "/" + d.downloadurl.projectname}
                />
              </React.Fragment>
            )} 
          </Row>
            <div><h1>Auto-gen</h1>
              <Button
              variant="primary"
              onClick={this.handleRequestUI}
              >
              Auto-gen from {this.state.ipFragment1}.{this.state.ipFragment2}.{this.state.ipFragment3}.{this.state.ipFragment4}:{this.state.port}
              </Button>
            </div>
            {getAutogen(this,this.props)}
        </Container>
      </div>
    );
  }
  

}

export default connect(
  (state: ApplicationState) => state.openSpeechData,
  OpenSpeechDataStore.openSpeechDataActionCreators 
)(Dashboard as any);     
