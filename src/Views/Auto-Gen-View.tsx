
import * as React from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps } from 'react-router';
import * as OpenSpeechDataStore from '../Store/OpenSpeechToolsData';
import { ApplicationState } from '..';

import { ControlPanel } from './FunctionalElements/ControlPanel';
import { S3ProjectsContainer } from './FunctionalElements/S3ProjectsContainer';
import { AddressManager } from './FunctionalElements/AutoGenDeviceAddress';

// At runtime, Redux will merge together...
type OpenSpeechProps =
  OpenSpeechDataStore.OpenSpeechToolsState // ... state we've requested from the Redux store
  & typeof OpenSpeechDataStore.openSpeechDataActionCreators // ... plus action creators we've requested
  & RouteComponentProps<{}>; // ... plus incoming routing parameters

// const ws = new WebSocket('ws://localhost:5050');

// ws.onopen = function(event){
//   ws.send(
//     JSON.stringify({
//       function:"SendDataPacket",
//       object:{value:1}
//     })
//   );
//   ws.send(
//     JSON.stringify({
//       function:"ModelUpdated",
//       object:{value:1}
//     })
//   );
// }
// ws.onmessage = function(event){
//   console.log(event);
//   console.log(event.data);
//   if(event.data === 'ping'){
//     ws.send('pong');
//   }
// }


class AutogenView extends React.PureComponent<OpenSpeechProps> {
  
  constructor(props: OpenSpeechProps){
    super(props);
  }

  render() {
    return (
      <div>
        <AddressManager {...this.props} className="d-none"/>
        <S3ProjectsContainer {...this.props} defaultBucket="frost-projects"/>
        <ControlPanel  {...this.props} />
      </div>
      );
  }
}

export default connect(
  (state: ApplicationState) => state.openSpeechData,
  OpenSpeechDataStore.openSpeechDataActionCreators 
)(AutogenView as any);     
