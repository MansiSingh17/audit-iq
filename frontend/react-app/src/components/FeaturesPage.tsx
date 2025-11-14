import React from 'react';
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
  ArrowRight,
  CheckCircle2,
  TrendingUp
} from 'lucide-react';

const FeaturesPage: React.FC = () => {
  const navigate = useNavigate();

  const features = [
    {
      id: 'dashboard',
      title: 'Dashboard',
      description: 'Centralized compliance overview and document management hub',
      icon: <LayoutDashboard className="w-7 h-7" strokeWidth={2} />,
      path: '/dashboard',
      metric: '360° View'
    },
    {
      id: 'documents',
      title: 'Documents',
      description: 'Secure document repository with intelligent organization',
      icon: <FileText className="w-7 h-7" strokeWidth={2} />,
      path: '/documents',
      metric: 'Cloud Storage'
    },
    {
      id: 'ai-analysis',
      title: 'AI Analysis',
      description: 'Advanced compliance gap analysis powered by machine learning',
      icon: <Brain className="w-7 h-7" strokeWidth={2} />,
      path: '/analyze',
      metric: 'AI-Powered',
      badge: 'AI'
    },
    {
      id: 'audit-findings',
      title: 'Audit Findings',
      description: 'Automated findings generation with remediation workflows',
      icon: <Shield className="w-7 h-7" strokeWidth={2} />,
      path: '/findings',
      metric: 'Auto-Track'
    },
    {
      id: 'ai-chat',
      title: 'AI Assistant',
      description: 'Expert compliance guidance and instant answers',
      icon: <MessageSquare className="w-7 h-7" strokeWidth={2} />,
      path: '/chat',
      metric: '24/7 Support',
      badge: 'AI'
    },
    {
      id: 'checklist',
      title: 'Checklist Generator',
      description: 'Automated compliance checklist creation and tracking',
      icon: <CheckSquare className="w-7 h-7" strokeWidth={2} />,
      path: '/generate-checklist',
      metric: 'Auto-Gen'
    },
    {
      id: 'grammar',
      title: 'Grammar & Style',
      description: 'Professional audit report writing assistance',
      icon: <Sparkles className="w-7 h-7" strokeWidth={2} />,
      path: '/grammar',
      metric: 'Claude AI'
    }
  ];

  const stats = [
    { 
      label: 'Efficiency Gain', 
      value: '70%', 
      icon: <TrendingUp className="w-6 h-6" strokeWidth={2.5} />,
      color: 'success'
    },
    { 
      label: 'Standards Supported', 
      value: '3', 
      icon: <Shield className="w-6 h-6" strokeWidth={2.5} />,
      color: 'professional'
    },
    { 
      label: 'AI Features', 
      value: '7', 
      icon: <Zap className="w-6 h-6" strokeWidth={2.5} />,
      color: 'gold'
    },
    { 
      label: 'Accuracy Rate', 
      value: '99%', 
      icon: <Target className="w-6 h-6" strokeWidth={2.5} />,
      color: 'corporate'
    }
  ];

  const standards = [
    { name: 'ISO 27001:2022', icon: '🔒', controls: '93 Controls' },
    { name: 'GDPR', icon: '🛡️', controls: '99 Articles' },
    { name: 'HIPAA', icon: '🏥', controls: '45+ Requirements' }
  ];

  return (
    <div className="min-h-screen bg-slate-50 relative overflow-hidden">
      {/* Professional Background Pattern */}
      <div className="absolute inset-0 bg-audit-pattern opacity-50 pointer-events-none"></div>
      
      {/* Subtle corner gradient accent */}
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-gradient-to-bl from-blue-900/5 via-transparent to-transparent pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-gradient-to-tr from-amber-500/5 via-transparent to-transparent pointer-events-none"></div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        
        {/* Professional Hero Section */}
        <div className="text-center mb-16 animate-fade-in">
          <div className="inline-flex items-center gap-2 mb-6 px-4 py-2 bg-white/80 backdrop-blur-sm border-2 border-slate-200 rounded-full shadow-corporate">
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
            <span className="text-sm font-bold text-slate-700 uppercase tracking-wider">Enterprise-Grade Platform</span>
          </div>
          
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black mb-6 text-slate-900" style={{ fontFamily: 'Poppins, sans-serif', letterSpacing: '-0.03em' }}>
            Audit<span className="text-amber-600">IQ</span> Features
          </h1>
          
          <p className="text-xl text-slate-600 max-w-3xl mx-auto font-medium leading-relaxed mb-8">
            Professional audit automation platform powered by advanced AI and machine learning
          </p>

          {/* Standards Badges */}
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            {standards.map((standard) => (
              <div key={standard.name} className="flex items-center gap-2 px-5 py-3 bg-white border-2 border-slate-200 rounded-xl shadow-corporate hover:shadow-corporate-lg hover:border-amber-200 transition-all duration-300 group">
                <span className="text-2xl group-hover:scale-110 transition-transform">{standard.icon}</span>
                <div className="text-left">
                  <div className="text-sm font-bold text-slate-900">{standard.name}</div>
                  <div className="text-xs text-slate-500">{standard.controls}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Professional Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-16 animate-slide-up">
          {stats.map((stat, idx) => (
            <div key={stat.label} className="group" style={{ animationDelay: `${idx * 100}ms` }}>
              <div className="card-corporate hover-lift-corporate p-6">
                <div className={`w-14 h-14 rounded-xl mb-4 flex items-center justify-center shadow-md
                  ${stat.color === 'gold' ? 'bg-gold-gradient text-white' :
                    stat.color === 'success' ? 'bg-success-gradient text-white' :
                    stat.color === 'professional' ? 'bg-gradient-to-br from-blue-800 to-blue-900 text-white' :
                    'bg-corporate-gradient text-white'}`}>
                  {stat.icon}
                </div>
                <div className={`text-4xl font-black mb-2
                  ${stat.color === 'gold' ? 'text-amber-600' :
                    stat.color === 'success' ? 'text-emerald-600' :
                    stat.color === 'professional' ? 'text-blue-900' :
                    'text-slate-900'}`}>
                  {stat.value}
                </div>
                <div className="text-sm font-bold text-slate-600 uppercase tracking-wider">
                  {stat.label}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Professional Features Grid */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-black text-slate-900 mb-4" style={{ fontFamily: 'Poppins, sans-serif' }}>
              Comprehensive Feature Suite
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Everything you need for professional compliance management
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, idx) => (
              <div
                key={feature.id}
                onClick={() => navigate(feature.path)}
                className="group cursor-pointer animate-scale-in"
                style={{ animationDelay: `${idx * 50}ms` }}
              >
                <div className="card-corporate hover-lift-corporate h-full p-6 relative overflow-hidden">
                  {/* Top accent bar */}
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-amber-500 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  
                  {/* Icon Container */}
                  <div className="mb-5">
                    <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-slate-900 to-blue-900 flex items-center justify-center shadow-corporate group-hover:shadow-gold-lg transition-all duration-500 group-hover:scale-110 group-hover:rotate-3">
                      <div className="text-amber-400">
                        {feature.icon}
                      </div>
                    </div>
                    {feature.badge && (
                      <span className="inline-block mt-3 px-3 py-1 text-xs font-bold bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-lg shadow-gold uppercase tracking-wider">
                        {feature.badge}
                      </span>
                    )}
                  </div>

                  {/* Content */}
                  <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-blue-900 transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-slate-600 leading-relaxed mb-4">
                    {feature.description}
                  </p>

                  {/* Metric Badge */}
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-slate-100 border border-slate-200 rounded-lg text-xs font-bold text-slate-700 group-hover:bg-amber-50 group-hover:border-amber-200 group-hover:text-amber-700 transition-all duration-300">
                    <div className="w-1.5 h-1.5 bg-amber-500 rounded-full"></div>
                    {feature.metric}
                  </div>

                  {/* Hover Arrow */}
                  <div className="absolute bottom-6 right-6 opacity-0 group-hover:opacity-100 transform translate-x-2 group-hover:translate-x-0 transition-all duration-300">
                    <ArrowRight className="w-5 h-5 text-amber-600" strokeWidth={2.5} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Professional CTA Section */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 p-12 shadow-premium">
          {/* Decorative pattern overlay */}
          <div className="absolute inset-0 opacity-10 pointer-events-none" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 10 L40 15 L40 30 Q40 40 30 45 Q20 40 20 30 L20 15 Z' fill='none' stroke='white' stroke-width='1'/%3E%3C/svg%3E")`,
            backgroundSize: '60px 60px'
          }}></div>
          
          {/* Gold accent lines */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-amber-400 to-transparent"></div>
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-amber-400 to-transparent"></div>
          
          <div className="relative text-center">
            <div className="inline-flex items-center gap-2 mb-6 px-4 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span className="text-sm font-bold text-white uppercase tracking-wider">Ready to Get Started?</span>
            </div>

            <h2 className="text-4xl sm:text-5xl font-black text-white mb-4" style={{ fontFamily: 'Poppins, sans-serif' }}>
              Transform Your Audit Process
            </h2>
            <p className="text-xl text-slate-300 mb-10 max-w-2xl mx-auto leading-relaxed">
              Join leading organizations using AI to streamline compliance and reduce audit time by <span className="text-amber-400 font-bold">70%</span>
            </p>

            {/* Professional CTAs */}
            <div className="flex gap-4 justify-center flex-wrap">
              <button
                onClick={() => navigate('/analyze')}
                className="group px-8 py-4 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-slate-900 rounded-xl font-bold shadow-gold-lg hover:shadow-gold transition-all duration-300 flex items-center gap-3 hover:scale-105"
              >
                <Upload className="w-5 h-5 group-hover:scale-110 transition-transform" strokeWidth={2.5} />
                Start Analysis
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" strokeWidth={2.5} />
              </button>
              
              <button
                onClick={() => navigate('/chat')}
                className="px-8 py-4 bg-white/10 backdrop-blur-sm border-2 border-white/30 text-white rounded-xl font-bold hover:bg-white/20 hover:border-white/50 transition-all duration-300 flex items-center gap-3 hover:scale-105"
              >
                <MessageSquare className="w-5 h-5" strokeWidth={2.5} />
                Ask AI Assistant
              </button>
            </div>

            {/* Trust Indicators */}
            <div className="mt-12 pt-8 border-t border-white/10">
              <div className="flex flex-wrap justify-center gap-8 text-white/80">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" strokeWidth={2.5} />
                  <span className="text-sm font-semibold">Enterprise Security</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" strokeWidth={2.5} />
                  <span className="text-sm font-semibold">99.9% Uptime</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" strokeWidth={2.5} />
                  <span className="text-sm font-semibold">SOC 2 Compliant</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Professional Benefits Section */}
        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center p-8 bg-white border-2 border-slate-200 rounded-2xl shadow-corporate hover:shadow-elevated transition-all duration-300 group">
            <div className="w-16 h-16 mx-auto mb-6 rounded-xl bg-gradient-to-br from-slate-900 to-blue-900 flex items-center justify-center shadow-corporate group-hover:shadow-gold transition-all duration-300 group-hover:scale-110">
              <Shield className="w-8 h-8 text-amber-400" strokeWidth={2.5} />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-3">Compliance Assurance</h3>
            <p className="text-slate-600 leading-relaxed">
              Ensure adherence to ISO 27001, GDPR, and HIPAA standards with AI-powered analysis
            </p>
          </div>

          <div className="text-center p-8 bg-white border-2 border-slate-200 rounded-2xl shadow-corporate hover:shadow-elevated transition-all duration-300 group">
            <div className="w-16 h-16 mx-auto mb-6 rounded-xl bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center shadow-gold group-hover:shadow-gold-lg transition-all duration-300 group-hover:scale-110">
              <TrendingUp className="w-8 h-8 text-white" strokeWidth={2.5} />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-3">70% Time Reduction</h3>
            <p className="text-slate-600 leading-relaxed">
              Automate manual processes and focus on strategic compliance initiatives
            </p>
          </div>

          <div className="text-center p-8 bg-white border-2 border-slate-200 rounded-2xl shadow-corporate hover:shadow-elevated transition-all duration-300 group">
            <div className="w-16 h-16 mx-auto mb-6 rounded-xl bg-gradient-to-br from-emerald-600 to-green-600 flex items-center justify-center shadow-md group-hover:shadow-lg transition-all duration-300 group-hover:scale-110">
              <BarChart3 className="w-8 h-8 text-white" strokeWidth={2.5} />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-3">Real-Time Insights</h3>
            <p className="text-slate-600 leading-relaxed">
              Get instant compliance status updates and actionable recommendations
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeaturesPage;