FROM python:3.9

RUN pip install pdf2image fastapi uvicorn  numpy pandas matplotlib  tensorflow==2.5 time opencv-python pytesseract

EXPOSE 80

COPY ./app /app

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "80"]