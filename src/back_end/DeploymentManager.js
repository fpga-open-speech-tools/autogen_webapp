#!/usr/bin/env node
var os = require( 'os' );
var networkInterfaces = os.networkInterfaces( );

console.log( networkInterfaces );


const ip = networkInterfaces.lo ? networkInterfaces.lo[0].address : networkInterfaces.lo0[0].address;
const port = 5000;

const server = require('./Server/Controller.js');
const service = require('./Server/Service.js');
const hub = require('./Hub/ModelDataHub.js');

hub.Init();
service.Init();
// TODO: listen on lo and eth0 and wlan?
server.listen(port, '0.0.0.0', () => {
    console.log(`Server running at http://${ip}:${port}/`);
});


