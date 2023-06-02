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

let distance;
let previous;

db.connect(function(err) {
    if (err) throw err;
    console.log("Connected!");
    });

    function getHistory(vertex) {
 
      // let distance;
      // let previous;
  
      function get_info(vertex, callback) {
          // console.log("2: ", player1, " ", player2);
          sql = "SELECT dist_from_start, previous_vertex FROM dijkstra WHERE vertex = '" + vertex + "';";
          // console.log(sql);
          db.query(sql, function(err, results){
              if (err){ 
              throw err;
              }
              // console.log(results);
              results.forEach((row) => {
                  distance = row.dist_from_start;
                  previous = row.previous_vertex;
  
                  // console.log("AAAAAAAA  ", P1wins, " ", P2wins);
              });
              io.of("/webpage").emit("distance", distance);
              console.log (distance);
              console.log ("--------");
              io.of("/webpage").emit("previous", previous);
              console.log (previous);
              console.log ("--------");
              return callback(results.dist_from_start);
          });
      }
      
      
      get_info(vertex, function(result){
          // console.log("3: ", player1, " ", player2);
          // console.log(distance);
          // console.log(previous);
          // clientIDs.forEach(clientID => {
          //     io.of("/client").to(clientID).emit("clientData", data);
          // });
          // if (gameSend) {
          //     io.of("/webpage").to(webId).emit("history", data);
          // }
      });
      
  }

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

//for testing, we're just going to send data to the client every second
setInterval( function() {

  getHistory(3);
  // socket.emit('distance', distance);
  // console.log (distance);
  // console.log ("--------");
  // socket.emit('previous', previous);
  // console.log (previous);
  // console.log ("--------");

}, 1000);

	socket.on("disconnect", function () {
		console.log(socket.request.connection.remoteAddress + " has disconnected");
        webId = null;
	});
});