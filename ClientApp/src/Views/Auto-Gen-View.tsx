
import * as React from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps } from 'react-router';
import * as OpenSpeechDataStore from '../Store/OpenSpeechToolsData';
import { ApplicationState } from '..';

import { AutoGenControls } from './FunctionalElements/AutoGenControls';
import { AvailableDemos } from './FunctionalElements/AutoGenDemos';
import { AddressManager } from './FunctionalElements/AutoGenDeviceAddress';
import { BeamformingWrapper } from '../Components/Autogen/Inputs/BeamformingWrapper';

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
        <BeamformingWrapper />
        <AddressManager {...this.props} />
        <AvailableDemos {...this.props} />
        <AutoGenControls  {...this.props} />
      </div>
      );
  }

}

export default connect(
  (state: ApplicationState) => state.openSpeechData,
  OpenSpeechDataStore.openSpeechDataActionCreators 
)(AutogenView as any);     
