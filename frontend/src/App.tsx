import { useState, useEffect } from "react";
import Header from "./components/Header";
import ChatWindow from "./components/ChatWindow";
import ChatInput from "./components/ChatInput";
import BasketSidebar from "./components/BasketSidebar";
import type { Message } from "./types/chat";

function App() {
  const [isBasketOpen, setIsBasketOpen] = useState(false);
  const [basketUpdatedEvent, setBasketUpdatedEvent] = useState(0);
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
  const [isDarkMode, setIsDarkMode] = useState(() => {
    return localStorage.getItem("theme") === "dark" || 
      (!("theme" in localStorage) && window.matchMedia("(prefers-color-scheme: dark)").matches);
  });

  useEffect(() => {
    localStorage.setItem("chat_messages", JSON.stringify(messages));
  }, [messages]);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  const toggleDarkMode = () => setIsDarkMode(prev => !prev);

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
        data: data.data,
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
    <div className="h-screen bg-white dark:bg-slate-900 transition-colors duration-300 flex flex-col overflow-hidden font-sans">
      <Header 
        isDarkMode={isDarkMode} 
        toggleDarkMode={toggleDarkMode} 
        onOpenBasket={() => setIsBasketOpen(true)}
      />

      <main className="flex-1 flex flex-col overflow-hidden w-full max-w-5xl mx-auto relative">
        <ChatWindow 
          messages={messages} 
          isTyping={isTyping} 
          onSendMessage={handleSendMessage} 
          onBasketUpdate={() => setBasketUpdatedEvent(prev => prev + 1)}
        />
        
        <div className="w-full pb-4 pt-2 px-4 bg-gradient-to-t from-white via-white to-transparent dark:from-slate-900 dark:via-slate-900 absolute bottom-0">
          <div className="max-w-4xl mx-auto">
            <ChatInput onSendMessage={handleSendMessage} disabled={isTyping} />
            <p className="text-center text-xs text-gray-400 dark:text-gray-500 mt-2">
              Retail AI Assistant can make mistakes. Please verify important information.
            </p>
          </div>
        </div>
      </main>

      <BasketSidebar 
        isOpen={isBasketOpen} 
        onClose={() => setIsBasketOpen(false)} 
        basketUpdatedEvent={basketUpdatedEvent}
        onCheckout={() => handleSendMessage("Checkout my basket")}
      />
    </div>
  );
}

export default App;