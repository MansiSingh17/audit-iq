import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Layers,
  LayoutDashboard, 
  FileText, 
  Gauge,
  Clock,
  MessageSquare,
  CheckSquare,
  Upload,
  Shield,
  User,
  Menu,
  X,
  ChevronDown
} from 'lucide-react';

const Navbar: React.FC = () => {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { 
      path: '/features', 
      label: 'Features', 
      icon: Layers,
    },
    { 
      path: '/dashboard', 
      label: 'Dashboard', 
      icon: LayoutDashboard,
    },
    { 
      path: '/documents', 
      label: 'Documents', 
      icon: FileText,
    },
    { 
      path: '/analyze', 
      label: 'AI Analysis', 
      icon: Gauge,
      badge: 'AI'
    },
    { 
      path: '/findings', 
      label: 'Draft Findings', 
      icon: Clock,
    },
    { 
      path: '/chat', 
      label: 'AI Chat', 
      icon: MessageSquare,
      badge: 'AI'
    },
    { 
      path: '/generate-checklist', 
      label: 'Checklist', 
      icon: CheckSquare,
    },
    { 
      path: '/grammar', 
      label: 'Grammar', 
      icon: Upload,
    },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-xl border-b-2 border-slate-200/80 shadow-corporate">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Professional Logo */}
          <Link to="/features" className="flex items-center gap-4 group flex-shrink-0">
            <div className="relative">
              {/* Subtle glow */}
              <div className="absolute inset-0 bg-gradient-to-br from-slate-900 to-blue-900 rounded-2xl blur-sm opacity-20 group-hover:opacity-30 transition-all duration-500"></div>
              
              {/* Icon container */}
              <div className="relative w-14 h-14 bg-gradient-to-br from-slate-900 to-blue-900 rounded-2xl flex items-center justify-center shadow-corporate group-hover:shadow-elevated transition-all duration-500 group-hover:scale-105">
                <Shield className="w-7 h-7 text-amber-400" strokeWidth={2.5} />
                {/* Corner accent */}
                <div className="absolute top-1 right-1 w-2 h-2 bg-amber-400 rounded-full shadow-gold"></div>
              </div>
            </div>
            
            <div className="hidden sm:block">
              <h1 className="text-2xl font-black text-slate-900 tracking-tight" style={{ fontFamily: 'Poppins, sans-serif' }}>
                Audit<span className="text-amber-600">IQ</span>
              </h1>
              <p className="text-xs text-slate-500 font-semibold tracking-wide uppercase" style={{ fontFamily: 'Inter, sans-serif', letterSpacing: '0.1em' }}>
                AI-Powered Compliance
              </p>
            </div>
          </Link>

          {/* Professional Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-2 ml-8">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path);
              
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`
                    relative group flex items-center gap-2.5 px-4 py-2.5 rounded-xl
                    font-semibold text-sm transition-all duration-300
                    ${active 
                      ? 'bg-gradient-to-br from-slate-900 to-blue-900 text-white shadow-corporate' 
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                    }
                  `}
                >
                  {/* Icon with professional styling */}
                  <div className={`
                    relative transition-all duration-300
                    ${active 
                      ? 'text-amber-400' 
                      : 'text-slate-400 group-hover:text-blue-900'
                    }
                  `}>
                    <Icon className="w-5 h-5" strokeWidth={2.5} />
                  </div>

                  {/* Label */}
                  <span className="tracking-wide" style={{ fontFamily: 'Inter, sans-serif' }}>
                    {item.label}
                  </span>

                  {/* Professional AI Badge */}
                  {item.badge && (
                    <span className={`
                      px-2 py-0.5 text-[10px] font-bold rounded-md uppercase tracking-wider
                      ${active 
                        ? 'bg-amber-400 text-slate-900' 
                        : 'bg-gradient-to-r from-amber-500 to-amber-600 text-white shadow-gold'
                      }
                    `} style={{ fontFamily: 'Inter, sans-serif', letterSpacing: '0.08em' }}>
                      {item.badge}
                    </span>
                  )}

                  {/* Bottom accent line for active state */}
                  {active && (
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 rounded-full"></div>
                  )}
                </Link>
              );
            })}
          </div>

          {/* Professional User Section */}
          <div className="hidden lg:flex items-center gap-4">
            <div className="relative group cursor-pointer">
              {/* Card container */}
              <div className="flex items-center gap-3 px-4 py-2.5 rounded-xl bg-white border-2 border-slate-200 shadow-corporate hover:shadow-corporate-lg hover:border-slate-300 transition-all duration-300">
                
                {/* Professional Avatar */}
                <div className="relative">
                  <div className="w-10 h-10 bg-gradient-to-br from-slate-800 to-blue-900 rounded-xl flex items-center justify-center shadow-md">
                    <User className="w-5 h-5 text-amber-400" strokeWidth={2.5} />
                  </div>
                  {/* Status indicator */}
                  <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-500 border-2 border-white rounded-full shadow-sm"></span>
                </div>
                
                {/* User info */}
                <div className="text-left">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-bold text-slate-900" style={{ fontFamily: 'Inter, sans-serif' }}>
                      Admin User
                    </p>
                    <span className="px-2 py-0.5 text-[9px] font-bold bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-md shadow-sm uppercase tracking-wider">
                      Pro
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 font-medium" style={{ fontFamily: 'Inter, sans-serif' }}>
                    Compliance Manager
                  </p>
                </div>
                
                {/* Dropdown indicator */}
                <ChevronDown className="w-4 h-4 text-slate-400 group-hover:text-slate-600 transition-colors ml-1" />
              </div>
            </div>
          </div>

          {/* Professional Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-3 rounded-xl text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-all duration-300 border-2 border-transparent hover:border-slate-200"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Professional Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="lg:hidden py-4 space-y-2 border-t-2 border-slate-200 animate-fade-in-corporate">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path);
              
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`
                    flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-300
                    ${active 
                      ? 'bg-gradient-to-br from-slate-900 to-blue-900 text-white shadow-corporate' 
                      : 'text-slate-700 hover:bg-slate-100 active:scale-98'
                    }
                  `}
                >
                  <div className={`
                    w-10 h-10 rounded-lg flex items-center justify-center
                    ${active 
                      ? 'bg-white/10 backdrop-blur-sm border border-white/20' 
                      : 'bg-slate-100 border border-slate-200'
                    }
                  `}>
                    <Icon className={`w-5 h-5 ${active ? 'text-amber-400' : 'text-slate-600'}`} strokeWidth={2.5} />
                  </div>
                  <span className="font-semibold flex-1" style={{ fontFamily: 'Inter, sans-serif' }}>
                    {item.label}
                  </span>
                  {item.badge && (
                    <span className={`
                      px-2.5 py-1 text-[10px] font-bold rounded-md uppercase tracking-wider
                      ${active 
                        ? 'bg-amber-400 text-slate-900' 
                        : 'bg-gradient-to-r from-amber-500 to-amber-600 text-white shadow-sm'
                      }
                    `}>
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
            
            {/* Mobile User Section */}
            <div className="mt-4 pt-4 border-t-2 border-slate-200">
              <div className="flex items-center gap-3 px-4 py-3.5 rounded-xl hover:bg-slate-50 transition-all cursor-pointer">
                <div className="relative w-11 h-11 bg-gradient-to-br from-slate-800 to-blue-900 rounded-xl flex items-center justify-center shadow-md">
                  <User className="w-5 h-5 text-amber-400" strokeWidth={2.5} />
                  <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-500 border-2 border-white rounded-full"></span>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-bold text-slate-900" style={{ fontFamily: 'Inter, sans-serif' }}>
                    Admin User
                  </p>
                  <p className="text-xs text-slate-500 font-medium">Compliance Manager</p>
                </div>
                <ChevronDown className="w-4 h-4 text-slate-400" />
              </div>
            </div>
          </div>
        )}
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=Poppins:wght@600;700;800;900&display=swap');
      `}</style>
    </nav>
  );
};

export default Navbar;