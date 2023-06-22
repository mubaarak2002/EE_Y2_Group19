
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
    let look = posN;
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
function collect_info(maze, posN, absN) {
    if (maze[posN[1]][posN[0]] == 0xff) {  // means the the current position has
        let wall = 0xf0;                // not been written so writing it in.
        let k = 0;
        rotate(360);
        for (let i = 0; i < 4; i++) {
            // using loop to determine the four absolute directions
            // should be like:k should be the informatio from the light and transform it to relative direction;
            // the value of wall should be the value after a bitwise OR operation between val_wall and (k<<i), and assign the result back to val_wall.
            k = read_f(maze, posN, absN);
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
    move(posN[0], posN[1]);
    
    return posN, absT; // when calling this function, call: posN, absN = go_to_next(posN, absN, absT);
}
