//table structure
// | vertex | dist_from_start | previous_vertex |

var mysql = require('mysql');

var db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "password",
  database: "mydb"
});

//updates vertex in table with shorter path

db.connect(function(err) {
    if (err) throw err;
    console.log("Connected!");
  });

var vertex = "A";
var dist = 0;
var prev = "A"
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

db.end((err) => {
  console.log("connection ended");
});