'use client';

import { useState, useEffect } from 'react';
import { getMessages, updateMessageStatus, deleteMessage } from '../../../../lib/firestore-service';
import { Mail, Trash2, MailOpen, Calendar, Check, AlertCircle } from 'lucide-react';

export default function MessagesManager() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    setLoading(true);
    try {
      const data = await getMessages();
      setMessages(data);
      if (data.length > 0 && !selectedMessage) {
        setSelectedMessage(data[0]);
        if (data[0].status === 'unread') {
          handleMarkRead(data[0].id);
        }
      }
    } catch (err) {
      console.error(err);
      setError('Failed to load messages.');
    } finally {
      setLoading(false);
    }
  }

  const handleSelectMessage = async (msg) => {
    setSelectedMessage(msg);
    if (msg.status === 'unread') {
      await handleMarkRead(msg.id);
    }
  };

  const handleMarkRead = async (id) => {
    try {
      await updateMessageStatus(id, 'read');
      // Update local state
      setMessages(prev =>
        prev.map(m => m.id === id ? { ...m, status: 'read' } : m)
      );
      if (selectedMessage && selectedMessage.id === id) {
        setSelectedMessage(prev => ({ ...prev, status: 'read' }));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleMarkUnread = async (id, e) => {
    e.stopPropagation();
    try {
      await updateMessageStatus(id, 'unread');
      setMessages(prev =>
        prev.map(m => m.id === id ? { ...m, status: 'unread' } : m)
      );
      if (selectedMessage && selectedMessage.id === id) {
        setSelectedMessage(prev => ({ ...prev, status: 'unread' }));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id, e) => {
    if (e) e.stopPropagation();
    if (!confirm('Are you sure you want to delete this message?')) return;

    try {
      await deleteMessage(id);
      setMessages(prev => prev.filter(m => m.id !== id));
      if (selectedMessage && selectedMessage.id === id) {
        setSelectedMessage(null);
      }
    } catch (err) {
      console.error(err);
      alert('Failed to delete message');
    }
  };

  return (
    <div className="space-y-10 animate-fade-in-up h-full flex flex-col">
      {/* Title */}
      <div className="pb-6 border-b border-slate-900">
        <h1 className="font-heading text-3xl font-extrabold text-white">Inquiries Inbox</h1>
        <p className="text-slate-400 text-sm mt-1">Review contact form submissions sent from your landing page.</p>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-indigo-500 border-r-2"></div>
          <p className="text-slate-500 text-sm">Loading inbox...</p>
        </div>
      ) : error ? (
        <div className="flex items-center gap-2 text-pink-400 bg-pink-950/20 border border-pink-900/30 p-4 rounded-xl text-xs">
          <AlertCircle size={16} />
          <span>{error}</span>
        </div>
      ) : messages.length === 0 ? (
        <div className="glass-card rounded-2xl p-12 text-center text-slate-500">
          <Mail size={48} className="mx-auto mb-4 text-slate-700" />
          <p className="text-lg">Your inbox is clean</p>
          <p className="text-xs text-slate-600 mt-1">Messages submitted from the contact form will show up here.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8 min-h-[500px]">
          {/* List panel */}
          <div className="md:col-span-2 glass-card rounded-2xl overflow-hidden flex flex-col h-[550px] border border-slate-900">
            <div className="p-4 border-b border-slate-900 bg-slate-950/50 flex justify-between items-center">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                All Messages ({messages.length})
              </span>
            </div>
            <div className="flex-1 overflow-y-auto divide-y divide-slate-900">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  onClick={() => handleSelectMessage(msg)}
                  className={`p-4 cursor-pointer transition-all hover:bg-slate-900/40 flex flex-col gap-1.5 ${
                    selectedMessage && selectedMessage.id === msg.id
                      ? 'bg-slate-900/70 border-l-4 border-indigo-500'
                      : ''
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <span className={`text-sm truncate max-w-[120px] ${
                      msg.status === 'unread' ? 'text-white font-bold' : 'text-slate-300'
                    }`}>
                      {msg.name}
                    </span>
                    <span className="text-[10px] text-slate-500 shrink-0">
                      {new Date(msg.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p className={`text-xs truncate ${
                    msg.status === 'unread' ? 'text-indigo-300 font-medium' : 'text-slate-400'
                  }`}>
                    {msg.subject || '(No Subject)'}
                  </p>
                  <div className="flex justify-between items-center mt-1">
                    <span className="text-[10px] text-slate-500 truncate max-w-[150px]">{msg.email}</span>
                    <div className="flex gap-2">
                      {msg.status === 'read' && (
                        <button
                          onClick={(e) => handleMarkUnread(msg.id, e)}
                          title="Mark unread"
                          className="text-slate-500 hover:text-indigo-400 p-0.5"
                        >
                          <MailOpen size={12} />
                        </button>
                      )}
                      <button
                        onClick={(e) => handleDelete(msg.id, e)}
                        title="Delete message"
                        className="text-slate-600 hover:text-pink-400 p-0.5"
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Details panel */}
          <div className="md:col-span-3 glass-card rounded-2xl p-8 flex flex-col justify-between h-[550px] border border-slate-900 overflow-y-auto">
            {selectedMessage ? (
              <div className="space-y-6 flex-1 flex flex-col justify-between">
                <div className="space-y-6">
                  {/* Header */}
                  <div className="pb-6 border-b border-slate-900 flex justify-between items-start gap-4">
                    <div>
                      <h2 className="text-xl font-bold text-white leading-tight">
                        {selectedMessage.subject || '(No Subject)'}
                      </h2>
                      <div className="text-xs text-slate-400 mt-2 space-y-1">
                        <p><span className="text-slate-500">From:</span> {selectedMessage.name} &lt;{selectedMessage.email}&gt;</p>
                        <p className="flex items-center gap-1">
                          <Calendar size={10} className="text-slate-500" />
                          <span className="text-slate-500">Date:</span> {new Date(selectedMessage.createdAt).toLocaleString()}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleDelete(selectedMessage.id)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-pink-900/30 bg-pink-950/20 hover:bg-pink-900/40 text-pink-400 hover:text-pink-300 text-xs font-semibold transition-all"
                    >
                      <Trash2 size={14} />
                      Delete
                    </button>
                  </div>

                  {/* Body */}
                  <div className="text-slate-300 text-sm leading-relaxed whitespace-pre-wrap font-light p-4 bg-slate-900/30 rounded-xl border border-slate-900">
                    {selectedMessage.message}
                  </div>
                </div>

                {/* Footer action */}
                <div className="pt-6 border-t border-slate-900 flex justify-end">
                  <a
                    href={`mailto:${selectedMessage.email}?subject=Re: ${selectedMessage.subject || 'Your inquiry'}`}
                    className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition-all"
                  >
                    <Mail size={14} />
                    Reply via Email
                  </a>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-slate-500">
                <MailOpen size={36} className="text-slate-700 mb-2" />
                <p className="text-sm">Select a message to read details</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
