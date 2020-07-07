import React, { Component } from "react";
import RangeSlider  from 'react-bootstrap-range-slider';
import { Row, Col } from "react-bootstrap";
import ReactDOM from 'react-dom';
import Draggable from 'react-draggable';
import LineTo from 'react-lineto';


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
  }

  componentDidMount() {
    this.setState({
      x: this.props.xDefault,
      y: this.props.yDefault,
      z: this.props.zDefault
    });

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


  render() {
    const dragHandlers = { onStart: this.onStart, onStop: this.onStop };
    const { deltaPosition, controlledPosition } = this.state;
    return (
      <div>
        <div className="box" style={{ height: '500px', width: '500px', position: 'relative', overflow: 'auto', padding: '0' }}>

          {this.state.beamTargets.map((target) => 
            <Draggable bounds="parent" {...dragHandlers}>
              <div className="box smol-item">
                <i class={"fa fa-circle-o " + target.name} aria-hidden="true"></i>
              </div>
            </Draggable>
          )}
          {this.state.micArrays.map((array) =>
            <Draggable bounds="parent" {...dragHandlers}>
              <div className={"box array " + array.id}>
                {array.microphones.map((microphone) =>
                  <div className="mic">
                  <i class={"fa fa-square-o mic " + microphone.id} aria-hidden="true"></i>
                    <LineTo from={microphone.id} to={microphone.beamTarget} />
                  </div>
                )}
              </div>
            </Draggable>
          )}
        </div>
      </div>
    );
  }
}
export default BeamformingWrapper;



