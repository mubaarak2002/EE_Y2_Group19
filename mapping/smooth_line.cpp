#include <iostream>
#include <vector>

const int WIDTH = 10;
const int HEIGHT = 10;

// Check if a pixel is surrounded by walls
bool isIsolated(const std::vector<std::vector<int>>& image, int row, int col) {
    if (row > 0 && image[row - 1][col] == 1 ||row > 1 && image[row - 2][col] == 1) {
        return false;  // Check top pixel
    }
    if (row < HEIGHT - 1 && image[row + 1][col] == 1 || row < HEIGHT - 2 && image[row + 2][col] == 1) {
        return false;  // Check bottom pixel
    }
    if (col > 0 && image[row][col - 1] == 1 || col > 1 && image[row][col - 2] == 1) {
        return false;  // Check left pixel
    }
    if (col < WIDTH - 1 && image[row][col + 1] == 1 || col < WIDTH - 2 && image[row][col + 2] == 1) {
        return false;  // Check right pixel
    }
    return true;
}

// Smooth the walls and remove isolated points
void smoothWalls(std::vector<std::vector<int>>& image) {
    std::vector<std::vector<int>> smoothedImage(image);

    // Smooth each row
    for (int col = 0; col < WIDTH; ++col) {
        // Record the start and end position of the wall in the current column
        int startRow = -1;
        int endRow = -1;

        // Iterate through each row in the current column
        for (int row = 0; row < HEIGHT; ++row) {
            // Check if it is a wall pixel
            if (image[row][col] == 1) {
                if (startRow == -1) {
                    startRow = row;
                }
                endRow = row;
            }
        }

        // Set the pixels between the start and end positions as walls in the smoothed image
        if (startRow != -1 && endRow != -1) {
            for (int row = startRow; row <= endRow; ++row) {
                smoothedImage[row][col] = 1;
            }
        }
    }

    // Remove isolated points
    for (int row = 0; row < HEIGHT; ++row) {
        for (int col = 0; col < WIDTH; ++col) {
            if (image[row][col] == 1 && isIsolated(image, row, col)) {
                smoothedImage[row][col] = 0;
            }
        }
    }

    // Update the original image
    image = smoothedImage;
}

// Print the image
void printImage(const std::vector<std::vector<int>>& image) {
    for (int row = 0; row < HEIGHT; ++row) {
        for (int col = 0; col < WIDTH; ++col) {
            std::cout << image[row][col] << " ";
        }
        std::cout << std::endl;
    }
}

int main() {
    // Sample input
    std::vector<std::vector<int>> image = {
        {1, 0, 0, 0, 0, 0, 0, 0, 0, 0},
        {0, 0, 0, 0, 0, 0, 0, 1, 0, 0},
        {0, 0, 0, 0, 0, 0, 0, 0, 0, 0},
        {1, 0, 0, 0, 1, 0, 0, 1, 0, 1},
        {0, 0, 0, 0, 0, 0, 0, 0, 0, 0},
        {1, 0, 0, 0, 0, 0, 0, 1, 0, 0},
        {1, 0, 0, 0, 0, 0, 0, 0, 0, 0},
        {1, 0, 0, 1, 0, 0, 0, 1, 0, 0},
        {1, 0, 0, 0, 0, 0, 0, 0, 0, 0},
        {0, 1, 0, 0, 0, 1, 0, 1, 0, 0}
    };

    std::cout << "Original image:" << std::endl;
    printImage(image);

    smoothWalls(image);

    std::cout << "Smoothed image:" << std::endl;
    printImage(image);

    return 0;
}
