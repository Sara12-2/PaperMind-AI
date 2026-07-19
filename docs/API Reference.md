---
tags: [papermind, api, backend]
---

# API Reference

All routes live in `backend/app.py`. See [[Backend]] for the Flask wiring and
[[RAG Pipeline]] for what actually happens inside `/upload` and `/ask`.

## `GET /health`

No auth, no body. Returns:

```json
{ "status": "ok" }
```

## `POST /upload`

`multipart/form-data`, single field `file` (PDF, ≤25MB).

**200 — success**
```json
{ "doc_id": "a1b2c3...", "message": "\"paper.pdf\" processed — 12 pages, 34 chunks indexed." }
```

**Errors**

| Status | Cause |
|---|---|
| 400 | No file provided, or file isn't `application/pdf` |
| 413 | File exceeds 25MB (Flask's `MAX_CONTENT_LENGTH`, rejected before the route runs) |
| 422 | PDF has no extractable text — scanned/image-only, no OCR (see [[RAG Pipeline#1. Extraction — pdf_utils.py]]) |

## `POST /ask`

`application/json`: `{ "question": string, "doc_id": string }`

**200 — success**
```json
{
  "answer": "The maximum upload size is 25MB (p. 2).",
  "sources": [
    { "text": "...chunk text...", "page": 2 },
    { "text": "...chunk text...", "page": 1 }
  ]
}
```

`sources` is always the top-4 retrieved chunks (see
[[RAG Pipeline#5. Retrieval — store.py]]), regardless of how many the model
actually cited in its answer.

**Errors**

| Status | Cause |
|---|---|
| 400 | Missing/empty `question` |
| 404 | Unknown `doc_id` — either never uploaded, or the backend restarted since upload (see [[Troubleshooting]]) |
| 502 | Groq call failed — missing/invalid `GROQ_API_KEY`, rate limit, bad model id. `error` field has the underlying message (see [[RAG Pipeline#6. Generation — llm.py]]) |

## Consumers

The frontend's entire API surface is two functions in `frontend/services/api.js`:
`uploadPDF(file)` and `askQuestion(question, docId)`. See [[Frontend]].

## Related notes

[[Backend]] · [[RAG Pipeline]] · [[Architecture]] · [[Troubleshooting]]
