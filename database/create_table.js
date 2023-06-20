var mysql = require('mysql');

var db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "password",
  database: "mydb"
});

//table structure
// | vertex | dist_from_start | previous_vertex |

db.connect(function(err) {
    if (err) throw err;
    console.log("Connected!");
  });

var sql = "CREATE TABLE dijkstra (vertex CHAR(1), dist_from_start VARCHAR(255), previous_vertex CHAR(1))";
db.query(sql, function (err, result) {
  if (err) throw err;
  console.log("Table created");
});

db.end((err) => {
  console.log("connection ended");
});