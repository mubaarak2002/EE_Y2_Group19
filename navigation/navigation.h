#include <cmath>
#include <vector>

// use PID to control the speeds of the wheels to make the robot drive in the middle of the corridor

// if it is too close to the left wall, go right (left wheel speeds up)
// otherwise, go left (right wheel speeds up)

namespace control {
    int pid(
            std::vector<int>& feedback,          // feedback[0] is error, feedback[1] is sum of error, feedback[2] is previous error
            const std::vector<int>& constants    // constants: k_p, k_i, k_d
    ) {
        int proportional = constants[0] * feedback[0];
        int integral = constants[1] * feedback[1];
        int derivative = constants[2] * (feedback[0] - feedback[2]);

        int pid = proportional + integral + derivative;
        return pid;
    }
}

namespace nav { 
    std::vector<int> corridor_navigation (
            std::vector<int> feedback,
            const std::vector<int>& constants
    ) {
        int left_distance = 10;      // this is the distance between the robot and the left wall from computer vision
        int right_distance = 10;     // this is the distance between the robot and the right wall from computer vision
        
        int mid_distance = (left_distance + right_distance) / 2; 
        feedback[0] = mid_distance - right_distance;
        feedback[1] += feedback[0];
        
        move(control::pid(feedback, constants));        // the function adds pid to the speed of the right motor
                                                        // and subtracts pid from the speed of the left motor

        feedback[2] = feedback[0];
        return feedback;
    }
}
