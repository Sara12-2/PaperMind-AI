---
tags: [papermind, troubleshooting]
---

# Troubleshooting

Symptom → cause → fix. See [[API Reference]] for the error shapes referenced
here, [[Environment Variables]] for config, [[RAG Pipeline]] for pipeline
internals.

## `/ask` returns "GROQ_API_KEY is not set"

Add your key to `backend/.env` (not `.env.example` — see
[[Environment Variables#GROQ_API_KEY]]) and restart `python app.py`.

## Upload succeeds, but then `/ask` says "Unknown document"

The backend process restarted since you uploaded — document state is
in-memory only (see [[Architecture]], [[RAG Pipeline#Limitations]]). Common
causes: Flask's debug reloader kicked in (see [[Backend#Why use_reloader=False]]),
or you manually restarted `python app.py`. Fix: re-upload the PDF.

## CORS error in the browser console

The frontend's origin isn't in the backend's allowed list. Check
[[Environment Variables#CORS_ORIGINS]] matches the port the frontend is
actually running on (default `http://localhost:3000`), and that the frontend's
[[Environment Variables#frontend/.env.local]] points at the right backend port.

## First `/upload` request is slow

Expected, once. The embedding model (`all-MiniLM-L6-v2`, ~90MB) downloads from
Hugging Face on first use and caches locally
(`~/.cache/huggingface`) — see [[RAG Pipeline#3. Embedding — embedder.py]].
Every request after that is fast and fully offline for retrieval.

## `422 Couldn't extract any text` on upload

The PDF is scanned/image-only — PyPDF2 extracts embedded text, there's no OCR
step. See [[RAG Pipeline#1. Extraction — pdf_utils.py]].

## `npm run dev` fails immediately with no compile output

Usually a Node version mismatch. This project was verified against Node 18+;
very new or very old Node majors can behave unpredictably with Next.js's dev
server (this is exactly what happened with the project's original
Create-React-App setup on a newer Node version — it silently exited without
compiling, which is why the frontend was rebuilt on Next.js).

## Theme toggle doesn't visually update in an automated browser/preview tool

If you're driving the app through some form of headless/automated browser
tooling and a live theme toggle click doesn't visibly repaint (but the
`data-theme` attribute and `localStorage` value *do* update correctly when
inspected), that's a rendering/repaint quirk of that specific tool, not the
app — reloading the page re-applies the stored theme correctly from the very
first paint (see [[Frontend#Theming]]). Verify in a real browser if in doubt.

## Related notes

[[Overview]] · [[Architecture]] · [[Backend]] · [[RAG Pipeline]] · [[Frontend]] · [[API Reference]] · [[Environment Variables]]
