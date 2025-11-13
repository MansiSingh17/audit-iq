import React, { useState, useEffect, useRef } from 'react';
import { Send, Sparkles, Bot, User, MessageSquare, Zap, Moon, Sun } from 'lucide-react';
import Button from './common/Button';
import { chatService, ChatMessage } from '../services/chatService';

const ChatPage: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [sending, setSending] = useState(false);
  const [conversationId, setConversationId] = useState<number | null>(null);
  const [selectedStandard, setSelectedStandard] = useState('ISO_27001');
  const [darkMode, setDarkMode] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const standards = ['ISO_27001', 'GDPR', 'HIPAA'];

  const quickQuestions = [
    { icon: '🔐', text: 'What are ISO 27001 A.8.24 requirements?', category: 'Encryption' },
    { icon: '👤', text: 'How do I implement GDPR Article 32?', category: 'Data Security' },
    { icon: '🏥', text: 'What is required for HIPAA encryption?', category: 'Healthcare' },
    { icon: '📝', text: 'Help me write an access control policy', category: 'Policy Writing' },
    { icon: '🚨', text: 'How do I handle data breaches?', category: 'Incident Response' },
    { icon: '✨', text: 'What are industry best practices for MFA?', category: 'Best Practices' },
  ];

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (messages.length === 0) {
      const welcomeMessage: ChatMessage = {
        id: 'welcome',
        role: 'ASSISTANT',
        content: `Hello! 👋 I'm your Audit-IQ compliance assistant.

I can help you with:

📋 **Compliance Requirements** - Detailed explanations of ISO 27001, GDPR, HIPAA controls
🔍 **Finding Analysis** - Understand and remediate audit findings
📝 **Policy Writing** - Create audit-ready policies and procedures  
✨ **Best Practices** - Industry benchmarks and recommendations
⚡ **Quick Guidance** - Remediation steps and implementation advice

What would you like help with today?`,
        timestamp: new Date().toISOString(),
      };
      setMessages([welcomeMessage]);
    }
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
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
      console.log('💬 Sending message:', inputValue);
      
      const response = await chatService.sendMessage(
        inputValue,
        conversationId,
        'chat-page',
        selectedStandard
      );

      console.log('✅ Received response:', response);

      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'ASSISTANT',
        content: response.message || 'No response received',
        timestamp: response.timestamp || new Date().toISOString(),
      };

      setMessages(prev => [...prev, assistantMessage]);
      
      if (response.conversationId) {
        setConversationId(response.conversationId);
      }

    } catch (error: any) {
      console.error('❌ Error sending message:', error);
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'ASSISTANT',
        content: `I apologize, but I encountered an error: ${error.message || 'Please try again.'}`,
        timestamp: new Date().toISOString(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setSending(false);
    }
  };

  const handleQuickQuestion = (question: string) => {
    setInputValue(question);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50'} relative overflow-hidden transition-colors duration-500`}>
      {/* Dark Mode Toggle */}
      <button
        onClick={() => setDarkMode(!darkMode)}
        className="fixed top-20 right-6 z-50 p-3 rounded-full bg-white/90 shadow-lg hover:scale-110 transition-all backdrop-blur-xl border-2 border-gray-200"
      >
        {darkMode ? <Sun className="w-6 h-6 text-yellow-500" /> : <Moon className="w-6 h-6 text-indigo-600" />}
      </button>

      {/* Enhanced Multi-Layer Animated Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0iIzkzYzVmZCIgc3Ryb2tlLW9wYWNpdHk9IjAuMSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIiAvPjwvc3ZnPg==')] opacity-40"></div>
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-to-br from-blue-400/20 via-indigo-400/15 to-transparent rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-gradient-to-br from-indigo-400/20 via-purple-400/15 to-transparent rounded-full blur-3xl animate-float-delayed"></div>
        <div className="absolute top-1/2 left-1/2 w-[400px] h-[400px] -translate-x-1/2 -translate-y-1/2 bg-gradient-to-br from-purple-400/10 via-pink-400/10 to-transparent rounded-full blur-3xl animate-pulse"></div>
        
        {/* More Floating Particles */}
        {[...Array(30)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-blue-500/30 rounded-full animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${10 + Math.random() * 10}s`
            }}
          />
        ))}
      </div>

      <div className="relative z-10 max-w-7xl mx-auto p-4 sm:p-6">
        {/* Enhanced Header */}
        <div className="mb-6 sm:mb-8 animate-fade-in">
          <div className="flex items-center gap-3 sm:gap-4 mb-3">
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-indigo-600 blur-xl opacity-50 rounded-2xl group-hover:opacity-75 transition-opacity"></div>
              <div className="relative w-12 h-12 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 flex items-center justify-center shadow-2xl group-hover:shadow-blue-500/50 transition-all duration-300 group-hover:scale-105">
                <Sparkles className="w-6 h-6 sm:w-8 sm:h-8 text-white animate-pulse" />
              </div>
              <div className="absolute -top-1 -right-1 w-3 h-3 sm:w-4 sm:h-4 bg-green-500 border-2 border-white rounded-full animate-pulse"></div>
            </div>
            <div>
              <h1 className={`text-3xl sm:text-4xl font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent animate-gradient`}>
                AI Compliance Assistant
              </h1>
              <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'} flex items-center gap-2 mt-1 text-sm sm:text-base`}>
                <MessageSquare className="w-4 h-4 text-blue-500" />
                Ask questions about compliance requirements, get policy writing help, and receive expert guidance
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
          {/* Enhanced Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-6 space-y-4 sm:space-y-6">
              {/* Enhanced Standard Selector */}
              <div className="group animate-fade-in-up">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-indigo-500/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className={`relative ${darkMode ? 'bg-gray-800/95' : 'bg-white/95'} backdrop-blur-xl rounded-2xl shadow-xl border ${darkMode ? 'border-gray-700' : 'border-gray-200/50'} p-4 sm:p-6 transition-all duration-300 hover:shadow-2xl hover:border-blue-300/50`}>
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-indigo-600 flex items-center justify-center shadow-lg">
                      <Zap className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                    </div>
                    <h3 className={`font-bold ${darkMode ? 'text-white' : 'text-gray-900'} text-sm sm:text-base`}>Compliance Context</h3>
                  </div>
                  <label className={`text-xs font-semibold ${darkMode ? 'text-gray-400' : 'text-gray-600'} mb-2 block uppercase tracking-wide`}>
                    Select Framework:
                  </label>
                  <select
                    value={selectedStandard}
                    onChange={(e) => setSelectedStandard(e.target.value)}
                    className={`w-full px-3 sm:px-4 py-2 sm:py-3 border-2 ${darkMode ? 'border-gray-700 bg-gray-900 text-white' : 'border-gray-200 bg-white'} rounded-xl text-sm font-medium focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all hover:border-gray-300 cursor-pointer`}
                  >
                    {standards.map(std => (
                      <option key={std} value={std}>{std.replace('_', ' ')}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Enhanced Quick Questions */}
              <div className="group animate-fade-in-up" style={{ animationDelay: '100ms' }}>
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className={`relative ${darkMode ? 'bg-gray-800/95' : 'bg-white/95'} backdrop-blur-xl rounded-2xl shadow-xl border ${darkMode ? 'border-gray-700' : 'border-gray-200/50'} p-4 sm:p-6 transition-all duration-300 hover:shadow-2xl hover:border-indigo-300/50`}>
                  <h3 className={`font-bold ${darkMode ? 'text-white' : 'text-gray-900'} mb-4 flex items-center gap-2 text-sm sm:text-base`}>
                    <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg">
                      <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                    </div>
                    Quick Questions
                  </h3>
                  
                  <div className="space-y-2">
                    {quickQuestions.map((q, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleQuickQuestion(q.text)}
                        className={`w-full text-left p-3 sm:p-3.5 ${darkMode ? 'bg-gray-700/50 hover:bg-gray-600/50 border-gray-600 hover:border-blue-500' : 'bg-gradient-to-r from-gray-50 to-blue-50/80 hover:from-blue-50 hover:to-indigo-50 border-gray-200 hover:border-blue-400'} border-2 rounded-xl transition-all duration-200 group/btn hover:shadow-lg hover:-translate-y-0.5`}
                      >
                        <div className="flex items-start space-x-2 sm:space-x-3">
                          <span className="text-xl sm:text-2xl group-hover/btn:scale-125 transition-transform duration-300">{q.icon}</span>
                          <div className="flex-1 min-w-0">
                            <p className={`text-xs font-semibold ${darkMode ? 'text-white group-hover/btn:text-blue-400' : 'text-gray-900 group-hover/btn:text-blue-700'} transition-colors leading-relaxed mb-1.5`}>
                              {q.text}
                            </p>
                            <span className={`inline-block px-2 sm:px-2.5 py-1 ${darkMode ? 'bg-gray-600 border-gray-500 group-hover/btn:border-blue-400 group-hover/btn:bg-blue-900/30 text-gray-300 group-hover/btn:text-blue-300' : 'bg-white/90 border-gray-200 group-hover/btn:border-blue-300 group-hover/btn:bg-blue-50 text-gray-600 group-hover/btn:text-blue-700'} border rounded-full text-xs font-medium transition-all`}>
                              {q.category}
                            </span>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>

                  {/* Features */}
                  <div className="mt-6 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-400/20 to-indigo-400/20 rounded-xl blur"></div>
                    <div className={`relative p-3 sm:p-4 ${darkMode ? 'bg-blue-900/30 border-blue-700' : 'bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200'} border-2 rounded-xl`}>
                      <p className={`text-xs font-bold ${darkMode ? 'text-blue-300' : 'text-blue-900'} mb-3 flex items-center gap-2`}>
                        <Sparkles className="w-4 h-4 animate-pulse" />
                        I can help with:
                      </p>
                      <ul className={`text-xs ${darkMode ? 'text-blue-200' : 'text-blue-800'} space-y-2.5`}>
                        {['Compliance requirements', 'Policy writing', 'Remediation guidance', 'Best practices', 'Control explanations'].map((item, idx) => (
                          <li key={idx} className="flex items-center gap-2 group/item">
                            <span className="w-1.5 h-1.5 bg-blue-600 rounded-full group-hover/item:scale-150 transition-transform"></span>
                            <span className="group-hover/item:translate-x-1 transition-transform">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Enhanced Chat Area */}
          <div className="lg:col-span-2 animate-fade-in-up" style={{ animationDelay: '200ms' }}>
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className={`relative ${darkMode ? 'bg-gray-800/95' : 'bg-white/95'} backdrop-blur-xl rounded-2xl shadow-2xl border ${darkMode ? 'border-gray-700' : 'border-gray-200/50'} h-[calc(100vh-12rem)] flex flex-col overflow-hidden hover:shadow-blue-500/20 transition-all duration-300`}>
                
                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 sm:space-y-6 scroll-smooth">
                  {messages.map((msg, idx) => (
                    <div
                      key={msg.id}
                      className={`flex items-start gap-3 sm:gap-4 ${msg.role === 'USER' ? 'flex-row-reverse' : 'flex-row'} animate-fadeIn`}
                      style={{ animationDelay: `${idx * 0.05}s` }}
                    >
                      <div className="flex-shrink-0">
                        {msg.role === 'USER' ? (
                          <div className="relative group/avatar">
                            <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-blue-600 blur opacity-40 rounded-full group-hover/avatar:opacity-60 transition-opacity"></div>
                            <div className="relative w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg group-hover/avatar:scale-110 transition-transform duration-300">
                              <User className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                            </div>
                          </div>
                        ) : (
                          <div className="relative group/avatar">
                            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 to-purple-500 blur opacity-40 rounded-full group-hover/avatar:opacity-60 transition-opacity"></div>
                            <div className="relative w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center shadow-lg group-hover/avatar:scale-110 transition-transform duration-300">
                              <Bot className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                            </div>
                          </div>
                        )}
                      </div>

                      <div className={`flex flex-col gap-1.5 max-w-[85%] sm:max-w-[80%] ${msg.role === 'USER' ? 'items-end' : 'items-start'}`}>
                        <div className={`px-4 sm:px-5 py-3 sm:py-3.5 rounded-2xl shadow-md transition-all duration-200 hover:shadow-lg ${
                          msg.role === 'USER'
                            ? 'bg-gradient-to-br from-blue-600 to-indigo-600 text-white rounded-tr-sm hover:from-blue-700 hover:to-indigo-700'
                            : `${darkMode ? 'bg-gradient-to-br from-gray-700 to-gray-800 text-white border border-gray-600' : 'bg-gradient-to-br from-gray-50 to-gray-100 text-gray-900 border border-gray-200'} rounded-tl-sm hover:border-blue-300 ${darkMode ? 'hover:from-gray-600 hover:to-gray-700' : 'hover:from-blue-50/50 hover:to-indigo-50/50'}`
                        }`}>
                          <p className="text-xs sm:text-sm whitespace-pre-wrap leading-relaxed">{msg.content}</p>
                        </div>
                        <p className={`text-xs px-2 ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                          {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                    </div>
                  ))}

                  {sending && (
                    <div className="flex items-start gap-3 sm:gap-4 animate-fadeIn">
                      <div className="relative">
                        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 to-purple-500 blur opacity-40 rounded-full"></div>
                        <div className="relative w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center shadow-lg">
                          <Bot className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                        </div>
                      </div>
                      <div className={`px-4 sm:px-5 py-3 sm:py-3.5 rounded-2xl rounded-tl-sm ${darkMode ? 'bg-gradient-to-br from-gray-700 to-gray-800 border border-gray-600' : 'bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-200'} shadow-md`}>
                        <div className="flex items-center gap-2">
                          <div className="flex space-x-1.5">
                            <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce-slow"></div>
                            <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce-slow" style={{ animationDelay: '0.15s' }}></div>
                            <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce-slow" style={{ animationDelay: '0.3s' }}></div>
                          </div>
                          <span className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'} ml-1 font-medium`}>AI is thinking...</span>
                        </div>
                      </div>
                    </div>
                  )}

                  <div ref={messagesEndRef} />
                </div>

                {/* Enhanced Input */}
                <div className={`border-t-2 ${darkMode ? 'border-gray-700 bg-gradient-to-r from-gray-800 via-gray-800 to-gray-800' : 'border-gray-200 bg-gradient-to-r from-gray-50 via-blue-50/30 to-indigo-50/30'} backdrop-blur-sm p-4 sm:p-5`}>
                  <div className="flex gap-2 sm:gap-3">
                    <div className="flex-1 relative">
                      <input
                        type="text"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="Type your question..."
                        className={`w-full px-4 sm:px-5 py-3 sm:py-3.5 border-2 ${darkMode ? 'border-gray-700 bg-gray-900 text-white' : 'border-gray-300 bg-white'} rounded-xl text-sm focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-sm hover:border-gray-400 placeholder:text-gray-400`}
                        disabled={sending}
                      />
                      {inputValue && (
                        <div className={`absolute right-3 top-1/2 -translate-y-1/2 text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'} font-medium hidden sm:block`}>
                          Press Enter ↵
                        </div>
                      )}
                    </div>
                    <Button
                      onClick={handleSend}
                      disabled={!inputValue.trim() || sending}
                      className={`px-4 sm:px-6 py-3 sm:py-3.5 rounded-xl font-medium shadow-lg transition-all duration-200 ${
                        !inputValue.trim() || sending
                          ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                          : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white hover:shadow-xl hover:shadow-blue-500/50 hover:scale-105 active:scale-95'
                      }`}
                    >
                      {sending ? (
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      ) : (
                        <Send className="w-4 h-4 sm:w-5 sm:h-5" />
                      )}
                    </Button>
                  </div>
                  <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-500'} mt-2 sm:mt-2.5 flex items-center gap-1.5 flex-wrap`}>
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 ${darkMode ? 'bg-gray-700' : 'bg-gray-100'} rounded-md font-medium`}>
                      <span className="text-blue-600">↵</span> Enter
                    </span>
                    to send •
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 ${darkMode ? 'bg-gray-700' : 'bg-gray-100'} rounded-md font-medium`}>
                      <span className="text-blue-600">⇧</span> Shift+Enter
                    </span>
                    for new line
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes float {
          0%, 100% { transform: translate(0, 0) scale(1); }
          25% { transform: translate(20px, -20px) scale(1.05); }
          50% { transform: translate(-15px, 15px) scale(0.95); }
          75% { transform: translate(15px, 10px) scale(1.02); }
        }
        @keyframes float-delayed {
          0%, 100% { transform: translate(0, 0) scale(1); }
          25% { transform: translate(-25px, 20px) scale(1.08); }
          50% { transform: translate(20px, -15px) scale(0.92); }
          75% { transform: translate(-10px, -20px) scale(1.05); }
        }
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }
        @keyframes gradient {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn { animation: fadeIn 0.3s ease-out forwards; }
        .animate-float { animation: float 20s ease-in-out infinite; }
        .animate-float-delayed { animation: float-delayed 25s ease-in-out infinite; }
        .animate-bounce-slow { animation: bounce-slow 1.2s ease-in-out infinite; }
        .animate-gradient { background-size: 200% 200%; animation: gradient 8s ease infinite; }
        .animate-fade-in { animation: fade-in 0.6s ease-out forwards; }
        .animate-fade-in-up { animation: fade-in-up 0.6s ease-out forwards; }
        .scroll-smooth::-webkit-scrollbar { width: 6px; }
        .scroll-smooth::-webkit-scrollbar-track { background: transparent; }
        .scroll-smooth::-webkit-scrollbar-thumb { background: linear-gradient(to bottom, #60a5fa, #818cf8); border-radius: 10px; }
        .scroll-smooth::-webkit-scrollbar-thumb:hover { background: linear-gradient(to bottom, #3b82f6, #6366f1); }
      `}</style>
    </div>
  );
};

export default ChatPage;