import {
    traverse_forward,
    traverse_corridor,
    get_current_state,
    get_current_position,
    turn_back,
    get_exits,
    allign_abs_angle,
    allign_left_most_exit,
    allign_left_exit,
    allign_right_exit,
    traverse
} from '../navigation/autonomous_traversal.js';

export function check_visited(vertex_positions, current_pos, tolerance = 3) {
    for (let vertex in vertex_positions) {
        if ((Math.abs(current_pos[0] - vertex[0]) <= tolerance) && (Math.abs(current_pos[1] - vertex[1]) <= tolerance)) {
            return 1;
        }
    }
    return 0;
}

// procedure DFS(G, v) is
//      label v as discovered
//      for all directed edges from v to w that are in G.adjacentEdges(v) do
//          if vertex w is not labeled as discovered then
//              recursivedly call DFS(G, w)

// if you can go left, go left
// if you can't go left but can go straight

export function dfs(maze, adjacency, prev_vertex, vertex_positions) {
    // this junction is unvisted, add info to adjacency and vertex_positions
    let cur_vertex = adjacency.length()
    let cur_pos = get_current_position();
    adjacency[prev_vertex].push(cur_vertex);
    adjacency.push([prev_vertex]);
    vertex_positions.push(cur_pos);

    // get info about next paths to explore
    let exits = get_exits(maze);
    // if it is a dead end, go back
    if (exits) {
        turn_back();
        traverse_forward();
        state = "continue";
        state, maze = traverse(maze);
        return adjacency, vertex_positions;
    }
    allign_left_most_exit(maze);
    let abs_angle = get_abs_angle();
    for (let exit in exits) {
        // allign with the left most path
        allign_abs_angle(abs_angle);
        // then allign with the next unexplored path
        for (let i = 0; i < exit; i++) {
            allign_right_exit();
        }
        // traverse forward until we have reached a junction
        traverse_forward();
        state = "continue";
        state, maze = traverse(maze);
        let cur_pos = get_current_position();
        // if the new junction has already been visited turn back to original junction
        //      no need to update the adjacency list since if it has been visited before
        //      then it will necessarily have an entry in the adjacency list
        if (check_visited(vertex_positions, cur_pos)) {
            turn_back();
            traverse_forward();
            state = "continue";
            state, maze = traverse(maze);
        }
        // else, do a dfs with this junction
        else {
            adjacency, vertex_positions = dfs(maze, adjacency, cur_vertex, vertex_positions);
        }
    }
    // once traversed all exits, return to previous vertex
    allign_abs_angle(abs_angle);
    allign_left_exit(maze);
    traverse_forward();
    let state = "continue";
    state, maze = traverse(maze);
    return adjacency, vertex_positions;
}
