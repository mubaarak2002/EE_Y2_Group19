function closest_vertex(distances, start_vertex, unvisited){
    let closest = [0, 0, start_vertex];

    let j = 0;
    while (distances[unvisited[j]] == 0) {
        j++;
        if (j == unvisited.length) {
            return "no path"
        }
    }

    closest[0] = unvisited[j];
    closest[1] = distances[unvisited[j]];

    for (let i = j+1; i < unvisited.length; i++) {
        if ((distances[unvisited[i]] != 0) && distances[unvisited[i]] < closest[1]) {
            closest[0] = unvisited[i];
            closest[1] = distances[unvisited[i]];
        }
    }

    return closest;
}

function get_path(parent, destination) {
    let path = [], vertex = destination;

    while (vertex != -1) {
        path.unshift(vertex);
        vertex = parent[vertex];
    }

    return path;
}

function dijkstra(adjacency, start, end) {
    let num_vertices = adjacency.length, parent = [], unvisited = [], visited = [start];

    for (let i = 0; i < num_vertices; i++) {
        if (i != start) {
            unvisited.push(i);
        }
        parent.push(-1);
    }

    let closest, next_closest;

    for (let i = 0; i < num_vertices - 1; i++) {
        closest = closest_vertex(adjacency[visited[0]], visited[0], unvisited);
        for (let j = 1; j < visited.length; j++) {
            next_closest = closest_vertex(adjacency[visited[j]], visited[j], unvisited);
            if ((closest == "no path") || (next_closest[1] < closest[1])) {
                closest = next_closest;
            }
        }
        if (closest == "no path") {
            return closest;
        }
        let index = unvisited.indexOf(closest[0]);
        unvisited.splice(index, 1);
        visited.push(closest[0]);
        parent[closest[0]] = closest[2];


        if (closest[0] == end) return get_path(parent, end);

    }

    return "uncomplete matrix";
}


var matrix = [
    [0, 10, 3, 0, 0],
    [0, 0, 1, 2, 0],
    [0, 4, 0, 8, 2],
    [0, 0, 0, 0, 7],
    [0, 0, 0, 7, 0]
];

console.log("path:", dijkstra(matrix, 0, 3));
