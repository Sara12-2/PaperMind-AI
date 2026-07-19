import os

from sentence_transformers import SentenceTransformer

_model = None


def get_model():
    global _model
    if _model is None:
        name = os.environ.get("EMBEDDING_MODEL", "sentence-transformers/all-MiniLM-L6-v2")
        _model = SentenceTransformer(name)
    return _model


def embed(texts):
    """Embed a list of strings, returns an (n, dim) numpy array of normalized vectors."""
    model = get_model()
    return model.encode(texts, normalize_embeddings=True, convert_to_numpy=True)
