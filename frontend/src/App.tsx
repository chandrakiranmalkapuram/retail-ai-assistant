import { useState, useEffect } from "react";
import Header from "./components/Header";
import ChatWindow from "./components/ChatWindow";
import ChatInput from "./components/ChatInput";
import type { Message } from "./types/chat";

function App() {
  const [messages, setMessages] = useState<Message[]>(() => {
    const saved = localStorage.getItem("chat_messages");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error("Failed to parse chat_messages from localStorage", e);
      }
    }
    return [];
  });
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    localStorage.setItem("chat_messages", JSON.stringify(messages));
  }, [messages]);

  const handleSendMessage = async (message: string) => {
    const userMessage: Message = {
      id: Date.now(),
      role: "user",
      content: message,
      timestamp: Date.now(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsTyping(true);

    try {
      const response = await fetch("http://localhost:3001/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message }),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch response from backend");
      }

      const data = await response.json();
      
      const aiMessage: Message = {
        id: Date.now() + 1,
        role: "assistant",
        content: data.reply || "I received an empty response.",
        timestamp: Date.now(),
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      console.error("Chat error:", error);
      const errorMessage: Message = {
        id: Date.now() + 1,
        role: "assistant",
        content: "I'm sorry, I encountered a network error. Please make sure the backend is running.",
        timestamp: Date.now(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="h-screen bg-gray-50 flex flex-col overflow-hidden">
      <Header />

      <main className="flex-1 flex flex-col overflow-hidden w-full mx-auto">
        <ChatWindow messages={messages} isTyping={isTyping} onSendMessage={handleSendMessage} />
        <div className="w-full max-w-4xl mx-auto">
          <ChatInput onSendMessage={handleSendMessage} disabled={isTyping} />
        </div>
      </main>
    </div>
  );
}

export default App;