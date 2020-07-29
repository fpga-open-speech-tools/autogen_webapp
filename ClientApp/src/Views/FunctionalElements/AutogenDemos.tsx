
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
import { OpenSpeechDemoCard } from "../../Components/OpenSpeechDemos/OpenSpeechDemoCard.jsx";
import NotificationWrapper from "../../Components/Notifications/NotificationWrapper.jsx";


// At runtime, Redux will merge together...
type OpenSpeechProps =
  OpenSpeechDataStore.OpenSpeechToolsState // ... state we've requested from the Redux store
  & typeof OpenSpeechDataStore.openSpeechDataActionCreators // ... plus action creators we've requested
  & RouteComponentProps<{}>; // ... plus incoming routing parameters

export interface AutoGenState {
  downloadStatus: DownloadStatus,
  autogen: Autogen,
  notification: Notification
}

interface DownloadStatus {
  lastDownloadProgressRequestTime: number,
  lastDownloadProgress: number,
}

interface Autogen {
  name: string,
}

interface Notification {
  text: string,
  level: string
}

export class AvailableDemos extends React.PureComponent<OpenSpeechProps,AutoGenState>{

  constructor(props: OpenSpeechProps) {
    super(props);

    this.state = {
      downloadStatus: {
        lastDownloadProgressRequestTime: 0,
        lastDownloadProgress: 0,
      },

      notification: {
        text: "",
        level: ""
      },

      autogen: {
        name: ""
      }

    };


    this.handleDownloadDemo = this.handleDownloadDemo.bind(this);
    this.setNotification = this.setNotification.bind(this);
  }


  componentDidMount() {
    this.props.requestOpenSpeechS3Demos();
  }
  componentDidUpdate() {

    if (this.props.autogen) {
      if (this.props.autogen.name === 'Demo Upload Failed' && this.props.autogen.name !== this.state.autogen.name) {
        this.setNotification('error', 'Demo Upload Failed');
        this.setState({
          autogen: {
            name: this.props.autogen.name,
          }
        });
      }
      else if (this.props.autogen.name === "ERROR" && this.props.autogen.name !== this.state.autogen.name) {
        this.setNotification('error', 'Control Generation Failed')
        this.setState({
          autogen: {
            name: this.props.autogen.name
          }
        });
      }
      else if (this.props.autogen.name !== this.state.autogen.name) {
        this.setNotification('success', 'New Controls Generated');
        this.setState({
          autogen: {
            name: this.props.autogen.name
          }
        });
      }
    }
  }





  handleDownloadDemo(device:string,project:string) {
    if (!this.props.isLoading) {
      this.setState({
        autogen: {
          name: project
        }
      });
      this.props.requestDownloadS3Demo(this.props.deviceAddress,device, project);
    }
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

      function animateDownloadStatus(state: AutoGenState, props:OpenSpeechProps, projectID: string) {
      if (props.isDeviceDownloading === true) {
        if (state.autogen.name === projectID) {
          return (
            <Spinner animation="border" variant="light" className="open-speech-loading-anim"/>
            );
        }
        else {
          return (
            <i className="fas fa-info large-icon open-speech-accent-icon" />);
        }
      }
        if (props.autogen && props.currentDemo) {
          if (props.autogen.name === "Demo Upload Failed" && props.currentDemo === projectID) {
          return (< i className="fa fa-times open-speech-accent-font" />);
        }
        else {
          return (<i className="fas fa-info  open-speech-accent-icon" />);
        }
      }
      else {
        return (<i className="fas fa-info open-speech-accent-icon" />);
      }
    }


    //Would like to rewrite this to better consider properties of selection. 
    //Currently, takes into account ui return, selected projectID and object, as well as determines if downloading.
     function highlightIfDownloaded(state: AutoGenState, props: OpenSpeechProps, projectID: string) {
      if (!props.isDeviceDownloading) {
        if (props.currentDemo === projectID) {
          if (props.autogen) {
            if (props.autogen.name === "Demo Upload Failed") {
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
        return ("card card-stats");
      }//[End] Device IS downloading
    }//[end]highlightIfDownloaded



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
                <Modal.Title>Available Demos</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <Row className="autogen-pages">
            {this.props.availableDemos.map((d: OpenSpeechDataStore.Demo) => 
              <React.Fragment key = { d.name }>
                <OpenSpeechDemoCard
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
        </Container>
      </div>
    );
  }
  
}

export default connect(
  (state: ApplicationState) => state.openSpeechData,
  OpenSpeechDataStore.openSpeechDataActionCreators
)(AvailableDemos as any);    
