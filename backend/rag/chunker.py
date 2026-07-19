CHUNK_WORDS = 180
OVERLAP_WORDS = 30


def chunk_pages(pages, chunk_words=CHUNK_WORDS, overlap_words=OVERLAP_WORDS):
    """Split each page's text into overlapping word-window chunks.

    Returns a list of {text, page} dicts, page numbers preserved from the source page.
    """
    chunks = []
    for page in pages:
        words = page["text"].split()
        if not words:
            continue
        step = chunk_words - overlap_words
        for start in range(0, len(words), step):
            window = words[start:start + chunk_words]
            if not window:
                continue
            chunks.append({"text": " ".join(window), "page": page["page"]})
            if start + chunk_words >= len(words):
                break
    return chunks
