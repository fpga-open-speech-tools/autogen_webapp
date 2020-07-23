import * as signalR from "@microsoft/signalr";

interface ModelDataState {
  connected: boolean;
}

interface ModelDataCallbacks {
  incomingDataListener: Function,
  incomingMessageListener: Function
}

let connection = new signalR.HubConnectionBuilder().withUrl("/model-data").build();


export class ModelDataClient{

  public state: ModelDataState = {
    connected: false,
  }
  public callbacks: ModelDataCallbacks = {
    incomingDataListener: this.doNothing,
    incomingMessageListener: this.doNothing
  }

  private doNothing(obj: any) {

  }

  public sendObject(object:any) {
    connection.invoke("SendDataPacket", object).catch(function (err) {
      return console.error(err.toString());
    });
  }

  public verifyConnection() {
    connection.invoke("AfterConnected").catch(function (err) {
      return console.error(err.toString());
    });
  }

  public startSession() {

      connection.on("Connected", (message) => {
        var msg = message.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
        this.state.connected = true;
        this.callbacks.incomingMessageListener(msg);
      });

    connection.on("ModelUpdated", (obj) => {
      //var newObj = { dataPackets: obj };
      //return (this.callbacks.incomingDataListener(newObj));
    });

    connection.on("Update", (obj) => {
      //var newObj = { dataPackets: obj };
      return(this.callbacks.incomingDataListener(obj));
    });
    connection.start()
      .then(function (val) {
      }).then(res => this.verifyConnection())
      .catch(function (err) {
        setTimeout(() => connection.start(), 5000);
        return console.error(err.toString());
      });

  } //End Start Connection to SignalR Client hub


}//End ModelDataClient

export default new ModelDataClient();