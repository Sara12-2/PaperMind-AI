import { useState } from "react";

const IconUpload = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
    <polyline points="17 8 12 3 7 8"/>
    <line x1="12" y1="3" x2="12" y2="15"/>
  </svg>
);

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
