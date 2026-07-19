"use client";

import { useState } from "react";
import { uploadPDF } from "../services/api";
import { useToast } from "../context/ToastContext";

const MAX_FILE_SIZE = 25 * 1024 * 1024; // 25MB

export function useDocuments() {
  const [documents, setDocuments]   = useState([]);
  const [activeDoc, setActiveDoc]   = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadName, setUploadName] = useState("");
  const { showToast } = useToast();

  async function handleUpload(file) {
    if (!file) return;
    if (file.type !== "application/pdf") {
      showToast("Please upload a PDF file.");
      return;
    }
    if (file.size > MAX_FILE_SIZE) {
      showToast(`"${file.name}" is too large (max 25MB).`);
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
      showToast(data.message || `"${file.name}" uploaded.`, "success");
    } catch (err) {
      showToast(err.message || "Upload failed. Is the Flask server running?");
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
