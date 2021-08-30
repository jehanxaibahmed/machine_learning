import numpy as np
import pandas as pd
import re
import uvicorn
from fastapi import FastAPI
from typing import Optional
from pydantic import BaseModel
from fastapi import File
from fastapi import UploadFile
from matplotlib import pyplot as plt
from text_alignment import ImageAlignment

from pdf2image import convert_from_path
from ocr_sections import ocr_data
import os
import pathlib
import tensorflow as tf
import argparse
import time
import cv2
import pytesseract
# pytesseract.tesseract_cmd = r'C:/Program Files/Tesseract-OCR/tesseract.exe'
import shutil
import random
try:
 from PIL import Image
except ImportError:
 import Image


#load model
# PROVIDE PATH TO MODEL DIRECTORY
PATH_TO_MODEL_DIR = 'ssd_mobinet/export'

# PROVIDE PATH TO LABEL MAP
PATH_TO_LABELS = 'ssd_mobinet/export/label_map.pbtxt'

PATH_TO_SAVED_MODEL = PATH_TO_MODEL_DIR + "/saved_model"

print('Loading model...', end='')
start_time = time.time()

# LOAD SAVED MODEL AND BUILD DETECTION FUNCTION
detect_fn = tf.saved_model.load(PATH_TO_SAVED_MODEL)

end_time = time.time()
elapsed_time = end_time - start_time
print('Done! Took {} seconds'.format(elapsed_time))

#load fastapi
app = FastAPI()

#get function
@app.get('/')
def read_root():
    return {"Hello": "World"}

#post function
@app.post("/uploadfile")
async def create_upload_file(file: UploadFile = File(...)):
    file_location = f"files/{file.filename}"
    with open(file_location, "wb+") as file_object:
        file_object.write(file.file.read())
    if file.filename.endswith('.pdf'):
        pages = convert_from_path(file_location, poppler_path=r'poppler-0.68.0/bin')
        for page in pages:
            page.save('files/out.jpg', 'JPEG')
        image = cv2.imread('files/out.jpg') 
    else:  
        image = cv2.imread(file_location)
    image = ImageAlignment.rgb_color(image)
    # The input needs to be a tensor, convert it using `tf.convert_to_tensor`.
    input_tensor = tf.convert_to_tensor(image)
    # The model expects a batch of images, so add an axis with `tf.newaxis`.
    input_tensor = input_tensor[tf.newaxis, ...]

    # input_tensor = np.expand_dims(image_np, 0)
    detections = detect_fn(input_tensor)

    # All outputs are batches tensors.
    # Convert to numpy arrays, and take index [0] to remove the batch dimension.
    # We're only interested in the first num_detections.
    num_detections = int(detections.pop('num_detections'))
    detections = {key: value[0, :num_detections].numpy()
                for key, value in detections.items()}
    detections['num_detections'] = num_detections

    # detection_classes should be ints.
    detections['detection_classes'] = detections['detection_classes'].astype(np.int64)
    #adjust threshold for image_prediction
    detection_threshold = 0.5
    # image = image_np_with_detections
    scores = list(filter(lambda x: x> detection_threshold, detections['detection_scores']))
    boxes = detections['detection_boxes'][:len(scores)]
    classes = detections['detection_classes'][:len(scores)]
    print(classes) 
    width = image.shape[1]
    height = image.shape[0]
    #Tables ocr
    mask = np.logical_and(classes == 2,classes > 1)
    tableColumn = boxes[mask]
    Tables = ocr_data.table_data(tableColumn,width,height,image)             
    # Company Details OCr
    mask = np.logical_and(classes < 2,classes == 1)
    paragraph = boxes[mask]
    company_name = ocr_data.company_data(paragraph,width,height,image)       

    # buyer Details OCR
    mask = np.logical_and(classes == 5,classes > 4)
    BuyerInfo = boxes[mask]
    buyer_info = ocr_data.buyer_data(BuyerInfo,width,height,image)       

    # Invoice Details OCR 
    mask = np.logical_and(classes == 4,classes > 3)
    inv_info = boxes[mask]
    Invoice_info = []
    Invoice_number = []
    for nb in inv_info:
        roi = nb*[height, width, height, width]
        print(roi)
        region = image[int(roi[0]):int(roi[2]),int(roi[1]):int(roi[3])]
        custom_config = r'--oem 3 --psm 6'
        ocr_result = pytesseract.image_to_string(region, config=custom_config)
        ocr_result = ocr_result.replace('\n\n','\n')
        ocr_results = ocr_result.split("\n")
        ocr_results = ocr_results[:-1]
        Invoice_info.append(ocr_results)
        for i in Invoice_info:
            for j in i:
                Invoice_number.append(j)
    text = ' '.join(str(e) for e in Invoice_number)
    print(text)
    invoice_reg = re.compile(r'(?:Invoice #|Invoice Number|Invoice Number:|INVOICE#|Invoice#|Invoice No.|INVOICE NUMBER|Invoice|Invoice NO:|INVOICE #|Invoice ID:)(?:\s+|)([a-zA-Z0-9_-]+\d+)')
    match = invoice_reg.finditer(text)
    invoice=""
    for matches in match:
        invoice = matches.group(1)
    #due date
    due_date = ''
    due_date_reg = re.compile(r'(?:DueDate:|Due DATE|Due Date|Due Date:|DUE DATE|DUE|Due date:|Payment Due|Due})(?:\s+|)(\w+(?:\s+|-)\w+[,-](?:\s+|)\d+|\w{1,2}(?:\s|)[-\/](?:\s|)\d{1,2}(?:\s|)[-\/](?:\s|)\d{1,4})')
    match = due_date_reg.finditer(text)
    for matches in match:
        due_date = matches.group(1)
    # po number
    po_number = ''
    po_reg = re.compile(r'(?:PO#|PO:|P.O.#|P.0#|P.O.|PO #|P.0.#|Po#)(?:\s+|)(\w+)') 
    match = po_reg.finditer(text)
    for matches in match:
        po_number = matches.group(1)
    # Currency
    currency = ''
    currency_reg = re.compile(r'(?:Currency Type:|Currency:|currency#|Currency|currency)(?:\s+|)(\w+)') 
    match = currency_reg.finditer(text)
    for matches in match:
        currency = matches.group(1)    
    #payment terms
    payment_terms = ''
    payment_reg = re.compile(r'(?:Payment terms:|Terms:)(?:\s+|)([a-zA-Z0-9_-]+(?:\s+|)\d+)') 
    match = payment_reg.finditer(text)
    for matches in match:
        payment_terms = matches.group(1)   
    #invoice date
    Invoice_dated = ''
    invoice_date_reg = re.compile(r'(?:[dD][aA][tT][Ee]:|[dD][aA][tT][Ee])(?:\s+|)(\w+(?:\s+|-)\w+[,-](?:\s+|)\d+|\w{1,2}(?:\s|)[-\/](?:\s|)\d{1,2}(?:\s|)[-\/](?:\s|)\d{1,4})')
    date = []
    match = invoice_date_reg.finditer(text)
    for matches in match:
        invoice_date = matches.group(1)
        date.append(invoice_date)
    if date:
        Invoice_dated = date[0]
    else:
        Invoice_dated = ''    

    #complete image ocr
    custom_config = r'--oem 3 --psm 6'
    total_result = pytesseract.image_to_string(image, config=custom_config)
    print(total_result)

    #total
    total = ''
    total_reg = re.compile(r'(?:[tT]otal:|[tT]otal|TOTAL:|TOTAL|Net Amount)(?:\s+|)((?:\$|)\w+.*)')
    total_list = []
    match = total_reg.finditer(total_result)
    for matches in match:
        amnt = matches.group(1)
        total_list.append(amnt)
    if total_list:
        total = total_list[-1]
    else:
        total = '' 

    # SubTotal
    gross_amount = ''
    sub_total_reg = re.compile(r'(?:[sS][uU][bB](?:\s+|)[tT][oO][tT][aA][lL]:|Gross Amount|[sS][uU][bB](?:\s+|)[tT][oO][tT][aA][lL])(?:\s+|)((?:\$|)\w+.*)')
    sub_total_list = []
    match = sub_total_reg.finditer(total_result)
    for matches in match:
        gross_amnt = matches.group(1)
        sub_total_list.append(gross_amnt)
    if sub_total_list:
        gross_amount = sub_total_list[-1]
    else:
        gross_amount = ''

    # Tax
    tax_amount = ''
    tax_total_reg = re.compile(r'(?:[tT][aA][xX](?:\s+|)[(].*[)]|[tT][aA][xX](?:\s+|)[(].*[)]:|[tT][aA][xX](?:\s+|)\w+(?:\%|)|[tT][aA][xX](?:\s+|)\w+(?:\%|):|[tT][aA][xX]:|[tT][aA][xX])(?:\s+|)((?:\$|)\w+.*)')
    tax_total_list = []
    match = tax_total_reg.finditer(total_result)
    for matches in match:
        tax_amnt = matches.group(1)
        tax_total_list.append(tax_amnt)
    if tax_total_list:
        tax_amount = tax_total_list[-1]
    else:
        tax_amount = ''

    # Discount
    discount_amount = ''
    discount_reg = re.compile(r'(?:[dD][iI][sS][Cc][Oo][Uu][Nn][tT]|[dD][iI][sS][Cc][Oo][Uu][Nn][tT]:)(?:\s+|)((?:\$|)\w+.*)')
    discount_list = []
    match = discount_reg.finditer(total_result)
    for matches in match:
        discount_amnt = matches.group(1)
        discount_list.append(discount_amnt)
    if discount_list:
        discount_amount = discount_list[-1]
    else:
        discount_amount = ''             

    if invoice == '':
        match = invoice_reg.finditer(total_result)
        for matches in match:
            invoice = matches.group(1)
    #due date
    if due_date == '':
        match = due_date_reg.finditer(total_result)
        for matches in match:
            due_date = matches.group(1)
    # po number
    if po_number == '':
        match = po_reg.finditer(total_result)
        for matches in match:
            po_number = matches.group(1)
    # Currency
    if currency == '':
        match = currency_reg.finditer(total_result)
        for matches in match:
            currency = matches.group(1)    
    #payment terms
    if payment_terms == '':
        match = payment_reg.finditer(total_result)
        for matches in match:
            payment_terms = matches.group(1)   
    #invoice date
    if Invoice_dated == '':
        date = []
        match = invoice_date_reg.finditer(total_result)
        for matches in match:
            invoice_date = matches.group(1)
            date.append(invoice_date)
        if date:
            Invoice_dated = date[0]
        else:
            Invoice_dated = ''     



    return {'invoice_number':invoice,
    'invoice_date':Invoice_dated,
    'PO#':po_number,
    'Currency':currency,
    'Due Date':due_date,
    'Payment Terms':payment_terms,
    'Buyer Details':buyer_info,
    'Company Details':company_name,
    'Net Amount':total,
    'Gross Amount':gross_amount,
    'Tax':tax_amount,
    'Discount':discount_amount,
    'file_name':str(file.filename),
    'Tables':Tables}
