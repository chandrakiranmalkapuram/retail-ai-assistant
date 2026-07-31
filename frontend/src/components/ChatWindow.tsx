import React from 'react';
import ChatMessage from './ChatMessage';
import type { Message } from '../types/chat';

interface ChatWindowProps {
  messages: Message[];
}

const ChatWindow: React.FC<ChatWindowProps> = ({ messages }) => {
  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col flex-1 p-4 md:p-6 overflow-hidden">
      <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
        {messages.map((msg) => (
          <ChatMessage 
            key={msg.id} 
            role={msg.role} 
            content={msg.content} 
          />
        ))}
      </div>
    </div>
  );
};

export default ChatWindow;
