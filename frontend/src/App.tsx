import { useState } from "react";
import Header from "./components/Header";
import ChatWindow from "./components/ChatWindow";
import ChatInput from "./components/ChatInput";
import { Message } from "./types/chat";

function App() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      role: "assistant",
      content: "Hello! I'm your Retail AI Assistant. How can I help you today?",
    },
  ]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />

      <main className="flex-1 flex flex-col">
        <ChatWindow messages={messages} />
        <ChatInput />
      </main>
    </div>
  );
}

export default App;