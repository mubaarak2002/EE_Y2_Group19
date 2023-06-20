#include <cmath>
#include <vector>

using namespace std;

/**
 *  0
 * 3  1
 *  2
 * the four direction is define as 0 3 1 2
*/
/**
 * Converting absolute directions to relative directions
*/
void map_initial(char map[5000][5000]){
    char i,j;
    for(i=0;i<5000;i++)
    {
        for(j=0;j<5000;j++)
        {
            map[i][j]=0xff;
        }
    } 
}
char abs_to_rel(char absN, char absT){
    //abdN:Current absolute direction
    //adbT:Which absolute direction to expect to switch to
    char rel;  
    rel=(absT-absN)%4;
    if(rel>127) rel=rel+4;
    return rel;
    //now we can return to the relative direction
}

/**
 * Record maze information for current coordinates
*/
char read_f(){
    //TODO:Retrieving coordinate information in relative directions from previous step
}
void collect_info(char maze[5000][5000],xyTypeDef now, char absN){

    //record the information of the maze
    if(maze[now.x][now.y]==0){//which means that the cordinate now has not been written before, so writting it in
        char wall=0xf0;
        char k=0;
        for(int i=0;i<4;i++)
        {
            //using loop to determine the four absolute directions
            //should be like:k should be the informatio from the light and transform it to relative direction;
            //the value of wall should be the value after a bitwise OR operation between val_wall and (k<<i), and assign the result back to val_wall.
        }
        maze[now.y][now.x] &= wall;  // write the information of wall in high 4-bits
        maze[now.y][now.x] &= ((absN<<4)|0x0f);  // write the future direction in low 4-bits
    }
}
/**
 * choosing a direction, if there exist a direction which is covered before, goto that; else, perform a retrospective
*/
/** Key Function Set Select Direction
* Based on the recorded maze array information, select the appropriate direction.
* Scan the surroundings, if there is an unvisited cell, proceed to it.
* If all surrounding cells have been visited, then read the upper 4 bits to determine the direction for backtracking.
**/
        char is_path(char maze[5000][5000], xyTypeDef now, char absN){ // Determine if this direction is connected
            return !((maze[now.y][now.x]>>absN)&0x01);
        }
        char is_new(char maze[5000][5000], xyTypeDef now, char absN){ // Determine if this direction leads to a new cell
            if(absD==0) return (maze[now.y-1][now.x]>>4)==0x0f;
            if(absD==1) return (maze[now.y][now.x+1]>>4)==0x0f;
            if(absD==2) return (maze[now.y+1][now.x]>>4)==0x0f;
            if(absD==3) return (maze[now.y][now.x-1]>>4)==0x0f;
            return 0;
        }
        char search_dir(char maze[5000][5000], xyTypeDef now, char flag){ // Select direction
            char i;
            char pre = maze[now.y][now.x] >> 4;
            char back;
            if(!flag){ // If not sprinting, scan the four directions for walkability
                for(i=0; i<4; i++){
                if(is_path(maze, xyTypeDef now, i) && is_new(maze, xyTypeDef now, i)){ // Check if there is a wall and if it has been visited
                    return i;
                }
            }
        }
        // If sprinting or all four directions are not walkable, directly read the upper 4 bits for sprinting guidance or backtracking
        if(pre<=1) back = pre+2;
        if(pre>=2) back = pre-2;
        return back;
        }
/** Key Function Set: Execution
* Based on the information obtained from the previous step, execute the actions.
**/
    void go_to_next(xyTypeDef *now, char *absN, char absT){
        char relD = abs_to_rel(*absN, absT);
        // Update the current coordinates and absolute direction
        if(absT == 0) (now->y)--;
        if(absT == 1) (now->x)++;
        if(absT == 2) (now->y)++;
        if(absT == 3) (now->x)--;
        *absD = absD_t;
        // Execute the actions
        //here should be a line that let the bug go the direction of relD by 1 step
        if(relD != 0) //then do not go by 1 step;
        }
