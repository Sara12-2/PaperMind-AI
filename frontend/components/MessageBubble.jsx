import SourceCard from "./SourceCard";
import { IconBrain, IconChevron } from "./Icons";

export default function MessageBubble({ msg, idx, sourcesOpen, onToggleSources }) {
  const isUser = msg.role === "user";

  return (
    <div className={`msg ${msg.role}`}>
      <div className="msg-avatar">
        {isUser ? "U" : <IconBrain size={16} />}
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
