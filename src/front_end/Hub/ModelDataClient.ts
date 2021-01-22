//import * as signalR from "@microsoft/signalr";

import { HubClient } from "./HubClient";

interface ModelDataState {
  connected: boolean;
  processing: boolean;
  payload: any;
}

interface ModelDataCallbacks {
  incomingDataListener: Function,
  incomingMessageListener: Function
}

//let connection = new signalR.HubConnectionBuilder().withUrl("/model-data").build();
//let connection =  new WebSocket("");
console.log(window.location.hostname);
const connection = new HubClient('ws://' + window.location.hostname + ':5050');

export class ModelDataClient{

  public state: ModelDataState = {
    connected:  false,
    processing: false,
    payload:    null
  }
  public callbacks: ModelDataCallbacks = {
    incomingDataListener: this.doNothing,
    incomingMessageListener: this.doNothing
  }

  private doNothing(obj: any) {

  }

  public sendObject(object:any) {
    connection.invoke("SendDataPacket", object);
  }

  public verifyConnection() {
    connection.invoke("AfterConnected", {});
  }

  public startSession() {

    connection.on("Connected", (message:any) => {
      var msg = message.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
      this.state.connected = true;
      this.callbacks.incomingMessageListener(msg);
    });

    connection.on("ModelUpdated", (obj:any) => {
     this.callbacks.incomingDataListener(obj);
    });


    connection.on("Update", (obj:any) => {
      this.callbacks.incomingDataListener(obj);
    });

    // connection.start()
    //   .then(function (val) {
    //   }).then(res => this.verifyConnection())
    //   .catch(function (err) {
    //     setTimeout(() => connection.start(), 5000);
    //     return console.error(err.toString());
    //   });

  } //End Start Connection to SignalR Client hub


}//End ModelDataClient

export default new ModelDataClient();