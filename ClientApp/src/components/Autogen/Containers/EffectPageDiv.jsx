import React, { Component} from "react";
import 'react-bootstrap-range-slider/dist/react-bootstrap-range-slider.css';
import { EffectPanelDiv } from './EffectPanelDiv';

export class EffectPageDiv extends Component {

  
  render() {
    return (
      <div className="autogen autogen-page row">
        {this.props.page.panels.map((panel) =>
          <React.Fragment key={panel.name}>
          <EffectPanelDiv
              title={panel.name}
              panel={panel}
            />
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
    );
  }
}
//onChange={changeEvent => this.setState({ currentValue: changeEvent.target.value })}


export default EffectPageDiv;


