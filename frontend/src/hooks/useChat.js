import { useState, useEffect, useRef } from "react";
import { askQuestion } from "../services/api";

export function useChat(activeDoc) {
  const [messages,  setMessages]  = useState([]);
  const [input,     setInput]     = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const chatRef = useRef(null);

  // Clear chat when document changes
  useEffect(() => {
    setMessages([]);
    setInput("");
  }, [activeDoc?.id]);

  // Auto-scroll on new message
  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  async function sendMessage() {
    const q = input.trim();
    if (!q || isLoading || !activeDoc) return;

    setMessages(prev => [...prev, { role: "user", content: q }]);
    setInput("");
    setIsLoading(true);

    try {
      const data = await askQuestion(q, activeDoc.id);
      setMessages(prev => [
        ...prev,
        { role: "ai", content: data.answer, sources: data.sources || [] },
      ]);
    } catch (err) {
      setMessages(prev => [
        ...prev,
        { role: "ai", content: `Error: ${err.message}`, sources: [] },
      ]);
    } finally {
      setIsLoading(false);
    }
  }

  function clearChat() {
    setMessages([]);
    setInput("");
  }

  return {
    messages,
    input,
    setInput,
    isLoading,
    sendMessage,
    clearChat,
    chatRef,
  };
}
