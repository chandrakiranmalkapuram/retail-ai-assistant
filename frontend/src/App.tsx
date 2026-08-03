import { useState, useEffect } from "react";
import Header from "./components/Header";
import ChatWindow from "./components/ChatWindow";
import ChatInput from "./components/ChatInput";
import BasketSidebar from "./components/BasketSidebar";
import Sidebar from "./components/Sidebar";
import type { Message, Conversation } from "./types/chat";

const initConversations = (): Conversation[] => {
  const saved = localStorage.getItem("chat_conversations");
  if (saved) {
    try {
      const parsed = JSON.parse(saved);
      if (parsed && parsed.length > 0) return parsed;
    } catch (e) {
      console.error("Failed to parse chat_conversations", e);
    }
  }
  
  const legacySaved = localStorage.getItem("chat_messages");
  if (legacySaved) {
    try {
      const messages = JSON.parse(legacySaved);
      if (messages && messages.length > 0) {
        return [{
          id: Date.now().toString(),
          title: "Previous Conversation",
          createdAt: Date.now(),
          updatedAt: Date.now(),
          messages: messages
        }];
      }
    } catch (e) {}
  }

  return [];
};

function App() {
  const [isBasketOpen, setIsBasketOpen] = useState(false);
  const [basketUpdatedEvent, setBasketUpdatedEvent] = useState(0);
  
  const [conversations, setConversations] = useState<Conversation[]>(initConversations);
  const [currentConversationId, setCurrentConversationId] = useState<string>(() => {
    const convs = initConversations();
    return convs.length > 0 ? convs[0].id : "";
  });
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  const [isTyping, setIsTyping] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    return localStorage.getItem("theme") === "dark" || 
      (!("theme" in localStorage) && window.matchMedia("(prefers-color-scheme: dark)").matches);
  });

  useEffect(() => {
    localStorage.setItem("chat_conversations", JSON.stringify(conversations));
  }, [conversations]);

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

  const generateAutoTitle = (message: string) => {
    if (message.length <= 30) return message;
    return message.substring(0, 30) + "...";
  };

  const handleSendMessage = async (message: string) => {
    let targetConvId = currentConversationId;
    let isNewConv = false;
    
    if (!targetConvId || !conversations.find(c => c.id === targetConvId)) {
      targetConvId = Date.now().toString();
      isNewConv = true;
    } else {
      const conv = conversations.find(c => c.id === targetConvId);
      if (conv && conv.messages.length === 0) {
        isNewConv = true;
      }
    }

    const title = isNewConv ? generateAutoTitle(message) : undefined;
    const now = Date.now();

    const userMessage: Message = {
      id: now,
      role: "user",
      content: message,
      timestamp: now,
    };

    setConversations(prev => {
      let updated = [...prev];
      const convIndex = updated.findIndex(c => c.id === targetConvId);
      
      if (convIndex >= 0) {
        updated[convIndex] = {
          ...updated[convIndex],
          messages: [...updated[convIndex].messages, userMessage],
          updatedAt: now,
          ...(title ? { title } : {})
        };
      } else {
        updated = [{
          id: targetConvId,
          title: title || "New Chat",
          createdAt: now,
          updatedAt: now,
          messages: [userMessage]
        }, ...prev];
        setCurrentConversationId(targetConvId);
      }
      return updated;
    });

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

      setConversations(prev => {
        const updated = [...prev];
        const convIndex = updated.findIndex(c => c.id === targetConvId);
        if (convIndex >= 0) {
          updated[convIndex] = {
            ...updated[convIndex],
            messages: [...updated[convIndex].messages, aiMessage],
            updatedAt: Date.now()
          };
        }
        return updated;
      });
    } catch (error) {
      console.error("Chat error:", error);
      const errorMessage: Message = {
        id: Date.now() + 1,
        role: "assistant",
        content: "I'm sorry, I encountered a network error. Please make sure the backend is running.",
        timestamp: Date.now(),
      };
      setConversations(prev => {
        const updated = [...prev];
        const convIndex = updated.findIndex(c => c.id === targetConvId);
        if (convIndex >= 0) {
          updated[convIndex] = {
            ...updated[convIndex],
            messages: [...updated[convIndex].messages, errorMessage],
            updatedAt: Date.now()
          };
        }
        return updated;
      });
    } finally {
      setIsTyping(false);
    }
  };

  const handleNewChat = () => {
    const newId = Date.now().toString();
    const newConv: Conversation = {
      id: newId,
      title: "New Chat",
      createdAt: Date.now(),
      updatedAt: Date.now(),
      messages: []
    };
    setConversations(prev => [newConv, ...prev]);
    setCurrentConversationId(newId);
  };

  const handleRenameChat = (id: string, newTitle: string) => {
    setConversations(prev => prev.map(c => c.id === id ? { ...c, title: newTitle, updatedAt: Date.now() } : c));
  };

  const handleDeleteChat = (id: string) => {
    setConversations(prev => {
      const filtered = prev.filter(c => c.id !== id);
      if (currentConversationId === id) {
        setCurrentConversationId(filtered.length > 0 ? filtered[0].id : "");
      }
      return filtered;
    });
  };

  const handlePinChat = (id: string) => {
    setConversations(prev => prev.map(c => c.id === id ? { ...c, isPinned: !c.isPinned, updatedAt: Date.now() } : c));
  };

  const currentConversation = conversations.find(c => c.id === currentConversationId);
  const messages = currentConversation ? currentConversation.messages : [];

  return (
    <div className="h-screen bg-white dark:bg-slate-900 transition-colors duration-300 flex flex-col overflow-hidden font-sans">
      <Header 
        isDarkMode={isDarkMode} 
        toggleDarkMode={toggleDarkMode} 
        onOpenBasket={() => setIsBasketOpen(true)}
        onOpenSidebar={() => setIsSidebarOpen(true)}
      />

      <div className="flex-1 flex overflow-hidden">
        <Sidebar
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
          conversations={conversations}
          currentConversationId={currentConversationId}
          onSelectConversation={(id) => {
            setCurrentConversationId(id);
            if (window.innerWidth < 768) setIsSidebarOpen(false);
          }}
          onNewChat={handleNewChat}
          onRenameChat={handleRenameChat}
          onDeleteChat={handleDeleteChat}
          onPinChat={handlePinChat}
        />
        
        <main className="flex-1 flex flex-col overflow-hidden w-full relative">
          <div className="flex-1 overflow-hidden max-w-5xl mx-auto w-full flex flex-col">
            <ChatWindow 
              messages={messages} 
              isTyping={isTyping} 
              onSendMessage={handleSendMessage} 
              onBasketUpdate={() => setBasketUpdatedEvent(prev => prev + 1)}
            />
            
            <div className="w-full pb-4 pt-2 px-4 bg-gradient-to-t from-white via-white to-transparent dark:from-slate-900 dark:via-slate-900">
              <div className="max-w-4xl mx-auto">
                <ChatInput onSendMessage={handleSendMessage} disabled={isTyping} />
                <p className="text-center text-xs text-gray-400 dark:text-gray-500 mt-2">
                  Retail AI Assistant can make mistakes. Please verify important information.
                </p>
              </div>
            </div>
          </div>
        </main>
      </div>

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