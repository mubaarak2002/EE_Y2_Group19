const http = require('http');
const express = require("express");
const app = express();
const mysql = require("mysql");
const WebSocketServer = require('websocket').server;

let coordinates;

var server2 = http.createServer(function(request, response) {
    console.log((new Date()) + ' Received request for ' + request.url);
    response.writeHead(404);
    response.end();
  });
  server2.listen(5000, function() {
    console.log((new Date()) + ' Server is listening on port 5000');
  });
  
  wsServer = new WebSocketServer({
    httpServer: server2,
    // You should not use autoAcceptConnections for production
    // applications, as it defeats all standard cross-origin protection
    // facilities built into the protocol and the browser.  You should
    // *always* verify the connection's origin and decide whether or not
    // to accept it.
    autoAcceptConnections: false
  });
  
  function originIsAllowed(origin) {
  // put logic here to detect whether the specified origin is allowed.
  return true;
  }
  
  wsServer.on('request', function(request) {
    console.log(request)
    if (!originIsAllowed(request.origin)) {
      // Make sure we only accept requests from an allowed origin
      request.reject();
      console.log((new Date()) + ' Connection from origin ' + request.origin + ' rejected.');
      return;
    }
    
    var connection = request.accept(null, request.origin)
    console.log((new Date()) + ' Connection accepted.');
  
    connection.on('message', function(message) {
        if (message.type === 'utf8') {
            console.log('Received Message: ' + message.utf8Data);
            coordinates = message.utf8Data;
            console.log(string[0]);
            console.log(string[1]);
            //connection.sendUTF(message.utf8Data); this resend the reseived message, instead of it i will send a custom message. hello from nodejs
            connection.sendUTF("Hello from node.js");
        }
  
        else if (message.type === 'binary') {
            console.log('Received Binary Message of ' + message.binaryData.length + ' bytes');
            connection.sendBytes(message.binaryData);
        }
    });
  
    connection.on('close', function(reasonCode, description) {
        console.log((new Date()) + ' Peer ' + connection.remoteAddress + ' disconnected.');
    });
  });

var comma = coordinates.split(",");
maze = Array.from({ length: 10 }).map(() => Array.from({ length: 10 }).fill(0));
for(let i = 0; i < comma.length; i++){
    var pair = comma[i].split(" ");
    var x = pair[0];
    var y = pair[1];
    maze[x][y] = 1;
    //console.log("x = " + x + " y = " + y);
}
maze[0][0] = 0;
console.table(maze);