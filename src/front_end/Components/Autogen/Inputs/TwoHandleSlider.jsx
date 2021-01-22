//Steps
//Create Min + Max Sliders.
//Height of both sliders combined is the same as a standard slider.
//Vertical slider fill for min-slider must be hidden.
// use layering in css for display
import React from "react";
import { Row, Col, Form } from "react-bootstrap";
import ReactBootstrapSlider from "react-bootstrap-slider";
import '../../../assets/sass/two-handle-slider.scss';


export class TwoHandleSlider extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      currentMin: this.props.data[0].value ?
        parseFloat(this.props.data[0].value) : this.props.data[0].properties.min,
      currentMax: this.props.data[1].value ?
        parseFloat(this.props.data[1].value) : this.props.data[1].properties.min,
    }
    this.createSlider = this.createSlider.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.generatePayload = this.generatePayload.bind(this);
  }


  componentWillReceiveProps() {
    if (this.state.currentMin !== this.props.data[0].value){
      this.setState({
        currentMin: parseFloat(this.props.data[0].value)
      });
    }
    if(this.state.currentMax !== this.props.data[1].value){
      this.setState({
        currentMax: parseFloat(this.props.data[1].value) 
      });
    }
  }

  componentDidMount() {
    this.setState({
            currentMin:
        this.props.data[0].value ?
          parseFloat(this.props.data[0].value) : this.props.data[0].properties.min,
          currentMax:
          this.props.data[1].value ?
          parseFloat(this.props.data[1].value) : this.props.data[1].properties.min,
    });
  }

  generatePayload(values){
    const payload = [];
    this.props.view.references.forEach((reference,index) =>{
      (payload.push({
        index:reference,
        value:values[index]
      }))
    });
    return payload;
  }

  handleChange = (min,max) => {
    if(min>=max){
      //Moving Min Handle
      if(min !== this.state.currentMin){
        let updateMax = min + this.props.data[1].properties.step;
        let maxPossible = this.props.data[1].properties.max;
        max = (updateMax <= maxPossible) ? updateMax : maxPossible;
      }
      //Moving Max Handle
      else{
        let updateMin = max - this.props.data[0].properties.step;
        let minPossible = this.props.data[0].properties.min;

        min = (updateMin <= minPossible) ? minPossible : updateMin;
      }
    }
    return(this.props.callback(this.generatePayload([min,max])));
  }

  createSlider = () => {
    return (
      <React.Fragment>
        <Row className="centered-row">
          <Col sm={12} md={12} lg={12} className="autogen-control-name pb-4">
            {this.props.view.name}
          </Col>
        </Row>
        <Row className="vertical-slider-row">
          <Col sm={3} md={3} lg={3} className="vertical-slider-col">
            <div className = "two-handle-slider-container">
              <div className="two-handle-slider-min two-handle-slider">
                <ReactBootstrapSlider
                  orientation={"vertical"}
                  tooltip="hide"
                  reversed={true}
                  step={this.props.data[0].properties.step}
                  min={this.props.data[0].properties.min}
                  max={this.props.data[0].properties.max}
                  value={this.state.currentMin}
                  change={
                    changeEvent => {
                      this.handleChange(changeEvent.target.value,this.state.currentMax);
                    }
                  }
                />
              </div>
              <div  className="two-handle-slider-max two-handle-slider">
                <ReactBootstrapSlider
                  orientation={"vertical"}
                  tooltip="hide"
                  reversed={true}
                  step={this.props.data[1].properties.step}
                  min={this.props.data[1].properties.min}
                  max={this.props.data[1].properties.max}
                  value={this.state.currentMax}
                  change={
                    changeEvent => {
                      this.handleChange(this.state.currentMin,changeEvent.target.value);
                    }
                  }
                />
              </div>
            </div>
          </Col>
          <Col>
            <Col className="vertical-slider-col grid align-end">
                <Row className="stacked-row">
                <div className="autogen-units full-width justify-start flex">
                  dB Max
                  </div>
                <Row className="autogen-value-row full-width justify-start">
              <Row className={this.state.formHighlight}>
                <Form className="autogen-form">
                  <Form.Control
                    className="autogen-form-control float-left"
                    name="val"
                    value={this.state.currentMax.toString()}
                    onChange={
                      changeEvent => {
                        this.handleChange(this.state.currentMin, parseFloat(changeEvent.target.value));
                      }
                    }
                  >
                  </Form.Control>
                </Form>
                </Row>
                  </Row>
                </Row>
              </Col>
              <Col className="vertical-slider-col grid align-end">
                <Row className="stacked-row">
                <div className="autogen-units full-width justify-start flex">
                  dB Min
                  </div>
                <Row className="autogen-value-row full-width justify-start">
              <Row className={this.state.formHighlight}>
                <Form className="autogen-form">
                  <Form.Control
                    className="autogen-form-control float-left"
                    name="val"
                    value={this.state.currentMin.toString()}
                    onChange={
                      changeEvent => {
                        this.handleChange(parseFloat(changeEvent.target.value),this.state.currentMax);
                      }
                    }
                  >
                  </Form.Control>
                </Form>
                </Row>
                  </Row>
                </Row>
              </Col>
          </Col>
        </Row>
      </React.Fragment>
    );
  }

  render(){
    return(
      <div className="autogen autogen-slider">
        {this.createSlider()}
      </div>
    );
  }
}
 
export default TwoHandleSlider;