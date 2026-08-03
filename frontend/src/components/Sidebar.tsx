import React, { useState, useMemo } from 'react';
import type { Conversation } from '../types/chat';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  conversations: Conversation[];
  currentConversationId: string;
  onSelectConversation: (id: string) => void;
  onNewChat: () => void;
  onRenameChat: (id: string, newTitle: string) => void;
  onDeleteChat: (id: string) => void;
  onPinChat: (id: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  isOpen,
  onClose,
  conversations,
  currentConversationId,
  onSelectConversation,
  onNewChat,
  onRenameChat,
  onDeleteChat,
  onPinChat,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);

  const filteredConversations = useMemo(() => {
    if (!searchQuery.trim()) return conversations;
    const lowerQuery = searchQuery.toLowerCase();
    return conversations.filter(c => c.title.toLowerCase().includes(lowerQuery));
  }, [conversations, searchQuery]);

  const pinnedConversations = filteredConversations.filter(c => c.isPinned);
  const unpinnedConversations = filteredConversations.filter(c => !c.isPinned);

  const groupedUnpinned = useMemo(() => {
    const today: Conversation[] = [];
    const yesterday: Conversation[] = [];
    const previous7Days: Conversation[] = [];
    const older: Conversation[] = [];

    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
    const yesterdayStart = todayStart - 86400000;
    const weekStart = todayStart - 7 * 86400000;

    unpinnedConversations.forEach(c => {
      if (c.updatedAt >= todayStart) {
        today.push(c);
      } else if (c.updatedAt >= yesterdayStart) {
        yesterday.push(c);
      } else if (c.updatedAt >= weekStart) {
        previous7Days.push(c);
      } else {
        older.push(c);
      }
    });

    // Sort each group by most recent
    const sortDesc = (a: Conversation, b: Conversation) => b.updatedAt - a.updatedAt;
    today.sort(sortDesc);
    yesterday.sort(sortDesc);
    previous7Days.sort(sortDesc);
    older.sort(sortDesc);

    return { today, yesterday, previous7Days, older };
  }, [unpinnedConversations]);

  const handleRenameStart = (e: React.MouseEvent, conversation: Conversation) => {
    e.stopPropagation();
    setEditingId(conversation.id);
    setEditTitle(conversation.title);
    setActiveMenuId(null);
  };

  const handleRenameSubmit = (e: React.KeyboardEvent | React.FocusEvent, id: string) => {
    if (e.type === 'keydown' && (e as React.KeyboardEvent).key !== 'Enter') return;
    if (editTitle.trim()) {
      onRenameChat(id, editTitle.trim());
    }
    setEditingId(null);
  };

  const handleDelete = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    onDeleteChat(id);
    setActiveMenuId(null);
  };

  const handlePinToggle = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    onPinChat(id);
    setActiveMenuId(null);
  };

  const renderGroup = (title: string, items: Conversation[]) => {
    if (items.length === 0) return null;
    return (
      <div className="mb-4">
        <h3 className="px-3 text-xs font-semibold text-gray-500 dark:text-gray-400 mb-2 uppercase tracking-wider">{title}</h3>
        <ul className="space-y-1">
          {items.map(renderConversationItem)}
        </ul>
      </div>
    );
  };

  const renderConversationItem = (c: Conversation) => {
    const isActive = c.id === currentConversationId;
    return (
      <li key={c.id} className="relative group">
        <div
          onClick={() => onSelectConversation(c.id)}
          className={`flex items-center p-2 rounded-lg cursor-pointer transition-colors ${
            isActive 
              ? 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300' 
              : 'hover:bg-gray-100 dark:hover:bg-slate-800 text-gray-700 dark:text-gray-300'
          }`}
        >
          <div className="flex-1 truncate mr-6">
            {editingId === c.id ? (
              <input
                autoFocus
                type="text"
                value={editTitle}
                onChange={e => setEditTitle(e.target.value)}
                onBlur={e => handleRenameSubmit(e, c.id)}
                onKeyDown={e => handleRenameSubmit(e, c.id)}
                className="w-full bg-white dark:bg-slate-800 text-gray-900 dark:text-gray-100 border border-indigo-300 dark:border-indigo-500 rounded px-1 outline-none"
                onClick={e => e.stopPropagation()}
              />
            ) : (
              <span className="text-sm font-medium">{c.title}</span>
            )}
          </div>
          
          {!editingId && (
            <div className={`absolute right-2 flex items-center opacity-0 group-hover:opacity-100 transition-opacity ${isActive ? 'opacity-100' : ''}`}>
              <button
                onClick={(e) => { e.stopPropagation(); setActiveMenuId(activeMenuId === c.id ? null : c.id); }}
                className="p-1 rounded-md hover:bg-gray-200 dark:hover:bg-slate-700 text-gray-500 dark:text-gray-400"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <circle cx="12" cy="5" r="2" />
                  <circle cx="12" cy="12" r="2" />
                  <circle cx="12" cy="19" r="2" />
                </svg>
              </button>
            </div>
          )}
        </div>

        {activeMenuId === c.id && (
          <div className="absolute right-2 top-10 w-32 bg-white dark:bg-slate-800 rounded-lg shadow-lg border border-gray-100 dark:border-slate-700 z-10 overflow-hidden">
            <button
              onClick={(e) => handlePinToggle(e, c.id)}
              className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50 dark:hover:bg-slate-700 text-gray-700 dark:text-gray-300"
            >
              {c.isPinned ? 'Unpin' : 'Pin'}
            </button>
            <button
              onClick={(e) => handleRenameStart(e, c)}
              className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50 dark:hover:bg-slate-700 text-gray-700 dark:text-gray-300"
            >
              Rename
            </button>
            <button
              onClick={(e) => handleDelete(e, c.id)}
              className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
            >
              Delete
            </button>
          </div>
        )}
      </li>
    );
  };

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden" 
          onClick={onClose}
        />
      )}

      {/* Sidebar Container */}
      <div className={`fixed inset-y-0 left-0 z-40 w-[280px] bg-gray-50 dark:bg-slate-900 border-r border-gray-200 dark:border-slate-800 transform transition-transform duration-300 ease-in-out flex flex-col ${
        isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
      } md:static md:translate-x-0 md:flex`}>
        
        {/* Header / New Chat */}
        <div className="p-3">
          <button
            onClick={() => { onNewChat(); if (window.innerWidth < 768) onClose(); }}
            className="w-full flex items-center justify-between px-4 py-3 bg-white dark:bg-slate-800 hover:bg-gray-100 dark:hover:bg-slate-700 border border-gray-200 dark:border-slate-700 rounded-xl transition-all shadow-sm group"
          >
            <div className="flex items-center gap-3">
              <div className="bg-indigo-100 dark:bg-indigo-900/50 p-1.5 rounded-lg group-hover:bg-indigo-200 dark:group-hover:bg-indigo-800/50 transition-colors">
                <svg className="w-4 h-4 text-indigo-600 dark:text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                </svg>
              </div>
              <span className="font-semibold text-gray-700 dark:text-gray-200">New chat</span>
            </div>
          </button>
        </div>

        {/* Search */}
        <div className="px-3 pb-3">
          <div className="relative">
            <input
              type="text"
              placeholder="Search chats..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-gray-200"
            />
            <svg className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>

        {/* Conversation List */}
        <div className="flex-1 overflow-y-auto px-3 pb-4" onClick={() => setActiveMenuId(null)}>
          {renderGroup('Pinned', pinnedConversations)}
          {renderGroup('Today', groupedUnpinned.today)}
          {renderGroup('Yesterday', groupedUnpinned.yesterday)}
          {renderGroup('Previous 7 Days', groupedUnpinned.previous7Days)}
          {renderGroup('Older', groupedUnpinned.older)}
        </div>
      </div>
    </>
  );
};

export default Sidebar;
