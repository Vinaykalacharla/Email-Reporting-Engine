'use client';

import React, { useState } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { AIStrategy } from '@/types/reporting';
import { MessageSquare, X, Send, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface AnalyticsBotProps {
  strategies: AIStrategy[];
}

interface ChatMessage {
  id: string;
  sender: 'ai' | 'user';
  text: string;
}

export default function AnalyticsBot({ strategies }: AnalyticsBotProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: '1', sender: 'ai', text: 'Hello! I am your LLM-powered Analytics Assistant. How can I help you optimize your campaign?' }
  ]);
  const [inputBox, setInputBox] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputBox.trim()) return;

    const userMsg: ChatMessage = { id: Date.now().toString(), sender: 'user', text: inputBox };
    setMessages(prev => [...prev, userMsg]);
    setInputBox('');
    setIsTyping(true);

    // Simulate LLM Processing
    setTimeout(() => {
      let aiResponse = "I have analyzed the data. Let me know if you want to apply the suggested optimization strategies.";
      if (userMsg.text.toLowerCase().includes('bounce')) {
        aiResponse = "I see a spike in soft bounces. We recommend staggering send times. Check the AI strategies panel for more.";
      }
      
      setMessages(prev => [...prev, { id: (Date.now() + 1).toString(), sender: 'ai', text: aiResponse }]);
      setIsTyping(false);
    }, 1200);
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={setIsOpen}>
      <Dialog.Trigger asChild>
        <button 
          className="fixed bottom-6 right-6 p-4 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg transition-transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 z-50 flex items-center gap-2"
          aria-label="Open Analytics Assistant Bot"
        >
          <Sparkles className="w-5 h-5" />
          <span className="font-medium hidden md:inline">Analytics Assistant</span>
        </button>
      </Dialog.Trigger>

      <AnimatePresence>
        {isOpen && (
          <Dialog.Portal forceMount>
            <Dialog.Overlay asChild>
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-slate-900/30 z-50 backdrop-blur-sm" 
              />
            </Dialog.Overlay>
            <Dialog.Content asChild>
              <motion.div 
                initial={{ x: '100%', opacity: 0.5 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: '100%', opacity: 0.5 }}
                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                className="fixed bottom-0 right-0 top-0 w-full sm:w-[400px] bg-white dark:bg-slate-900 shadow-2xl z-50 flex flex-col focus:outline-none border-l border-slate-200 dark:border-slate-800"
              >
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-800 bg-blue-50/50 dark:bg-blue-900/10">
                  <Dialog.Title className="text-lg font-semibold flex items-center gap-2 text-slate-900 dark:text-slate-100">
                    <MessageSquare className="w-5 h-5 text-blue-600" />
                    Intelligent Assistant
                  </Dialog.Title>
                  <Dialog.Close asChild>
                    <button className="p-2 rounded-md hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-500 aria-label='Close Dialog'">
                      <X className="w-5 h-5" />
                      <span className="sr-only">Close assistant</span>
                    </button>
                  </Dialog.Close>
                </div>
                <Dialog.Description className="sr-only">
                  Chat interface to interact with the LLM Analytics Assistant.
                </Dialog.Description>

                {/* Top Strategies Panel */}
                <div className="p-4 bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800 overflow-y-auto max-h-48 shrink-0">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">AI Strategy Recommendations</h4>
                  <ul className="space-y-3">
                    {strategies.map(s => (
                      <li key={s.id} className="bg-white dark:bg-slate-800 border border-orange-200 dark:border-orange-900/50 p-3 rounded-lg flex gap-3 shadow-sm">
                        <Sparkles className="w-4 h-4 text-orange-500 mt-0.5 shrink-0" />
                        <div>
                          <strong className="block text-sm text-slate-900 dark:text-slate-100">{s.title}</strong>
                          <span className="text-xs text-slate-600 dark:text-slate-400 mt-1 block">{s.description}</span>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Chat Log */}
                <div 
                  className="flex-grow overflow-y-auto p-4 space-y-4"
                  role="log"
                  aria-live="polite"
                  aria-atomic="false"
                >
                  {messages.map((m) => (
                    <div key={m.id} className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`p-3 rounded-2xl max-w-[85%] text-sm ${m.sender === 'user' ? 'bg-blue-600 text-white rounded-tr-none' : 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-tl-none'}`}>
                        {m.text}
                      </div>
                    </div>
                  ))}
                  {isTyping && (
                    <div className="flex justify-start">
                      <div className="p-4 bg-slate-100 dark:bg-slate-800 rounded-2xl rounded-tl-none flex gap-1">
                        <span className="w-2 h-2 rounded-full bg-slate-400 animate-bounce" />
                        <span className="w-2 h-2 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: '0.2s' }} />
                        <span className="w-2 h-2 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: '0.4s' }} />
                        <span className="sr-only">AI is typing</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Input Area */}
                <form onSubmit={handleSend} className="p-4 border-t border-slate-200 dark:border-slate-800 flex gap-2 bg-white dark:bg-slate-900">
                  <input 
                    type="text"
                    value={inputBox}
                    onChange={(e) => setInputBox(e.target.value)}
                    placeholder="Ask standard analytics queries..."
                    className="flex-grow px-4 py-2 border rounded-full border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600 text-sm dark:text-white"
                    aria-label="Ask the bot"
                  />
                  <button 
                    type="submit" 
                    disabled={!inputBox.trim() || isTyping}
                    className="p-2 bg-blue-600 text-white rounded-full disabled:opacity-50 hover:bg-blue-700 transition-colors focus:ring-2 focus:ring-offset-2 focus:ring-blue-600"
                    aria-label="Send message"
                  >
                    <Send className="w-5 h-5" />
                  </button>
                </form>

              </motion.div>
            </Dialog.Content>
          </Dialog.Portal>
        )}
      </AnimatePresence>
    </Dialog.Root>
  );
}
