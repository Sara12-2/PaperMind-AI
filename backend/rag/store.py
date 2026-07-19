import numpy as np

from .embedder import embed

TOP_K = 4

_documents = {}


def add_document(doc_id, filename, chunks):
    """chunks: list of {text, page}. Embeds and stores them under doc_id."""
    vectors = embed([c["text"] for c in chunks])
    _documents[doc_id] = {
        "filename": filename,
        "chunks": chunks,
        "vectors": vectors,
    }


def has_document(doc_id):
    return doc_id in _documents


def retrieve(doc_id, question, top_k=TOP_K):
    """Return the top_k most relevant chunks for question, each as {text, page}."""
    doc = _documents.get(doc_id)
    if not doc:
        return []

    query_vec = embed([question])[0]
    scores = doc["vectors"] @ query_vec
    top_idx = np.argsort(scores)[::-1][:top_k]
    return [doc["chunks"][i] for i in top_idx]
