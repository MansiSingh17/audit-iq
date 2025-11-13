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
      {/* Enhanced Floating Chat Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="group fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-br from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-full shadow-lg flex items-center justify-center transition-all hover:scale-110 z-50 hover:shadow-xl hover:shadow-blue-500/50"
        >
          <MessageCircle className="w-6 h-6 group-hover:scale-110 transition-transform" />
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white animate-pulse"></div>
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-full blur-lg opacity-50 group-hover:opacity-75 transition-opacity"></div>
        </button>
      )}

      {/* Enhanced Chat Window */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 w-full sm:w-96 max-w-[calc(100vw-3rem)] h-[500px] sm:h-[600px] bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl flex flex-col z-50 border-2 border-gray-200 animate-scale-in">
          {/* Enhanced Header */}
          <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-4 rounded-t-2xl flex items-center justify-between shadow-lg">
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAwIDEwIEwgNDAgMTAgTSAxMCAwIEwgMTAgNDAgTSAwIDIwIEwgNDAgMjAgTSAyMCAwIEwgMjAgNDAgTSAwIDMwIEwgNDAgMzAgTSAzMCAwIEwgMzAgNDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjEiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIgLz48L3N2Zz4=')] opacity-20"></div>
            <div className="relative flex items-center space-x-2">
              <div className="relative">
                <Sparkles className="w-5 h-5 animate-pulse" />
                <div className="absolute -top-1 -right-1 w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              </div>
              <div>
                <h3 className="font-semibold text-sm sm:text-base">Audit-IQ Assistant</h3>
                <p className="text-xs text-blue-100">Compliance Q&A</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="relative text-white hover:bg-white/20 rounded-lg p-1.5 transition-all hover:scale-110"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Enhanced Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-br from-gray-50 to-blue-50/30 scroll-smooth">
            {messages.length === 0 && (
              <div className="text-center text-gray-500 mt-8 animate-fade-in">
                <div className="relative inline-block mb-3">
                  <div className="absolute inset-0 bg-blue-400 blur-xl opacity-30 rounded-full"></div>
                  <Sparkles className="relative w-10 h-10 sm:w-12 sm:h-12 mx-auto text-blue-400" />
                </div>
                <p className="text-xs sm:text-sm font-medium">Ask me anything about compliance!</p>
              </div>
            )}

            {messages.map((msg, idx) => (
              <div
                key={msg.id}
                className={`flex ${msg.role === 'USER' ? 'justify-end' : 'justify-start'} animate-fadeIn`}
                style={{ animationDelay: `${idx * 0.05}s` }}
              >
                <div className={`flex items-start gap-2 max-w-[85%] ${msg.role === 'USER' ? 'flex-row-reverse' : 'flex-row'}`}>
                  {/* Avatar */}
                  <div className="flex-shrink-0">
                    {msg.role === 'USER' ? (
                      <div className="relative">
                        <div className="absolute inset-0 bg-blue-500 blur opacity-40 rounded-full"></div>
                        <div className="relative w-7 h-7 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-md">
                          <User className="w-4 h-4 text-white" />
                        </div>
                      </div>
                    ) : (
                      <div className="relative">
                        <div className="absolute inset-0 bg-purple-500 blur opacity-40 rounded-full"></div>
                        <div className="relative w-7 h-7 rounded-full bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center shadow-md">
                          <Bot className="w-4 h-4 text-white" />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Message Bubble */}
                  <div className={`flex flex-col gap-1 ${msg.role === 'USER' ? 'items-end' : 'items-start'}`}>
                    <div
                      className={`px-3 sm:px-4 py-2 sm:py-3 rounded-xl shadow-md transition-all hover:shadow-lg ${
                        msg.role === 'USER'
                          ? 'bg-gradient-to-br from-blue-600 to-indigo-600 text-white rounded-tr-sm'
                          : 'bg-white text-gray-900 border border-gray-200 rounded-tl-sm hover:border-blue-300'
                      }`}
                    >
                      <p className="text-xs sm:text-sm whitespace-pre-wrap leading-relaxed">{msg.content}</p>
                    </div>
                    <p className={`text-xs px-2 ${
                      msg.role === 'USER' ? 'text-blue-600' : 'text-gray-500'
                    }`}>
                      {new Date(msg.timestamp).toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              </div>
            ))}

            {sending && (
              <div className="flex justify-start animate-fadeIn">
                <div className="flex items-start gap-2">
                  <div className="relative">
                    <div className="absolute inset-0 bg-purple-500 blur opacity-40 rounded-full"></div>
                    <div className="relative w-7 h-7 rounded-full bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center shadow-md">
                      <Bot className="w-4 h-4 text-white" />
                    </div>
                  </div>
                  <div className="bg-white border border-gray-200 rounded-xl rounded-tl-sm px-4 py-3 shadow-md">
                    <div className="flex items-center gap-2">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce-slow"></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce-slow" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce-slow" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                      <span className="text-xs text-gray-500">AI is thinking...</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Suggested Questions */}
          {suggestions.length > 0 && messages.length === 0 && (
            <div className="px-4 py-3 border-t-2 border-gray-200 bg-white">
              <p className="text-xs font-semibold text-gray-600 mb-2">Suggested questions:</p>
              <div className="space-y-1.5">
                {suggestions.slice(0, 3).map((sug, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSuggestionClick(sug.question)}
                    className="w-full text-left text-xs p-2.5 bg-gradient-to-r from-gray-50 to-blue-50/50 hover:from-blue-50 hover:to-indigo-50 rounded-lg border border-gray-200 hover:border-blue-400 transition-all hover:shadow-md"
                  >
                    <span className="mr-1.5 text-base">{sug.icon}</span>
                    {sug.question}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Enhanced Input */}
          <div className="p-4 border-t-2 border-gray-200 bg-gradient-to-r from-gray-50 to-blue-50/30 rounded-b-2xl">
            <div className="flex space-x-2">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask about compliance..."
                className="flex-1 px-3 py-2.5 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 text-sm transition-all bg-white shadow-sm"
                disabled={sending}
              />
              <button
                onClick={handleSend}
                disabled={!inputValue.trim() || sending}
                className={`rounded-xl px-4 py-2.5 transition-all shadow-md ${
                  !inputValue.trim() || sending
                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white hover:shadow-lg hover:scale-105'
                }`}
              >
                {sending ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <Send className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes scale-in {
          from {
            opacity: 0;
            transform: scale(0.9) translateY(20px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-6px); }
        }
        .animate-fadeIn { animation: fadeIn 0.3s ease-out forwards; }
        .animate-scale-in { animation: scale-in 0.3s ease-out forwards; }
        .animate-bounce-slow { animation: bounce-slow 1s ease-in-out infinite; }
        .scroll-smooth::-webkit-scrollbar { width: 4px; }
        .scroll-smooth::-webkit-scrollbar-track { background: transparent; }
        .scroll-smooth::-webkit-scrollbar-thumb { background: linear-gradient(to bottom, #60a5fa, #818cf8); border-radius: 10px; }
      `}</style>
    </>
  );
};

export default ChatWidget;