
import * as React from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps } from 'react-router';
import * as OpenSpeechDataStore from '../Store/OpenSpeechToolsData';
import { ApplicationState } from '..';
import {Container, Row, Modal} from "react-bootstrap";
import {Heatmap} from "../Components/Autogen/Inputs/Spectrogram.jsx";
import {TwoHandleSlider} from "../Components/Autogen/Inputs/TwoHandleSlider.jsx";
import {Slider} from "../Components/Autogen/Inputs/Slider.jsx";
import {ProcessingButton} from "../Components/Autogen/Inputs/ProcessingButton.jsx";
import {Text} from "../Components/Autogen/Inputs/Text.jsx";
import {Graph} from "../Components/Autogen/Inputs/Graph.jsx";

// At runtime, Redux will merge together...
type OpenSpeechProps =
  OpenSpeechDataStore.OpenSpeechToolsState // ... state we've requested from the Redux store
  & typeof OpenSpeechDataStore.openSpeechDataActionCreators // ... plus action creators we've requested
  & RouteComponentProps<{}>; // ... plus incoming routing parameters

var ran = 0;
var groups = [1,2,3,4,5,6,7,8,9,10];
var subGroups = [1,2,3,4,5,6,7,8,9,10];
var data = [] as any;

ran = Math.random();

data = [];
groups.forEach((group)=>{
    subGroups.forEach((subGroup)=>{
      let a = {group:0, variable:0,value:0, height:0};
      a.group = group;
      a.variable = subGroup;
      a.value = Math.random()*60;
      a.height = Math.random();
      data.push(JSON.parse(JSON.stringify(a)));
    });
  });

  var graphData = [{
    value: 0,
    properties: { maxValues:10}
  }];
  var graphView ={
    type: {
      variant: "BAR",
      feed: "time"
    }
  };

export class SandboxView extends React.Component<OpenSpeechProps, any> {
  constructor(props: OpenSpeechProps) {
    super(props);
    this.state = {
      random_number:0,
      data:[],
      view: {

      },
      customMathTestData:[

        {
          value:1,
          properties:{
            min:0,

            max:3,
            step:1
          }
        },
        {
          value:2,
          properties:{
            min:0,
            max:3,
            step:1
          }
        },
        {
          value:"",
        }
      ],

      customMathProcessingOptions:{
        processing:{
          functions:[
            "out1=a+b",
            "out2=b-a+c"
          ],
          inputs:[
            {name:"a",type:"pointer",value:0},
            {name:"b",type:"pointer",value:1},
            {name:"c",type:"constant",value:6},
          ],
          output:"a:%a,b:%b,c:%c,out1:%out1,out2:%out2"
        }
      },

      twoHandleSliderData:[
        {
          value:1,
          properties:{
            min:0,
            step:0.5,
            max:3
          }
        },
        {
          value:2,
          properties:{
            min:0,
            step:0.5,
            max:3
          }
        }
      ],
      sliderData:[
        {
          value:1,
          properties:{
            min:0,
            max:3,
            step:1
          }
        }
      ],
      sliderView:{
        name:"Attack",
        type:{
          variant:"horizontal"
        },
      },
      twoHandleSliderView:{
        name: "Range",
        type:{
          variant:"vertical",
        }
      }
    }
    this.force = this.force.bind(this);
    this.getIt = this.getIt.bind(this);
    this.twoHandleSliderCallback = this.twoHandleSliderCallback.bind(this);
    this.makeSliders = this.makeSliders.bind(this);
  }//End Constructor


  force(state:SandboxView, ){
   function goForIt(){
    ran = Math.random();

    data.forEach((d:any)=>{
      d.value = d.value + 100*Math.random()*(0.005+ 0.005) - 0.005;
      if(d.value<0){
        d.value = 80;
      }
      if(d.value > 100){
        d.value = 20;
      }
      // d.height = d.height + Math.random()*(0.02+0.021) - 0.0205;
      // if(d.height <= 0){
      //   d.height = 0.05;
      // }
      // if(d.height >= 60){
      //   d.height = 60;
      // }
      d.height = 1;
    });
    state.setState({randomNumber:ran, data:data});
   }
   graphData[0].value = 100*ran*(0.005 + 0.005) - 0.005;

   //Repeat Map.
   setTimeout(goForIt,10);

  }

  getIt(state:any){
    return(<Heatmap data={state.data} random_number={state.random_number}></Heatmap>);
  }

  updateSliderData(state:any,value:any){
    this.setState({twoHandleSliderData:value});
  }

  twoHandleSliderCallback(min:any,max:any){
    //console.log("Updating Sliders to: " + min + "," + max);
    let data = [
      {
        value:min,
        properties:{
          min:0,
          step:0.5,
          max:3
        }
      },
      {
        value:max,
        properties:{
          min:0,
          step:0.5,
          max:3
        }
      }
    ];
    this.updateSliderData(this.state,data);
    this.forceUpdate();
  }

  makeSliders(state:any){
    return(<></>
        // <TwoHandleSlider
        //   data={state.twoHandleSliderData}
        //   view={state.twoHandleSliderView}
        //   callback={this.twoHandleSliderCallback}
        // />
    );
  }

  createFakeState(name:any,twoHandleName:any,v1:any,v2:any,v3:any,v4:any){
    let fakeState = {
      name:name,
      twoHandleSliderData:[
        {
          value:v1,
          properties:{
            min:-60,
            max:100,
            step:1
          }
        },
        {
          value:v2,
          properties:{
            min:-60,
            max:100,
            step:1
          }
        }
      ],
      twoHandleSliderView:{
        name:twoHandleName,
        type:{variant:"vertical"}
      },
      sliderData1:[
        {
          value:v3,
          properties:{
            min:0,
            max:1000,
            step:1,
            units:"milliseconds"
          }
        }
      ],
      sliderView1:{
        name:"Attack",
        type:{variant:"horizontal"}
      },
      sliderData2:[
        {
          value:v4,
          properties:{
            min:0,
            max:1000,
            step:1,
            units:"milliseconds"
          }
        }
      ],
      sliderView2:{
        name:"Decay",
        type:{variant:"horizontal"}
      }
    }
    return fakeState;
	}

	createFakeProcessing(state:any,obj:any){
    let newOpts = state.customMathProcessingOptions;
    newOpts.processing.variables = {};
    //console.log(JSON.stringify(newOpts));
    if(newOpts.processing){
      newOpts.processing.inputs.forEach((input:any) => {
        //console.log(JSON.stringify(input));
        if(input.type == "pointer"){
          newOpts.processing.variables[input.name]=state.customMathTestData[input.value].value;
        }
        else if(input.type == "constant"){
          newOpts.processing.variables[input.name] = input.value;
        }
      });
    }

    //console.log(JSON.stringify(newOpts));

    function processingCallback(value:any){
      obj.setState({
        customMathTestData:[
          {
            value:1,
            properties:{
              min:0,
              max:3,
              step:1
            }
          },
          {
            value:2,
            properties:{
              min:0,
              max:3,
              step:1
            }
          },
          {
            value:value,
          }
        ],
      });
    }


		return(
      <div>
			<ProcessingButton
        view={{name:"processing",type:{variant:"standard"}}}
				data={state.customMathTestData}
        options={state.customMathProcessingOptions}
        callback={processingCallback}
			/>
      <Text
        view={{name:"processing",type:{variant:"standard"}}}
        data={state.customMathTestData}
      />
      </div>
		);
	}

  createMockup(state:any){

    return(
      <Row>
        <Modal.Dialog>
        <Modal.Header><Modal.Title>Controls</Modal.Title></Modal.Header>
          <div className="autogen autogen-effectContainer modal-body">
						<Row className="autogen-pages row">
              {this.controlCard(this.createFakeState("Band 1", "0-250 (Hz)", 50,100,20,100)) }
              {this.controlCard(this.createFakeState("Band 2", "250-500 (Hz)" ,50,100,20,100)) }
              {this.controlCard(this.createFakeState("Band 3", "500-750 (Hz)" ,50,100,20,100)) }
              {this.controlCard(this.createFakeState("Band 4", "750-1k (Hz)", 50,100,20,100)) }
              {this.controlCard(this.createFakeState("Band 5", "1k-2k (Hz)", 60,100,20,100)) }
              {this.controlCard(this.createFakeState("Band 6", "2k-4k (Hz)", 70,100,20,100)) }
              {this.controlCard(this.createFakeState("Band 7", "4k-12k (Hz)", 80,100,20,100)) }
							{this.controlCard(this.createFakeState("Band 8", "12k-24k (Hz)", 80,100,20,100)) }
            </Row>
          </div>
        </Modal.Dialog>
      </Row>
    );
 }



  controlCard(state:any){
    return(
      <div className={"autogen + autogen-panel card"}>
        <div className="open-speech-header open-speech-header-std open-speech-accent-color">
        <h1 className="open-speech-accent-font-widget">{state.name}</h1>
        </div>
        <div className ="content autogen autogen-panel">
          <div className ="autogen autogen-control">
            <TwoHandleSlider
              data={state.twoHandleSliderData}
              view={state.twoHandleSliderView}
              callback={this.twoHandleSliderCallback}
            />
          </div>
          <div className = "autogen autogen-control">
            <Slider
              data={state.sliderData1}
              view={state.sliderView1}
            />
          </div>
          <div className = "autogen autogen-control">
            <Slider
              data={state.sliderData2}
              view={state.sliderView2}
            />
          </div>

        </div>
      </div>
    );
  }


  render() {
    this.force(this);
    return (
      <div className="content">
        {this.getIt(this.state)}
        <Container fluid>
					{this.createFakeProcessing(this.state,this)}
					{this.createMockup(this.state)}
          <div className = "autogen autogen-control">
            <Graph
              id="graph-1"
              data = {graphData}
              view = {graphView}
            />
          </div>
        </Container>
      </div>
    );
  } //End Render

}

export default connect(
  (state: ApplicationState) => state.openSpeechData,
  OpenSpeechDataStore.openSpeechDataActionCreators
)(SandboxView as any);
