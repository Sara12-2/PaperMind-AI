export default function SourceCard({ source, index }) {
  return (
    <div className="source-card">
      <div className="source-card-header">
        <span className="source-badge">Page {source.page || "?"}</span>
        <span className="source-chunk">Chunk {index + 1}</span>
      </div>
      <div className="source-text">{source.text}</div>
    </div>
  );
}
