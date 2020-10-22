"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ModelDataClient = void 0;
var signalR = __importStar(require("@microsoft/signalr"));
var connection = new signalR.HubConnectionBuilder().withUrl("/model-data").build();
var ModelDataClient = /** @class */ (function () {
    function ModelDataClient() {
        this.state = {
            connected: false,
            processing: false,
            payload: null
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
        connection.on("ModelUpdated", function (obj) {
            //this.callbacks.incomingDataListener(obj);
        });
        connection.on("Update", function (obj) {
            _this.callbacks.incomingDataListener(obj);
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
