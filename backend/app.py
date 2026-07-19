import os
import uuid

from dotenv import load_dotenv

load_dotenv()

from flask import Flask, jsonify, request
from flask_cors import CORS

from rag import store
from rag.chunker import chunk_pages
from rag.llm import LLMError, generate_answer
from rag.pdf_utils import extract_pages

app = Flask(__name__)
origins = os.environ.get("CORS_ORIGINS", "http://localhost:3000").split(",")
CORS(app, origins=origins)

MAX_FILE_SIZE = 25 * 1024 * 1024
app.config["MAX_CONTENT_LENGTH"] = MAX_FILE_SIZE


@app.get("/health")
def health():
    return jsonify({"status": "ok"})


@app.post("/upload")
def upload():
    file = request.files.get("file")
    if file is None or file.filename == "":
        return jsonify({"error": "No file provided."}), 400
    if file.mimetype != "application/pdf":
        return jsonify({"error": "Only PDF files are supported."}), 400

    pages = extract_pages(file.stream)
    if not pages:
        return jsonify({
            "error": "Couldn't extract any text from this PDF. It may be a scanned/image-only document."
        }), 422

    chunks = chunk_pages(pages)
    doc_id = uuid.uuid4().hex
    store.add_document(doc_id, file.filename, chunks)

    return jsonify({
        "doc_id": doc_id,
        "message": f'"{file.filename}" processed — {len(pages)} pages, {len(chunks)} chunks indexed.',
    })


@app.post("/ask")
def ask():
    data = request.get_json(silent=True) or {}
    question = (data.get("question") or "").strip()
    doc_id = data.get("doc_id")

    if not question:
        return jsonify({"error": "Question is required."}), 400
    if not doc_id or not store.has_document(doc_id):
        return jsonify({"error": "Unknown document. Try re-uploading the PDF."}), 404

    chunks = store.retrieve(doc_id, question)
    try:
        answer = generate_answer(question, chunks)
    except LLMError as e:
        return jsonify({"error": str(e)}), 502

    return jsonify({"answer": answer, "sources": chunks})


if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port, debug=True, use_reloader=False)
