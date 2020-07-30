import React, { Component} from "react";
import 'react-bootstrap-range-slider/dist/react-bootstrap-range-slider.css';

//Objective: 
//Take in Data Structures
//Iterate through input component folder
//Find appropriate matches for data / defaults
export const Components = () => {
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

export function getViewsFromData(modelDataArray) {
  var views = [];
  modelDataArray.map((modelData, index) => {
    const component = MatchDataToComponent(modelData);
    const view = {
      name: modelData.name,
      type: component,
      references:[index]
    };
    views.push(view);
  });
  return views;
}

export function getContainers(viewArray, dataArray) {
  //make empty container list
  var containers = [];
  //get list of unique device names
  const devices = getUniqueDevices(dataArray);
  //add an empty container for each unique device
  devices.map((device) => {
    const container = {
      name: device,
      views: []
    };
    containers.push(container);
  });
  //add each view to the container list
  viewArray.map((view, viewIndex) => {
    //find view's referenced data's device
    const device = dataArray[view.references[0]].device;
    //find matching container for device, add view's index.
    containers.map((container,containerIndex) => {
      if (container.name === device) {
        containers[containerIndex].views.push(viewIndex);
      }
    });
  });
  return containers;
}

export function createUIObjectFromData(data,name) {
  const views = getViewsFromData(data);
  const containers = getContainers(views, data);
  const autogenObject = {
    name: name,
    views: views,
    data: data,
    containers: containers
  };
  return autogenObject;
}

const getUniqueDevices = (data) => {
  var deviceNames = [];
  data.map((model) => {
    if (!deviceNames.includes(model.device)) {
      deviceNames.push(model.device);
    }
  });
  return deviceNames;
}



const MatchDataToComponent = (data) => {
  const dataProps = Object.keys(data.properties);
  var match = {};
  Components().components.map((component) => {
    const requiredProps = component.properties.data.required;
    const optionalProps = component.properties.data.optional;

    const checkMatch = containsRequiredProps(requiredProps, dataProps);
    var defaultVariant = component.variants.length === 0 ? "" : component.variants[0];
    //const optionalMatches = checkOptionalProps(optionalProps, dataProps);
    if (checkMatch.match) {
      match = { component: component.name, variant: defaultVariant };
     // match = component.name;
    }

  });
  return match;
}

//Add View to container. Needs the autogen object.
export function AddViewToContainer(autogen, container, containerIndex, viewIndex) {
  container.views.push(viewIndex);
  autogen.containers[containerIndex] = container;
  return autogen;
}

export function RemoveViewFromContainer(autogen, container, containerIndex, itemIndexToRemove) {
  container.views.splice(itemIndexToRemove, 1);
  autogen.containers[containerIndex] = container;
  return autogen;
}

export function GetAutogenObjectFromData(data, name) {
  const autogen = { name: "", views: [], data: data, containers: [] };
  if (data.length > 0) {
    var obj = createUIObjectFromData(data, name);
    autogen.name = obj.name;
    autogen.views = obj.views;
    autogen.containers = obj.containers;
  }
  return autogen;
}



export class MapifyComponents extends Component {
  constructor(props) {
    super(props);
    this.MapComponents = this.MapComponents.bind(this);
  }

  MapComponents = () => {
    const autogen = { name: "", views: [], data: this.props.data, containers: [] };
    if (this.props.data.length>0) {
      var obj = createUIObjectFromData(this.props.data, this.props.name);
      autogen.name = obj.name;
      autogen.views = obj.views;
      autogen.containers = obj.containers;
    }
    return JSON.stringify(autogen);
  }

  render(){
    return (
       <div> 
        {this.MapComponents()}
       </div>
      );
  }

}

export default MapifyComponents;


