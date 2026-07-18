import { useEffect, useRef } from "react";

const IconSend = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="22" y1="2" x2="11" y2="13"/>
    <polygon points="22 2 15 22 11 13 2 9 22 2"/>
  </svg>
);

export default function InputBar({ input, setInput, onSend, isLoading, activeDoc }) {
  const textareaRef = useRef(null);

  // Auto-resize textarea height
  useEffect(() => {
    const ta = textareaRef.current;
    if (ta) {
      ta.style.height = "22px";
      ta.style.height = Math.min(ta.scrollHeight, 140) + "px";
    }
  }, [input]);

  function onKey(e) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onSend();
    }
  }

  const placeholder = activeDoc
    ? `Ask anything about "${activeDoc.name}"…`
    : "Upload a PDF to start asking questions…";

  return (
    <div className="input-area">
      <div className="input-wrap">
        <textarea
          ref={textareaRef}
          rows={1}
          placeholder={placeholder}
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={onKey}
          disabled={!activeDoc || isLoading}
        />
        <button
          className="send-btn"
          onClick={onSend}
          disabled={!input.trim() || !activeDoc || isLoading}
        >
          <IconSend />
        </button>
      </div>
      <div className="input-hint">Enter to send · Shift + Enter for new line</div>
    </div>
  );
}
