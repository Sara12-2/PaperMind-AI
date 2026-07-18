import SourceCard from "./SourceCard";

const IconBrain = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96-.44 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 1.44-4.16Z"/>
    <path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96-.44 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-1.44-4.16Z"/>
  </svg>
);

const IconChevron = ({ open }) => (
  <svg
    width="13" height="13" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
    className={`chevron${open ? " open" : ""}`}
  >
    <polyline points="6 9 12 15 18 9"/>
  </svg>
);

export default function MessageBubble({ msg, idx, sourcesOpen, onToggleSources }) {
  const isUser = msg.role === "user";

  return (
    <div className={`msg ${msg.role}`}>
      <div className="msg-avatar">
        {isUser ? "U" : <IconBrain />}
      </div>
      <div className="msg-body">
        <div className="msg-role">{isUser ? "You" : "PaperMind"}</div>
        <div className="msg-bubble">{msg.content}</div>

        {!isUser && msg.sources?.length > 0 && (
          <div className="sources">
            <button className="sources-toggle" onClick={onToggleSources}>
              <span className="sources-dot" />
              {msg.sources.length} source{msg.sources.length > 1 ? "s" : ""} retrieved
              <IconChevron open={sourcesOpen} />
            </button>

            {sourcesOpen && (
              <div className="sources-list">
                {msg.sources.map((src, si) => (
                  <SourceCard key={si} source={src} index={si} />
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
