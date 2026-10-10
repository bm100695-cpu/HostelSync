import React, { useState, useRef, useEffect } from 'react';
import { Sparkles, X, Send, Bot, User, Loader2 } from 'lucide-react';
import { askSyncBot } from '../../services/gemini'; // Asli Gemini API import

export const AIChatWidget = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState([
    {
      id: 'welcome',
      sender: 'bot',
      text: 'Hello! I am SyncBot. Ask me about curfew timings, mess menu, gate passes, or emergency contacts.',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const quickPrompts = [
    'Night gate curfew?',
    'Today’s dinner menu?',
    'Report broken fan',
    'Emergency contact'
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
      // Yahan Gemini API ko call ja rahi hai context ke sath
      const prompt = `You are SyncBot, a helpful AI assistant for the HostelSync app. Answer concisely and politely. User asks: ${query}`;
      const reply = await askSyncBot(prompt);
      
      const botMsg = {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        text: reply || 'Here is what I found regarding your inquiry.',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages((prev) => [...prev, botMsg]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          id: `bot-err-${Date.now()}`,
          sender: 'bot',
          text: 'Sorry, I am having trouble connecting to the server right now. Please try again later.',
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-6 right-6 w-80 sm:w-96 h-[500px] bg-white rounded border border-gray-300 shadow-lg flex flex-col z-50">
      
      {/* Header */}
      <div className="p-3 bg-gray-100 border-b border-gray-300 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-600 flex items-center justify-center text-white rounded">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-gray-900">SyncBot AI</h3>
              <span className="px-1.5 py-0.5 text-[10px] font-bold bg-gray-200 text-gray-700 rounded border border-gray-300">
                AI
              </span>
            </div>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-gray-200 rounded"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Messages Feed */}
      <div className="flex-1 p-4 overflow-y-auto space-y-3 text-sm bg-white">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex items-start gap-2 ${msg.sender === 'user' ? 'flex-row-reverse' : ''}`}
          >
            <div
              className={`w-6 h-6 rounded flex items-center justify-center shrink-0 ${
                msg.sender === 'user'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700'
              }`}
            >
              {msg.sender === 'user' ? <User className="w-3 h-3" /> : <Bot className="w-3 h-3" />}
            </div>

            <div
              className={`max-w-[75%] rounded p-2.5 ${
                msg.sender === 'user'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-800 border border-gray-200'
              }`}
            >
              <div className="whitespace-pre-line text-xs">
                {msg.text}
              </div>
              <div
                className={`text-[9px] mt-1 ${
                  msg.sender === 'user' ? 'text-blue-200 text-right' : 'text-gray-500'
                }`}
              >
                {msg.time}
              </div>
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex items-center gap-2 text-gray-500 text-xs p-2">
            <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
            <span>SyncBot is typing...</span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Query Chips */}
      <div className="px-3 py-2 bg-gray-50 border-t border-gray-200 flex flex-wrap gap-1.5">
        {quickPrompts.map((prompt, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(prompt)}
            className="px-2 py-1 bg-white hover:bg-gray-100 text-gray-700 border border-gray-300 text-xs rounded transition"
          >
            {prompt}
          </button>
        ))}
      </div>

      {/* Input Box */}
      <div className="p-3 bg-white border-t border-gray-300 flex items-center gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Type your question..."
          className="flex-1 bg-gray-50 text-gray-900 text-sm rounded px-3 py-2 border border-gray-300 focus:bg-white focus:outline-none focus:border-blue-500 transition"
        />
        <button
          onClick={() => handleSend()}
          disabled={!input.trim() || loading}
          className="p-2 rounded bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white transition flex items-center justify-center"
        >
          <Send className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};