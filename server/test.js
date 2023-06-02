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

db.connect(function(err) {
    if (err) throw err;
    console.log("Connected!");
    });

function getHistory(vertex) {
    // console.log("1: ", player1, " ", player2);

    //query database for match history of players
    //make sure to rearrange to player1, player2 - should not return from here alphabetically

    //format data as a json object
    //data = {"History": history} where history is a string of form 1 - 0
    //query the rivalries table
    //send rivalry data to socket
    let distance;
    let previous;
    let data;

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
            return callback(results.dist_from_start);
        });
    }
    
    
    get_info(vertex, function(result){
        // console.log("3: ", player1, " ", player2);
        console.log(distance);
        console.log(previous);
        // clientIDs.forEach(clientID => {
        //     io.of("/client").to(clientID).emit("clientData", data);
        // });
        // if (gameSend) {
        //     io.of("/webpage").to(webId).emit("history", data);
        // }
    });
    return data;
}

getHistory(3);