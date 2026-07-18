import { useState } from "react";
import { uploadPDF } from "../services/api";

export function useDocuments() {
  const [documents, setDocuments]   = useState([]);
  const [activeDoc, setActiveDoc]   = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadName, setUploadName] = useState("");

  async function handleUpload(file) {
    if (!file) return;
    if (file.type !== "application/pdf") {
      alert("Please upload a PDF file.");
      return;
    }

    setIsUploading(true);
    setUploadName(file.name);

    try {
      const data = await uploadPDF(file);
      const newDoc = {
        id:   data.doc_id || String(Date.now()),
        name: file.name,
      };
      setDocuments(prev => [newDoc, ...prev]);
      setActiveDoc(newDoc);
    } catch (err) {
      alert(err.message || "Upload failed. Is the Flask server running?");
    } finally {
      setIsUploading(false);
      setUploadName("");
    }
  }

  function removeDoc(id) {
    setDocuments(prev => prev.filter(d => d.id !== id));
    if (activeDoc?.id === id) setActiveDoc(null);
  }

  function switchDoc(doc) {
    setActiveDoc(doc);
  }

  return {
    documents,
    activeDoc,
    isUploading,
    uploadName,
    handleUpload,
    removeDoc,
    switchDoc,
  };
}
