import React, { useState, useEffect, useRef } from 'react';
import { Send, Sparkles, Bot, User, MessageSquare, Zap } from 'lucide-react';
import Button from './common/Button';
import { chatService, ChatMessage } from '../services/chatService';

const ChatPage: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [sending, setSending] = useState(false);
  const [conversationId, setConversationId] = useState<number | null>(null);
  const [selectedStandard, setSelectedStandard] = useState('ISO_27001');
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
    <div className="min-h-screen page-bg-corporate">
      <div className="absolute inset-0 bg-audit-pattern opacity-50 pointer-events-none"></div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-8">
        
        {/* Professional Header */}
        <div className="mb-8 animate-fade-in-corporate">
          <div className="flex items-center gap-4">
            <div className="icon-container-gold w-16 h-16">
              <Sparkles className="w-8 h-8 text-white" strokeWidth={2.5} />
            </div>
            <div>
              <h1 className="section-header-corporate !mb-1">
                AI Compliance Assistant
              </h1>
              <p className="text-corporate-secondary flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-amber-600" />
                Expert compliance guidance and instant answers
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Professional Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-6 space-y-6">
              
              {/* Standard Selector */}
              <div className="card-corporate">
                <div className="p-6">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-900 to-indigo-900 flex items-center justify-center shadow-sm">
                      <Zap className="w-4 h-4 text-amber-400" strokeWidth={2.5} />
                    </div>
                    <h3 className="text-corporate-primary text-sm">Compliance Context</h3>
                  </div>
                  <label className="text-xs font-bold text-slate-600 mb-2 block uppercase tracking-wider">
                    Select Framework:
                  </label>
                  <select
                    value={selectedStandard}
                    onChange={(e) => setSelectedStandard(e.target.value)}
                    className="input-corporate text-sm"
                  >
                    {standards.map(std => (
                      <option key={std} value={std}>{std.replace('_', ' ')}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Quick Questions */}
              <div className="card-corporate">
                <div className="p-6">
                  <h3 className="text-corporate-primary mb-4 flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-600 to-amber-700 flex items-center justify-center shadow-sm">
                      <Sparkles className="w-4 h-4 text-white" strokeWidth={2.5} />
                    </div>
                    Quick Questions
                  </h3>
                  
                  <div className="space-y-2">
                    {quickQuestions.map((q, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleQuickQuestion(q.text)}
                        className="w-full text-left p-3.5 bg-slate-50 hover:bg-blue-50 border-2 border-slate-200 hover:border-blue-900 rounded-xl transition-all hover-lift-corporate"
                      >
                        <div className="flex items-start gap-3">
                          <span className="text-2xl">{q.icon}</span>
                          <div className="flex-1">
                            <p className="text-xs font-semibold text-slate-900 mb-1.5 leading-relaxed">
                              {q.text}
                            </p>
                            <span className="inline-block px-2.5 py-1 bg-white border border-slate-200 rounded-md text-xs font-medium text-slate-600">
                              {q.category}
                            </span>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>

                  {/* Features */}
                  <div className="mt-6 p-4 bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-xl">
                    <p className="text-xs font-bold text-blue-900 mb-3 flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-amber-600" />
                      I can help with:
                    </p>
                    <ul className="text-xs text-blue-800 space-y-2.5">
                      {['Compliance requirements', 'Policy writing', 'Remediation guidance', 'Best practices', 'Control explanations'].map((item, idx) => (
                        <li key={idx} className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 bg-amber-600 rounded-full"></div>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Professional Chat Area */}
          <div className="lg:col-span-2">
            <div className="card-corporate h-[calc(100vh-12rem)] flex flex-col shadow-premium">
              
              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex items-start gap-4 ${msg.role === 'USER' ? 'flex-row-reverse' : 'flex-row'}`}
                  >
                    <div className="flex-shrink-0">
                      {msg.role === 'USER' ? (
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-900 to-indigo-900 flex items-center justify-center shadow-corporate">
                          <User className="w-5 h-5 text-amber-400" strokeWidth={2.5} />
                        </div>
                      ) : (
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center shadow-gold">
                          <Bot className="w-5 h-5 text-white" strokeWidth={2.5} />
                        </div>
                      )}
                    </div>

                    <div className={`flex flex-col gap-1.5 max-w-[80%] ${msg.role === 'USER' ? 'items-end' : 'items-start'}`}>
                      <div className={`px-5 py-3.5 rounded-2xl shadow-corporate border-2 ${
                        msg.role === 'USER'
                          ? 'bg-gradient-to-br from-slate-900 to-blue-900 text-white border-slate-800'
                          : 'bg-white text-slate-900 border-slate-200'
                      }`}>
                        <p className="text-sm whitespace-pre-wrap leading-relaxed" style={{ fontFamily: 'Inter, sans-serif' }}>{msg.content}</p>
                      </div>
                      <p className="text-xs px-2 text-slate-500 font-medium">
                        {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>
                ))}

                {sending && (
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center shadow-gold">
                      <Bot className="w-5 h-5 text-white" strokeWidth={2.5} />
                    </div>
                    <div className="px-5 py-3.5 rounded-2xl bg-white border-2 border-slate-200 shadow-corporate">
                      <div className="flex items-center gap-2">
                        <div className="flex space-x-1.5">
                          <div className="w-2 h-2 bg-amber-600 rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-blue-900 rounded-full animate-bounce" style={{ animationDelay: '0.15s' }}></div>
                          <div className="w-2 h-2 bg-amber-600 rounded-full animate-bounce" style={{ animationDelay: '0.3s' }}></div>
                        </div>
                        <span className="text-xs text-slate-600 ml-1 font-medium">AI is thinking...</span>
                      </div>
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Professional Input */}
              <div className="border-t-2 border-slate-200 bg-white p-5">
                <div className="flex gap-3">
                  <div className="flex-1 relative">
                    <input
                      type="text"
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="Type your question..."
                      className="input-corporate"
                      disabled={sending}
                    />
                  </div>
                  <Button
                    onClick={handleSend}
                    disabled={!inputValue.trim() || sending}
                    className={`px-6 py-3.5 rounded-xl font-bold shadow-corporate transition-all ${
                      !inputValue.trim() || sending
                        ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                        : 'btn-corporate-primary hover:shadow-elevated'
                    }`}
                  >
                    {sending ? (
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      <Send className="w-5 h-5" strokeWidth={2.5} />
                    )}
                  </Button>
                </div>
                <p className="text-xs text-slate-500 mt-2.5 flex items-center gap-2">
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-slate-100 rounded-md font-medium">
                    <span className="text-blue-900">↵</span> Enter
                  </span>
                  to send •
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-slate-100 rounded-md font-medium">
                    <span className="text-blue-900">⇧</span> Shift+Enter
                  </span>
                  for new line
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;