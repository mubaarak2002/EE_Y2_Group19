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
    return path, distance;
}
