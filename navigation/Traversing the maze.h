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
    //TODO:Retrieving coordinate information in relative directions
}
void collect_info(char maze[5000][5000],int x_cordinate, int y_cordinate, char abdN){

    //record the information of the maze
    if(maze[x][y]==0){//which means that the cordinate now has not been written before, so writting it in
        char wall=0xf0;
        char k=0;
        for(int i=0;i<4;i++)
        {
            //TODO:using loop to determine the four absolute directions
            //the form should be like:k should be the informatio from the light and transform it to relative direction;
            //the value of wall should be the value after a bitwise OR operation between val_wall and (k<<i), and assign the result back to val_wall.
        }
        //TODO:write the information of wall and future direction to maze. Don't know how to write now.
    }
}
/**
 * choosing a direction, if there exist a direction which is covered before, goto that; else, perform a retrospective
*/
