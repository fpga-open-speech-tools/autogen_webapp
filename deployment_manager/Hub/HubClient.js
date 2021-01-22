exports.HubClient = function(address){
  this.address = address;
  this.ws = new WebSocket(address);
  const listeners = [];

  this.invoke = function(tag, object){
    this.ws.send(JSON.stringify({tag:tag, object:object}));
  }
  this.on = function(tag, operation){
    listeners.push({tag:tag,operation:operation});
    this.ws.onmessage = function(event){

      let tag = JSON.parse(event.data).tag;
      let message = JSON.parse(event.data).object;

      if(listeners){
        listeners.forEach((listener) => {
          if(tag === listener.tag){
            listener.operation(message);
          }
        });
      }
    }
  }
}