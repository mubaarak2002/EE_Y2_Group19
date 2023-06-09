var coordinates = "1 9,2 8,3 7,4 6,5 5,6 4,7 3,8 2,0 0 ";
var comma = coordinates.split(",");
maze = Array.from({ length: 10 }).map(() => Array.from({ length: 10 }).fill(0));
for(let i = 0; i < comma.length; i++){
    var pair = comma[i].split(" ");
    var x = pair[0];
    var y = pair[1];
    maze[x][y] = 1;
    //console.log("x = " + x + " y = " + y);
}
maze[0][0] = 0;
console.table(maze);