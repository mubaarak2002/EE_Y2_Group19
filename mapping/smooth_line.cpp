#include <iostream>
#include <vector>

using namespace std;

// Function to smooth and connect discontinuous line segments
vector<vector<int>> smoothLineSegments(const vector<vector<int>>& map) {
    vector<vector<int>> smoothedMap = map;

    int rows = map.size();
    int cols = map[0].size();

    for (int i = 0; i < rows; i++) {
        for (int j = 0; j < cols; j++) {
            if (map[i][j] == 1) {
                // Check if the current point is disconnected from its neighbors
                bool disconnected = false;

                // Check left neighbor
                if (j > 0 && map[i][j - 1] == 0) {
                    disconnected = true;
                }

                // Check right neighbor
                if (j < cols - 1 && map[i][j + 1] == 0) {
                    disconnected = true;
                }

                // Check top neighbor
                if (i > 0 && map[i - 1][j] == 0) {
                    disconnected = true;
                }

                // Check bottom neighbor
                if (i < rows - 1 && map[i + 1][j] == 0) {
                    disconnected = true;
                }

                // If the current point is disconnected, connect it to the neighbors
                if (disconnected) {
                    // Check left neighbor
                    if (j > 0 && map[i][j - 1] == 0) {
                        smoothedMap[i][j - 1] = 1;
                    }

                    // Check right neighbor
                    if (j < cols - 1 && map[i][j + 1] == 0) {
                        smoothedMap[i][j + 1] = 1;
                    }

                    // Check top neighbor
                    if (i > 0 && map[i - 1][j] == 0) {
                        smoothedMap[i - 1][j] = 1;
                    }

                    // Check bottom neighbor
                    if (i < rows - 1 && map[i + 1][j] == 0) {
                        smoothedMap[i + 1][j] = 1;
                    }
                }
            }
        }
    }

    return smoothedMap;
}

int main() {
    // Sample input map
    vector<vector<int>> map = {
       //here input the image from  vision processing
    };

    // Smooth and connect discontinuous line segments
    vector<vector<int>> smoothedMap = smoothLineSegments(map);

    // Print the smoothed map
    for (const auto& row : smoothedMap) {
        for (const auto& val : row) {
            cout << val << " ";
        }
        cout << endl;
    }

    return 0;
}
