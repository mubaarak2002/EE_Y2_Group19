const http = require('http');
const express = require("express");
const app = express();
const mysql = require("mysql");

var http = require("http");

function onRequest(request, response) {
  console.log("Received client.");
  response.writeHead(200, {"Content-Type": "text/html"});
  response.write("Hola Mundo.");
  response.end();
}

http.createServer(onRequest).listen(8888);

console.log("Server started.");
