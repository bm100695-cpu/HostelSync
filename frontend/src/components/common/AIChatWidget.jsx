import React, { useState, useRef, useEffect } from 'react';
import { Sparkles, X, Send, Bot, User, CornerDownLeft, Loader2, HelpCircle } from 'lucide-react';
import { api } from '../../services/api';

export const AIChatWidget = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState([
    {
      id: 'welcome',
      sender: 'bot',
      text: '👋 Hello! I am **SyncBot AI**, your 24/7 intelligent Hostel Concierge powered by Gemini. Ask me about curfew timings, mess menu, gate passes, maintenance turnaround, or emergency contacts!',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const quickPrompts = [
    'What is the night gate curfew?',
    'What is on today’s mess dinner menu?',
    'How do I report a broken fan/water leak?',
    'Who is the chief warden in emergency?'
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleSend = async (textToSend) => {
    const query = textToSend || input;
    if (!query.trim() || loading) return;

    const userMsg = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: query,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const res = await api.askAI(query);
      const botMsg = {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        text: res.reply || 'Here is what I found regarding your hostel inquiry.',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages((prev) => [...prev, botMsg]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          id: `bot-err-${Date.now()}`,
          sender: 'bot',
          text: '⚠️ I had a temporary issue reaching the server, but as a reminder: Main Gate Curfew is 09:30 PM and Emergency Warden is at +91 94231 55667.',
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-6 right-6 w-[380px] sm:w-[420px] h-[580px] bg-white rounded-3xl shadow-2xl border border-slate-200 flex flex-col z-50 overflow-hidden animate-in fade-in slide-in-from-bottom-5 duration-200">
      {/* Header */}
      <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-brand-600 to-emerald-500 flex items-center justify-center text-white shadow-md shadow-brand-500/20">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-slate-900">SyncBot AI</h3>
              <span className="px-1.5 py-0.5 text-[9px] font-bold bg-brand-50 text-brand-700 rounded-md border border-brand-200">
                GEMINI 1.5
              </span>
            </div>
            <p className="text-[10px] text-slate-500">Hostel Virtual Concierge & Rules Assistant</p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Messages Feed */}
      <div className="flex-1 p-4 overflow-y-auto space-y-3 text-xs bg-white">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex items-start gap-2.5 ${msg.sender === 'user' ? 'flex-row-reverse' : ''}`}
          >
            <div
              className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 ${
                msg.sender === 'user'
                  ? 'bg-brand-600 text-white'
                  : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
              }`}
            >
              {msg.sender === 'user' ? <User className="w-3.5 h-3.5" /> : <Bot className="w-3.5 h-3.5" />}
            </div>

            <div
              className={`max-w-[80%] rounded-2xl p-3 shadow-sm ${
                msg.sender === 'user'
                  ? 'bg-gradient-to-r from-brand-600 to-emerald-600 text-white rounded-tr-none'
                  : 'bg-slate-100 text-slate-800 border border-slate-200/80 rounded-tl-none leading-relaxed'
              }`}
            >
              <div className="whitespace-pre-line text-[11.5px] leading-relaxed">
                {msg.text}
              </div>
              <div
                className={`text-[9px] mt-1.5 ${
                  msg.sender === 'user' ? 'text-emerald-100 text-right' : 'text-slate-400'
                }`}
              >
                {msg.time}
              </div>
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex items-center gap-2 text-slate-500 text-xs p-2">
            <Loader2 className="w-4 h-4 animate-spin text-brand-600" />
            <span>SyncBot is thinking...</span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Query Chips */}
      <div className="px-3 py-2 bg-slate-50/80 border-t border-slate-100 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
        {quickPrompts.map((prompt, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(prompt)}
            className="shrink-0 px-2.5 py-1 rounded-full bg-white hover:bg-brand-50 text-slate-600 hover:text-brand-700 border border-slate-200 hover:border-brand-200 text-[10.5px] font-medium transition shadow-2xs"
          >
            {prompt}
          </button>
        ))}
      </div>

      {/* Input Box */}
      <div className="p-3 bg-white border-t border-slate-200 flex items-center gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Ask SyncBot about rules, food, passes..."
          className="flex-1 bg-slate-50 text-slate-900 text-xs rounded-xl px-3.5 py-2.5 border border-slate-200 focus:bg-white focus:outline-none focus:border-brand-500 transition placeholder:text-slate-400"
        />
        <button
          onClick={() => handleSend()}
          disabled={!input.trim() || loading}
          className="p-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 disabled:opacity-50 text-white transition flex items-center justify-center shadow-md shadow-brand-600/30"
        >
          <Send className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
