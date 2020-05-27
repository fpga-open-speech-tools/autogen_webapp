import React, { Component} from "react";
import 'react-bootstrap-range-slider/dist/react-bootstrap-range-slider.css';
import SliderWrapper from '../Inputs/SliderWrapper';
import ToggleWrapper from '../Inputs/ToggleWrapper';

export class EffectPanelDiv extends Component {

  //<h2 className="autogen-control-name">{control.title}</h2>
  render() {
    return (
        <div className={"autogen + autogen-panel card" + (this.props.plain ? " card-plain" : "")}>
          <div className="open-speech-header open-speech-header-std open-speech-accent-color">
            <h1 className="open-speech-accent-font">{this.props.headerTitle}</h1>
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
                <InputComponent
                  min={control.min}
                  max={control.max}
                  defaultValue={control.defaultValue}
                  step={0.1}
                  callback={this.props.callback}
                  module={control.module}
                  controlTitle={control.title}
                  link={control.linkerName}
                  type={control.type}
                  units={control.units}
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
  const controlTitle = props.controlTitle;
  const units = props.units;

  if (whatComponent === "slider") {
    return (
      <SliderWrapper
        step={step}
        min={min}
        max={max}
        callback={callback}
        module={module}
        link={link}
        defaultValue={defaultValue}
        controlTitle={controlTitle}
        units={units}
      />
    );
  } else if (whatComponent === "toggle") {
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


