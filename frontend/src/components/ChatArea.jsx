import { useRef, useEffect, useState } from "react";
import MessageBubble from "./MessageBubble";
import WelcomeScreen from "./WelcomeScreen";

const IconBrain = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96-.44 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 1.44-4.16Z"/>
    <path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96-.44 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-1.44-4.16Z"/>
  </svg>
);

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
              <div className="msg-avatar"><IconBrain /></div>
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
