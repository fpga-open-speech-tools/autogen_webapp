
import * as React from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps } from 'react-router';
import * as OpenSpeechDataStore from '../Store/OpenSpeechToolsData';
import { ApplicationState } from '..';

import { ControlPanel } from './FunctionalElements/ControlPanel';
import { AvailableDemos } from './FunctionalElements/AutogenDemos';
import { AddressManager } from './FunctionalElements/AutoGenDeviceAddress';

// At runtime, Redux will merge together...
type OpenSpeechProps =
  OpenSpeechDataStore.OpenSpeechToolsState // ... state we've requested from the Redux store
  & typeof OpenSpeechDataStore.openSpeechDataActionCreators // ... plus action creators we've requested
  & RouteComponentProps<{}>; // ... plus incoming routing parameters



class AutogenView extends React.PureComponent<OpenSpeechProps> {
  
  constructor(props: OpenSpeechProps){
    super(props);
  }

  render() {
    return (
      <div>
        <AddressManager {...this.props} className="d-none"/>
        <AvailableDemos {...this.props} />
        <ControlPanel  {...this.props} />
      </div>
      );
  }
}

export default connect(
  (state: ApplicationState) => state.openSpeechData,
  OpenSpeechDataStore.openSpeechDataActionCreators 
)(AutogenView as any);     
