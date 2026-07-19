"use client";

import { useEffect, useRef } from "react";
import { IconSend } from "./Icons";

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
