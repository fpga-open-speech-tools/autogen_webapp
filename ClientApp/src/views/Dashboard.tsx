
import * as React from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps } from 'react-router';
import * as OpenSpeechDataStore from '../store/OpenSpeechToolsData';
import { ApplicationState } from '../';
import {
  Container, Row, Col, InputGroup,
  FormControl, Button, Spinner,
  Card, Jumbotron, Modal
} from "react-bootstrap";
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
  lastDownloadProgress: number,
  projectID: string
}

class Dashboard extends React.PureComponent<OpenSpeechProps, IState> {

  constructor(props: OpenSpeechProps) {
    super(props);

    this.state = {
      ipFragment1: '127',
      ipFragment2: '0',
      ipFragment3: '0',
      ipFragment4: '1',
      port: '3355',
      lastDownloadProgressRequestTime: 0,
      lastDownloadProgress: 0,
      projectID: "Example"
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
    this.handleRequestUI();

    if (this.props.downloadProgress) {
      if (this.state.lastDownloadProgress !== this.props.downloadProgress.progress) {
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
      this.setState({ projectID: project });
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
            <Jumbotron>{props.uiConfig.module}</Jumbotron>
            <Card>
            {props.uiConfig.pages.map((page) =>
              <React.Fragment key={page.name}>
                <div className={page.name}>
                  <Jumbotron>{page.name}</Jumbotron>
                  <EffectPageDiv
                    callback={board.handleInputCommand}
                    module={props.uiConfig.module}
                    page={page} />
                  </div>
              </React.Fragment>)
              }
              </Card>
          </div>);
      }
      else if(props.uiConfig.module){
        return (<div className="autogen autogen-effectContainer">
          <h4>{props.uiConfig.module}</h4></div>);
      }
    }


    function animateDownloadStatus(state: IState, props:OpenSpeechProps, projectID: string) {
      if (props.isDeviceDownloading === true) {
        if (state.projectID === projectID) {
          return (
            <Spinner animation="border" variant="light" className="open-speech-loading-anim"/>
            );
        }
        else {
          return (
            <i className="fa fa-info large-icon open-speech-accent-font" />);
        }
      }
      if (props.uiConfig && props.currentDemo) {
        if (props.uiConfig.module === "Demo Upload Failed" && props.currentDemo === projectID) {
          return (< i className="fa fa-times large-icon open-speech-accent-font" />);
        }
        else {
          return (<i className="fa fa-info large-icon open-speech-accent-font" />);
        }
      }
      else {
        return (<i className="fa fa-info large-icon open-speech-accent-font" />);
      }
    }


    //Would like to rewrite this to better consider properties of selection. 
    //Currently, takes into account ui return, selected projectID and object, as well as determines if downloading.
    function highlightIfDownloaded(state: IState, props: OpenSpeechProps, projectID: string) {
      if (!props.isDeviceDownloading) {
        if (props.currentDemo === projectID) {
          if (props.uiConfig) {
            if (props.uiConfig.module === "Demo Upload Failed") {
              return ("card card-stats open-speech-is-error-highlighted");
            }//[End]If Demo upload failed
            else {
              return ("card card-stats open-speech-is-highlighted");
            }//[End]Demo upload Succeeded
          }//[End]UI Config Exists
          else {return ("card card-stats open-speech-is-highlighted");}
        }//[End] currentDemo downloaded is the entered objectID
        else {
          return ("card card-stats");
        }//[End] currentDemo downloaded is not the entered objectID
      }//[End] Device is NOT downloading
      else {
        if (props.currentDemo) {
          if (props.currentDemo === projectID) {
            if (props.uiConfig) {
              if (props.uiConfig.module === "Demo Upload Failed") {
                return ("card card-stats open-speech-is-error-highlighted");
              }//[End] Demo Upload Failed
              else {
                return ("card card-stats");
              }//[End] Demo Upload Did not Fail
            }//[End] Ui Config Exists
            else {
              return ("card card-stats");
            }//[End] Ui Config Does not exist
          }//[End]Current project selected matches object
          else {
            return ("card card-stats");
          }//[End] Current Project Selected does not match object
        }//[End] We do have a current demo property
        else {
          return ("card card-stats");
        }//[End] We do not have a current demo property
      }//[End] Device IS downloading
    }//[end]highlightIfDownloaded

    return (
      <div className="content">
        <Container fluid>
          <Row>
            <Modal.Dialog><Modal.Header><Modal.Title>Connection</Modal.Title></Modal.Header>
              <Col lg={12} md={12} sm={12}>
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
              <Col lg={12} md={12} sm={12}>
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
              </Modal.Dialog>
          </Row>
          <Row>
          <Modal.Dialog>
              <Modal.Header><Modal.Title>Available Demos</Modal.Title></Modal.Header>
              <Modal.Body>
                <Row>
            {this.props.availableDemos.map((d: OpenSpeechDataStore.Demo) => 
              <React.Fragment key = { d.name }>
                <StatsCard
                  isSelected={highlightIfDownloaded(this.state,this.props,d.name)}
                  isDownloading={animateDownloadStatus(this.state,this.props,d.name)}
                  downloadDevice={d.downloadurl.devicename}
                  downloadProject={d.downloadurl.projectname}
                  headerTitle={d.name}
                  callback={this.handleDownloadDemo}
                  statsValue={(d.filesize/1000000).toFixed(2) + "MB"}
                  statsIcon={<i className="fa fa-folder-o" />}
                  statsIconText={d.downloadurl.devicename + "/" + d.downloadurl.projectname}
                />
              </React.Fragment>
            )} 
          </Row>
                </Modal.Body>
            </Modal.Dialog>
          </Row>
          <Row>
            <Modal.Dialog>
              <Modal.Header><Modal.Title className="float-left">Controls</Modal.Title>
                <div className="float-right">
                <Button
                  variant="primary"
                  className="btn-simple btn-icon"
                  onClick={this.handleRequestUI}
                >
                  <i className="fa fa-refresh large-icon" />
                </Button>
              </div></Modal.Header>

            {getAutogen(this, this.props)}
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
)(Dashboard as any);     
