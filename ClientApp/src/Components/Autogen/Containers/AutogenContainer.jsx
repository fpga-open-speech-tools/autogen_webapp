import React, { Component} from "react";
import 'react-bootstrap-range-slider/dist/react-bootstrap-range-slider.css';

export class AutogenContainer extends Component {
  constructor(props) {
    super(props);
    this.editable = this.props.editable;
  }

  render = () => {
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
          {this.props.references.map((reference) =>
            <React.Fragment key={reference}>
              <div className="autogen autogen-control" key={reference}>
                <InputComponent
                  view={this.props.views[reference]}
                  data={this.props.data}
                  callback={this.props.callback}
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

const InputComponent = (props) => {
  const dataList = [];
  props.view.references.map((reference) => {
    dataList.push(props.data[reference]);
  });

  try {
    let Component = require('../Inputs/' + props.view.type.component).default;
    
    return (
      <Component
        view={props.view}
        data={dataList}
        callback={props.callback}
      />
    );
  }
  catch{
    return (<div>Component Not Recognized!</div>);
  }
}

export default AutogenContainer;


