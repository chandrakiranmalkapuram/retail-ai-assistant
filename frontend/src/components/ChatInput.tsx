import React, { useState } from 'react';

interface ChatInputProps {
    onSendMessage: (message: string) => void;
}
const ChatInput: React.FC<ChatInputProps> = ({ onSendMessage }) => {
    const [message, setMessage] = useState("");
    const [animatingText, setAnimatingText] = useState<string | null>(null);

    const sendMessage = () => {
        if (!message.trim() || animatingText) return;

        const sentMessage = message;
        setAnimatingText(sentMessage);
        
        // Wait briefly for the animation before actually triggering the chat update
        setTimeout(() => {
            onSendMessage(sentMessage);
        }, 200);

        setMessage("");

        // Reset animation state
        setTimeout(() => {
            setAnimatingText(null);
        }, 800);
    };
    return (
        <div className="w-full p-4 flex-shrink-0">
            <div className="relative flex items-center bg-gray-50 rounded-full border border-gray-200 focus-within:ring-2 focus-within:ring-indigo-500 focus-within:border-transparent transition-shadow shadow-sm">

                {/* Microphone Button (Left) */}
                <button
                    type="button"
                    className="p-3 ml-1 text-gray-500 hover:text-indigo-600 transition-colors rounded-full focus:outline-none"
                    aria-label="Voice input"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
                        <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
                        <line x1="12" y1="19" x2="12" y2="22" />
                    </svg>
                </button>

                {/* Text Input */}
                <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === "Enter") {
                            sendMessage();
                        }
                    }}
                    className="flex-1 bg-transparent border-none py-3 px-2 text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-0"
                    placeholder="Ask me anything about products or orders..."
                />
                {/* Send Button (Right) */}
                <button
                    type="button"
                    onClick={sendMessage}
                    className={`mr-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition-all duration-300 shadow-sm focus:outline-none flex items-center justify-center relative ${
                        animatingText ? 'px-4 py-2 w-auto max-w-[150px]' : 'p-2 w-10 h-10'
                    }`}
                    aria-label="Send message"
                >
                    {animatingText ? (
                        <span className="animate-rocket-text text-sm font-medium whitespace-nowrap block truncate">
                            {animatingText}
                        </span>
                    ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 ml-[2px] transition-transform duration-300 hover:translate-x-1 hover:-translate-y-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="22" y1="2" x2="11" y2="13" />
                            <polygon points="22 2 15 22 11 13 2 9 22 2" />
                        </svg>
                    )}
                </button>

            </div>
        </div>
    );
};

export default ChatInput;
