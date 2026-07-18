const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:5000";

export async function uploadPDF(file) {
  const formData = new FormData();
  formData.append("file", file);

  const res = await fetch(`${API_BASE}/upload`, {
    method: "POST",
    body: formData,
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Upload failed");
  return data; // { doc_id, message }
}

export async function askQuestion(question, docId) {
  const res = await fetch(`${API_BASE}/ask`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ question, doc_id: docId }),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Request failed");
  return data; // { answer, sources: [{ text, page }] }
}
