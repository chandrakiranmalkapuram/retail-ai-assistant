import React, { useState } from 'react';

interface ChatInputProps {
    onSendMessage: (message: string) => void;
    disabled?: boolean;
}

const ChatInput: React.FC<ChatInputProps> = ({ onSendMessage, disabled = false }) => {
    const [message, setMessage] = useState("");
    const [animatingText, setAnimatingText] = useState<string | null>(null);

    const sendMessage = () => {
        if (!message.trim() || animatingText || disabled) return;

        const sentMessage = message;
        setAnimatingText(sentMessage);
        
        setTimeout(() => {
            onSendMessage(sentMessage);
        }, 200);

        setMessage("");

        setTimeout(() => {
            setAnimatingText(null);
        }, 800);
    };
    
    return (
        <div className="w-full flex-shrink-0 px-2 md:px-0">
            <div className="relative flex items-center bg-gray-100 dark:bg-slate-800 rounded-3xl border border-transparent dark:border-slate-700 focus-within:bg-white dark:focus-within:bg-slate-800 focus-within:ring-1 focus-within:ring-gray-300 dark:focus-within:ring-slate-600 focus-within:shadow-md transition-all shadow-sm group">

                <button
                    type="button"
                    className="p-3.5 ml-1 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors rounded-full focus:outline-none"
                    aria-label="Voice input"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
                        <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
                        <line x1="12" y1="19" x2="12" y2="22" />
                    </svg>
                </button>

                <input
                    type="text"
                    value={message}
                    disabled={disabled}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === "Enter" && !disabled) {
                            sendMessage();
                        }
                    }}
                    className="flex-1 bg-transparent border-none py-4 px-2 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-0 disabled:opacity-50 disabled:cursor-not-allowed text-[15px]"
                    placeholder="Ask me anything..."
                />

                <button
                    type="button"
                    onClick={sendMessage}
                    disabled={disabled || !message.trim()}
                    className={`mr-2 rounded-full transition-all duration-300 focus:outline-none flex items-center justify-center relative ${
                        disabled || !message.trim() 
                        ? 'bg-gray-200 dark:bg-slate-700 text-gray-400 dark:text-gray-500 cursor-not-allowed' 
                        : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm'
                    } ${
                        animatingText ? 'px-4 py-2 w-auto max-w-[150px]' : 'p-2 w-9 h-9'
                    }`}
                    aria-label="Send message"
                >
                    {animatingText ? (
                        <span className="animate-rocket-text text-sm font-medium whitespace-nowrap block truncate">
                            {animatingText}
                        </span>
                    ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" className={`w-4 h-4 ml-[1px] transition-transform duration-300 ${(!disabled && message.trim()) ? 'hover:translate-x-0.5 hover:-translate-y-0.5' : ''}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="12" y1="19" x2="12" y2="5" />
                            <polyline points="5 12 12 5 19 12" />
                        </svg>
                    )}
                </button>

            </div>
        </div>
    );
};

export default ChatInput;
