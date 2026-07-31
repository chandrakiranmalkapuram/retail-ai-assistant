import React from 'react';

interface ChatInputProps {
    onSendMessage: (message: string) => void;
}
const ChatInput: React.FC<ChatInputProps> = ({ onSendMessage }) => {
    return (
        <div className="w-full bg-white p-4 rounded-b-lg border-t border-gray-100">
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
                    className="flex-1 bg-transparent border-none py-3 px-2 text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-0"
                    placeholder="Ask me anything about products or orders..."
                />

                {/* Send Button (Right) */}
                <button
                    type="button"
                    className="p-2 mr-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition-colors shadow-sm focus:outline-none"
                    aria-label="Send message"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 ml-[2px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="22" y1="2" x2="11" y2="13" />
                        <polygon points="22 2 15 22 11 13 2 9 22 2" />
                    </svg>
                </button>

            </div>
        </div>
    );
};

export default ChatInput;
