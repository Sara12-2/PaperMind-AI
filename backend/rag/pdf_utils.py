from PyPDF2 import PdfReader


def extract_pages(file_stream):
    """Return a list of {page, text} dicts, one per non-empty PDF page."""
    reader = PdfReader(file_stream)
    pages = []
    for i, page in enumerate(reader.pages):
        text = (page.extract_text() or "").strip()
        if text:
            pages.append({"page": i + 1, "text": text})
    return pages
