#Hello Fellow Group mates,
#pls pip install numpy, opencv-python, matplotlib, for this to work.
#NOTE: you need to use python 3.11.0, 64 bit, NOT PYTHON 10, switch at the bottom of the window on the blue bar
#NOTE: Also make sure you are in the correct directory else you dont be able to find the file
import cv2
import numpy as np
import matplotlib.pyplot as plt
from matplotlib.widgets import Button, Slider, RangeSlider
import math

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



def photo_process(range={"lower": np.array([0, 0, 0]), "upper": np.array([179, 255, 255])}, photo="./assets/TestPhoto.jpg", mode="FullSliders", blueMask={"lower": np.array([138, 129, 143]), "upper": np.array([192, 255, 255])}, greenMask={"lower": [0, 0, 0], "upper": [179, 255, 255]}, redMask={"lower": [0, 0, 0], "upper": [179, 255, 255]}):
    img = cv2.imread(photo, -1)
    #maskSliders(img)

    #plt.imshow(img)
    #plt.show()
    #Mask(img, np.array([0, 0, 0]), np.array([255, 255, 255]))
    #Mask(img, range["lower"], range["upper"])
    if mode == "FullSliders":
        FullSliders(img, range)
    elif mode == "PlotTwo":
        PlotTwo(img, Mask(img, range["lower"], range["upper"]))
    elif mode == "TripleMask":
        TripleMask(img, blueMask, greenMask, redMask)



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


#OpenCV uses H: 0-179, S: 0-255, V: 0-255
#Masks, of the form [Hue, saturation, value]
blueRanges = {"lower": np.array([138, 129, 143]), "upper": np.array([192, 255, 255])}
redRanges = {"lower": np.array([100, 150, 75]), "upper": np.array([150, 255, 176])}
greenRanges = {"lower": np.array([55, 150, 116]), "upper": np.array([110, 255, 200])}
totalRanges = {"lower": np.array([0, 0, 0]), "upper": np.array([179, 255, 255])}



#photo_process(range=totalRanges, mode="FullSliders")
photo_process(range=totalRanges, mode="TripleMask", blueMask=blueRanges, greenMask=greenRanges, redMask=redRanges)