#Hello Fellow Group mates,
#pls pip install numpy, opencv-python, matplotlib, for this to work.
#NOTE: you need to use python 3.11.0, 64 bit, NOT PYTHON 10, switch at the bottom of the window on the blue bar (not always needed)
#NOTE: Also make sure you are in the correct directory else you dont be able to find the file
import cv2
import numpy as np
import matplotlib.pyplot as plt
from matplotlib.widgets import Button, RangeSlider, Slider
import math
from skimage.transform import hough_line as hl
from skimage.transform import  hough_line_peaks as hlp

#ALL GLOBAL VARIABLES:
global NUM_PATH_ANGLES
#this is how many angles we use (the rover will round all paths into 360 degreese divided into however many angles we allow)
NUM_PATH_ANGLES = 50

global ANGLE_RANGE
#this is the range of the field of view of the rover (0 to 180)
ANGLE_RANGE = 180

global DISTANCE_SENSITIVITY
#the distance sensitivity determines how close lines of the same angle bin must be to eachother to be considered the "same line"
DISTANCE_SENSITIVITY = 0.1

global DISTANCE_BINS
#for binning distances (how many distances do you want)
DISTANCE_BINS = 10


def camera():
    cap = cv2.VideoCapture(0)

    # Check if the webcam is opened correctly
    if not cap.isOpened():
        raise IOError("Cannot open webcam")

    while True:
        ret, frame = cap.read()
        cv2.imshow('Input', frame)
        c = cv2.waitKey(1)
        if c == 27:
            break

    cap.release()
    cv2.destroyAllWindows()



def photo_process(ranges={"lower": np.array([0, 0, 0]), "upper": np.array([179, 255, 255])}, photo="./assets/TestPhoto.jpg", mode="FullSliders", blueMask={"lower": np.array([138, 129, 143]), "upper": np.array([192, 255, 255])}, greenMask={"lower": [0, 0, 0], "upper": [179, 255, 255]}, redMask={"lower": [0, 0, 0], "upper": [179, 255, 255]}):
    img = cv2.imread(photo, -1)
    #maskSliders(img)

    #plt.imshow(img)
    #plt.show()
    #Mask(img, np.array([0, 0, 0]), np.array([255, 255, 255]))
    #Mask(img, range["lower"], range["upper"])
    if mode == "FullSliders":
        FullSliders(img, ranges)
    elif mode == "PlotTwo":
        PlotTwo(img, Mask(img, ranges["lower"], ranges["upper"]))
    elif mode == "TripleMask":
        TripleMask(img, blueMask, greenMask, redMask)
    elif mode == "JustMask":
        #return img
        return JustMask(img, ranges["lower"], ranges["upper"])

def HueMask(image, lowerHue, upperHue):
    lower = np.array([lowerHue, 0, 0])
    upper = np.array([upperHue, 255, 255])

    frame = cv2.cvtColor(image, cv2.COLOR_BGR2HSV)
    
    mask = cv2.inRange(frame, lower, upper)
    result = cv2.bitwise_and(image, image, mask=mask)
    return result

def PlotTwo(Source, Processed):
    rows = 1
    columns = 2
    fig = plt.figure(figsize=(10, 7))
    fig.add_subplot(rows, columns, 1)
    plt.imshow(Source)
    plt.title("Source")
    fig.add_subplot(rows, columns, 2)
    plt.imshow(Processed)
    plt.title("Processed")
    plt.show()

def gptSliders(Source, range={"lower": np.array([0, 0, 0]), "upper": np.array([255, 255, 255])}):

    ranges = {"lower": npArrayToNormal(range["lower"]), "upper": npArrayToNormal(range["upper"])}

    # Create the figure and axes
    fig, ax = plt.subplots()
    plt.subplots_adjust(bottom=0.35)

    initValue = [ranges["lower"][0], ranges["upper"][0]]

    # Display the initial image
    image_plot = ax.imshow(HueMask(Source, 0, 255))

    # Create the slider axes
    slider_ax1 = plt.axes([0.2, 0.1, 0.6, 0.03])

    # Create the sliders
    sliderHue = RangeSlider(slider_ax1, 'Hue', ranges["lower"][0], ranges["upper"][0])
    # Create the second slider

    
    # Function to update the image based on the slider value
    def update_image(value):
        lowerValue, upperValue = value
        masked_image = HueMask(Source, math.floor(lowerValue), math.floor(upperValue))
        image_plot.set_data(masked_image)
        fig.canvas.draw_idle()

    # Register the update function with the slider
    sliderHue.on_changed(update_image)

    plt.show()

def Mask(image, lowerRange, upperRange):
    frame = cv2.cvtColor(image, cv2.COLOR_BGR2HSV)
    
    mask = cv2.inRange(frame, lowerRange, upperRange)
    result = cv2.bitwise_and(image, image, mask=mask)

    #PlotTwo(image, result)
    return result

def JustMask(image, lowerRange, upperRange):
    frame = cv2.cvtColor(image, cv2.COLOR_BGR2HSV)
    
    mask = cv2.inRange(frame, lowerRange, upperRange)

    return mask

def FullSliders(Source, range={"lower": np.array([0, 0, 0]), "upper": np.array([255, 255, 255])}):

    ranges = {"lower": npArrayToNormal(range["lower"]), "upper": npArrayToNormal(range["upper"])}

    # Create the figure and axes
    fig, (Reference, Edited) = plt.subplots(1, 2)
    plt.subplots_adjust(bottom=0.35)
    
    working = range

    # Display the initial image
    image_plot_Edited = Edited.imshow(Mask(Source, range["lower"], range["upper"]))
    image_plot_Reference = Reference.imshow(Source)

    # Create the slider axes
    slider_Hue = plt.axes([0.2, 0.25, 0.6, 0.03])
    slider_Sat = plt.axes([0.2, 0.15, 0.6, 0.03])
    slider_Val = plt.axes([0.2, 0.05, 0.6, 0.03])

    # Create the sliders
    sliderHue = RangeSlider(slider_Hue, 'Hue', ranges["lower"][0], ranges["upper"][0])
    sliderSat = RangeSlider(slider_Sat, 'Saturation', ranges["lower"][1], ranges["upper"][1])
    sliderVal = RangeSlider(slider_Val, 'Value', ranges["lower"][2], ranges["upper"][2])
    
    #sliderHue = RangeSlider(slider_Hue, 'Hue', 0, 255)
    #sliderSat = RangeSlider(slider_Sat, 'Saturation', 0, 255)
    #sliderVal = RangeSlider(slider_Val, 'Value', 0, 255)

    # Function to update the image based on the slider value
    def update_Hue(value):
        lowerValue, upperValue = value
        working["lower"][0] = math.floor(lowerValue)
        working["upper"][0] = math.floor(upperValue)
        masked_image = Mask(Source, working["lower"], working["upper"])
        image_plot_Edited.set_data(masked_image)
        fig.canvas.draw_idle()

    def update_Sat(value):
        lowerValue, upperValue = value
        working["lower"][1] = math.floor(lowerValue)
        working["upper"][1] = math.floor(upperValue)
        masked_image = Mask(Source, working["lower"], working["upper"])
        image_plot_Edited.set_data(masked_image)
        fig.canvas.draw_idle()
        
    def update_Val(value):
        lowerValue, upperValue = value
        working["lower"][2] = math.floor(lowerValue)
        working["upper"][2] = math.floor(upperValue)
        masked_image = Mask(Source, working["lower"], working["upper"])
        image_plot_Edited.set_data(masked_image)
        fig.canvas.draw_idle()

    # Register the update function with the slider
    sliderHue.on_changed(update_Hue)
    sliderSat.on_changed(update_Sat)
    sliderVal.on_changed(update_Val)

    plt.show()

def npArrayToNormal(npArray):
    #not needed, just becuase I forget how to do it a lot
    return npArray.tolist()

def TripleMask(img, blueMask, greenMask, redMask):
    f, axarr = plt.subplots(2,2)
    axarr[0,0].imshow(img)
    axarr[1,0].imshow(Mask(img, blueMask["lower"], blueMask["upper"]))
    axarr[0,1].imshow(Mask(img, greenMask["lower"], greenMask["upper"]))
    axarr[1,1].imshow(Mask(img, redMask["lower"], redMask["upper"]))

    plt.show()

def ShowMask(mask):
    plt.imshow(mask)
    plt.show()
    
def getMeanRange(photo="./assets/TestPhoto.jpg", ranges={"lower": np.array([110, 165, 55]), "upper": np.array([160, 255, 175])}):
    

    
    mask = photo_process(photo=photo, range=ranges, mode="JustMask")

    temp = npArrayToNormal(mask)
    current_x = []
    current_y = []
    #i is y, j is x
    
    length = len(temp)
    
    for i in range(length):
        for j in range(len(temp[0])):
            if(temp[i][j] != 0):
                #print("X: " + str(j) + " Y: " + str(i) + " With a Value of: " + str(temp[i][j]))
                current_y.append(i)
                current_x.append(j)

    theMean = [np.array(current_x).mean(), np.array(current_y).mean()]

    return theMean
    
def addMarkerMap(photo="./assets/TestPhoto.jpg", ranges=[{"lower": np.array([110, 165, 55]), "upper": np.array([160, 255, 175]), "name": "Red"}]):
    
    plt.imshow(cv2.imread(photo, -1))
    #This function takes any number of colour ranges, and plots the mean of each of them on an image
    for colourRange in ranges:
        coords = getMeanRange(photo, colourRange)
        plt.annotate(colourRange["name"] + ' Mean', xy=(coords[0],coords[1]), xycoords='data',
             xytext=(coords[0] + 150, coords[1] + 150),
             arrowprops=dict(arrowstyle="->"))

    plt.show()
    
#OpenCV uses H: 0-255, S: 0-255, V: 0-255
#Masks, of the form [Hue, saturation, value]
blueRanges = {"lower": np.array([138, 129, 143]), "upper": np.array([192, 255, 255])}
redRanges = {"lower": np.array([110, 165, 55]), "upper": np.array([160, 255, 175])}
greenRanges = {"lower": np.array([55, 150, 116]), "upper": np.array([110, 255, 200])}
totalRanges = {"lower": np.array([0, 0, 0]), "upper": np.array([179, 255, 255])}

RGBMap = [{"lower": np.array([110, 165, 55]), "upper": np.array([160, 255, 175]), "name": "Red"}, {"lower": np.array([138, 129, 143]), "upper": np.array([192, 255, 255]), "name": "Blue "}, {"lower": np.array([55, 150, 116]), "upper": np.array([110, 255, 200]), "name": "Green"}]

#addMarkerMap(ranges = RGBMap)
#print(str(getMeanRange()))


#Something Nice to Know:
#https://pyimagesearch.com/2015/01/19/find-distance-camera-objectmarker-using-python-opencv/

def HSVtoInt(array):
    #this function takes a HSV array of values then turns it into an nxm matrix with a value "0" if the pixel value is "0", and "1" if the value is 1. This basically 
    #rewrites a mask in a different form
    
    out = []
    
    for i in range(len(array)):
        temp = []
        for j in range(len(array[0])):
            if array[i][j].sum() == 0:
                temp.append(0)
            else:
                temp.append(1)
        out.append(temp)
            
    return out

#LineProcessing:
def FindRange(photo="./assets/Course_Images/Straight_Line_1.jpeg"):
    img = cv2.imread(photo, -1)
    FullSliders(Source=img)

def plotHoughLines(photo, hspace, theta, dist, mode="default", data=[]):
    #data = [hspace, angle, dist] (array of arrays)
    
    if mode == "defualt":
        angle_list=[]
        image = cv2.imread(photo, -1)
        fig, axes = plt.subplots(1, 3, figsize=(12, 6))
        
        ax = axes.ravel()
        ax[0].imshow(cv2.imread(photo, -1))
        ax[0].set_title("input image")
        ax[0].set_axis_off()
        
        ax[1].imshow(np.log(1 + hspace),
                extent=[np.rad2deg(theta[-1]), np.rad2deg(theta[0]), dist[-1], dist[0]],
                cmap='gray', aspect=1/1.5)
        ax[1].set_title('Hough transform')
        ax[1].set_xlabel('Angles (degrees)')
        ax[1].set_ylabel('Distance (pixels)')
        #ax[1].set_xlim([0,1])
        ax[1].axis('image')

        ax[2].imshow(image, cmap='gray')

        origin = np.array((0, image.shape[1]))

        for _, angle, dist in zip(*hlp(hspace, theta, dist)):
            angle_list.append(angle) #Not for plotting but later calculation of angles
            y0, y1 = (dist - origin * np.cos(angle)) / np.sin(angle)
            ax[2].plot(origin, (y0, y1), '-r')
        ax[2].set_xlim(origin)
        ax[2].set_ylim((image.shape[0], 0))
        ax[2].set_axis_off()
        ax[2].set_title('Detected lines')



        plt.tight_layout()
        plt.show()
    
    elif mode == "given":
        angle_list=[]
        image = cv2.imread(photo, -1)
        fig, axes = plt.subplots(1, 2, figsize=(12, 6))
        
        ax = axes.ravel()
        ax[0].imshow(cv2.imread(photo, -1))
        ax[0].set_title("input image")
        ax[0].set_axis_off()
    
        ax[1].imshow(image, cmap='gray')


        origin = np.array((0, image.shape[1]))

        for index in range(len(data[0])):
            h = data[0][index]
            angle = data[1][index]
            dist = data[2][index]
            angle_list.append(angle) #Not for plotting but later calculation of angles
            y0, y1 = (dist - origin * np.cos(angle)) / np.sin(angle)
            ax[1].plot(origin, (y0, y1), '-r')
        ax[1].set_xlim(origin)
        ax[1].set_ylim((image.shape[0], 0))
        ax[1].set_axis_off()
        ax[1].set_title('Detected lines')

        #'print(image.shape[1])

        
        plt.tight_layout()
        plt.show()
        
    
    
def HoughLinesOverlay(photo, data):
    angle_list=[]
    image = cv2.imread(photo, -1)
    fig, axes = plt.subplots(1, 2, figsize=(12, 6))

    ax = axes.ravel()
    ax[0].imshow(image)
    ax[0].set_title("input image")
    ax[0].set_axis_off()

    ax[1].imshow(cv2.imread(photo, -1))
    ax[1].set_title("Found Lines")

   
    for i in range(len(data["radii"])):

        #x = [1, 10]
        #y = []
        #set x angle to  
        #get first point:
        ang = data["thetas"][i]
        rad = data["radii"][i]
        #y.append(-1 * (np.cos(ang)/np.sin(ang)) * (1) + (data["radii"][i]/np.sin(ang)))
        #y.append(-1 * (np.cos(ang)/np.sin(ang)) * (10) + (data["radii"][i]/np.sin(ang)))
        #ax[1].axline((x[0], x[1]), (y[0], y[1]), color='C3')

        #attempt two, point 1 is intersection, slope is 90 degreees to that line:
        x = np.cos(ang) * rad
        y = np.sin(ang) * rad
        m =  -1 / ((y) / (x))
        ax[1].axline((x, y), slope=m, color='C3', label='by slope')

        print("x: " + str(x) + " y: " + str(y))

        

    
    ax[1].imshow(image)

    plt.show()


def Hough(photo, mask, ANG_MIN=0, ANG_MAX=np.pi, NAB=NUM_PATH_ANGLES, mode="show", filter=True):

    
    tested_angles = np.linspace(ANG_MIN, ANG_MAX, NAB)
    hspace, theta, dist = hl(mask.sum(-1), tested_angles)
    
    h, q, d = hlp(hspace, theta, dist)
    
    
    if mode == "show":
        image = cv2.imread(photo, -1)
        #plt.imshow(image)
        #plt.figure(figsize=(10,10))
        #plt.imshow(hspace)
        plotHoughLines(photo, hspace, theta, dist, mode="given", data=[h,q,d])
    elif mode == "return":
        return {"hspace": hspace, "theta": theta, "dist": dist, "h": h, "q": q, "d": d}

def crop(photo, hspace, distances, thetas, topCrop=1/4, bottomCrop=0):
    #crops out all lines that start and finish inside the cropped out region
       
    image = cv2.imread(photo, -1)

    left = 0
    bottom = image.shape[0]
    top = 0
    right = image.shape[1]
    
    allLines = getLines(hspace, distances, thetas)
    
    
    toRemove = []
    for i in range(len(distances)):
        line = allLines[i]
        slope = line["slope"]
        point = line["point"]
        leftIntercept = slope * -1 * point[0] + point[1]
        rightIntercept = slope * (right - point[0]) + point[1]
    
        if (rightIntercept < (topCrop) * bottom and leftIntercept < (topCrop) * bottom ):
            toRemove.append(i)
    
    return [np.delete(hspace, toRemove), np.delete(distances, toRemove), np.delete(thetas, toRemove)]


    

#for debugging (I think Im loosing my mind)
def doNothing(photo, h, q, d):
    return {"h": h, "t": q, "d": d}

def HoughLinesReturn(photo, data):
    image = cv2.imread(photo, -1)
    fig, axes = plt.subplots()



    axes.imshow(cv2.imread(photo, -1))
    #axes.set_title("Found Lines")

   
    for i in range(len(data["radii"])):

        #x = [1, 10]
        #y = []
        #set x angle to  
        #get first point:
        ang = data["thetas"][i]
        rad = data["radii"][i]
        #y.append(-1 * (np.cos(ang)/np.sin(ang)) * (1) + (data["radii"][i]/np.sin(ang)))
        #y.append(-1 * (np.cos(ang)/np.sin(ang)) * (10) + (data["radii"][i]/np.sin(ang)))
        #ax[1].axline((x[0], x[1]), (y[0], y[1]), color='C3')

        #attempt two, point 1 is intersection, slope is 90 degreees to that line:
        x = np.cos(ang) * rad
        y = np.sin(ang) * rad
        m =  -1 / ((y) / (x))
        axes.axline((x, y), slope=m, color='C3', label='by slope')

        #print("x: " + str(x) + " y: " + str(y))

        

    
    # Save the plot as an image without extra whitespace
    fig.tight_layout()

    # Convert the plot to an image
    fig.canvas.draw()

    # Get the image from the plot and convert it to a NumPy array
    image = np.array(fig.canvas.renderer.buffer_rgba())

    # Close the plot to free up resources
    plt.close(fig)

    return image

def HoughBinSliders(photo, mask, AngleBins=[10, 360], DistanceBins=[5,100], AngleRange=ANGLE_RANGE):

    image = cv2.imread(photo, -1)

    working = [AngleBins[0], DistanceBins[0]]
    
    # Create the figure and axes
    fig, (Reference, Edited) = plt.subplots(1, 2)
    plt.subplots_adjust(bottom=0.35)
    
    image_plot_Edited = Edited.imshow(HoughLinesReturn(photo, houghFiltered(photo, mask, AngleBins[0], DistanceBins[0], AngleRange)))
    image_plot_Reference = Reference.imshow(image)
    
    slider_Angle = plt.axes([0.2, 0.25, 0.6, 0.03])
    slider_Distance = plt.axes([0.2, 0.15, 0.6, 0.03])
    
    sliderAngle = Slider(slider_Angle, label='Angle', valmin=AngleBins[0], valmax=AngleBins[1], valinit=AngleBins[0])
    sliderDistance = Slider(slider_Distance, label='Distance', valmin=DistanceBins[0], valmax=DistanceBins[1], valinit=DistanceBins[0])
    
       # Function to update the image based on the slider value
    def update_Angle(value):
        working[0] = math.floor(value)
        
        newImage = HoughLinesReturn(photo, houghFiltered(photo, mask, working[0], working[1], AngleRange))
        
        image_plot_Edited.set_data(newImage)
        fig.canvas.draw_idle()
        
       # Function to update the image based on the slider value
    def update_Distance(value):
        working[1] = math.floor(value)
        
        newImage = HoughLinesReturn(photo, houghFiltered(photo, mask, working[0], working[1], AngleRange))
        
        image_plot_Edited.set_data(newImage)
        fig.canvas.draw_idle()
        
    sliderAngle.on_changed(update_Angle)
    sliderDistance.on_changed(update_Distance)
    
    plt.show()
    


    


 
def HoughSliders(photo, mask, ANG_MIN=0, ANG_MAX=np.pi, NAB=NUM_PATH_ANGLES):
    image = cv2.imread(photo, -1)
    # Create the figure and axes
    fig, (Reference, Edited) = plt.subplots(1, 2)
    plt.subplots_adjust(bottom=0.35)
    
    image_plot_Reference = Reference.imshow(image)
    image_plot_Edited = Edited.imshow()
    
    tested_angles = np.linspace(ANG_MIN, ANG_MAX, NAB)
    hspace, theta, dist = hl(mask.sum(-1), tested_angles)
    
    #of the form [angle min, angle max, num Angles]
    working = []
    
    slider_Angle_min = plt.axes([0.2, 0.25, 0.6, 0.03])
    slider_Angle_max = plt.axes([0.2, 0.15, 0.6, 0.03])
    slider_Angle_inc = plt.axes([0.2, 0.15, 0.6, 0.03])
    
    #To Finish, basically want sliders where we can click and drag to change the minimum detectable angle, the maximum detectable angle, and the number of angle bins
    
    
def getLines(hspace, theta, dist):
    #This function takes in a hughspace triple, and returns an array with the slope, and a point of each line.
    #make sure the input to this function is the return of a hlp() function, not a hl() function
    out = []
    
    for i in range(len(dist)):
        
        ang = theta[i]
        rad = dist[i]
        
        #attempt two, point 1 is intersection, slope is 90 degreees to that line:
        x = np.cos(ang) * rad
        y = np.sin(ang) * rad
        m =  -1 / ((y) / (x))
        out.append({"slope": m, "point": [x,y]})
    
    return out
    
def chopchop(lines, mode="return", image="./assets/Course_Images/Straight_Line_1.jpeg"):
    #This function takes in an array of elements of the form {"slope": m, "point": [x,y]} which represent lines, then 
    #will return the co-ordinates of all intersection points of each line. We know that any two lines will intersect
    #unless they have the same slope, so we can set these points as 'x' and 'y', and then cna rearrange both equasions
    #to fit the function
    
    picture = cv2.imread(image) 
    intersections = []
    
    #doing a "diagonal check", so not checking along leading diagonal, or "right half" of the table
    for jindex in range(len(lines)):
        for index in range(jindex):
            
            line = lines[jindex]
            
            #we must now check if line "line" intersects the line lines[i]
            
            if(lines[index]["slope"] != line["slope"]):
                x = (lines[index]["point"][1] - lines[index]["slope"] * lines[index]["point"][0] - line["point"][1] + line["slope"] * line["point"][0]) / (line["slope"] - lines[index]["slope"])
                y = line["slope"] * (x - line["point"][0]) + line["point"][1]
                if(y > picture.shape[0] * 1/4):
                    intersections.append((x,y))
                
    #print(intersections)
    if (mode == "plot"):

        # Create a figure and axes
        fig, ax = plt.subplots()
        
        # Display the image
        ax.imshow(picture)
        
        # Extract the x and y coordinates from the list
        x_coords = [coord[0] for coord in intersections]
        y_coords = [coord[1] for coord in intersections]
        
        # Plot the coordinates on the image
        ax.plot(x_coords, y_coords, 'ro')  # 'ro' stands for red circles
        
        # Set axis limits to match the image dimensions
        ax.set_xlim(0, picture.shape[1])
        ax.set_ylim(picture.shape[0], 0)
        
        # Show the plot
        plt.show()
    elif mode == "return":
        return intersections
    
def houghFiltered(photo, mask, NP=NUM_PATH_ANGLES, DB=DISTANCE_BINS, AR=ANGLE_RANGE, TH=[2,2]):
    #detect lines in an image and return them in the form of (r, theta)
    


    print(1)

def HalfnHalf(photo="./assets/Course_Images/Straight_Line_1.jpeg", ranges={"lower": np.array([0, 100, 220]), "upper": np.array([190, 180, 255]), "name": "white"}):
    
    
    
    #this function finds all white points with another white point on the other side.
    mask = Mask(cv2.imread(photo, -1), ranges["lower"], ranges["upper"])
    
    #debugging stuff
    #HoughSliders(photo, mask)


    #def Hough(photo, mask, ANG_MIN=0, ANG_MAX=np.pi, NAB=NUM_PATH_ANGLES, mode="show", filter=True):
    who = Hough(photo, mask, mode="return", NAB=360)
    
    
    lines = crop(photo, who["h"], who["q"], who["d"]) # Will return: return {"h": hspace, "d": distances, "t": thetas}
    
    

    
    #lines = doNothing(photo, who["h"], who["q"], who["d"])
    

    
    #Hough(photo, mask)
    

    
    plotHoughLines(photo, None, None, None, mode="given", data=crop(photo, who["h"], who["q"], who["d"]))
    #plotHoughLines(photo, None, None, None, mode="given", data=[who["h"], who["q"], who["d"]])
    
    
    
    
    
    
    #chopchop(lines)
    
    #to finish, basically we need to find all line semgemnts that are symmetric about a common x axis, this can determine how centred the rover is, and it's path
     
    

    
ApproxWhiteRange = {"lower": np.array([0, 0, 220]), "upper": np.array([255, 255, 255]), " name": "white"}
#photo_process(photo="./assets/Course_Images/Straight_Line_1.jpeg", mode="FullSliders")


HalfnHalf(ranges=ApproxWhiteRange)

#num of angle bins and distance bins required (ish)
[300, 80]
#photo_process(photo="./assets/Lamp_Images/Big_Blue.jpeg", range=totalRanges, mode="FullSliders")
#photo_process(range=totalRanges, mode="TripleMask", blueMask=blueRanges, greenMask=greenRanges, redMask=redRanges)