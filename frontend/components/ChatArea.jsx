"use client";

import { useRef, useEffect, useState } from "react";
import MessageBubble from "./MessageBubble";
import WelcomeScreen from "./WelcomeScreen";
import { IconBrain } from "./Icons";

export default function ChatArea({ messages, isLoading }) {
  const chatRef = useRef(null);
  const [openSources, setOpenSources] = useState({});

  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  function toggleSources(idx) {
    setOpenSources(prev => ({ ...prev, [idx]: !prev[idx] }));
  }

  return (
    <div className="chat-area" ref={chatRef}>
      {messages.length === 0 && !isLoading ? (
        <WelcomeScreen />
      ) : (
        <>
          {messages.map((msg, idx) => (
            <MessageBubble
              key={idx}
              msg={msg}
              idx={idx}
              sourcesOpen={openSources[idx]}
              onToggleSources={() => toggleSources(idx)}
            />
          ))}

          {isLoading && (
            <div className="msg ai">
              <div className="msg-avatar"><IconBrain size={18} /></div>
              <div className="msg-body">
                <div className="msg-role">PaperMind</div>
                <div className="msg-bubble">
                  <div className="typing">
                    <div className="dot" />
                    <div className="dot" />
                    <div className="dot" />
                  </div>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
