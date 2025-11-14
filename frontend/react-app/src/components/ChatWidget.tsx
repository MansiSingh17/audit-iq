import React, { useState, useEffect, useRef } from 'react';
import { MessageCircle, X, Send, Sparkles, Bot, User } from 'lucide-react';
import { chatService, ChatMessage, SuggestedQuestion } from '../services/chatService';

interface ChatWidgetProps {
  context?: string;
  standard?: string;
}

const ChatWidget: React.FC<ChatWidgetProps> = ({ context, standard }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [sending, setSending] = useState(false);
  const [conversationId, setConversationId] = useState<number | null>(null);
  const [suggestions, setSuggestions] = useState<SuggestedQuestion[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      loadSuggestions();
    }
  }, [isOpen, context, standard]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const loadSuggestions = async () => {
    try {
      const sug = await chatService.getSuggestions(context, standard);
      setSuggestions(sug);
    } catch (error) {
      console.error('Error loading suggestions:', error);
    }
  };

  const handleSend = async () => {
    if (!inputValue.trim() || sending) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'USER',
      content: inputValue,
      timestamp: new Date().toISOString(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setSending(true);

    try {
      const response = await chatService.sendMessage(
        inputValue, 
        conversationId,
        context, 
        standard
      );
      
      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'ASSISTANT',
        content: response.message,
        timestamp: new Date().toISOString(),
      };

      setMessages(prev => [...prev, assistantMessage]);
      setConversationId(response.conversationId);

    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'ASSISTANT',
        content: 'Sorry, I encountered an error. Please try again.',
        timestamp: new Date().toISOString(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setSending(false);
    }
  };

  const handleSuggestionClick = (question: string) => {
    setInputValue(question);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <>
      {/* Professional Floating Chat Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 w-16 h-16 bg-gold-gradient hover:shadow-gold-lg text-white rounded-2xl shadow-gold flex items-center justify-center transition-all hover:scale-110 z-50 group"
        >
          <MessageCircle className="w-7 h-7 group-hover:scale-110 transition-transform" strokeWidth={2.5} />
          <div className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-white shadow-sm">
            <span className="absolute inset-0 bg-emerald-500 rounded-full animate-ping"></span>
          </div>
        </button>
      )}

      {/* Professional Chat Window */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 w-full sm:w-96 max-w-[calc(100vw-3rem)] h-[600px] bg-white rounded-2xl shadow-premium flex flex-col z-50 border-2 border-slate-200">
          
          {/* Professional Header */}
          <div className="bg-corporate-gradient text-white p-4 rounded-t-2xl flex items-center justify-between shadow-corporate">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-sm flex items-center justify-center border border-white/20">
                  <Sparkles className="w-5 h-5 text-amber-400" strokeWidth={2.5} />
                </div>
                <div className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-emerald-400 rounded-full border-2 border-slate-900">
                  <span className="absolute inset-0 bg-emerald-400 rounded-full animate-ping"></span>
                </div>
              </div>
              <div>
                <h3 className="font-bold text-base" style={{ fontFamily: 'Poppins, sans-serif' }}>Audit-IQ Assistant</h3>
                <p className="text-xs text-slate-200 font-medium">Compliance Q&A</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white hover:bg-white/10 rounded-lg p-1.5 transition-all hover:scale-110"
            >
              <X className="w-5 h-5" strokeWidth={2.5} />
            </button>
          </div>

          {/* Professional Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50">
            {messages.length === 0 && (
              <div className="text-center text-slate-500 mt-8">
                <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center shadow-gold">
                  <Sparkles className="w-6 h-6 text-white" strokeWidth={2.5} />
                </div>
                <p className="text-sm font-semibold text-slate-700">Ask me anything about compliance!</p>
              </div>
            )}

            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.role === 'USER' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`flex items-start gap-2 max-w-[85%] ${msg.role === 'USER' ? 'flex-row-reverse' : 'flex-row'}`}>
                  <div className="flex-shrink-0">
                    {msg.role === 'USER' ? (
                      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-900 to-indigo-900 flex items-center justify-center shadow-sm">
                        <User className="w-4 h-4 text-amber-400" strokeWidth={2.5} />
                      </div>
                    ) : (
                      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center shadow-gold">
                        <Bot className="w-4 h-4 text-white" strokeWidth={2.5} />
                      </div>
                    )}
                  </div>

                  <div className={`flex flex-col gap-1 ${msg.role === 'USER' ? 'items-end' : 'items-start'}`}>
                    <div className={`px-4 py-3 rounded-xl shadow-sm border ${
                      msg.role === 'USER'
                        ? 'bg-gradient-to-br from-slate-900 to-blue-900 text-white border-slate-800'
                        : 'bg-white text-slate-900 border-slate-200'
                    }`}>
                      <p className="text-sm whitespace-pre-wrap leading-relaxed" style={{ fontFamily: 'Inter, sans-serif' }}>{msg.content}</p>
                    </div>
                    <p className="text-xs px-2 text-slate-500">
                      {new Date(msg.timestamp).toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              </div>
            ))}

            {sending && (
              <div className="flex justify-start">
                <div className="flex items-start gap-2">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center shadow-gold">
                    <Bot className="w-4 h-4 text-white" strokeWidth={2.5} />
                  </div>
                  <div className="bg-white border border-slate-200 rounded-xl px-4 py-3 shadow-sm">
                    <div className="flex items-center gap-2">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-amber-600 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-blue-900 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-amber-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                      <span className="text-xs text-slate-500">AI is thinking...</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Suggested Questions */}
          {suggestions.length > 0 && messages.length === 0 && (
            <div className="px-4 py-3 border-t-2 border-slate-200 bg-white">
              <p className="text-xs font-bold text-slate-700 mb-2 uppercase tracking-wider">Suggested questions:</p>
              <div className="space-y-1.5">
                {suggestions.slice(0, 3).map((sug, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSuggestionClick(sug.question)}
                    className="w-full text-left text-xs p-2.5 bg-slate-50 hover:bg-blue-50 rounded-lg border border-slate-200 hover:border-blue-900 transition-all"
                  >
                    <span className="mr-1.5 text-base">{sug.icon}</span>
                    {sug.question}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Professional Input */}
          <div className="p-4 border-t-2 border-slate-200 bg-white rounded-b-2xl">
            <div className="flex gap-2">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask about compliance..."
                className="flex-1 px-3 py-2.5 border-2 border-slate-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-900/20 focus:border-blue-900 text-sm transition-all bg-white"
                disabled={sending}
              />
              <button
                onClick={handleSend}
                disabled={!inputValue.trim() || sending}
                className={`rounded-xl px-4 py-2.5 transition-all shadow-sm ${
                  !inputValue.trim() || sending
                    ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                    : 'bg-corporate-gradient hover:shadow-corporate text-white hover:scale-105'
                }`}
              >
                {sending ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <Send className="w-4 h-4" strokeWidth={2.5} />
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ChatWidget;