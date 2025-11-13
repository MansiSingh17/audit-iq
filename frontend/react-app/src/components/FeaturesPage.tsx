import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  FileText,
  Brain,
  Shield,
  MessageSquare,
  CheckSquare,
  Sparkles,
  Upload,
  BarChart3,
  Zap,
  Target,
  TrendingUp,
  ArrowRight,
  Moon,
  Sun
} from 'lucide-react';

const FeaturesPage: React.FC = () => {
  const navigate = useNavigate();
  const [darkMode, setDarkMode] = useState(false);
  const [typewriterText, setTypewriterText] = useState('');
  const fullText = 'Audit-IQ Features';

  // Typewriter effect
  useEffect(() => {
    let index = 0;
    const timer = setInterval(() => {
      if (index <= fullText.length) {
        setTypewriterText(fullText.slice(0, index));
        index++;
      } else {
        clearInterval(timer);
      }
    }, 100);
    return () => clearInterval(timer);
  }, []);

  const features = [
    {
      id: 'dashboard',
      title: 'Dashboard',
      description: 'Central hub for document management',
      icon: <LayoutDashboard className="w-7 h-7" />,
      color: 'from-blue-500 to-indigo-600',
      path: '/dashboard',
      emoji: '📊'
    },
    {
      id: 'documents',
      title: 'Documents',
      description: 'Manage compliance documents',
      icon: <FileText className="w-7 h-7" />,
      color: 'from-indigo-500 to-purple-600',
      path: '/documents',
      emoji: '📁'
    },
    {
      id: 'ai-analysis',
      title: 'AI Analysis',
      description: 'Intelligent compliance analysis',
      icon: <Brain className="w-7 h-7" />,
      color: 'from-purple-500 to-pink-600',
      path: '/analyze',
      emoji: '🤖'
    },
    {
      id: 'audit-findings',
      title: 'Audit Findings',
      description: 'Auto-generate findings & remediation',
      icon: <Shield className="w-7 h-7" />,
      color: 'from-pink-500 to-rose-600',
      path: '/findings',
      emoji: '🎯'
    },
    {
      id: 'ai-chat',
      title: 'AI Chat',
      description: 'Get instant compliance answers',
      icon: <MessageSquare className="w-7 h-7" />,
      color: 'from-rose-500 to-red-600',
      path: '/chat',
      emoji: '💬',
      badge: 'AI'
    },
    {
      id: 'checklist',
      title: 'Checklist',
      description: 'Generate compliance checklists',
      icon: <CheckSquare className="w-7 h-7" />,
      color: 'from-cyan-500 to-blue-600',
      path: '/generate-checklist',
      emoji: '✅'
    },
    {
      id: 'grammar',
      title: 'Grammar',
      description: 'AI-powered writing enhancement',
      icon: <Sparkles className="w-7 h-7" />,
      color: 'from-green-500 to-emerald-600',
      path: '/grammar',
      emoji: '✨'
    },
    {
      id: 'risk',
      title: 'Risk Assessment',
      description: 'Analyze & score compliance risks',
      icon: <TrendingUp className="w-7 h-7" />,
      color: 'from-orange-500 to-amber-600',
      path: '/risk/1',
      emoji: '⚠️'
    }
  ];

  const stats = [
    { label: 'AI-Powered Features', value: '8', icon: <Zap className="w-6 h-6" />, color: 'from-yellow-500 to-orange-600' },
    { label: 'Compliance Standards', value: '3+', icon: <Shield className="w-6 h-6" />, color: 'from-blue-500 to-indigo-600' },
    { label: 'Time Saved', value: '85%', icon: <Target className="w-6 h-6" />, color: 'from-green-500 to-emerald-600' },
    { label: 'Accuracy Rate', value: '99%', icon: <BarChart3 className="w-6 h-6" />, color: 'from-purple-500 to-pink-600' }
  ];

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50'} relative overflow-hidden transition-colors duration-500`}>
      {/* Dark Mode Toggle */}
      <button
        onClick={() => setDarkMode(!darkMode)}
        className="fixed top-20 right-6 z-50 p-3 rounded-full bg-white/90 dark:bg-gray-800 shadow-lg hover:scale-110 transition-all backdrop-blur-xl border-2 border-gray-200"
      >
        {darkMode ? <Sun className="w-6 h-6 text-yellow-500" /> : <Moon className="w-6 h-6 text-indigo-600" />}
      </button>

      {/* Enhanced Animated Background with Particles */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0iIzkzYzVmZCIgc3Ryb2tlLW9wYWNpdHk9IjAuMSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIiAvPjwvc3ZnPg==')] opacity-40"></div>
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-to-br from-blue-400/20 via-indigo-400/15 to-transparent rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-gradient-to-br from-indigo-400/20 via-purple-400/15 to-transparent rounded-full blur-3xl animate-float-delayed"></div>
        <div className="absolute top-1/2 left-1/2 w-[400px] h-[400px] -translate-x-1/2 -translate-y-1/2 bg-gradient-to-br from-purple-400/10 via-pink-400/10 to-transparent rounded-full blur-3xl animate-pulse"></div>
        
        {/* Floating Particles */}
        {[...Array(20)].map((_, i) => (
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

      <div className="relative z-10 max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        {/* Hero Section - Enhanced with Typewriter */}
        <div className="text-center mb-12 sm:mb-16">
          <div className="inline-block mb-6">
            <div className="relative animate-bounce-slow">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 rounded-2xl blur-2xl opacity-50 animate-pulse"></div>
              <div className="relative w-20 h-20 bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-2xl hover:scale-110 transition-transform">
                <Sparkles className="w-10 h-10 text-white animate-spin-slow" />
              </div>
            </div>
          </div>
          
          {/* Typewriter Effect */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black mb-4 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent min-h-[1.2em]">
            {typewriterText}
            <span className="animate-blink">|</span>
          </h1>
          
          <p className={`text-base sm:text-lg ${darkMode ? 'text-gray-300' : 'text-gray-600'} max-w-2xl mx-auto animate-fade-in-up`}>
            AI-powered compliance automation platform
          </p>
        </div>

        {/* Stats Grid - Enhanced with 3D Effect */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-12 sm:mb-16">
          {stats.map((stat, idx) => (
            <div
              key={stat.label}
              className="group relative transform perspective-1000 hover:scale-105 transition-all duration-500"
              style={{ animationDelay: `${idx * 100}ms` }}
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-0 group-hover:opacity-20 blur-xl transition-opacity rounded-2xl`}></div>
              <div className={`relative ${darkMode ? 'bg-gray-800/95' : 'bg-white/95'} backdrop-blur-xl rounded-2xl p-4 sm:p-6 border-2 ${darkMode ? 'border-gray-700' : 'border-gray-200'} shadow-xl hover:shadow-2xl transition-all hover:-translate-y-2 hover:border-blue-300 group-hover:rotate-y-6`}>
                <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center text-white mb-3 sm:mb-4 shadow-lg group-hover:scale-110 group-hover:rotate-12 transition-transform`}>
                  {stat.icon}
                </div>
                <div className={`text-3xl sm:text-4xl font-black mb-2 bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`}>
                  {stat.value}
                </div>
                <div className={`text-xs sm:text-sm font-bold ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{stat.label}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Features Grid - Enhanced with 3D Hover */}
        <div className="mb-12 sm:mb-16">
          <h2 className={`text-3xl sm:text-4xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'} mb-3 text-center`}>
            Explore All Features
          </h2>
          <p className={`text-center ${darkMode ? 'text-gray-400' : 'text-gray-600'} mb-8 sm:mb-10`}>
            Click any feature to get started
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {features.map((feature, idx) => (
              <div
                key={feature.id}
                onClick={() => navigate(feature.path)}
                className="group cursor-pointer transform perspective-1000 animate-fade-in-up"
                style={{ animationDelay: `${idx * 50}ms` }}
              >
                <div className="relative h-full">
                  <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-30 blur-xl transition-all duration-300 rounded-2xl`}></div>
                  
                  <div className={`relative h-full ${darkMode ? 'bg-gray-800/95' : 'bg-white/95'} backdrop-blur-xl border-2 ${darkMode ? 'border-gray-700 group-hover:border-blue-500' : 'border-gray-200 group-hover:border-blue-400'} rounded-2xl p-6 transition-all duration-300 hover:shadow-2xl hover:-translate-y-3 group-hover:rotate-y-5 group-hover:scale-105`}>
                    {/* Icon with Emoji Background */}
                    <div className="relative mb-4">
                      <div className="text-5xl absolute -top-2 -right-2 opacity-10 group-hover:opacity-20 transition-opacity group-hover:scale-125 group-hover:rotate-12">
                        {feature.emoji}
                      </div>
                      <div className={`relative w-14 h-14 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center text-white shadow-lg group-hover:scale-110 group-hover:rotate-6 transition-all duration-300`}>
                        {feature.icon}
                      </div>
                      {feature.badge && (
                        <div className="absolute -top-1 -right-1 px-2 py-0.5 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs font-bold rounded-full shadow-md animate-pulse">
                          {feature.badge}
                        </div>
                      )}
                    </div>

                    <h3 className={`text-lg font-bold ${darkMode ? 'text-white group-hover:text-blue-400' : 'text-gray-900 group-hover:text-blue-600'} mb-2 transition-colors`}>
                      {feature.title}
                    </h3>
                    <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'} leading-relaxed mb-4`}>
                      {feature.description}
                    </p>

                    <div className={`flex items-center gap-2 text-sm font-bold bg-gradient-to-r ${feature.color} bg-clip-text text-transparent`}>
                      <span>Open</span>
                      <ArrowRight className="w-4 h-4 text-blue-600 group-hover:translate-x-2 transition-transform" />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section - Enhanced */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 p-8 sm:p-12 shadow-2xl hover:shadow-3xl transition-shadow">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAwIDEwIEwgNDAgMTAgTSAxMCAwIEwgMTAgNDAgTSAwIDIwIEwgNDAgMjAgTSAyMCAwIEwgMjAgNDAgTSAwIDMwIEwgNDAgMzAgTSAzMCAwIEwgMzAgNDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjEiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIgLz48L3N2Zz4=')] opacity-20"></div>
          
          {/* Floating Decorations */}
          <div className="absolute top-8 left-8 w-16 h-16 bg-white/10 rounded-full blur-xl animate-float"></div>
          <div className="absolute bottom-8 right-8 w-24 h-24 bg-white/10 rounded-full blur-2xl animate-float-delayed"></div>
          
          <div className="relative text-center">
            <h2 className="text-3xl sm:text-4xl font-black text-white mb-4 animate-fade-in">
              Ready to Transform Your Audits?
            </h2>
            <p className="text-blue-100 text-base sm:text-lg mb-6 sm:mb-8 max-w-2xl mx-auto">
              Start automating your compliance workflow today. Reduce audit prep time by <span className="text-yellow-300 font-black text-xl sm:text-2xl">85%</span>
            </p>
            <div className="flex gap-3 sm:gap-4 justify-center flex-wrap">
              <button
                onClick={() => navigate('/analyze')}
                className="px-6 sm:px-8 py-3 sm:py-4 bg-white text-blue-600 rounded-xl font-bold shadow-xl hover:shadow-2xl hover:scale-105 transition-all flex items-center gap-2 text-sm sm:text-base"
              >
                <Upload className="w-4 h-4 sm:w-5 sm:h-5" />
                Upload Document
                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
              <button
                onClick={() => navigate('/chat')}
                className="px-6 sm:px-8 py-3 sm:py-4 bg-white/20 backdrop-blur-xl text-white border-2 border-white/50 rounded-xl font-bold hover:bg-white/30 hover:scale-105 transition-all flex items-center gap-2 text-sm sm:text-base"
              >
                <MessageSquare className="w-4 h-4 sm:w-5 sm:h-5" />
                Try AI Chat
              </button>
            </div>
          </div>
        </div>
      </div>

      <style>{`
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
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
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
        .animate-float { animation: float 20s ease-in-out infinite; }
        .animate-float-delayed { animation: float-delayed 25s ease-in-out infinite; }
        .animate-blink { animation: blink 1s infinite; }
        .animate-bounce-slow { animation: bounce-slow 3s ease-in-out infinite; }
        .animate-spin-slow { animation: spin-slow 8s linear infinite; }
        .animate-fade-in-up { animation: fade-in-up 0.6s ease-out forwards; }
        .perspective-1000 { perspective: 1000px; }
        .rotate-y-5:hover { transform: rotateY(5deg); }
        .rotate-y-6:hover { transform: rotateY(6deg); }
      `}</style>
    </div>
  );
};

export default FeaturesPage;