import React, { Component } from "react";
import RangeSlider  from 'react-bootstrap-range-slider';
import { Row, Col } from "react-bootstrap";
import ReactDOM from 'react-dom';
import Draggable from 'react-draggable';
import Line from 'react-lineto';


export class BeamformingWrapper extends Component {

  eventLogger = (e, data) => {
    console.log('Event: ', e);
    console.log('Data: ', data);
  }

  constructor(props) {
    super(props);
    this.state = {
      x: 0,
      y: 0,
      z: 0,
      activeDrags: 0,
      deltaPosition: {
        x: 0, y: 0
      },
      controlledPosition: {
        x: -400, y: 200
      },
      beamTargets: [
        {
          target: 1,
          name: "Target1",
          position: {
            x: 0,
            y: 0
          }
        },
        {
          target: 2,
          name: "Target2",
          position: {
            x: 0,
            y: 0
          }
        }
      ],
      micArrays: [
        {
          id: "array_1",
          microphones: [
            {
              id: "mic1",
              beamTarget: "Target1"
            },
            {
              id: "mic2",
              beamTarget: "Target1"
            },
            {
              id: "mic3",
              beamTarget: "Target2"
            },
            {
              id: "mic4",
              beamTarget: "Target2"
            }
          ]
        },
        {
          id: "array_2",
          microphones: [
            {
              id: "mic5",
              beamTarget: "Target2"
            },
            {
              id: "mic6",
              beamTarget: "Target2"
            },
            {
              id: "mic7",
              beamTarget: "Target2"
            },
            {
              id: "mic8",
              beamTarget: "Target1"
            }
          ]
        }
      ]
    };

    this.drawMicArrays = this.drawMicArrays.bind(this);
    this.drawTargets = this.drawTargets.bind(this);
    this.drawLines = this.drawLines.bind(this);
  }

  componentDidMount() {
    this.setState({
      x: this.props.xDefault,
      y: this.props.yDefault,
      z: this.props.zDefault
    });
  }

  componentDidUpdate() {
    
  }

  handleDrag = (e, ui) => {
    const { x, y } = this.state.deltaPosition;
    this.setState({
      deltaPosition: {
        x: x + ui.deltaX,
        y: y + ui.deltaY,
      }
    });
  };

  onStart = () => {
    this.setState({ activeDrags: ++this.state.activeDrags });
  };

  onStop = () => {
    this.setState({ activeDrags: --this.state.activeDrags });
  };

  // For controlled component
  adjustXPos = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const { x, y } = this.state.controlledPosition;
    this.setState({ controlledPosition: { x: x - 10, y } });
  };

  adjustYPos = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const { controlledPosition } = this.state;
    const { x, y } = controlledPosition;
    this.setState({ controlledPosition: { x, y: y - 10 } });
  };

  onControlledDrag = (e, position) => {
    const { x, y } = position;
    this.setState({ controlledPosition: { x, y } });
  };

  onControlledDragStop = (e, position) => {
    this.onControlledDrag(e, position);
    this.onStop();
  };

  drawMicArrays(props, micArrays) {
    return (
      micArrays.map((array) =>
        <Draggable bounds="parent" {...props.dragHandlers} key={array.id}>
          <div className={"box array " + array.id}>
            {array.microphones.map((microphone) =>
              <div className={"mic " + microphone.id} key={microphone.id}>
                <i className={"fa fa-square-o mic " + microphone.id} aria-hidden="true"></i>
              </div>
            )}
          </div>
        </Draggable>
    ));
  }



  drawTargets(props, beamTargets) {
    return (
      beamTargets.map((target) =>
        <Draggable bounds="parent" {...props.dragHandlers} key={target.name}>
        <div className="box smol-item">
          <i className={"fa fa-circle-o " + target.name} aria-hidden="true"></i>
        </div>
      </Draggable>
    ));
  }

  drawLines(micArrays) {
    return (
      micArrays.map((array) => {
        array.microphones.map((microphone) =>
          <Line
            delay={100}
            x0={this.state.controlledPosition.x}
            y0={this.state.controlledPosition.y}
            x1={this.state.deltaPosition.x}
            y1={this.state.deltaPosition.y} />
        )
      }
    ));
  }


  render() {
    const dragHandlers = { onStart: this.onStart, onStop: this.onStop };
    const { deltaPosition, controlledPosition } = this.state;

    return(
      <div>
        <div className="box" style={{ height: '500px', width: '500px', position: 'relative', overflow: 'auto', padding: '0', boxShadow:'1px 1px 3px gray' }}>
          {this.drawTargets(this, this.state.beamTargets)}
          {this.drawMicArrays(this, this.state.micArrays)}
          {this.drawLines(this.state.micArrays)}
        </div>
      </div>
    );
  }
}
export default BeamformingWrapper;



