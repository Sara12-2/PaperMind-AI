---
tags: [papermind, config]
---

# Environment Variables

Two separate `.env` files, one per app. Both are gitignored — only
`.env.example` templates are committed. See [[Troubleshooting]] for what
breaks when one of these is missing or wrong.

## `backend/.env`

| Variable | Default | Required | Notes |
|---|---|---|---|
| `GROQ_API_KEY` | — | Yes, for `/ask` | `/upload` works without it. Missing key → `/ask` returns a 502 with a clear message. See [[RAG Pipeline#6. Generation — llm.py]]. |
| `GROQ_MODEL` | `llama-3.1-8b-instant` | No | Any Groq-hosted chat model id. |
| `EMBEDDING_MODEL` | `sentence-transformers/all-MiniLM-L6-v2` | No | Any sentence-transformers model name/path. Changing this re-downloads a model on next use. |
| `CORS_ORIGINS` | `http://localhost:3000` | No | Comma-separated list, passed straight to Flask-CORS. |
| `PORT` | `5000` | No | Port the Flask dev server binds. |

### GROQ_API_KEY

The one credential the whole project needs. Get a free one at
[console.groq.com/keys](https://console.groq.com/keys). Never put a real value
in `backend/.env.example` — that file is meant to be committed; put real
values only in `backend/.env`, which `.gitignore` excludes.

## `frontend/.env.local`

| Variable | Default | Notes |
|---|---|---|
| `NEXT_PUBLIC_API_URL` | `http://localhost:5000` | Base URL the frontend calls for `/upload` and `/ask`. Must keep the `NEXT_PUBLIC_` prefix — that's what makes Next.js expose it to browser-side code; anything without that prefix stays server-only and `services/api.js` (a client module) wouldn't be able to read it. |

## Related notes

[[Backend]] · [[Frontend]] · [[API Reference]] · [[Troubleshooting]]
