'use client';

import { useState, useEffect } from 'react';
import { getMessages, updateMessageStatus, deleteMessage } from '../../lib/firestore-service';
import { Mail, Check, Trash2, Shield, Circle, Reply } from 'lucide-react';

export default function MessagesInbox() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMessage, setSelectedMessage] = useState(null);

  useEffect(() => {
    loadMessages();
  }, []);

  async function loadMessages() {
    setLoading(true);
    const data = await getMessages();
    setMessages(data);
    setLoading(false);
  }

  const handleSelectMessage = async (msg) => {
    setSelectedMessage(msg);
    if (msg.status === 'unread') {
      try {
        await updateMessageStatus(msg.id, 'read');
        // Update local state
        setMessages(prev =>
          prev.map(m => (m.id === msg.id ? { ...m, status: 'read' } : m))
        );
      } catch (err) {
        console.error('Failed to update message status:', err);
      }
    }
  };

  const handleToggleStatus = async (e, msg) => {
    e.stopPropagation();
    const newStatus = msg.status === 'read' ? 'unread' : 'read';
    try {
      await updateMessageStatus(msg.id, newStatus);
      setMessages(prev =>
        prev.map(m => (m.id === msg.id ? { ...m, status: newStatus } : m))
      );
      if (selectedMessage?.id === msg.id) {
        setSelectedMessage(prev => ({ ...prev, status: newStatus }));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (e, id) => {
    e.stopPropagation();
    if (!confirm('Are you sure you want to delete this message?')) return;
    try {
      await deleteMessage(id);
      setMessages(prev => prev.filter(m => m.id !== id));
      if (selectedMessage?.id === id) {
        setSelectedMessage(null);
      }
    } catch (err) {
      console.error(err);
      alert('Failed to delete message');
    }
  };

  return (
    <div className="space-y-10 animate-fade-in-up">
      {/* Header */}
      <div className="pb-6 border-b border-slate-900">
        <h1 className="font-heading text-3xl font-extrabold text-white">Inquiries Inbox</h1>
        <p className="text-slate-400 text-sm mt-1">Review contact inquiries submitted on your website.</p>
      </div>

      {loading ? (
        <div className="text-center py-20">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-indigo-500 border-r-2 mb-4"></div>
          <p className="text-slate-400">Loading messages...</p>
        </div>
      ) : messages.length === 0 ? (
        <div className="glass-card text-center py-20 text-slate-500 rounded-2xl">
          <Mail size={48} className="mx-auto mb-4 text-slate-700" />
          <p className="text-lg">Your inbox is empty</p>
          <p className="text-xs text-slate-650 mt-1">Messages submitted on the contact page will appear here.</p>
        </div>
      ) : (
        /* Split view: List on left, reader on right */
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 min-h-[500px]">
          {/* Messages list */}
          <div className="lg:col-span-2 space-y-3 max-h-[600px] overflow-y-auto pr-2">
            {messages.map((msg) => (
              <div
                key={msg.id}
                onClick={() => handleSelectMessage(msg)}
                className={`glass-card p-4 rounded-xl cursor-pointer hover:border-slate-800 transition-all border ${
                  selectedMessage?.id === msg.id
                    ? 'border-indigo-500 bg-indigo-950/5'
                    : msg.status === 'unread'
                    ? 'border-slate-850 bg-slate-900/40'
                    : 'border-slate-900/60'
                }`}
              >
                <div className="flex justify-between items-start mb-1">
                  <div className="flex items-center gap-1.5 min-w-0">
                    {msg.status === 'unread' && (
                      <Circle size={8} className="text-indigo-400 fill-indigo-400 shrink-0" />
                    )}
                    <span className={`text-sm text-slate-200 truncate ${msg.status === 'unread' ? 'font-bold' : ''}`}>
                      {msg.name}
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-500 shrink-0 font-medium">
                    {new Date(msg.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-xs text-indigo-400/80 mb-2 truncate">{msg.email}</p>
                <p className="text-xs text-slate-400 line-clamp-1 leading-relaxed">{msg.message}</p>
              </div>
            ))}
          </div>

          {/* Reader Panel */}
          <div className="lg:col-span-3">
            {selectedMessage ? (
              <div className="glass-card p-8 rounded-2xl border border-slate-900 flex flex-col h-full justify-between">
                <div className="space-y-6">
                  {/* Sender Details */}
                  <div className="pb-6 border-b border-slate-900 flex justify-between items-start">
                    <div className="space-y-1">
                      <h4 className="font-heading text-lg font-bold text-white">{selectedMessage.name}</h4>
                      <p className="text-sm text-indigo-400 font-medium">{selectedMessage.email}</p>
                      <p className="text-[10px] text-slate-500">
                        Received on: {new Date(selectedMessage.createdAt).toLocaleString()}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={(e) => handleToggleStatus(e, selectedMessage)}
                        title={selectedMessage.status === 'read' ? 'Mark as Unread' : 'Mark as Read'}
                        className={`p-2.5 rounded-xl border transition-all ${
                          selectedMessage.status === 'read'
                            ? 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                            : 'bg-indigo-950/20 border-indigo-900/30 text-indigo-400 hover:text-indigo-300'
                        }`}
                      >
                        <Check size={16} />
                      </button>
                      <button
                        onClick={(e) => handleDelete(e, selectedMessage.id)}
                        title="Delete Message"
                        className="p-2.5 rounded-xl bg-pink-950/10 border border-pink-900/20 hover:bg-pink-900/30 text-pink-400 hover:text-pink-300 transition-all"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>

                  {/* Body Text */}
                  <div className="space-y-2">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Message Body</span>
                    <p className="text-slate-300 text-sm leading-relaxed whitespace-pre-wrap font-light">
                      {selectedMessage.message}
                    </p>
                  </div>
                </div>

                {/* Reply Button */}
                <div className="pt-8 border-t border-slate-900 mt-8 flex justify-end">
                  <a
                    href={`mailto:${selectedMessage.email}?subject=Regarding your portfolio inquiry`}
                    className="flex items-center gap-2 px-5 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition-all"
                  >
                    <Reply size={14} />
                    Reply via Email
                  </a>
                </div>
              </div>
            ) : (
              <div className="glass-card rounded-2xl border border-slate-900/60 flex flex-col items-center justify-center text-slate-550 h-full min-h-[350px]">
                <Shield size={36} className="text-slate-800 mb-2" />
                <p className="text-sm">Select an inquiry from the list to view details.</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
