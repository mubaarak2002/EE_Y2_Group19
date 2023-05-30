const http = require('http');
const express = require("express");
const app = express();
const mysql = require("mysql");

var db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "password",
    database: "mydb"
  });

// db.connect(function(err) {
//     if (err) throw err;
//     console.log("Connected!");
//     });

// var sql = "SELECT * FROM dijkstra";
// db.query(sql, (err, result) => {
//     if(err) throw err;
//     console.log(result);
// });

const server = http.createServer(app);

const io = require('socket.io')(server); //require socket.io module and pass the http object (the server)

server.listen(3000, () => {
  console.log("Application started and Listening on port 3000");
});

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/maze.html");
});

let clientIDs = [];
let webId = null;

io.of("/webpage").on('connection', function (socket) {// WebSocket Connection
    if (webId == null) {
        webId = socket.id;
        console.log("Connection from webpage" + socket.handshake.headers); //reveals client ip
    } else {
        console.log("Go away");
        socket.disconnect();
    }

    socket.on("restart", function() {
        clientIDs = [];
        playerNames = [];
        io.of("/client").disconnectSockets();
    });

	socket.on("disconnect", function () {
		console.log(socket.request.connection.remoteAddress + " has disconnected");
        webId = null;
	});
});