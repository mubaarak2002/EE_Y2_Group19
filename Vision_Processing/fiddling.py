def getClosestPoint(lines, CurrentIndex):
    #
    
    # Takes a list of lines, with each line in the form of the dictionary outputted by usableLines. 
    # This list of lines and returns the closest line to each point (startpoint and endpoint). the CurrentIndex is the the index 
    # of the line in question the responce will be in the form of a dictionary, with the index 
    
    
    #Line Formats:
    # The dictionary of the 
    # each entry will always be in the form of a series of points, and eahc of these points connects a series of points, and 
    # these points will connect 
    #
    #
    # The output will be in the form of {"startClosest": [a,b, i], "endClosest": [c,d, j]}
    # 
    # Outputted will also be a memoisation table of each point being an entry, and it's closest point and distance being stored
    
    #Where [a,b] is the point closest to the start point, and "i" is it's index in the dictioanry. same with end
    
    currentLine = lines[CurrentIndex]
    startPoint = currentLine[0]
    endPoint = currentLine[len(currentLine) - 1]
    
    closest = {"startClosest": {"index": -1, "distance": -1}, "endClosest": [-1, -1, -1]}
    
    #memoisation table:
    #dictionary with every entry being a point, and then it's closest point being returned
    
    for index, line in lines.items():
        if (index != CurrentIndex):
            thisStart = line[0]
            thisEnd = line[len(line) - 1]
            
            d_start_start =  math.sqrt( (startPoint[0] - thisStart[0]) ** 2 + (startPoint[1] - thisStart[1]) ** 2 )
            d_start_end =  math.sqrt( (startPoint[0] - thisEnd[0]) ** 2 + (startPoint[1] - thisEnd[1]) ** 2 )
            d_end_start = math.sqrt( (endPoint[0] - thisStart[0]) ** 2 + (endPoint[1] - thisStart[1]) ** 2 )
            d_end_end = math.sqrt( (endPoint[0] - thisEnd[0]) ** 2 + (endPoint[1] - thisEnd[1]) ** 2 )
            
            #if (d_start_start < (closest["startClosest"])["distance"]):
            #        closest["startClosest"] = []
            