const WebSocket = require('ws');
const hub = new WebSocket.Server({port:5050});
const CLIENTS = [];

function heartbeat() {
  this.isAlive = true;
}

function noop(){}


hub.getUniqueID = function () {
  function s4() {
      return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
  }
  return s4() + s4() + '-' + s4();
};

hub.addClient = function(ws) {
  ws.id = hub.getUniqueID();
  CLIENTS.push(ws);
  clients = "";
  CLIENTS.forEach((client)=>{
    clients += client.id + ", ";
  });
  return ws.id;
}

hub.removeClient = function(ws){
  CLIENTS.forEach((client,index) => {
    if(client.id === ws.id){
      if(client){
        client.terminate();
      }
      CLIENTS.splice(index,1);
    }
  });
}

hub.broadcast = function(tag, object){
  let message = {
    tag: tag,
    object: object
  }
  hub.clients.forEach(function each(client) {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(message));
    }
  });
}

hub.broadcastAllExcept = function(tag, object, exclude){
  let message = {
    tag: tag,
    object: object
  }
  hub.clients.forEach(function each(client) {
    if (client !== exclude && client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(message));
    }
  });
}

exports.Init = () => {
  hub.on('connection', function connection(ws){
    let clientID = hub.addClient(ws);
    ws.isAlive = true;
    ws.on('pong', heartbeat);

    ws.on('message', function incomingMessage(message){
      let content = JSON.parse(message);
      //Add new tags/listeners here. 
      //Object is: {tag:string, object:any}
      // Where function is the expected function to run/processing.
      // and object is the parameter(s) to pass to the function.
      if(content.tag === 'SendDataPacket'){
       hub.broadcastAllExcept("Update", content.object, ws);
      }
      else if(content.tag === 'ModelUpdated'){
        hub.broadcast("ModelUpdated", content.object);
      }

    });//End Message Handlers
    //After Connected, send user their connection info/ID
    let connectionInfo = {
      tag: "Connected",
      object: "Connection Successful. ID: " + clientID
    }
    ws.send(JSON.stringify(connectionInfo));
  });//End Connection

  //Run interval at end of initialization to ping active clients. Remove stale clients from pool.
  const interval = setInterval(function ping() {
    CLIENTS.forEach(function each(client) {
      if (client.isAlive === false){
        hub.removeClient(client);
        return;
      } 
      client.isAlive = false;
      client.ping(noop);
    });
  }, 10000);

  hub.on('close', function close(){
    clearInterval(interval);
  });
}

