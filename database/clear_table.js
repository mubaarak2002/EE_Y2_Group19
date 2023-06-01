var mysql = require('mysql');

var db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "password",
  database: "mydb"
});

var sql = "DELETE FROM dijkstra";
db.query(sql, (err, result) => {
    if(err) throw err;
    console.log(result);
});