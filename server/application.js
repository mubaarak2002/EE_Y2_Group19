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
  sql = "SELECT dist_from_start, previous_vertex FROM dijkstra WHERE vertex = '" + vertex + "';";
  db.query(sql, function(err, results){
      if (err){
      throw err;
      }
      results.forEach((row) => {
          distance = row.dist_from_start;
          previous = row.previous_vertex;
      });
      io.of("/webpage").emit("distance", distance);
      console.log (distance);
      console.log ("--------");
      io.of("/webpage").emit("previous", previous);
      console.log (previous);
      console.log ("--------");
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
}, 1000);



	socket.on("disconnect", function () {
		console.log(socket.request.connection.remoteAddress + " has disconnected");
        webId = null;
	});
});

function closest_vertex(distances, start_vertex, unvisited){
  let closest = [0, 0, start_vertex];

  let j = 0;
  while (distances[unvisited[j]] == 0) {
      j++;
      if (j == unvisited.length) {
          return "no path"
      }
  }

  closest[0] = unvisited[j];
  closest[1] = distances[unvisited[j]];

  for (let i = j+1; i < unvisited.length; i++) {
      if ((distances[unvisited[i]] != 0) && distances[unvisited[i]] < closest[1]) {
          closest[0] = unvisited[i];
          closest[1] = distances[unvisited[i]];
      }
  }

  return closest;
}

function get_path(parent, destination) {
  let path = [], vertex = destination;

  while (vertex != -1) {
      path.unshift(vertex);
      vertex = parent[vertex];
  }

  return path;
}

function dijkstra(adjacency, start, end) {
  let num_vertices = adjacency.length, parent = [], unvisited = [], visited = [start];

  for (let i = 0; i < num_vertices; i++) {
      if (i != start) {
          unvisited.push(i);
      }
      parent.push(-1);
  }

  let closest, next_closest;

  for (let i = 0; i < num_vertices - 1; i++) {
      closest = closest_vertex(adjacency[visited[0]], visited[0], unvisited);
      for (let j = 1; j < visited.length; j++) {
          next_closest = closest_vertex(adjacency[visited[j]], visited[j], unvisited);
          if ((closest == "no path") || (next_closest[1] < closest[1])) {
              closest = next_closest;
          }
      }
      if (closest == "no path") {
          return closest;
      }
      let index = unvisited.indexOf(closest[0]);
      unvisited.splice(index, 1);
      visited.push(closest[0]);
      parent[closest[0]] = closest[2];


      if (closest[0] == end) return get_path(parent, end);

  }

  return "incomplete matrix";
}

function get_distance(matrix, path) {
  let distance = 0;
  for (let i = 1; i < path.length; i++) {
      distance += matrix[path[i-1]][path[i]];
  }

  return distance;
}

var matrix = [
  [0, 10, 3, 0, 0],
  [0, 0, 1, 2, 0],
  [0, 4, 0, 8, 2],
  [0, 0, 0, 0, 7],
  [0, 0, 0, 7, 0]
];

var result = dijkstra(matrix, 0, 3);
console.log(result);

var vertex = result[result.length - 1];
var dist = get_distance(matrix, result);
var prev = result[result.length - 2]
var sql = "INSERT INTO dijkstra VALUES ('" + vertex + "', '" + dist + "', '" + prev + "') ON DUPLICATE KEY UPDATE vertex = vertex, dist_from_start = '" + dist + "', previous_vertex = '" + prev + "';" ;
db.query(sql, (err, result) => {
  if(err) throw err;
});

//displays the table
var sql = "SELECT * FROM dijkstra";
db.query(sql, (err, result) => {
  if(err) throw err;
  console.log(result);
});