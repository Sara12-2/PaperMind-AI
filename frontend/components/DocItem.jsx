import { IconFile, IconX } from "./Icons";

export default function DocItem({ doc, isActive, onClick, onRemove }) {
  return (
    <div className={`doc-item${isActive ? " active" : ""}`} onClick={onClick}>
      <span className="doc-item-icon"><IconFile /></span>
      <span className="doc-item-name" title={doc.name}>{doc.name}</span>
      <button
        className="doc-item-del"
        onClick={e => { e.stopPropagation(); onRemove(); }}
        title="Remove document"
      >
        <IconX />
      </button>
    </div>
  );
}
