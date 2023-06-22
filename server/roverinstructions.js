
function commandRover (curPos, moveTo){
    xdif = moveTo[0] - curPos[0];
    ydif = moveTo[1] - curPos[1];
    var c = xdif*xdif + ydif*ydif;
    var dist = Math.sqrt(c);
    var angle = Math.atan(xdif/ydif);
    pi = Math.PI;
    deg = angle * (180/pi);
    if(ydif<0){
        deg = 180 + deg;
    }
    if(xdif< 0 && ydif >= 0){
        deg = 360 + deg;
    }
    console.log(dist);
    return [deg, dist];
}

module.exports = { commandRover };

