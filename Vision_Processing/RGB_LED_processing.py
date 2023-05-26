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



def photo_process(range={"lower": np.array([0, 0, 0]), "upper": np.array([179, 255, 255])}, photo="./assets/TestPhoto.jpg"):
    img = cv2.imread(photo, -1)
    #maskSliders(img)

    #plt.imshow(img)
    #plt.show()
    #Mask(img, np.array([0, 0, 0]), np.array([255, 255, 255]))
    #Mask(img, range["lower"], range["upper"])
    gptSliders(img)

def Mask(image, lowerRange, upperRange):
    print("Channel Info: " + str(image.shape[2]))
    frame = cv2.cvtColor(image, cv2.COLOR_BGR2HSV)
    
    mask = cv2.inRange(frame, lowerRange, upperRange)
    result = cv2.bitwise_and(image, image, mask=mask)

    PlotTwo(image, result)
    return result

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
    plt.subplots_adjust(bottom=0.25)

    initValue = floor((ranges["lower"][0] + ranges["upper"][0])/2)

    # Display the initial image
    image_plot = ax.imshow(HueMask(Source, 0, initValue))

    # Create the slider axes
    slider_ax = plt.axes([0.2, 0.1, 0.6, 0.03])
    
    

    # Create the sliders
    slider = Slider(slider_ax, 'Hue', ranges["lower"][0], ranges["upper"][0], initValue)

    # Function to update the image based on the slider value
    def update_image(value):
        masked_image = HueMask(Source, 0, value)
        image_plot.set_data(masked_image)
        fig.canvas.draw_idle()

    # Register the update function with the slider
    slider.on_changed(update_image)

    plt.show()

def hueSliderTwo(Source, range={"lower": np.array([0, 0, 0]), "upper": np.array([255, 255, 255])}):

    ranges = {"lower": npArrayToNormal(range["lower"]), "upper": npArrayToNormal(range["upper"])}
    initValue = (ranges["lower"][0] + ranges["upper"][0])/2
    
    rows = 1
    columns = 2
    fig = plt.figure(figsize=(10, 7))
    fig.add_subplot(rows, columns, 1)
    plt.imshow(Source)
    plt.title("Source")
    fig.add_subplot(rows, columns, 2)
    Processed = HueMask(Source, range["lower"], range["upper"])
    plt.imshow(Processed)
    plt.title("Processed")


    print("min: " + str(ranges["lower"][0]) + " upper: " + str(ranges["upper"][0]) + " default " + str(initValue))

    hue_slider = Slider(
        ax = Hue,
        label = "Hue",
        valmin = ranges["lower"][0],
        valmax = ranges["upper"][0],
        valinit = initValue
    )

    fig, ax = plt.subplots()
    plt.subplots_adjust



    def updateMask(val):
        im = ax.imshow(Mask(image, hue_slider.val, hue_slider.val + 100))

    hue_slider.on_changed(updateMask)

    plt.show()

def npArrayToNormal(npArray):
    #not needed, just becuase I forget how to do it a lot
    return npArray.tolist()


#OpenCV uses H: 0-179, S: 0-255, V: 0-255
#Masks, of the form [Hue, saturation, value]
blueRanges = {"lower": np.array([90, 50, 50]), "upper": np.array([130, 255, 255])}
redRanges = {"lower": [], "upper": []}
greenRanges = {"lower": [], "upper": []}

totalRanges = {"lower": [0, 0, 0], "upper": [179, 255, 255]}



photo_process(range=blueRanges)