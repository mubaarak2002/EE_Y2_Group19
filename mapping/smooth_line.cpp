#include <iostream>
#include <vector>

std::vector<std::vector<int>> smoothLineSegments(const std::vector<std::vector<int>>& matrix) {
    int rows = matrix.size();
    int cols = matrix[0].size();
    std::vector<std::vector<int>> outputMatrix(rows, std::vector<int>(cols, 0));

    for (int i = 0; i < rows; i++) {
        int start_index = -1;
        for (int j = 0; j < cols; j++) {
            if (matrix[i][j] == 1) {
                if (start_index == -1) {
                    start_index = j;
                }
            } else {
                if (start_index != -1) {
                    int end_index = j - 1;
                    for (int k = start_index; k <= end_index; k++) {
                        outputMatrix[i][k] = 1;
                    }
                    start_index = -1;
                }
            }
        }

        if (start_index != -1) {
            int end_index = cols - 1;
            for (int k = start_index; k <= end_index; k++) {
                outputMatrix[i][k] = 1;
            }
        }
    }

    return outputMatrix;
}

int main() {
    //input matrix here
    

    // Call the function
    std::vector<std::vector<int>> outputMatrix = smoothLineSegments(inputMatrix);

    // Print the output
    for (const auto& row : outputMatrix) {
        for (int value : row) {
            std::cout << value << " ";
        }
        std::cout << std::endl;
    }

    return 0;
}
