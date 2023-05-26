#Hello Fellow Group mates,
#pls pip install numpy, opencv-python, matplotlib, for this to work.
#NOTE: you need to use python 3.11.0, 64 bit, NOT PYTHON 10, switch at the bottom of the window on the blue bar
#NOTE: Also make sure you are in the correct directory else you dont be able to find the file
import cv2
import numpy as np
import matplotlib.pyplot as plt
from matplotlib.widgets import Button, Slider

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



def photo_process(photo="./assets/TestPhoto.jpg", range={"lower": np.array([0, 0, 0]), "upper": np.array([179, 255, 255])}):
    img = cv2.imread(photo, -1)
    #maskSliders(img)

    #plt.imshow(img)
    #plt.show()
    #Mask(img, np.array([0, 0, 0]), np.array([255, 255, 255]))
    Mask(img, range["lower"], range["upper"])


def Mask(image, lowerRange, upperRange):
    print("Channel Info: " + str(image.shape[2]))
    frame = cv2.cvtColor(image, cv2.COLOR_BGR2HSV)
    
    mask = cv2.inRange(frame, lowerRange, upperRange)
    result = cv2.bitwise_and(frame, frame, mask=mask)

    PlotTwo(frame, result)
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
   
def maskSliders(image, ranges={"lower": [0, 0, 0], "upper": [179, 255, 255]}):

    initValue = (ranges["lower"][0] + ranges["upper"][0])/2
    fig, ax = plt.subplots()
    im = ax.imshow(Mask(image, ranges["lower"][0], ranges["upper"][0]))

    Hue = fig.add_axes([0.25, 0.1, 0.65, 0.03])
    print("min: " + str(ranges["lower"][0]) + " upper: " + str(ranges["upper"][0]) + " default " + str(initValue))

    hue_slider = Slider(
        ax = Hue,
        label = "Hue",
        valmin = ranges["lower"][0],
        valmax = ranges["upper"][0],
        valinit = initValue
    )


    def updateMask(val):
        im = ax.imshow(Mask(image, hue_slider.val, hue_slider.val + 100))

    hue_slider.on_changed(updateMask)


    
    plt.imshow(image)
    plt.show()




#OpenCV uses H: 0-179, S: 0-255, V: 0-255
#Masks, of the form [Hue, saturation, value]
blueRanges = {"lower": np.array([110, 50, 50]), "upper": np.array([130, 255, 255])}
redRanges = {"lower": [], "upper": []}
greenRanges = {"lower": [], "upper": []}

totalRanges = {"lower": [0, 0, 0], "upper": [179, 255, 255]}



photo_process(range=blueRanges)