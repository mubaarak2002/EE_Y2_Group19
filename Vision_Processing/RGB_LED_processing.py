import cv2
import numpy as np

def camera():
    cap = cv2.VideoCapture(0)

    # Check if the webcam is opened correctly
    if not cap.isOpened():
        raise IOError("Cannot open webcam")

    while True:
        ret, frame = cap.read()
        frame = cv2.resize(frame, None, fx=0.5, fy=0.5, interpolation=cv2.INTER_AREA)
        cv2.imshow('Input', frame)

        c = cv2.waitKey(1)
        if c == 27:
            break

    cap.release()
    cv2.destroyAllWindows()



def photo_process(photo="assets/TestPhoto.jpg"):
    img = cv2.imread(photo, -1)

    cv2.imshow('image', img)
    cv2.waitKey(0)
    cv2.destroyAllWindows()
    
    RGBmask(img)




def RGBmask(image):
    
    frame = cv2.cvtColor(image, cv2.COLOR_BGR2HSV)
    
    #Blue Masks
    lower_blue = np.array([90, 50, 50])
    upper_blue = np.array([130, 255, 255])
    #Red Masks
    #lower_red = np.array()
    #upper_red = np.array()
    #Green Masks
    #lower_green = np.array()
    #upper_green = np.array()
    
    mask = cv2.inRange(frame, lower_blue, upper_blue)
    
    result = cv2.bitwise_and(frame, frame, mask=mask)
    
    cv2.imshow('frame', result)
    
    if cv2.waitKey(0) == ord('q'):
        cv2.destroyAllWindows()
    
    
    
    #colour checking stuff:
    #BGR_colour = np.array([[[255,0,0]]])
    #temporary = cv2.cvtColor(BGR_colour, cv2.COLOR_BGR2HSV)
    #print(temporary[0][0])
    

photo_process()