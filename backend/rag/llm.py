import os

from groq import Groq

_client = None

SYSTEM_PROMPT = (
    "You are PaperMind AI, a research assistant that answers questions about a "
    "specific PDF using only the excerpts provided below. If the excerpts don't "
    "contain the answer, say you couldn't find it in the document. Be concise and "
    "cite page numbers inline like (p. 3) when you use a fact from an excerpt."
)


class LLMError(Exception):
    pass


def _get_client():
    global _client
    if _client is None:
        api_key = os.environ.get("GROQ_API_KEY")
        if not api_key:
            raise LLMError(
                "GROQ_API_KEY is not set. Add it to backend/.env (see .env.example)."
            )
        _client = Groq(api_key=api_key)
    return _client


def generate_answer(question, chunks):
    context = "\n\n".join(f"[p. {c['page']}] {c['text']}" for c in chunks)
    user_prompt = f"Document excerpts:\n{context}\n\nQuestion: {question}"

    client = _get_client()
    model = os.environ.get("GROQ_MODEL", "llama-3.1-8b-instant")

    try:
        completion = client.chat.completions.create(
            model=model,
            messages=[
                {"role": "system", "content": SYSTEM_PROMPT},
                {"role": "user", "content": user_prompt},
            ],
            temperature=0.2,
            max_tokens=600,
        )
    except Exception as e:
        raise LLMError(f"Groq request failed: {e}")

    return completion.choices[0].message.content.strip()
