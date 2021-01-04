import * as React from 'react';
import {Bar, Line} from 'react-chartjs-2';
import {Row, Col} from 'react-bootstrap';

let g_datasets = [];
let g_labels = [];

export class Graph extends React.Component {
  constructor(props){
    super(props);
    this.chartReference  = React.createRef();
    this.state = {
      labels: [],
      backgroundColor: 'rgba(0,123,255,255)',
      borderColor: 'rgba(0,123,255,255)',
      data: [],
      fill: false,
      graphOptions: { 
        maintainAspectRatio: true, 
        animation:{duration: 0},
        responseive: true
      },
      datasets:[]
    }
  }

  batchSet(){

  }

  feedData(data, index, label){
    this.chartReference.chartInstance.update();
    //Push timestamp label to list if not already pushed.
    if(g_labels[g_labels.length-1] !== label){
      g_labels.push(new Date(label).toString());
      if(g_labels.length >= this.props.data[0].properties.config.maxValues){
        g_labels.shift();
      }
      //index does not exist in dataset, create new dataset for index.
      if(!g_datasets[index]){
        let newDataSet = {
          label: index,
          backgroundColor: 'rgba(0,123,255,255)',
          borderColor: 'rgba(0,123,255,255)',
          data: [data.value],
          fill: false,
          pointRadius: 1,
          pointHoverRadius: 1
        };
        g_datasets.push(newDataSet);
        this.chartReference.chartInstance.update();
      }
      else{
        if(g_datasets[index].data.length >= this.props.data[0].properties.config.maxValues){
          g_datasets[index].data.shift();
          this.chartReference.chartInstance.update();
        }
        g_datasets[index].data.push(data.value);
        this.chartReference.chartInstance.update();
      }
    }
    this.forceUpdate();
  }

  componentDidMount() {
    if(!this.props.data[0]){
      return;
    }
    else if(!this.props.data[0].properties.config){
      return;
    }
    if(this.props.data[0].properties.min || this.props.data[0].properties.max){
      console.log("New graph options");
      var min = 0;
      var max = 0;
      var currentOptions = this.state.graphOptions;
      if(this.props.data[0].properties.min){
        min = this.props.data[0].properties.min;
      }
      if(this.props.data[0].properties.max){
        max = this.props.data[0].properties.max;
      }
      currentOptions["scales"] = {
        xAxes:[{
          display:false
        }],
        yAxes:[{
          ticks:{
            min:min,
            max:max
          }
        }]
      }
      this.setState({graphOptions:currentOptions});

    }
    else if(this.props.data[0].properties.config.feed === "batch"){
      //Batch plot dataset
    }
    else if(this.props.data[0].properties.config.feed === "time"){
      let currentTime = new Date();
      this.props.data.forEach((data, index) =>{
        this.feedData(data, index, currentTime);
      });
      //this.forceUpdate();
    }
  }

  componentWillReceiveProps(){
    if(!this.props.data[0]){
      return;
    }
    else if(!this.props.data[0].properties){
      return;
    }
    else if(!this.props.data[0].properties.config){
      return;
    }
    if(this.props.data[0].properties.config.feed === "batch"){
      
    }
    else if(this.props.data[0].properties.config.feed === "time"){
      let currentTime = new Date();
      this.props.data.forEach((data, index) =>{
        this.feedData(data, index, currentTime.getTime());
      });
      //this.forceUpdate();
    }
  }

  render(){
    const GenericGraph = () => {
      if(this.props.view.type.variant === "bar"){
        return(
          <Bar
            ref = {(reference) => this.chartReference = reference}
            data={{labels:g_labels, datasets:g_datasets}}
            options={ this.state.graphOptions }
          />
        );
      }
      else if(this.props.view.type.variant === "line"){
        return(
          <Line 
            ref = {(reference) => this.chartReference = reference}
            data={{labels:g_labels, datasets:g_datasets}}
            options={ this.state.graphOptions }
          />
        );
      }
    }
    return(        
      <div
        id="draw-me"
        className="draw-me"
      >
        <Row className="centered-row">
          <Col sm={12} md={12} lg={12} className="autogen-control-name">
            {this.props.view.name}
          </Col>
        </Row>
        <GenericGraph
          ref = {(reference) => this.chartReference = reference}
          data={{labels:g_labels, datasets:g_datasets}}
          options={ this.state.graphOptions }
        />
      </div>
    );
  }
}

export default Graph;