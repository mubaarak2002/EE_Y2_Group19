//table structure
// | vertex | dist_from_start | previous_vertex |

var mysql = require('mysql');

var db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "password",
  database: "mydb"
});

db.connect(function(err) {
    if (err) throw err;
    console.log("Connected!");
  });

//displays the table
var sql = "ALTER TABLE dijkstra ADD PRIMARY KEY (vertex)";
db.query(sql, (err, result) => {
    if(err) throw err;
    console.log(result);
});

db.end((err) => {
  console.log("connection ended");
});