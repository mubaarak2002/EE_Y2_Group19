#include <iostream>
#include <vector>
#include <algorithm>

using namespace std;

// 2D vector representing coordinates of a point
using Point = pair<int, int>;

// Define the size of the map
const int WIDTH = 250;
const int HEIGHT = 350;

// Function: Noise reduction processing
vector<vector<int>> preprocessData(const vector<vector<double>>& data, double threshold)
{
    vector<vector<int>> binaryData(HEIGHT, vector<int>(WIDTH, 0));

    for (int i = 0; i < HEIGHT; i++) {
        for (int j = 0; j < WIDTH; j++) {
            if (data[i][j] >= threshold) {
                binaryData[i][j] = 1;
            }
        }
    }

    return binaryData;
}

// Function: Smooth the map
vector<vector<double>> smoothMap(const vector<vector<int>>& map, double sigma)
{
    vector<vector<double>> smoothedMap(HEIGHT, vector<double>(WIDTH, 0.0));

    for (int i = 0; i < HEIGHT; i++) {
        for (int j = 0; j < WIDTH; j++) {
            // Apply Gaussian smoothing to each pixel by considering its surrounding pixels
            for (int m = i - 1; m <= i + 1; m++) {
                for (int n = j - 1; n <= j + 1; n++) {
                    if (m >= 0 && m < HEIGHT && n >= 0 && n < WIDTH) {
                        smoothedMap[i][j] += map[m][n];
                    }
                }
            }
            smoothedMap[i][j] /= 9.0;
        }
    }

    return smoothedMap;
}

int main()
{
    // Assume there is noise data named visionData, which is a 2D array
    vector<vector<double>> visionData(HEIGHT, vector<double>(WIDTH, 0.0));
    // Fill the noise data

    // Data preprocessing
    vector<vector<int>> processedData = preprocessData(visionData, 0.5);

    // Smooth the map
    vector<vector<double>> smoothedMap = smoothMap(processedData, 1.0);

    // Display the processed data or perform further operations as needed

    return 0;
}
