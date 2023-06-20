import { 
    closest_vertex,
    get_path,
    dijkstra
} from '../mapping/dijkstra.js';

export function traverse_forward() {}

export function traverse_corridor() {}

export function get_current_state(maze) {}

export function get_current_position() {}

export function turn_back(maze) {}

export function get_exits(maze) {}

export function allign_abs_angle(angle) {}

export function allign_left_most_exit(maze) {}

export function allign_left_exit(maze) {}

export function allign_right_exit(maze) {}

export function traverse(maze) {
    // if back at start, end
    // current_state is corridor/junction/dead end
    let current_state;
    current_state, maze = get_current_state(maze)
    while (current_state == "corridor") {
        traverse_corridor();
        current_state, maze = get_current_state(maze);
        return "continue", maze;
    }
    if (current_state == "junction") {
        return "junction", maze;
    }
}


export function adjacency_list_to_matrix(adjacency, distances) {
    // initialize a square matrix full of zeros
    let matrix = [], size = adjacency.length;

    for (let i = 0; i < size; i++) {
        matrix[i] = Array(size).fill(0);
    }
    // replace zeros with distances of adjacent vertices
    for (let i = 0; i < size; i++ ) {
        for (let vertex in adjacency[i]) {
            matrix[i][vertex] = distances[i][vertex];
        }
    }

    return matrix;
}

// need to consider angle that you start at
export function autonomous(adjacency, maze, distances, start, end) {
    let matrix = adjacency_to_matrix(adjacency, distances);
    let path = dijkstra(adjacency, start, end);
    let index;
    let state = "continue";
    for (let i = 0; i < path.length - 1; i++) {
        exit = matrix.indexOf(adjacency[i][i - 1]);
        allign_left_most_exit(maze);
        for (let j = 0; j < exit; j++) {
            allign_right_exit(maze);
        }
        state, maze = traverse(maze);
    }
}
