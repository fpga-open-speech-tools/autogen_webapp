import React, { Component} from "react";
import 'react-bootstrap-range-slider/dist/react-bootstrap-range-slider.css';
import SliderWrapper from '../Inputs/SliderWrapper';
import ToggleWrapper from '../Inputs/ToggleWrapper';

export class EffectPanelDiv extends Component {

  
  render() {
    return (
      <div className={"autogen + autogen-panel card" + (this.props.plain ? " card-plain" : "")}>
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
            (this.props.ctTableUpgrade ? " table-upgrade" : "") +
            " autogen" + " autogen-panel"
          }
        >
          {this.props.content}
          {this.props.panel.controls.map((control) =>
            <React.Fragment key={control.linkerName}>
              <div className="autogen autogen-control" key={control.linkerName}>
                <h2>{control.title}</h2>
                <InputComponent
                  min={control.min}
                  max={control.max}
                  step={0.1}
                  callback={this.props.callback}
                  module={control.module}
                  link={control.linkerName}
                  type={control.type}
                />
                </div>
            </React.Fragment>
          )}
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

function InputComponent(props) {

  const whatComponent = props.type;
  const defaultValue = props.defaultValue;
  const module = props.module;
  const link = props.link;
  const callback = props.callback;
  const min = props.min;
  const max = props.max;
  const step = props.step;

  if (whatComponent == "slider") {
    return (
      <SliderWrapper
        step={step}
        min={min}
        max={max}
        callback={callback}
        module={module}
        link={link}
        value={defaultValue}
      />
    );
  } else if (whatComponent == "toggle") {
    return (
      <ToggleWrapper
        module={module}
        link={link}
        callback={callback}
        value={defaultValue}
      />
    );
  }
}

export default EffectPanelDiv;


