from flask import Flask, request, jsonify
from flask_cors import CORS, cross_origin
from flask import send_file
import flask
import os
import PyPDF2
from PyPDF2 import PdfReader
import google.generativeai as genai
import google.ai.generativelanguage as glm
from pathlib import Path
import pickle
from langchain.embeddings.openai import OpenAIEmbeddings
from langchain.vectorstores import FAISS
from langchain.chains.question_answering import load_qa_chain
from langchain.llms import OpenAI
from langchain.callbacks import get_openai_callback
from langchain.text_splitter import (
    RecursiveCharacterTextSplitter,
    CharacterTextSplitter,
)

gemini_api = "AIzaSyAKJxKabHwXQuH2Lt6sn53Fz7LZU8So0DQ"
genai.configure(api_key=gemini_api)

os.environ["OPENAI_API_KEY"] = "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"
store_name = ""
llm = OpenAI(temperature=0)
chain = load_qa_chain(llm, chain_type="stuff")
os.environ['KMP_DUPLICATE_LIB_OK']='True'

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


def stem_words(words):
    stemmer = PorterStemmer()
    stemmed_words = [stemmer.stem(word) for word in words]
    return stemmed_words

def check_similarity(sent1, sent2):
    try:
        cleaned_sent1 = re.sub('[^a-zA-Z\s]', '', sent1).lower()
        x = re.sub('[^a-zA-Z\s]', '', sent2).lower()
        cleaned_sent2 = stem_words(x)
        cleaned_sent1 = stem_words(cleaned_sent1.lower())
       
        unique_words = set(cleaned_sent1)
        counter = 0
        for word in cleaned_sent2:
            if word in unique_words:
                counter += 1

        return (counter / len(cleaned_sent2)) * 100
    except Exception as e:
        return jsonify({"Error": str(e)})


@app.route("/upload_file", methods=["POST"])
def process_file():
    global store_name
    try:
        file = request.files["pdf"]
        if "pdf" not in request.files:
            return jsonify({"Error 400":"No file uploaded."})

        save_directory = "Files/"

        file_path = save_directory + file.filename
        file.save(file_path)
        pdf_reader = PdfReader(file)
        store_name = file.filename[:-4]

        text = ""
        for page in pdf_reader.pages:
            text += page.extract_text()

        text_splitter = CharacterTextSplitter(
            separator="\n", chunk_overlap=200, length_function=len
        )
        chunks = text_splitter.split_text(text=text)
        embeddings = OpenAIEmbeddings()
        knowledge_base = FAISS.from_texts(chunks, embedding=embeddings)
        with open(f"{store_name}.pkl", "wb") as f:
            pickle.dump(knowledge_base, f)
        return jsonify({"response": "File saved and processed successfully."})
    except Exception as e:
        return jsonify({str(e):"No file uploaded."})


def func_question_answering(knowledge_base, user_question):
    try:
        if user_question:
            docs = knowledge_base.similarity_search(user_question)

            llm = OpenAI(batch_size=20,model='text-embedding-ada-002')
            chain = load_qa_chain(llm)
            with get_openai_callback() as cb:
                response = chain.run(input_documents=docs, question=user_question)

        else:
            response = "No question found"
            matching_images = []
        response_data = {"response": str(response), "matching_doc": []}
        return response_data
    except Exception as e:
        return {"response":str(e),"matching_images":[]}


@app.route("/question_answering", methods=["POST"])
def question_answering():
    try:
        if store_name != "":
            with open(f"{store_name}.pkl", "rb") as f:
                knowledge_base = pickle.load(f)

        question = request.form.get("question")
        response_data = func_question_answering(knowledge_base, question)

        return jsonify(response_data)
    except Exception as e:
        return jsonify({"response":str(e),'matching_doc': []})
   

if __name__ == "__main__":
    app.run(host='0.0.0.0', port=8080)