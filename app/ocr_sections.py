import numpy as np
import pandas as pd
import re
import base64
import uvicorn
from text_alignment import ImageAlignment
import os
import pathlib
import tensorflow as tf
import cv2
import easyocr
import pytesseract
pytesseract.tesseract_cmd = r'C:/Program Files/Tesseract-OCR/tesseract.exe'
import shutil 
import random
try:
 from PIL import Image
except ImportError:
 import Image


class ocr_data():
#Table Data   
    def table_data(tableColumn,width,height,image):
        Tables = []
        for column in tableColumn:
            h = []
            table = []
            roi = column*[height, width, height, width]
            print(roi)
            region = image[int(roi[0]):int(roi[2]),int(roi[1]):int(roi[3])]
            region = ImageAlignment.get_grayscale(region)
            region = ImageAlignment.gaussianBlur(region)
            # region = ImageAlignment.deskew1(region)
            region = ImageAlignment.adaptive_thresold_gaussian(region)
            region = ImageAlignment.remove_noise(region)
            region = cv2.resize(region,None,fx = 1.2, fy = 1.6,interpolation = cv2.INTER_CUBIC)
            custom_config = r'--oem 3 --psm 6'
            ocr_result = pytesseract.image_to_string(region, config=custom_config)
            ocr_result = ocr_result.replace('\n\n','\n')
            ocr_result = ocr_result.replace('|','1')
            ocr_result = ocr_result.replace('{','1')
            ocr_result = ocr_result.replace(',','.')
            ocr_results = ocr_result.split("\n")
            print(ocr_result)
            table.append(ocr_results)
            for result in ocr_results:
                # print(np.sum(np.subtract(result[0][2],result[0][1])))
                h.append(result)
                table1 = {h[0]:h[1:-1]}
            Tables.append(table1)
        print(Tables)
        for i in Tables.copy():
            for j in list(i):
                if j.endswith('y')|j.endswith('&')|j.endswith('Y')|j.endswith('y.'):
                    i["Quantity"] = i.pop(j)
                if j.endswith('on')|j.endswith('ON')|j.startswith('DES'):
                    i["Description"] = i.pop(j)
                if j.endswith('E')|j.endswith('e'):
                    i["Price"] = i.pop(j)
                if (j.startswith('a')&j.endswith('t'))|j.startswith('A'):
                    i["Amount"] = i.pop(j)   
        return Tables  

    # company data                         
    def company_data(paragraph,width,height,image):      
        ocr_results = ''
        for i in paragraph:
            roi = i*[height, width, height, width]
            print(roi)
            region = image[int(roi[0]):int(roi[2]),int(roi[1]):int(roi[3])]
            c_region = cv2.resize(region,None,fx = 1.2, fy = 1.5,interpolation = cv2.INTER_CUBIC)
            custom_config = r'--oem 3 --psm 6'
            ocr_result = pytesseract.image_to_string(c_region, config=custom_config)
            print(ocr_result)
            ocr_result = ocr_result.replace('\n\n','\n')
            ocr_results = ocr_result.split("\n")
            ocr_results = ocr_results[:-1]
            print(ocr_results)
        company_details = ' '.join(str(e) for e in ocr_results)
        print(company_details)
        import re    
        company_name = ''
        company_to_reg = re.compile(r'(?:From|Invoice From|)(?:\s+|)(.*\w+)')
        match = company_to_reg.finditer(company_details)
        for matches in match:
            company_name = (matches.group(1))
        return company_name

    # buyer info
    def buyer_data(BuyerInfo,width,height,image):
            buyer_info = []
            for buyer in BuyerInfo:
                buyer_number = []
                buyer_no = ''
                roi = buyer*[height, width, height, width]
                print(roi)
                region = image[int(roi[0]):int(roi[2]),int(roi[1]):int(roi[3])]
                custom_config = r'--oem 3 --psm 6'
                ocr_result = pytesseract.image_to_string(region, config=custom_config)
                print(ocr_result)
                ocr_result = ocr_result.replace('\n\n','\n')
                buyer_number = ocr_result.split("\n")
                buyer_no = {buyer_number[0]:buyer_number[1:-1]}
                buyer_info.append(buyer_no)
            return buyer_info    
