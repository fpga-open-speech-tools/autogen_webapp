import React, { Component, useState } from "react";
import 'react-bootstrap-range-slider/dist/react-bootstrap-range-slider.css';
import SliderWrapper from '../Inputs/SliderWrapper'

export class EffectDiv extends Component {

  
  render() {
    return (
      <div className={"card" + (this.props.plain ? " card-plain" : "")}>
        <div className={"header" + (this.props.hCenter ? " text-center" : "")}>
          <h4 className="title">{this.props.title}</h4>
          <p className="category">{this.props.category}</p>
        </div>
        <div
          className={
            "content" +
            (this.props.ctAllIcons ? " all-icons" : "") +
            (this.props.ctTableFullWidth ? " table-full-width" : "") +
            (this.props.ctTableResponsive ? " table-responsive" : "") +
            (this.props.ctTableUpgrade ? " table-upgrade" : "")
          }
        >
          {this.props.content}
          <div>
            <h1>{this.props.panel.name}</h1>
          </div>
          {this.props.panel.controls.map((control) =>
            <div>
              <h2>{control.title}</h2>
              <SliderWrapper
                value={control.defaultValue}
              />
            </div>)
          }
          <div className="footer">
            {this.props.legend}
            {this.props.stats != null ? <hr /> : ""}
            <div className="stats">
              <i className={this.props.statsIcon} /> {this.props.stats}
            </div>
          </div>
        </div>
      </div>
    );
  }
}
//onChange={changeEvent => this.setState({ currentValue: changeEvent.target.value })}


export default EffectDiv;


