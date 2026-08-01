import React, { useRef, useEffect } from 'react';
import ChatMessage from './ChatMessage';
import type { Message } from '../types/chat';

interface ChatWindowProps {
  messages: Message[];
  isTyping?: boolean;
  onSendMessage?: (message: string) => void;
}

const ChatWindow: React.FC<ChatWindowProps> = ({ messages, isTyping, onSendMessage }) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="flex-1 w-full max-w-4xl mx-auto overflow-hidden flex flex-col">
      <div className="flex-1 overflow-y-auto p-4 md:p-6">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full animate-fade-in-up text-center mt-10 md:mt-20">
            <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-indigo-600" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 8V4H8" />
                <rect width="16" height="12" x="4" y="8" rx="2" />
                <path d="M2 14h2" />
                <path d="M20 14h2" />
                <path d="M15 13v2" />
                <path d="M9 13v2" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">How can I help you today?</h2>
            <p className="text-gray-500 mb-6 max-w-sm">
              I can help you track your orders, find product details, or assist with returns.
            </p>
            <div className="flex flex-wrap justify-center gap-2 max-w-lg">
              {['Track my order', 'Help with a printer', 'Return an item'].map((query) => (
                <button 
                  key={query}
                  onClick={() => onSendMessage && onSendMessage(query)}
                  className="px-4 py-2 bg-white border border-gray-200 rounded-full text-sm font-medium text-indigo-600 hover:bg-indigo-50 hover:border-indigo-200 transition-colors shadow-sm"
                >
                  {query}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((msg) => (
          <ChatMessage
            key={msg.id}
            role={msg.role}
            content={msg.content}
            timestamp={msg.timestamp}
          />
        ))}

        {/* Typing Indicator */}
        {isTyping && (
          <div className="flex w-full mb-6 justify-start">
            <div className="flex-shrink-0 mr-3">
              <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center">
                <svg className="w-5 h-5 text-indigo-600" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 8V4H8" />
                  <rect width="16" height="12" x="4" y="8" rx="2" />
                  <path d="M2 14h2" />
                  <path d="M20 14h2" />
                  <path d="M15 13v2" />
                  <path d="M9 13v2" />
                </svg>
              </div>
            </div>
            <div className="bg-white text-gray-800 rounded-2xl rounded-bl-sm shadow-sm border border-gray-100 px-4 py-4 flex items-center gap-1.5">
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>
    </div>
  );
};

export default ChatWindow;
