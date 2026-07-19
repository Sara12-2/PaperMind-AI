"use client";

import Sidebar from "../components/Sidebar";
import ChatArea from "../components/ChatArea";
import InputBar from "../components/InputBar";
import { useDocuments } from "../hooks/useDocuments";
import { useChat } from "../hooks/useChat";

export default function Home() {
  const docs = useDocuments();
  const chat = useChat(docs.activeDoc);

  return (
    <div className="app">
      <Sidebar docs={docs} />
      <main className="main">
        <div className="topbar">
          <span className="topbar-doc">
            {docs.activeDoc ? docs.activeDoc.name : <span className="muted">No document selected</span>}
          </span>
          <span className={`topbar-badge ${docs.activeDoc ? 'active' : 'inactive'}`}>
            {docs.activeDoc ? 'Ready' : 'Idle'}
          </span>
          {chat.messages.length > 0 && (
            <button className="topbar-clear" onClick={chat.clearChat}>
              Clear chat
            </button>
          )}
        </div>
        <ChatArea messages={chat.messages} isLoading={chat.isLoading} />
        <InputBar
          input={chat.input}
          setInput={chat.setInput}
          onSend={chat.sendMessage}
          isLoading={chat.isLoading}
          activeDoc={docs.activeDoc}
        />
      </main>
    </div>
  );
}
