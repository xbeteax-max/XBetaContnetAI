
import React, { useState, useRef, useEffect } from 'react';
import { startChatSession } from '../services/gemini';
import { Send, User, Bot, Loader2, Sparkles, AlertCircle } from 'lucide-react';

interface Message {
  role: 'user' | 'model';
  text: string;
}

const AIChatBot: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'model', text: "Hello! I'm your Omniscore Social Strategist. How can I help you grow your audience or optimize your content today?" }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [chat, setChat] = useState<any>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setChat(startChatSession());
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const handleSend = async () => {
    if (!input.trim() || isLoading || !chat) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMessage }]);
    setIsLoading(true);

    try {
      const response = await chat.sendMessage({ message: userMessage });
      setMessages(prev => [...prev, { role: 'model', text: response.text || "I couldn't process that. Could you try again?" }]);
    } catch (error) {
      console.error("Chat Error:", error);
      setMessages(prev => [...prev, { role: 'model', text: "Oops, I encountered an error connecting to my neural network. Please check your API key and try again." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto h-[calc(100vh-12rem)] flex flex-col animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-indigo-600/10 rounded-2xl">
          <Sparkles className="text-indigo-400" size={24} />
        </div>
        <div>
          <h2 className="text-2xl font-display font-bold text-white uppercase tracking-tight">AI Strategy Session</h2>
          <p className="text-xs text-slate-500 font-medium">Powered by Gemini 3 Pro</p>
        </div>
      </div>

      <div className="flex-1 bg-slate-900/50 border border-slate-800 rounded-3xl overflow-hidden flex flex-col shadow-2xl">
        <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
          {messages.map((msg, i) => (
            <div key={i} className={`flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
              <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 border ${
                msg.role === 'user' ? 'bg-slate-800 border-slate-700' : 'bg-indigo-600 border-indigo-400/50 shadow-lg shadow-indigo-600/20'
              }`}>
                {msg.role === 'user' ? <User size={20} /> : <Bot size={20} className="text-white" />}
              </div>
              <div className={`max-w-[80%] p-4 rounded-3xl text-sm leading-relaxed ${
                msg.role === 'user' 
                  ? 'bg-indigo-600 text-white rounded-tr-none' 
                  : 'bg-slate-800 text-slate-200 rounded-tl-none border border-slate-700/50'
              }`}>
                {msg.text}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 border bg-indigo-600 border-indigo-400/50 shadow-lg shadow-indigo-600/20">
                <Bot size={20} className="text-white" />
              </div>
              <div className="bg-slate-800 border border-slate-700/50 p-4 rounded-3xl rounded-tl-none">
                <Loader2 className="animate-spin text-indigo-400" size={20} />
              </div>
            </div>
          )}
        </div>

        <div className="p-4 bg-slate-900 border-t border-slate-800">
          <div className="relative flex items-center">
            <input 
              type="text" 
              placeholder="Ask about trends, platform strategies, or content ideas..." 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              className="w-full bg-slate-800/50 border border-slate-700 rounded-2xl py-4 pl-6 pr-14 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
            />
            <button 
              onClick={handleSend}
              disabled={isLoading || !input.trim()}
              className="absolute right-2 p-3 bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-700 text-white rounded-xl transition-all shadow-lg shadow-indigo-600/20"
            >
              {isLoading ? <Loader2 className="animate-spin" size={20} /> : <Send size={20} />}
            </button>
          </div>
          <div className="mt-3 flex items-center justify-center gap-4 text-[10px] font-bold text-slate-600 uppercase tracking-widest">
            <span className="flex items-center gap-1"><AlertCircle size={10} /> Data from live trends</span>
            <span className="flex items-center gap-1"><Sparkles size={10} className="text-indigo-400" /> Pro Model Active</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIChatBot;
