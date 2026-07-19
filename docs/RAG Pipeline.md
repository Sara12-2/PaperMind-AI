---
tags: [papermind, rag, backend]
---

# RAG Pipeline

The actual retrieval-augmented-generation logic, as implemented today in
`backend/rag/`. See [[Backend]] for the Flask wiring around this, and
[[Architecture]] for the end-to-end request flow.

## 1. Extraction — `pdf_utils.py`

PyPDF2 reads the uploaded PDF page by page. Any page whose extracted text is
empty after stripping whitespace is dropped (this is what makes scanned/
image-only PDFs fail with a 422 — see [[API Reference#POST /upload]] and
[[Troubleshooting]]; there's no OCR step).

Output: `[{page: 1, text: "..."}, {page: 2, text: "..."}, ...]`

## 2. Chunking — `chunker.py`

Each page's text is split into overlapping word-windows:

- **180 words per chunk**
- **30-word overlap** between consecutive chunks
- Chunks **never cross a page boundary** — every chunk carries exactly one
  page number, which is what makes page citations possible downstream

The overlap exists so a fact sitting right at a chunk boundary doesn't get
split across two chunks and lost to both.

## 3. Embedding — `embedder.py`

Model: `sentence-transformers/all-MiniLM-L6-v2` (configurable via
[[Environment Variables#EMBEDDING_MODEL]]), loaded once as a lazy singleton on
first use. Runs on CPU via PyTorch — no API key, no network call once the
model weights are cached locally (~90MB, downloaded from Hugging Face on first
run only).

Every chunk gets embedded once, at upload time. Vectors are L2-normalized.

## 4. Storage — `store.py`

A plain Python dict: `{doc_id: {filename, chunks, vectors}}`. `doc_id` is a
random `uuid4().hex` generated at upload time. This is **in-memory only** —
see [[Architecture]] for why that's the central architectural tradeoff of the
whole project, and [[Limitations]] below for what it costs you.

## 5. Retrieval — `store.py`

At ask-time:

1. The question is embedded with the same model (normalized).
2. Cosine similarity — which, since both vectors are normalized, reduces to a
   plain dot product — is computed between the question vector and every
   chunk vector for that `doc_id`.
3. The **top 4** chunks by similarity score are selected as context.

## 6. Generation — `llm.py`

The top-4 chunks (each prefixed `[p. N]`) plus the question are sent to Groq
as a chat completion:

- Model: `llama-3.1-8b-instant` by default (configurable, see
  [[Environment Variables#GROQ_MODEL]])
- `temperature=0.2`, `max_tokens=600`
- System prompt instructs the model to answer **only** from the given
  excerpts, admit when the answer isn't in them, and cite page numbers inline
  (`(p. 3)` style)

If `GROQ_API_KEY` is missing or the Groq call fails for any reason, `/ask`
returns a `502` with the underlying error message rather than a generic
failure — see [[API Reference#POST /ask]].

## Tuning knobs, if you're adjusting retrieval quality

| Constant | Location | Current value |
|---|---|---|
| Chunk size | `chunker.py` `CHUNK_WORDS` | 180 words |
| Chunk overlap | `chunker.py` `OVERLAP_WORDS` | 30 words |
| Retrieved chunks | `store.py` `TOP_K` | 4 |
| Generation temperature | `llm.py` | 0.2 |
| Generation max tokens | `llm.py` | 600 |

## Limitations

- **No persistence** — restarting the Flask process clears every uploaded
  document; there's no database backing the store
- **No OCR** — scanned/image-only PDFs return a 422, since PyPDF2 extracts
  embedded text only
- **Single-process only** — the in-memory store doesn't work across multiple
  gunicorn workers (see [[Architecture#Process/deployment shape]])
- **English-tuned embeddings** — `all-MiniLM-L6-v2` works cross-lingually but
  is optimized for English; retrieval on non-English PDFs may be weaker
- **No streaming** — `/ask` waits for the full Groq response before replying

## Related notes

[[Backend]] · [[Architecture]] · [[API Reference]] · [[Troubleshooting]]
