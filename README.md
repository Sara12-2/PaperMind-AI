# PaperMind AI

RAG-powered research paper Q&A. Upload a PDF, ask questions about it, get answers
grounded in the document with page citations.

## Stack

- **Frontend:** Next.js (App Router) + React, plain CSS
- **Backend:** Flask, PyPDF2 (text extraction), sentence-transformers (local
  embeddings), scikit-learn/numpy (similarity search), Groq (answer generation)

## Running locally

### Backend

```bash
cd backend
pip install -r requirements.txt
cp .env.example .env   # then add your GROQ_API_KEY
python app.py
```

Runs on `http://localhost:5000`. Get a free key at [console.groq.com](https://console.groq.com).

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Runs on `http://localhost:3000`. Configure the backend URL in `frontend/.env.local`
(defaults to `http://localhost:5000`).

## How it works

1. **Upload** — the PDF is parsed page-by-page, split into overlapping chunks, and
   each chunk is embedded with a local sentence-transformers model. Chunks + embeddings
   are kept in memory, keyed by a generated `doc_id`.
2. **Ask** — the question is embedded the same way, compared against the document's
   chunks via cosine similarity, and the top matches are sent to Groq
   (`llama-3.1-8b-instant` by default) with instructions to answer only from those
   excerpts and cite page numbers.

Document state is in-memory only — restarting the backend clears uploaded documents.

## Project structure

```
backend/
  app.py              Flask routes: /health, /upload, /ask
  rag/
    pdf_utils.py       PDF -> per-page text
    chunker.py         page text -> overlapping chunks
    embedder.py        sentence-transformers wrapper
    store.py           in-memory doc store + retrieval
    llm.py             Groq answer generation

frontend/
  app/                 Next.js routes (layout.js, page.js, globals.css)
  components/          UI components
  hooks/                useDocuments, useChat
  context/              ToastContext (notifications)
  services/api.js       fetch calls to the backend
```
