import * as React from "react";
import { connect } from "react-redux";
import { RouteComponentProps } from "react-router";
import * as OpenSpeechDataStore from "../../Store/OpenSpeechToolsData";
import { GetAutogenObjectFromData, Components } from '../../Components/Autogen/Inputs/Manager/MapifyComponents.jsx';
import { ApplicationState } from "../../..";
import {
  Container,
  Row,
  Form,
  Spinner,
  Modal,
  Tab,
  Nav,
  Col,
  Button
} from "react-bootstrap";
import { OpenSpeechProjectCard } from "../../Components/OpenSpeechElements/OpenSpeechProjectCard.jsx";
import NotificationWrapper from "../../Components/Notifications/NotificationWrapper.jsx";

// At runtime, Redux will merge together...
type OpenSpeechProps = OpenSpeechDataStore.OpenSpeechToolsState & // ... state we've requested from the Redux store
  ProjectsProps &
  typeof OpenSpeechDataStore.openSpeechDataActionCreators & // ... plus action creators we've requested
  RouteComponentProps<{}>; // ... plus incoming routing parameters

export interface ProjectsProps{
  defaultBucket?: string;
  className?: string;
}

export interface S3ProjectsState {
  className: string;
  downloadStatus: DownloadStatus;
  autogen: Autogen;
  notification: Notification;
  form: S3Form;
  currentDevice: string;
  downloadTarget: string;
  loadingDemos: boolean;
}

interface DownloadStatus {
  lastDownloadProgressRequestTime: number;
  lastDownloadProgress: number;
}

interface Autogen {
  name: string;
}

interface Notification {
  text: string;
  level: string;
}

interface S3Form {
  s3_bucket: string;
}

export class S3ProjectsContainer extends React.PureComponent<
  OpenSpeechProps,
  S3ProjectsState
> {
  constructor(props: OpenSpeechProps) {
    super(props);

    this.state = {
      className: "",
      downloadStatus: {
        lastDownloadProgressRequestTime: 0,
        lastDownloadProgress: 0,
      },

      notification: {
        text: "",
        level: "",
      },

      autogen: {
        name: "",
      },

      form: {
        s3_bucket: "",
      },
      currentDevice: "",
      downloadTarget: "",
      loadingDemos: false,
    };

    this.handleDownloadDemo = this.handleDownloadDemo.bind(this);
    this.setNotification = this.setNotification.bind(this);
    this.setCurrentDevice = this.setCurrentDevice.bind(this);
    this.requestUI = this.requestUI.bind(this);
  }

  componentDidMount() {
    if(this.props.defaultBucket){
      this.props.requestOpenSpeechS3Demos(this.props.defaultBucket);
      this.setState({ loadingDemos: true, form:{s3_bucket:this.props.defaultBucket} });
    }
    if(this.props.className){
      this.setState({className:this.props.className});
    }
  }

  componentDidUpdate() {
    if (
      this.props.availableDemos.length > 0 &&
      this.state.currentDevice == ""
    ) {
      this.setState({ loadingDemos: false });
      if (this.props.availableDemos[0].name) {
        if (this.props.availableDemos[0].name != this.state.currentDevice) {
          this.setState({ currentDevice: this.props.availableDemos[0].name });
        }
      }
    }
    if(this.props.autogen.views && this.props.autogen.containers){
      if(this.props.autogen.views.length === 0 && this.props.autogen.containers.length === 0){
        if(this.props.autogen.data){
          if(this.props.autogen.data.length !== 0){
            console.log("Fixing Edit");
            this.props.requestSendAutogenConfiguration(
              GetAutogenObjectFromData(this.props.autogen.data, this.props.autogen.options, this.props.autogen.name), 
              this.requestUI
            );
          }
        }
      }
    }
  }

  requestUI(){
    this.props.requestAutogenConfiguration()
  }

  handleDownloadDemo(device: string, project: string) {
    if (!this.props.isLoading) {
      this.setState({ downloadTarget: project });
      this.props.requestDownloadS3Demo(
        this.state.form.s3_bucket,
        device,
        project
      );
    }
  }

  setNotification(level: string, text: string) {
    this.setState({
      notification: {
        level: level,
        text: text,
      },
    });
  }

  setCurrentDevice(device_name: string) {
    this.setState({ currentDevice: device_name });
  }

  handleChange(event: any) {
    let fieldName = event.target.name;
    let fieldVal = event.target.value;
    this.setState({ form: { ...this.state.form, [fieldName]: fieldVal } });
    //this.props.requestOpenSpeechS3Demos(fieldVal);
  }

  render() {
    function tabMapNav(cl: S3ProjectsContainer) {
      function checkClassName(key_name: string, cl: S3ProjectsContainer) {
        if (cl.state.currentDevice === key_name) {
          return "text-white";
        } else {
          return "text-primary";
        }
      }

      return cl.props.availableDemos.map(
        (d: OpenSpeechDataStore.DemoDevice) => (
          <Nav.Item key={d.name}>
            <Nav.Link className={checkClassName(d.name, cl)} eventKey={d.name}>
              <p>{d.name}</p>
            </Nav.Link>
          </Nav.Item>
        )
      );
    }

    function tabMapContent(cl: S3ProjectsContainer) {
      return cl.props.availableDemos.map(
        (d: OpenSpeechDataStore.DemoDevice) => (
          <Tab.Pane key={d.name} eventKey={d.name} title={d.name}>
            <Row>{ProjectCards(cl, d)}</Row>
          </Tab.Pane>
        )
      );
    }

    return (
      <div className={"content " + this.state.className}>
        <NotificationWrapper
          pushText={this.state.notification.text}
          level={this.state.notification.level}
        />
        <Container fluid>
          <Row>
            <Modal.Dialog>
              <Modal.Header>
                <Modal.Title>Available Projects</Modal.Title>
              </Modal.Header>
              <Modal.Body className="mw-1080-px">
                <Form.Group>
                  <Form.Label>S3 Bucket</Form.Label>
                  <Form.Control
                    className="autogen-form-control float-left border-bottom mb-4"
                    type="text"
                    name="s3_bucket"
                    placeholder="s3-bucket"
                    defaultValue={this.state.form.s3_bucket}
                    onChange={this.handleChange.bind(this)}
                  />
                  <Button
                    variant="primary"
                    className="btn-simple btn-icon"
                    onClick={()=> {this.props.requestOpenSpeechS3Demos(this.state.form.s3_bucket)}}
                  >
                    Update
                  </Button>
                </Form.Group>
                <div className="autogen-pages">
                  {DeviceTabs(this, tabMapNav, tabMapContent)}
                </div>
              </Modal.Body>
            </Modal.Dialog>
          </Row>
        </Container>
      </div>
    );
  }
}

function ProjectCards(cl: S3ProjectsContainer, d: any) {
  //Would like to rewrite this to better consider properties of selection.
  //Currently, takes into account ui return, selected projectID and object, as well as determines if downloading.
  function highlightIfDownloaded(
    state: S3ProjectsState,
    props: OpenSpeechProps,
    projectID: string
  ) {
    if (!props.isDeviceDownloading) {
      if (props.currentDemo === projectID) {
        if (props.autogen) {
          if (props.autogen.name === "Demo Upload Failed") {
            return "card card-stats open-speech-is-error-highlighted";
          } //[End]If Demo upload failed
          else {
            return "card card-stats open-speech-is-highlighted";
          } //[End]Demo upload Succeeded
        } //[End]UI Config Exists
        else {
          return "card card-stats open-speech-is-highlighted";
        }
      } //[End] currentDemo downloaded is the entered objectID
      else {
        return "card card-stats";
      } //[End] currentDemo downloaded is not the entered objectID
    } //[End] Device is NOT downloading
    else {
      return "card card-stats";
    } //[End] Device IS downloading
  } //[end]highlightIfDownloaded

  function animateDownloadStatus(
    state: S3ProjectsState,
    props: OpenSpeechProps,
    projectID: string
  ) {
    if (props.isDeviceDownloading === true) {
      if (state.downloadTarget === projectID) {
        return (
          <Spinner
            animation="border"
            variant="light"
            className="open-speech-loading-anim"
          />
        );
      } else {
        return <i className="fas fa-info open-speech-accent-icon" />;
      }
    }
    if (props.autogen && props.currentDemo) {
      if (
        props.autogen.name === "Demo Upload Failed" &&
        props.currentDemo === projectID
      ) {
        return <i className="fas fa-times open-speech-accent-icon" />;
      } else {
        return <i className="fas fa-info  open-speech-accent-icon" />;
      }
    } else {
      return <i className="fas fa-info open-speech-accent-icon" />;
    }
  }

  return d.projects.map((proj: any) => (
    <React.Fragment key={proj.name}>
      <OpenSpeechProjectCard
        isSelected={highlightIfDownloaded(cl.state, cl.props, proj.name)}
        isDownloading={animateDownloadStatus(cl.state, cl.props, proj.name)}
        downloadDevice={d.name}
        downloadProject={proj.name}
        headerTitle={proj.name}
        callback={cl.handleDownloadDemo}
        statsValue={(proj.size / 1000000).toFixed(2) + "MB"}
        statsIcon={<i className="fa fa-folder-o" />}
        statsIconText={d.name + "/" + proj.name}
      />
    </React.Fragment>
  ));
}

function DeviceTabs(
  cl: S3ProjectsContainer,
  tabMapNav: Function,
  tabMapContent: Function
) {
  if (cl.state.loadingDemos) {
    return (
      <div className="col justify-content-center">
        <Spinner
          animation="border"
          variant="primary"
          className="open-speech-loading-anim"
        />
      </div>
    );
  }
  return (
    <Tab.Container
      id="controlled-tab-device"
      activeKey={cl.state.currentDevice}
      onSelect={(k: any) => cl.setCurrentDevice(k)}
      transition={false}
    >
      <label className="form-label">Device</label>
      <Nav variant="pills">{tabMapNav(cl)}</Nav>
      <hr className="mt-0 pt-0 bg-primary"></hr>
      <Tab.Content>{tabMapContent(cl)}</Tab.Content>
    </Tab.Container>
  );
}

export default connect(
  (state: ApplicationState) => state.openSpeechData,
  OpenSpeechDataStore.openSpeechDataActionCreators
)(S3ProjectsContainer as any);
