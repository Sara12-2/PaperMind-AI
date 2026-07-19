import UploadZone from "./UploadZone";
import DocItem from "./DocItem";
import { IconBrain } from "./Icons";

export default function Sidebar({ docs, isOpen, onClose }) {
  const {
    documents, activeDoc,
    isUploading, uploadName,
    handleUpload, removeDoc, switchDoc,
  } = docs;

  function selectDoc(doc) {
    switchDoc(doc);
    onClose?.();
  }

  return (
    <aside className={`sidebar${isOpen ? " open" : ""}`}>
      <div className="sidebar-header">
        <div className="logo">
          <div className="logo-icon"><IconBrain size={22} /></div>
          <div>
            <div className="logo-text">PaperMind AI</div>
            <div className="logo-sub">Research Assistant</div>
          </div>
        </div>
        <UploadZone
          onUpload={handleUpload}
          isUploading={isUploading}
          uploadName={uploadName}
        />
      </div>

      <div className="docs-section">
        <div className="docs-title">Documents</div>
        {documents.length === 0 ? (
          <div className="empty-docs">
            No documents yet.<br />Upload a PDF to get started.
          </div>
        ) : (
          documents.map(doc => (
            <DocItem
              key={doc.id}
              doc={doc}
              isActive={activeDoc?.id === doc.id}
              onClick={() => selectDoc(doc)}
              onRemove={() => removeDoc(doc.id)}
            />
          ))
        )}
      </div>
    </aside>
  );
}
