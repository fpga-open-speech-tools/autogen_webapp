import React, { Component} from "react";
import 'react-bootstrap-range-slider/dist/react-bootstrap-range-slider.css';

//Objective: 
//Take in Data Structures
//Iterate through input component folder
//Find appropriate matches for data / defaults
const Components = () => {
  //const components = JSON.parse('./Components.json');
  const components = require('./Components.json');
  return components;
}


const containsRequiredProps = (requiredProps, dataProps) => {
  var obj = {
    match: true,
    count: 0,
    remainingProps:dataProps.length
    };

  requiredProps.map((currentProp) => {
    if (!dataProps.includes(currentProp)) {
      obj.match = false;
    }
    else {
      obj.remainingProps--;
      obj.count++;
    }
  });
  return obj;
}

const checkOptionalProps = (optionalProps, dataProps) => {
  var obj = {
    count: 0,
    matches:[]
  };
  optionalProps.map((currentProp) => {
    if (dataProps.includes(currentProp)) {
      obj.count++;
      obj.matches.push(currentProp);
    }
  });
  return obj;
}



const MatchDataToComponent = (data) => {
  const dataProps = Object.keys(data.properties).sort();
  var match = "No Match Found.";
  Components().components.map((component) => {
    const requiredProps = component.properties.data.required;
    const optionalProps = component.properties.data.optional;

    const checkMatch = containsRequiredProps(requiredProps, dataProps);
    const optionalMatches = checkOptionalProps(optionalProps, dataProps);

    if (checkMatch.match) {
      match = "Component: " + component.name +
        "\n\t | optional Matches: " + optionalMatches.count +
        "\n\t | Option(s): " + optionalMatches.matches + 
        "\n\t | Expected Options: " + checkMatch.remainingProps;
    }

  });
  return match;
}



export class MapifyComponents extends Component {
  constructor(props) {
    super(props);
    this.MapComponents = this.MapComponents.bind(this);
  }

  MapComponents = () => {
    const matches = [];
    if (this.props.data.length>0) {
      this.props.data.map((data) => { matches.push(MatchDataToComponent(data)); });
    }
    return matches;
  }

  render(){
    return (
      <div>
        
        {this.MapComponents().map((match) =>
        {
          return (<p>{match}</p>);
          })
        }
        
       </div>
      );
  }

}

export default MapifyComponents;


