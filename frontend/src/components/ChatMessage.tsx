interface ChatMessageProps {
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ role, content, timestamp }) => {
  const isUser = role === 'user';
  
  if (isUser) {
    return (
      <div className="flex w-full mb-6 justify-end animate-fade-in-up px-4 md:px-0">
        <div className="max-w-[85%] md:max-w-[70%] px-5 py-3.5 bg-indigo-600 text-white rounded-2xl shadow-sm">
          <p className="text-[15px] leading-relaxed whitespace-pre-wrap">{content}</p>
          <div className="text-[11px] text-indigo-200 mt-1 text-right">
            {new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex w-full mb-8 animate-fade-in-up px-4 md:px-0 group">
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
      
      <div className="flex-1 max-w-full overflow-hidden pt-1">
        <div className="text-[15px] leading-relaxed whitespace-pre-wrap text-gray-800 dark:text-gray-200">
          {content}
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;
