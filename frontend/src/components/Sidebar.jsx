import UploadZone from "./UploadZone";
import DocItem from "./DocItem";

// Brain icon
const IconBrain = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96-.44 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 1.44-4.16Z"/>
    <path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96-.44 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-1.44-4.16Z"/>
  </svg>
);

export default function Sidebar({ docs }) {
  const {
    documents, activeDoc,
    isUploading, uploadName,
    handleUpload, removeDoc, switchDoc,
  } = docs;

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <div className="logo">
          <div className="logo-icon"><IconBrain /></div>
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
              onClick={() => switchDoc(doc)}
              onRemove={() => removeDoc(doc.id)}
            />
          ))
        )}
      </div>
    </aside>
  );
}
