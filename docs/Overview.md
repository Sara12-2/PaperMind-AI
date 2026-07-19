---
tags: [papermind, overview]
---

# PaperMind AI

A retrieval-augmented Q&A tool for research papers. Upload a PDF, ask questions
about it in plain English, get answers grounded in the actual document text
with page-number citations — not the model's general knowledge.

This vault is the technical reference for the project. Start here, then follow
the links below depending on what you're touching.

## Map of notes

- [[Architecture]] — how a request flows through the system, end to end
- [[Backend]] — the Flask app: routes, CORS, upload limits
- [[RAG Pipeline]] — the actual retrieval-augmented-generation internals: chunking, embeddings, retrieval, prompting
- [[Frontend]] — the Next.js app: components, hooks, theming, responsive layout
- [[API Reference]] — request/response shapes and error codes for every endpoint
- [[Environment Variables]] — every config value, both apps
- [[Troubleshooting]] — symptom → cause → fix

## What it does

- Drag-and-drop or click-to-upload PDF ingestion (25MB max)
- Multi-document support, chat history scoped per document
- Answers grounded strictly in the uploaded document, with inline page citations
- Expandable "sources" panel showing the exact retrieved excerpts
- Light/dark theme (see [[Frontend#Theming]])
- Fully responsive — the sidebar becomes an off-canvas drawer on narrow screens
- Toast notifications for upload validation, a crash screen instead of a blank page on render errors

## What it deliberately doesn't do

See [[RAG Pipeline#Limitations]] and [[Troubleshooting]] — no persistence across
backend restarts, no OCR, no auth, single-process only. This is a local dev /
learning project, not a hardened production service.

## Tech stack at a glance

| Layer | Choice |
|---|---|
| Frontend framework | Next.js 16 (App Router) + React 19 |
| Styling | Plain CSS, custom properties, no framework |
| Backend framework | Flask 3 + Flask-CORS |
| PDF extraction | PyPDF2 |
| Embeddings | sentence-transformers (`all-MiniLM-L6-v2`), local, CPU, no API key |
| Retrieval | scikit-learn / NumPy cosine similarity |
| Answer generation | Groq (`llama-3.1-8b-instant` by default) — the only paid/networked dependency |

Full setup instructions live in the repo's root `README.md`, not duplicated here
— this vault is about *how it works*, the README is about *how to run it*.
