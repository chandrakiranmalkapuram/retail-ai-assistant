import React, { useRef, useEffect } from 'react';
import ChatMessage from './ChatMessage';
import ProductList from './ProductList';
import ComparisonTable from './ComparisonTable';
import type { Message } from '../types/chat';
import type { ProductSearchResult } from '../../../shared/types/product.types';

interface ChatWindowProps {
  messages: Message[];
  isTyping?: boolean;
  onSendMessage?: (message: string) => void;
}

const parseMessageContent = (content: string) => {
    // Only parse assistant messages
    const products: Partial<ProductSearchResult>[] = [];
    let isComparison = false;
    
    if (content.includes('[COMPARISON_RESULT]')) {
        isComparison = true;
        content = content.replace(/\[COMPARISON_RESULT\]/g, '');
    }

    const lines = content.split('\n');
    const cleanLines: string[] = [];

    // Pattern matches: * **Product Name** - $Price (Rating: ...) - Description - URL
    const pattern = /^\*\s+\*\*(.+?)\*\*(?:\s+for\s+|\s*-\s*)\$?([\d,.]+)(?:\s*\(Rating:\s*([\d.]+)\))?[\s:-]+(.*?)(?:\s*-\s*(https?:\/\/[^\s]+))?\s*$/i;

    for (const line of lines) {
        const match = line.match(pattern);
        if (match) {
            products.push({
                name: match[1].trim(),
                price: match[2].trim(),
                rating: match[3] ? match[3].trim() : undefined,
                description: match[4] ? match[4].trim() : undefined,
                url: match[5] ? match[5].trim() : undefined
            });
        } else {
            cleanLines.push(line);
        }
    }

    return {
        text: cleanLines.join('\n').trim(),
        products,
        isComparison
    };
};

const ChatWindow: React.FC<ChatWindowProps> = ({ messages, isTyping, onSendMessage }) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="flex-1 w-full max-w-4xl mx-auto overflow-hidden flex flex-col">
      <div className="flex-1 overflow-y-auto pb-32">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full animate-fade-in-up text-center mt-20 md:mt-32 px-4">
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6 border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-sm">
              <svg className="w-8 h-8 text-indigo-600 dark:text-indigo-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 8V4H8" />
                <rect width="16" height="12" x="4" y="8" rx="2" />
                <path d="M2 14h2" />
                <path d="M20 14h2" />
                <path d="M15 13v2" />
                <path d="M9 13v2" />
              </svg>
            </div>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-2">How can I help you today?</h2>
            <p className="text-gray-500 dark:text-gray-400 mb-8 max-w-md">
              I'm your AI Shopping Assistant. I can help you find products, track your orders, or answer questions about your purchases.
            </p>
            <div className="flex flex-wrap justify-center gap-3 max-w-2xl">
              {['Track my last order', 'Show me some laptops', 'I need a new phone'].map((query) => (
                <button 
                  key={query}
                  onClick={() => onSendMessage && onSendMessage(query)}
                  className="px-5 py-2.5 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-full text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors shadow-sm"
                >
                  {query}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="pt-8">
          {messages.map((msg) => {
            const { text, products, isComparison } = msg.role === 'assistant' 
                ? parseMessageContent(msg.content) 
                : { text: msg.content, products: [], isComparison: false };
                
            return (
              <div key={msg.id} className="flex flex-col w-full">
                {/* Normal messages */}
                {text && !isComparison && (
                  <ChatMessage
                    role={msg.role}
                    content={text}
                    timestamp={msg.timestamp}
                  />
                )}

                {/* AI Recommendation Card (For Comparisons) */}
                {text && isComparison && (
                  <div className="bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-100 dark:border-indigo-800 rounded-xl p-6 mt-4 w-full">
                    <h4 className="flex items-center gap-2 font-semibold text-indigo-900 dark:text-indigo-300 mb-4">
                      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                         <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                      </svg>
                      AI Recommendation
                    </h4>
                    <ChatMessage
                      role={msg.role}
                      content={text}
                      timestamp={msg.timestamp}
                    />
                  </div>
                )}

                {/* Normal Product List */}
                {products.length > 0 && !isComparison && (
                  <ProductList products={products} />
                )}

                {/* Product Comparison Table */}
                {products.length > 0 && isComparison && (
                  <ComparisonTable products={products} />
                )}
              </div>
            );
          })}

          {/* Typing Indicator */}
          {isTyping && (
            <div className="flex w-full mb-8 animate-fade-in-up px-4 md:px-0">
              <div className="flex-shrink-0 mr-4">
                <div className="w-8 h-8 rounded-full flex items-center justify-center border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-sm">
                  <svg className="w-4 h-4 text-indigo-600 dark:text-indigo-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 8V4H8" />
                    <rect width="16" height="12" x="4" y="8" rx="2" />
                    <path d="M2 14h2" />
                    <path d="M20 14h2" />
                    <path d="M15 13v2" />
                    <path d="M9 13v2" />
                  </svg>
                </div>
              </div>
              <div className="flex items-center gap-1.5 pt-2">
                <div className="w-2 h-2 bg-gray-400 dark:bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                <div className="w-2 h-2 bg-gray-400 dark:bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                <div className="w-2 h-2 bg-gray-400 dark:bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} className="h-4" />
        </div>
      </div>
    </div>
  );
};

export default ChatWindow;
