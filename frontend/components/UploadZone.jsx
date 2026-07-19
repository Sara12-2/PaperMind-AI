"use client";

import { useState } from "react";
import { IconUpload } from "./Icons";

export default function UploadZone({ onUpload, isUploading, uploadName }) {
  const [isDrag, setIsDrag] = useState(false);

  function onDrop(e) {
    e.preventDefault();
    setIsDrag(false);
    if (e.dataTransfer.files[0]) onUpload(e.dataTransfer.files[0]);
  }

  function onFileInput(e) {
    if (e.target.files[0]) onUpload(e.target.files[0]);
    e.target.value = ""; // reset so same file can be re-uploaded
  }

  return (
    <>
      <label
        className={`upload-zone${isDrag ? " drag" : ""}`}
        onDragOver={e => { e.preventDefault(); setIsDrag(true); }}
        onDragLeave={() => setIsDrag(false)}
        onDrop={onDrop}
      >
        <input
          type="file"
          accept=".pdf"
          onChange={onFileInput}
          disabled={isUploading}
        />
        <div className="upload-icon"><IconUpload /></div>
        <div className="upload-label">
          <span>Click to upload</span> or drag & drop<br />PDF files only
        </div>
      </label>

      {isUploading && (
        <div className="upload-progress">
          <div className="spinner" />
          Processing {uploadName}…
        </div>
      )}
    </>
  );
}
