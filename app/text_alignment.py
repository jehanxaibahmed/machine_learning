import cv2
import numpy as np
class ImageAlignment():
    def getSkewAngle(cvImage) -> float:
        # Prep image, copy, convert to gray scale, blur, and threshold
        newImage = cvImage.copy()
        gray = cv2.cvtColor(newImage, cv2.COLOR_BGR2GRAY)
        blur = cv2.GaussianBlur(gray, (9, 9), 0)
        thresh = cv2.threshold(blur, 0, 255, cv2.THRESH_BINARY_INV + cv2.THRESH_OTSU)[1]

        # Apply dilate to merge text into meaningful lines/paragraphs.
        # Use larger kernel on X axis to merge characters into single line, cancelling out any spaces.
        # But use smaller kernel on Y axis to separate between different blocks of text
        kernel = cv2.getStructuringElement(cv2.MORPH_RECT, (30, 5))
        dilate = cv2.dilate(thresh, kernel, iterations=2)

        # Find all contours
        contours, hierarchy = cv2.findContours(dilate, cv2.RETR_LIST, cv2.CHAIN_APPROX_SIMPLE)
        contours = sorted(contours, key = cv2.contourArea, reverse = True)
        for c in contours:
            rect = cv2.boundingRect(c)
            x,y,w,h = rect
            cv2.rectangle(newImage,(x,y),(x+w,y+h),(0,255,0),2)

        # Find largest contour and surround in min area box
        largestContour = contours[0]
        print (len(contours))
        minAreaRect = cv2.minAreaRect(largestContour)
        cv2.imwrite('box.jpg', newImage)
        # Determine the angle. Convert it to the value that was originally used to obtain skewed image
        angle = minAreaRect[-1]
        if angle < -45:
            angle = 90 + angle
        return -1.0 * angle
    # Rotate the image around its center
    def rotateImage(cvImage, angle: float):
        newImage = cvImage.copy()
        (h, w) = newImage.shape[:2]
        center = (w // 2, h // 2)
        M = cv2.getRotationMatrix2D(center, angle, 1.0)
        newImage = cv2.warpAffine(newImage, M, (w, h), flags=cv2.INTER_CUBIC, borderMode=cv2.BORDER_REPLICATE)
        return newImage
    # get gray
    def get_grayscale(image):
        return cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)    
    # Deskew image
    def deskew(cvImage):
        angle = getSkewAngle(cvImage)
        return rotateImage(cvImage, -1.0 * angle)

    # grayscale image
    def rgb_color(image):
        return cv2.cvtColor(image, cv2.COLOR_BGR2RGB) 

    #gaussian Blur
    def gaussianBlur(image):
        return cv2.GaussianBlur(image, (3,3), 1)

    # adaptive_thresold_gaussian
    def adaptive_thresold_gaussian(image):
        return cv2.adaptiveThreshold(image,255,cv2.ADAPTIVE_THRESH_GAUSSIAN_C,cv2.THRESH_BINARY,5,3)

    # remove noise
    def remove_noise(image):
        return cv2.medianBlur(image,3)

    # image adaptive_threshold
    def adaptive_threshold(image):
        return cv2.adaptiveThreshold(image, 255, cv2.ADAPTIVE_THRESH_MEAN_C, cv2.THRESH_BINARY, 11, 11)     

    # image threshold
    def thresholding(image):
        return cv2.threshold(image, 0, 255, cv2.THRESH_BINARY + cv2.THRESH_OTSU)[1]

    #  deskew image
    def deskew1(image):
        coords = np.column_stack(np.where(image > 0))
        angle = cv2.minAreaRect(coords)[-1]
        if angle < -45:
            angle = -(90 + angle)
        else:
            angle = -angle
        (h, w) = image.shape[:2]
        center = (w // 2, h // 2)
        M = cv2.getRotationMatrix2D(center, angle, 1.0)
        rotated = cv2.warpAffine(image, M, (w, h), flags=cv2.INTER_CUBIC, borderMode=cv2.BORDER_REPLICATE)
        return rotated 