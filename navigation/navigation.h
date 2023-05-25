#include <cmath>

// if both walls are within the acceptable range, move forwards
// else if robot is slightly closer to the left wall, adjust right (turn right while maintaining movement forwards)
    // same for if it slightly closer to the right wall
// else if it is significantly closer to the left wall, turn right (turn left while terminating forwards movement)
    // same for if it significantly closer the the right wall

namespace nav { 
    void corridorNavigation (
        const int& acceptableError = 5
    ) {
        int leftDistance = 10;      // this is the distance between the robot and the left wall from computer vision
        int rightDistance = 10;     // this is the distance between the robot and the right wall from computer vision
        
        int midDistance = (leftDistance + rightDistance) / 2; 
        int leftError = midDistance - leftDistance;
        int rightError = midDistance - rightDistance;

        if (abs(leftError) <= acceptableError && abs(rightError) <= acceptableError) {
            moveForward();  // sets speed of motors to move forward
        }
        else if (abs(leftError) > acceptableError && abs(rightError) <= acceptableError) {
            adjustRight();  // sets speed of motors to turn right while moving forward
        }
        else if (abs(rightError) > acceptableError && abs(leftError) <= acceptableError) {
            adjustLeft();   // sets speed of motors to turn left while moving forward
        }
        else {
            if (leftError > rightError) {
                turnRight();    // sets speed of motors to terminate forward movement while turning right
            }
            else {
                turnLeft();     // sets speed of motors to terminate forward movement while turning left
            }
        }
    }
}
