#include <cmath>
#include <vector>
using namespcae std:
/**
 * Key Function Set: Finding the Optimal Path using BFS
 * After backtracking to the starting point, start finding the optimal path using the breadth-first search algorithm.
 *   (1) First, establish an altitude table based on the previously recorded maze array.
 *   (2) Reverse-record the optimal path based on the altitude table.
 *   (3) Record the path in the high four bits of the maze array so that the previous structure can be reused to guide the car to the destination.
**/
bit bfs(char maze[5000][5000], xyTypeDef beg, xyTypeDef end) { // Breadth-First Search algorithm
    // Parameter initialization
    char height[5000][5000] = {0xff};  // Initialize the altitude table
    xyTypeDef queue_xy[15]; // Initialize the queue (after testing, the length is enough)
    char queue_len = 1;  // Initialize the queue length marker
    xyTypeDef queue_head;  // Initialize the queue head
    char j, i;  // Initialize iteration indices
    xyTypeDef temp;  // Initialize a temporary variable
    xyTypeDef now;  // Initialize the current position

    init_map(height);
    height[beg.y][beg.x] = 0;
    queue_xy[0].x = beg.x;
    queue_xy[0].y = beg.y;
    while (queue_len > 0) {  // When the queue is not empty
        queue_head = queue_xy[0];  // Dequeue the first element of the queue
        queue_len--;
        for (j = 0; j < queue_len; j++) {  // (Since an array is used to simulate the queue, all elements need to be manually shifted forward)
            queue_xy[j] = queue_xy[j + 1];
        }
        for (i = 0; i < 4; i++) {  // Check four directions
            temp = queue_head;
            if (i == 0)  temp.y = queue_head.y - 1;
            if (i == 1)  temp.x = queue_head.x + 1;
            if (i == 2)  temp.y = queue_head.y + 1;
            if (i == 3)  temp.x = queue_head.x - 1;
            if (temp.x > 127 || temp.y > 127)  continue;
            if (is_path(maze, queue_head, i) && height[temp.y][temp.x] == 255) {  // If the coordinate is connected and accessed for the first time
                height[temp.y][temp.x] = height[queue_head.y][queue_head.x] + 1;  // Increase the altitude of the coordinate by 1 in the altitude table
                queue_xy[queue_len++] = temp;  // Enqueue the coordinate
            }
        }
    }
    
    // The altitude table is established, start reverse searching for the optimal path
    now.x = end.x;
    now.y = end.y;
    while (!(now.x == 0 && now.y == 0)) {  // If not yet at the starting point
        for (i = 0; i < 4; i++) {  // Scan four directions
            temp = now;
            if (i == 0)  temp.y = now.y - 1;
            if (i == 1)  temp.x = now.x + 1;
            if (i == 2)  temp.y = now.y + 1;
            if (i == 3)  temp.x = now.x - 1;
            if (temp.x >127 || temp.y>127) continue;
            if(is_path(maze, now, i) && (height[temp.y][temp.x]==height[now.y][now.x]-1)){  // If the coordinate is connected and the height is decreasing
                maze[temp.y][temp.x] |= 0xf0; // Initialize the high four bits of the maze array at that coordinate
                maze[temp.y][temp.x] &= ((i<<4)|0x0f);  // Write this direction to the high four bits
                now = temp;  // switch nodes
                break;
            }
        }
    }
  return 1;
}
