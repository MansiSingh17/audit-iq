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
  Sparkles,
  User,
  Menu,
  X
} from 'lucide-react';

const Navbar: React.FC = () => {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { 
      path: '/features', 
      label: 'Features', 
      icon: Layers,
      gradient: 'from-purple-500 to-pink-500',
      shadow: 'shadow-purple-500/30',
      hoverGlow: 'group-hover:shadow-purple-500/40'
    },
    { 
      path: '/dashboard', 
      label: 'Dashboard', 
      icon: LayoutDashboard,
      gradient: 'from-blue-500 to-cyan-500',
      shadow: 'shadow-blue-500/30',
      hoverGlow: 'group-hover:shadow-blue-500/40'
    },
    { 
      path: '/documents', 
      label: 'Documents', 
      icon: FileText,
      gradient: 'from-emerald-500 to-teal-500',
      shadow: 'shadow-emerald-500/30',
      hoverGlow: 'group-hover:shadow-emerald-500/40'
    },
    { 
      path: '/analyze', 
      label: 'AI Analysis', 
      icon: Gauge,
      gradient: 'from-orange-500 to-red-500',
      shadow: 'shadow-orange-500/30',
      hoverGlow: 'group-hover:shadow-orange-500/40'
    },
    { 
      path: '/findings', 
      label: 'Draft Findings', 
      icon: Clock,
      gradient: 'from-amber-500 to-yellow-500',
      shadow: 'shadow-amber-500/30',
      hoverGlow: 'group-hover:shadow-amber-500/40'
    },
    { 
      path: '/chat', 
      label: 'AI Chat', 
      icon: MessageSquare,
      badge: 'AI',
      gradient: 'from-pink-500 to-rose-500',
      shadow: 'shadow-pink-500/30',
      hoverGlow: 'group-hover:shadow-pink-500/40'
    },
    { 
      path: '/generate-checklist', 
      label: 'Checklist', 
      icon: CheckSquare,
      gradient: 'from-indigo-500 to-purple-500',
      shadow: 'shadow-indigo-500/30',
      hoverGlow: 'group-hover:shadow-indigo-500/40',
      highlight: true
    },
    { 
      path: '/grammar', 
      label: 'Grammar', 
      icon: Upload,
      gradient: 'from-violet-500 to-fuchsia-500',
      shadow: 'shadow-violet-500/30',
      hoverGlow: 'group-hover:shadow-violet-500/40'
    },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-xl border-b border-gray-200/50 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-8">
          {/* Enhanced Logo */}
          <Link to="/features" className="flex items-center space-x-3 group flex-shrink-0">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl blur-md opacity-50 group-hover:opacity-75 transition-all duration-300"></div>
              <div className="relative w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl group-hover:scale-110 transition-all duration-300">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
            </div>
            <div className="hidden sm:block">
              <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
                AuditIQ
              </h1>
              <p className="text-xs text-gray-500 -mt-1 font-medium">AI-Powered Compliance</p>
            </div>
          </Link>

          {/* Desktop Navigation - Super Enhanced Icons */}
          <div className="hidden lg:flex items-center space-x-2 ml-8">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path);
              
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`
                    relative group flex items-center gap-3 px-4 py-2 rounded-xl 
                    transition-all duration-300 ease-out
                    ${active 
                      ? 'text-white scale-105' 
                      : 'text-gray-600 hover:scale-105'
                    }

                  `}
                >
                  {/* Background gradient for active state */}
                  {active && (
                    <div className={`absolute inset-0 bg-gradient-to-br ${item.gradient} rounded-xl shadow-lg ${item.shadow}`}></div>
                  )}
                  
                  {/* Hover background glow */}
                  {!active && (
                    <div className={`absolute inset-0 bg-gradient-to-br ${item.gradient} rounded-xl opacity-0 group-hover:opacity-10 transition-opacity duration-300`}></div>
                  )}
                  
                  {/* Enhanced Icon Container */}
                  <div className={`
                    relative p-2 rounded-lg transition-all duration-300 z-10
                    ${active 
                      ? 'bg-white/20 backdrop-blur-sm shadow-inner' 
                      : `bg-gradient-to-br ${item.gradient} shadow-md ${item.shadow} ${item.hoverGlow}`
                    }
                  `}>
                    <Icon className={`
                      w-5 h-5 transition-all duration-300
                      ${active 
                        ? 'text-white drop-shadow-lg' 
                        : 'text-white group-hover:scale-125 group-hover:rotate-3'
                      }
                    `} />
                    
                    {/* Animated ping effect on active */}
                    {active && (
                      <span className="absolute inset-0 rounded-lg bg-white/30 animate-ping"></span>
                    )}
                  </div>

                  {/* Label with enhanced typography */}
                  <span className={`
                    font-medium text-sm relative z-10 transition-all duration-300
                    ${active ? 'font-bold tracking-wide' : 'group-hover:font-semibold'}
                  `}>
                    {item.label}
                  </span>

                  {/* AI Badge - Super Enhanced */}
                  {item.badge && (
                    <span className={`
                      relative z-10 px-2.5 py-1 text-xs font-bold rounded-full
                      transition-all duration-300
                      ${active 
                        ? 'bg-white/30 text-white backdrop-blur-sm' 
                        : 'bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-lg shadow-pink-500/40 group-hover:scale-110 group-hover:shadow-pink-500/60'
                      }
                    `}>
                      {item.badge}
                      {/* Sparkle effect */}
                      {!active && (
                        <span className="absolute -top-1 -right-1 w-2 h-2">
                          <span className="absolute inset-0 rounded-full bg-yellow-300 animate-ping"></span>
                          <span className="absolute inset-0 rounded-full bg-yellow-400"></span>
                        </span>
                      )}
                    </span>
                  )}

                  {/* Active indicator line with gradient */}
                  {active && (
                    <div className={`absolute bottom-0 left-1/2 transform -translate-x-1/2 w-2/3 h-1 bg-gradient-to-r ${item.gradient} rounded-full shadow-lg ${item.shadow}`}></div>
                  )}
                  
                  {/* Hover indicator line */}
                  {!active && (
                    <div className={`absolute bottom-0 left-1/2 transform -translate-x-1/2 w-0 h-0.5 bg-gradient-to-r ${item.gradient} rounded-full transition-all duration-300 group-hover:w-2/3`}></div>
                  )}
                </Link>
              );
            })}
          </div>

          {/* Super Enhanced Admin Section */}
          <div className="hidden lg:flex items-center gap-3">
            <div className="relative group cursor-pointer">
              {/* Glow effect background */}
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-2xl blur-lg opacity-20 group-hover:opacity-40 transition-all duration-300"></div>
              
              {/* Main container */}
              <div className="relative flex items-center gap-3 px-4 py-2.5 rounded-2xl bg-gradient-to-br from-white to-gray-50 border border-gray-200/50 shadow-md hover:shadow-xl hover:border-indigo-200 transition-all duration-300 backdrop-blur-sm">
                {/* Avatar with animated ring */}
                <div className="relative">
                  {/* Rotating gradient ring */}
                  <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-full blur-md opacity-40 group-hover:opacity-70 group-hover:scale-125 transition-all duration-500 animate-pulse"></div>
                  
                  {/* Avatar */}
                  <div className="relative w-10 h-10 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 rounded-full flex items-center justify-center shadow-lg group-hover:shadow-2xl group-hover:shadow-indigo-500/50 group-hover:scale-110 transition-all duration-300">
                    <User className="w-5 h-5 text-white drop-shadow-lg" />
                    
                    {/* Online status indicator with pulse */}
                    <span className="absolute -bottom-0.5 -right-0.5 flex">
                      <span className="absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75 animate-ping"></span>
                      <span className="relative w-3.5 h-3.5 bg-green-500 border-2 border-white rounded-full shadow-sm"></span>
                    </span>
                  </div>
                </div>
                
                {/* User info with enhanced typography */}
                <div className="text-left">
                  <div className="flex items-center gap-1.5">
                    <p className="text-sm font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent group-hover:from-indigo-700 group-hover:to-purple-700 transition-all">
                      Admin User
                    </p>
                    {/* Badge */}
                    <span className="px-1.5 py-0.5 text-[10px] font-bold bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-full shadow-sm">
                      PRO
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 font-medium flex items-center gap-1">
                    <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full"></span>
                    Compliance Manager
                  </p>
                </div>
                
                {/* Dropdown indicator */}
                <div className="ml-1 text-gray-400 group-hover:text-indigo-600 transition-colors">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* Mobile menu button with animation */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-lg text-gray-600 hover:bg-gradient-to-br hover:from-blue-50 hover:to-indigo-50 hover:text-blue-600 transition-all duration-300"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Enhanced Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="lg:hidden py-4 space-y-2 border-t border-gray-200 animate-in slide-in-from-top duration-300">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path);
              
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`
                    flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300
                    ${active 
                      ? `bg-gradient-to-br ${item.gradient} text-white shadow-lg ${item.shadow}` 
                      : 'text-gray-600 hover:bg-gray-50 active:scale-95'
                    }
                  `}
                >
                  <div className={`p-2 rounded-lg ${active ? 'bg-white/20' : `bg-gradient-to-br ${item.gradient}`}`}>
                    <Icon className={`w-5 h-5 ${active ? 'text-white' : 'text-white'}`} />
                  </div>
                  <span className="font-semibold">{item.label}</span>
                  {item.badge && (
                    <span className={`
                      ml-auto px-2 py-0.5 text-xs font-bold rounded-full
                      ${active ? 'bg-white/30' : 'bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-md'}
                    `}>
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
            
            {/* Mobile Admin Section */}
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer">
                <div className="relative w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-full flex items-center justify-center shadow-lg">
                  <User className="w-5 h-5 text-white" />
                  <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></span>
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-900">Admin User</p>
                  <p className="text-xs text-gray-500">Compliance Manager</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;