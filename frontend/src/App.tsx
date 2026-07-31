import { useState } from "react";
import Header from "./components/Header";
import ChatWindow from "./components/ChatWindow";
import ChatInput from "./components/ChatInput";
import type { Message } from "./types/chat";

function App() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      role: "assistant",
      content: "Hello! I'm your Retail AI Assistant. How can I help you today?",
    },
  ]);

  const handleSendMessage = (message: string) => {
    const userMessage: Message = {
      id: Date.now(),
      role: "user",
      content: message,
    };

    setMessages((prev) => [...prev, userMessage]);

    setTimeout(() => {
      let reply = "I'm sorry, I didn't understand that.";

      if (message.toLowerCase().includes("order")) {
        reply =
          "Sure! Please tell me your order number or email address.";
      } else if (message.toLowerCase().includes("printer")) {
        reply =
          "No problem! What is your printer model? For example: HP DeskJet 2720.";
      } else if (message.toLowerCase().includes("hello")) {
        reply = "Hello! How can I help you today?";
      }

      const aiMessage: Message = {
        id: Date.now() + 1,
        role: "assistant",
        content: reply,
      };

      setMessages((prev) => [...prev, aiMessage]);
    }, 1000);
  };

  return (
    <div className="h-screen bg-gray-50 flex flex-col overflow-hidden">
      <Header />

      <main className="flex-1 flex flex-col overflow-hidden w-full mx-auto">
        <ChatWindow messages={messages} />
        <div className="w-full max-w-4xl mx-auto">
          <ChatInput onSendMessage={handleSendMessage} />
        </div>
      </main>
    </div>
  );
}

export default App;