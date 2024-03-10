from flask import Flask, request, jsonify
from flask_cors import CORS, cross_origin
from flask import send_file
import flask

import PyPDF2
from PyPDF2 import PdfReader
import google.generativeai as genai
import google.ai.generativelanguage as glm
from pathlib import Path

gemini_api = "AIzaSyAKJxKabHwXQuH2Lt6sn53Fz7LZU8So0DQ"
genai.configure(api_key=gemini_api)

app = Flask(__name__)
cors = CORS(app)

def genai_general(query):
    model = genai.GenerativeModel('gemini-pro')
    response = model.generate_content(query)
    return response.text

def pdf2txt(filepath):
    pdfFileObj = open(filepath, 'rb')
    pdfReader = PyPDF2.PdfReader(pdfFileObj)

    data = []
    for i in range(len(pdfReader.pages)):
        pageObj = pdfReader.pages[i]
        data.append(pageObj.extract_text())

    pdfFileObj.close()

    return data

def genai_payroll(context, query):
    model = genai.GenerativeModel('gemini-pro')
    response = model.generate_content("you are a payroll insight assistance can you answer the following query : "+query+" using the following content : "+' '.join(context))
    return response.text


@app.route('/say_hello', methods=['GET'])
def say_hello():
    return 'Hello!welcome to devzen.'

pdf_file_data = ""
@app.route('/extract_text', methods=['POST'])
def extract_text_r2r():
    global pdf_file_data
    if 'file' not in request.files:
        return jsonify({'error': 'No file uploaded'})
    try:
        file = request.files['file']
        file_name = file.filename[:-4]
        save_directory = "./"
        if not file.filename.endswith('.pdf'):
            return jsonify({'error': 'Invalid file format'})

        pdf_reader = PdfReader(file)
       
        extracted_text = ''
        for page in pdf_reader.pages:
            extracted_text += page.extract_text()

        pdf_file_data = extracted_text
        with open(f"{save_directory}data.txt",'w') as f:
            f.write(extracted_text)
        return jsonify({'text': f'Data stored in {file_name}.txt successfully.', 'status':'success'})
    except Exception as e:
        return jsonify({'error':str(e), 'status':'failed'})
   
   
@app.route("/query_pdf", methods=["POST"])
def query_pdf():
    global pdf_file_data

    query = request.form.get("query")
    response = genai_payroll(pdf_file_data, query)
   
    return jsonify({'response':response, 'status':'success'})


@app.route("/general_qa", methods=["POST"])
def general_qa():
    query = request.form.get("query")
    response = genai_general(query)
   
    return jsonify({'response':response, 'status':'success'})

if __name__ == "__main__":
    app.run(host='0.0.0.0', port=8080)




