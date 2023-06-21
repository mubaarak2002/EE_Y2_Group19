#include <iostream>
#include <cstring>
#include <fstream>
#include <vector>
#include <cmath>
#include <sstream>

float get_r(const int& x, const int& y) {
    return std::sqrt(x*x + y*y);
}

// windowed sinc function: sinc(2 f_c(n - (N - 1)/2))(0.42 - 0.5cos(2πn/(N - 1)) + 0.08cos(4πn/(N - 1)))
// in this case N is the kernel_size and n is sqrt(x^2 + y^2)
// 2f_c * sinc(2f_c*n)
float sinc_function(
    const float& n,
    const float& f_c
) {
    if (n == 0) return 2*f_c;
    return std::sin(2*f_c*n)/n;
}

std::vector<std::vector<float> > generate_kernel(
    const int& kernel_size,
    const float& f_c
) {
    std::vector<std::vector<float> > kernel;
    for (int i = 0; i < kernel_size; i++) {
        int y_offset = i - (kernel_size - 1)/2;
        std::vector<float> line;
        for (int j = 0; j < kernel_size; j++) {
            int x_offset = j - (kernel_size - 1)/2;
            line.push_back(sinc_function(get_r(x_offset, y_offset), f_c)/kernel_size/kernel_size);
        }
        kernel.push_back(line);
    }
    return kernel;
}

std::vector<std::vector<float> > filter_image(
    const std::vector<std::vector<int> >& image,
    const std::vector<std::vector<float> >& kernel,
    const float& threshold
) {
    std::vector<std::vector<float> > filtered_image;
    int kernel_size = kernel.size();
    int height = image.size();
    int width = image[0].size();
    for (int y = 0; y < height; y++) {
        std::vector<float> line;
        for (int x = 0; x < width; x++) {
            float pixel = 0;
            for (int i = 0; i < kernel_size; i++) {
                int y_offset = y + i - (kernel_size - 1)/2;
                for (int j = 0; j < kernel_size; j++) {
                    int x_offset = x + j - (kernel_size - 1)/2;
                    if (!(x_offset < 0 || y_offset < 0 || x_offset >= width || y_offset >= height)) {
                        pixel += (image[y_offset][x_offset]-0.5) * kernel[i][j];
                    }
                }
            }
            if (pixel > threshold) line.push_back(1);
            else line.push_back(0);
        }
        filtered_image.push_back(line);
    }

    return filtered_image;
}

std::vector<std::vector<int> > read_from_file(const std::string& filename) {
    std::ifstream file(filename);
    std::vector<std::vector<int> > matrix;

    if (file.is_open()) {
        std::string line;
        while (std::getline(file, line)) {
            std::vector<int> row;
            std::istringstream iss(line);
            int num;
            while (iss >> num) {
                row.push_back(num);
            }
            matrix.push_back(row);
        }
        file.close();
    } else {
        std::cout << "Unable to open file: " << filename << std::endl;
    }

    return matrix;
}

void printImage(const std::vector<std::vector<float> >& image) {
    int height = image.size();
    int width = image[0].size();
    for (int row = 0; row < height; ++row) {
        for (int col = 0; col < width; ++col) {
            std::cout << image[row][col] << " ";
        }
        std::cout << std::endl;
    }
}

void print_int_Image(const std::vector<std::vector<int> >& image) {
    int height = image.size();
    int width = image[0].size();
    for (int row = 0; row < height; ++row) {
        for (int col = 0; col < width; ++col) {
            std::cout << image[row][col] << " ";
        }
        std::cout << std::endl;
    }
}

int main() {
    std::vector<std::vector<int> > image = read_from_file("fir_noise_filter_test.txt");
    int size;
    float f_c, threshold;
    std::cout << "Kernel size: ";
    std::cin >> size; // best 5
    std::cout << "Cutoff frequency: ";
    std::cin >> f_c; // best 1
    std::cout << "Threshold: ";
    std::cin >> threshold;
    std::cout << std::endl;
    std::vector<std::vector<float> > kernel = generate_kernel(size, f_c);

    std::cout << "Kernel:" << std::endl;
    printImage(kernel);
    std::cout << std::endl;

    std::cout << "Original image:" << std::endl;
    print_int_Image(image);
    std::cout << std::endl;

    std::vector<std::vector<float> > filtered_image = filter_image(image, kernel, threshold);
    std::cout << "Smoothed image:" << std::endl;
    printImage(filtered_image);

    return 0;
}
