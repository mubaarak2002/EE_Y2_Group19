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

// function getHistory(vertex) {
//   sql = "SELECT dist_from_start, previous_vertex, angle FROM dijkstra WHERE vertex = '" + vertex + "';";
//   db.query(sql, function(err, results){
//       if (err){
//       throw err;
//       }
//       results.forEach((row) => {
//           distance = row.dist_from_start;
//           previous = row.previous_vertex;
//           angle = row.angle;
//       });
//       io.of("/webpage").emit("distance", {dist: distance, prev: previous, angle: angle});
//       console.log (distance);
//       console.log ("--------");
//       // io.of("/webpage").emit("previous", previous);
//       console.log (previous);
//       console.log ("--------");
//   });
// }

const server = http.createServer(app);

const io = require('socket.io')(server); //require socket.io module and pass the http object (the server)

server.listen(3000, () => {
  console.log("Application started and Listening on port 3000");
});

// server.listen(8080, () => {
//   console.log("Listening on port 8080 for esp32");
// });

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/maze.html");
});

let webId = null;

io.of("/webpage").on('connection', function (socket) {// WebSocket Connection
    if (webId == null) {
        webId = socket.id;
        console.log("Connection from webpage" + socket.handshake.headers); //reveals client ip
    } else {
        console.log("Go away");
        socket.disconnect();
    }


    let counter = 0;
  //for testing, we're going to send data to the client every second
  setInterval( function() {
    // getHistory(3);
    var points;
    socket.emit("shortest", points);
    socket.emit("distance", {x: 200, y: 200});
    socket.emit("distance", {x: 400, y: 200});
    socket.emit("distance", {x: 200, y: 500});
    socket.emit("distance", {x: 300, y: 500});
    socket.emit("distance", {x: 400, y: 400});
    socket.emit("distance", {x: 450, y: 300});
    if(counter % 3 == 0){
      points = [[200, 200], [450, 300], [400, 400]];
    }
    else if(counter % 3 == 1){
      points = [[200, 200], [400, 200], [200, 500]];
    }
    else{
      points = [[200, 200], [400, 200], [200, 500], [300, 500]];
    }
    socket.emit("shortest", points);
    counter++;
  }, 1000);

  socket.on("test", function (){
    console.log("test")
  });

	socket.on("disconnect", function () {
		console.log(socket.request.connection.remoteAddress + " has disconnected");
        webId = null;
	});
});

//function closest_vertex(distances, start_vertex, unvisited){
//  let closest = [0, 0, start_vertex];
//
//  let j = 0;
//  while (distances[unvisited[j]] == 0) {
//      j++;
//      if (j == unvisited.length) {
//          return "no path"
//      }
//  }
//
//  closest[0] = unvisited[j];
//  closest[1] = distances[unvisited[j]];
//
//  for (let i = j+1; i < unvisited.length; i++) {
//      if ((distances[unvisited[i]] != 0) && distances[unvisited[i]] < closest[1]) {
//          closest[0] = unvisited[i];
//          closest[1] = distances[unvisited[i]];
//      }
//  }
//
//  return closest;
//}
//
//function get_path(parent, destination) {
//  let path = [], vertex = destination;
//
//  while (vertex != -1) {
//      path.unshift(vertex);
//      vertex = parent[vertex];
//  }
//
//  return path;
//}
//
//function dijkstra(adjacency, start, end) {
//  let num_vertices = adjacency.length, parent = [], unvisited = [], visited = [start];
//
//  for (let i = 0; i < num_vertices; i++) {
//      if (i != start) {
//          unvisited.push(i);
//      }
//      parent.push(-1);
//  }
//
//  let closest, next_closest;
//
//  for (let i = 0; i < num_vertices - 1; i++) {
//      closest = closest_vertex(adjacency[visited[0]], visited[0], unvisited);
//      for (let j = 1; j < visited.length; j++) {
//          next_closest = closest_vertex(adjacency[visited[j]], visited[j], unvisited);
//          if ((closest == "no path") || (next_closest[1] < closest[1])) {
//              closest = next_closest;
//          }
//      }
//      if (closest == "no path") {
//          return closest;
//      }
//      let index = unvisited.indexOf(closest[0]);
//      unvisited.splice(index, 1);
//      visited.push(closest[0]);
//      parent[closest[0]] = closest[2];
//
//
//      if (closest[0] == end) return get_path(parent, end);
//
//  }
//
//  return "incomplete matrix";
//}
//
//function get_distance(matrix, path) {
//  let distance = 0;
//  for (let i = 1; i < path.length; i++) {
//      distance += matrix[path[i-1]][path[i]];
//  }
//
//  return distance;
//}
//
//var matrix = [
//  [0, 10, 3, 0, 0],
//  [0, 0, 1, 2, 0],
//  [0, 4, 0, 8, 2],
//  [0, 0, 0, 0, 7],
//  [0, 0, 0, 7, 0]
//];
//
//var result = dijkstra(matrix, 0, 3);

function bfs(maze, start, end) {
    let vertex, new_vertex, wall;
    let q = [];
    let visited = {};
    let parent = {};
    visited[start] = true;
    q.push(start);
    while (q.length > 0) {
        vertex = q.shift();
        if (vertex == end) return parent;
        for (let i = 0; i < 4; i++) {
            if (i == 0) new_vertex = [vertex[1]-1,vertex[0]];
            if (i == 1) new_vertex = [vertex[1],vertex[0]+1];
            if (i == 2) new_vertex = [vertex[1]+1,vertex[0]];
            if (i == 3) new_vertex = [vertex[1],vertex[0]-1];
            wall = (new_vertex >> (i + 4)) & 0x01;
            if (!wall && !(new_vertex in visited)) {
                visited[new_vertex] = true;
                parent[new_vertex] = vertex;
                q.push(new_vertex);
            }
        }
    } 

    return parent;
}

function get_path_and_distance(parent, start, end) {
    let distance = 0;
    let path = [end];
    let vertex = end;
    while (vertex != start) {
        vertex = parent[vertex]
        path.unshift(vertex);
        distance++;
    }
    return path, distance;
}

// remember to use the algorithm maze, not the vision maze
var result, dist = get_path_and_distance(bfs(maze, start, end));
console.log(result);

var vertex = result[result.length - 1];
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
