"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var signalR = require("@microsoft/signalr");
var connection = new signalR.HubConnectionBuilder().withUrl("/model-data").build();
var ModelDataClient = /** @class */ (function () {
    function ModelDataClient() {
        this.state = {
            connected: false,
        };
        this.callbacks = {
            incomingDataListener: this.doNothing,
            incomingMessageListener: this.doNothing
        };
    }
    ModelDataClient.prototype.doNothing = function (obj) {
    };
    ModelDataClient.prototype.sendObject = function (object) {
        connection.invoke("SendDataPacket", object).catch(function (err) {
            return console.error(err.toString());
        });
    };
    ModelDataClient.prototype.verifyConnection = function () {
        connection.invoke("AfterConnected").catch(function (err) {
            return console.error(err.toString());
        });
    };
    ModelDataClient.prototype.startSession = function () {
        var _this = this;
        connection.on("Connected", function (message) {
            var msg = message.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
            _this.state.connected = true;
            _this.callbacks.incomingMessageListener(msg);
        });
        connection.on("Update", function (obj) {
            return (_this.callbacks.incomingDataListener(obj));
        });
        connection.start()
            .then(function (val) {
        }).then(function (res) { return _this.verifyConnection(); })
            .catch(function (err) {
            setTimeout(function () { return connection.start(); }, 5000);
            return console.error(err.toString());
        });
    }; //End Start Connection to SignalR Client hub
    return ModelDataClient;
}()); //End ModelDataClient
exports.ModelDataClient = ModelDataClient;
exports.default = new ModelDataClient();
//# sourceMappingURL=ModelDataClient.js.map