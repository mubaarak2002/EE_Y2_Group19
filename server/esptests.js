const http = require('http');
const express = require("express");
const app = express();
const mysql = require("mysql");
const { connection } = require('websocket');
const WebSocketServer = require('websocket').server;
const { commandRover } = require('./roverinstructions.js')

var db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "password",
    database: "mydb"
  });

let coordinates;
let moveCord;
let angle;
let msgFlag = 0;
let x;
let y;
let rovx;
let rovy;
let msg = "0000000";
let vision_maze = Array.from({ length: 500 }).map(() => Array.from({ length: 500 }).fill(0));

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

  //for testing, we're going to send data to the client every second
  var i = 0;
  setInterval( function() {
    // socket.emit("distance", {x: rovx, y: rovy});
    // socket.emit("shortest", result);
    var points = [[200, 200], [400, 200], [500, 500]];
    socket.emit("shortest", points);
    socket.emit("distance", {x: 100, y: 100});
    socket.emit("distance", {x: 300, y: 100});
    socket.emit("distance", {x: 350, y: 350});
    socket.emit("distance", {x: 350, y: 500});
    socket.emit("distance", {x: 500, y: 350});
    socket.emit("distance", {x: 100, y: 350});
    socket.emit("shortest", points);
    if((i%3) == 0){
      points = [[100, 100], [100, 350]];
    }
    else if((i%3) == 1){
      points = [[100, 100], [300, 100], [350, 350]];
    }
    else {
      points = [[100, 100], [300, 100], [350, 350], [500, 350]];
    }
    i++;
    socket.emit("shortest", points);
  }, 1000);

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


// the four directions are defined as
//
//  0
// 3 1
//  2

// each element corresponds to an area of the maze
// the first bit of the element encodes information of the
// top side of the area
// etc. for each side of the area
    // 0 corresponds to explo
    function initialise_map() {
      let i, j, line = [], maze = [];
      for (i = 0; i < 5000; i++) {
          line = [];
          for (j = 0; j < 5000; j++) {
              line.push(0xff);
          }
          maze.push(line);
      }
      return maze;
  }
  
  function abs_to_rel(absN, absT) {
      // absN: current absolute direction
      // absT: target absolute direction
      let rel;
      rel = (absT - absN) % 4;
      if (rel < 0) rel = rel + 4;
      return rel;
  }
  
  function read_f(visionMaze, posN, absN, unit = 5){
      let [x, y] = posN
      let look = [x*5, y*5]
      // add 3 to account for diagonals and turning rover around
      for (let j = 0; j < unit + 3; j++) {
          if (absN == 0) look[1]--;
          if (absN == 1) look[0]++;
          if (absN == 2) look[1]++;
          if (absN == 3) look[0]--;
          if (visionMaze[look[1]][look[0]] == 1) return 1;
      }
      return 0;
  }
  
  // posN is an array containing the x [0] and y [1] coordinates
  // of the rover now
  function collect_info(maze, vision_maze, posN, absN) {
      if (maze[posN[1]][posN[0]] == 0xff) {  // means the the current position has
          let wall = 0xf0;                // not been written so writing it in.
          let k = 0;
          rotate(360);
          for (let i = 0; i < 4; i++) {
              // using loop to determine the four absolute directions
              // should be like:k should be the informatio from the light and transform it to relative direction;
              // the value of wall should be the value after a bitwise OR operation between val_wall and (k<<i), and assign the result back to val_wall.
              k = read_f(vision_maze, posN, absN);
              absN = (absN + 1) % 4;
              wall |= (k<<i);
          }   
          maze[posN[1]][posN[0]] &= wall
          maze[posN[1]][posN[0]] &= ((absN<<4)|0x0f);
      }
      return maze;
  }
  
  // choosing a direction: if there exists a direction that hasn't been convered before
  // go that direction; else perform a retrospective
  
  // KEY FUNCTION SET: select direction
  // based on the recordered maze array information, select the appropriate direction
  // scan the surroundings, if there is an unvisited cell, proceed to it
  // if all surrounding cells have been visited, then read the upper 4 bits to determine the direction for backtracking
  
  function is_path(maze, posN, absT) {
      return !((maze[posN[1]][posN[0]]>>absT)&0x01);
  }
  
  function is_new(maze, posN, absN) {
      if (absN == 0) return (maze[posN[1]-1][posN[0]]>>4)==0x0f;
      if (absN == 1) return (maze[posN[1]][posN[0]+1]>>4)==0x0f;
      if (absN == 2) return (maze[posN[1]+1][posN[0]]>>4)==0x0f;
      if (absN == 3) return (maze[posN[1]][posN[0]-1]>>4)==0x0f;
      return 0;
  }
  
  function search_dir(maze, posN, flag) {
      let i;
      let pre = maze[posN[1]][posN[0]] >> 4;
      let back;
      if (!flag) {    // if not sprinting, scan the four directions 
          for (i = 0; i < 4; i++) {
              if(is_path(maze, posN, i) && is_new(maze, posN, i)) {
                  return i;
              }
          }
      }
      if (pre<=1) back = pre + 2;
      if (pre>=2) back = pre - 2;
      return back;
  }
  
  // KEY FUNCTION SET: execution
  
  function go_to_next(posN, absN, absT) {
      // update the current coordinates and absolute direction
      if (absT == 0) posN[1]--;
      if (absT == 1) posN[0]++;
      if (absT == 2) posN[1]++;
      if (absT == 3) posN[0]--;
      absN = absT;
      // execute the actions
      var AngDist = commandRover(rovx, rovy, posN[0]*5, posN[1]*5);
      var Ang = AngDist[0];
      var dist = AngDist[1];
      Ang = Ang.toPrecision(3);
      dist = dist.toPrecision(4);

      
      let arr = [posN, absN]
      return arr; // when calling this function, call: posN, absN = go_to_next(posN, absN, absT);
  }
  
  function explore(position, vision_maze) {
      let [x,y] = position;
      let posN = [x, y];
      posN[0] /= 5;
      posN[1] /= 5;
      let absN = 0;
      let absT;
      let maze = initialise_map();
      while (true) {
          // the maze in collect_info is the vision maze
          maze = collect_info(vision_maze, posN, absN);
          absT = search_dir(maze, posN, 0);
          let arr = go_to_next(posN, absN, absT);
          posN = arr[0];
          absN = arr[1];
      }
  }
  

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
  let arr = [path, distance];
  return arr;
}

// remember to use the algorithm maze, not the vision maze
// var temp = get_path_and_distance(bfs(maze, start, end));
// var result = temp[0];
// var dist = temp[1];
// console.log(result);

// var vertex = result[result.length - 1];
// var prev = result[result.length - 2]
// var sql = "INSERT INTO dijkstra VALUES ('" + vertex + "', '" + dist + "', '" + prev + "') ON DUPLICATE KEY UPDATE vertex = vertex, dist_from_start = '" + dist + "', previous_vertex = '" + prev + "';" ;
// db.query(sql, (err, result) => {
//   if(err) throw err;
// });

explore([rovx, rovy], vision_maze);

//displays the table
var sql = "SELECT * FROM dijkstra";
db.query(sql, (err, result) => {
  if(err) throw err;
  console.log(result);
});

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

wsServer.on('request', function(request) {
  console.log(request)
  var connection = request.accept(null, request.origin)
  console.log((new Date()) + ' Connection accepted.');

  connection.on('message', function(message) {
      if (message.type === 'utf8') {
          console.log('Received Message: ' + message.utf8Data);
          coordinates = message.utf8Data;
          var comma = coordinates.split(",");
          for(let i = 0; i < 8; i++){
              var pair = comma[i].split(" ");
              x = pair[0];
              y = pair[1];
              maze[x][y] = 1;
          }
          pair = comma[8].split(" ");
          rovx = pair[0];
          rovy = pair[1];
          console.log("rover: " + rovx + ", " + rovy);
          maze[0][0] = 0;
          if(msgFlag == 1){
            msg = (angle.toString() + distance.toString());
          }
          connection.sendUTF(msg.toString());
          msg = "0000000";
      }
  });

  connection.on('close', function(reasonCode, description) {
      console.log((new Date()) + ' Peer ' + connection.remoteAddress + ' disconnected.');
  });
});