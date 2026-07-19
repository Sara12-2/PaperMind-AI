---
tags: [papermind, backend, flask]
---

# Backend

Flask app living in `backend/`. See [[Architecture]] for how it fits with the
frontend, and [[RAG Pipeline]] for what happens inside `/upload` and `/ask`.

## Entry point — `backend/app.py`

Three routes:

- `GET /health` — liveness check, `{"status": "ok"}`
- `POST /upload` — see [[API Reference#POST /upload]]
- `POST /ask` — see [[API Reference#POST /ask]]

CORS is enabled via Flask-CORS, origins controlled by
[[Environment Variables#CORS_ORIGINS]] (defaults to the frontend's dev origin,
`http://localhost:3000`).

Upload size is capped at 25MB via Flask's `MAX_CONTENT_LENGTH` config —
oversized uploads get rejected by Flask itself before the route handler even
runs.

## Module layout — `backend/rag/`

| File | Responsibility |
|---|---|
| `pdf_utils.py` | PyPDF2 wrapper — PDF bytes → `[{page, text}, ...]`, skipping empty pages |
| `chunker.py` | `[{page, text}]` → overlapping word-window chunks, never crossing a page boundary |
| `embedder.py` | sentence-transformers wrapper, lazy-loaded singleton model |
| `store.py` | in-memory `{doc_id: {chunks, vectors}}` + cosine-similarity retrieval |
| `llm.py` | Groq client wrapper, grounding system prompt, answer generation |

Full internals (exact chunk size, overlap, top-k, prompt) are in
[[RAG Pipeline]] — this note is about the Flask wiring, that one's about the
actual retrieval-augmented-generation logic.

## Why `use_reloader=False`

Flask's debug reloader spawns the app in a child process and restarts it on
file changes. Since document state lives in a plain Python dict
(see [[Architecture]]), a reloader-triggered restart silently wipes every
uploaded document — `/ask` then 404s with "Unknown document" even though the
upload appeared to succeed moments earlier. Running with the reloader off
avoids that surprise during development. See [[Troubleshooting]] for the
symptom if this ever regresses.

## Dependencies

Pinned in `backend/requirements.txt`:

```
flask==3.0.3
flask-cors==4.0.1
python-dotenv==1.0.1
PyPDF2==3.0.1
numpy==1.24.3
scikit-learn==1.3.0
sentence-transformers==2.2.2
groq==1.5.0
```

## Related notes

[[Architecture]] · [[RAG Pipeline]] · [[API Reference]] · [[Environment Variables]]
