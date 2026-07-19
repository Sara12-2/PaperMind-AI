"use client";

import { useState } from "react";
import Sidebar from "../components/Sidebar";
import ChatArea from "../components/ChatArea";
import InputBar from "../components/InputBar";
import { useDocuments } from "../hooks/useDocuments";
import { useChat } from "../hooks/useChat";
import { useTheme } from "../context/ThemeContext";
import { IconMenu, IconSun, IconMoon } from "../components/Icons";

export default function Home() {
  const docs = useDocuments();
  const chat = useChat(docs.activeDoc);
  const { theme, toggleTheme } = useTheme();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="app">
      <Sidebar docs={docs} isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div
        className={`sidebar-backdrop${sidebarOpen ? " open" : ""}`}
        onClick={() => setSidebarOpen(false)}
      />
      <main className="main">
        <div className="topbar">
          <button
            className="menu-toggle"
            onClick={() => setSidebarOpen(true)}
            aria-label="Open sidebar"
          >
            <IconMenu size={18} />
          </button>
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
          <button
            className="theme-toggle"
            onClick={toggleTheme}
            aria-label={theme === "dark" ? "Switch to light theme" : "Switch to dark theme"}
            title={theme === "dark" ? "Switch to light theme" : "Switch to dark theme"}
          >
            {theme === "dark" ? <IconSun size={16} /> : <IconMoon size={16} />}
          </button>
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
