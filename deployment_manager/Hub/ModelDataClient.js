'use strict';

const { HubClient } = require("./HubClient");

class ModelDataClient {
    constructor(url, connected, callback) {
        this.url = url;
        this.connected = connected;
        this.callback = callback;

        this.connection = new HubClient('ws://localhost:5050');
    }
    doNothing(obj) {
    }
    sendObject(object) {
        this.connection.invoke("ModelUpdated", object).catch(function (err) {
            return console.error(err.toString());
        });
    }
    verifyConnection() {
        this.connection.invoke("AfterConnected").catch(function (err) {
            return console.error(err.toString());
        });
    }
    startSession() {

        this.connection.on("Connected", (message) => {
            this.connected = true;
        });

        this.connection.on("Update", (obj) => {
            return this.callback(obj)
        });

        this.connection.onclose( () => {
            this.connected = false;
        });
    }
}

module.exports = ModelDataClient