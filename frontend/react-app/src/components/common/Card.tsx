import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  variant?: 'default' | 'glass' | 'gradient' | 'elevated';
  hover?: boolean;
  glow?: boolean;
  style?: React.CSSProperties;
}

const Card: React.FC<CardProps> = ({ 
  children, 
  className = '', 
  onClick,
  variant = 'default',
  hover = true,
  glow = false,
  style
}) => {
  const variants = {
    default: 'bg-white rounded-xl shadow-md border border-gray-200',
    glass: 'bg-white/70 backdrop-blur-lg rounded-xl border border-white/30 shadow-xl',
    gradient: 'bg-gradient-to-br from-blue-50 via-white to-indigo-50 rounded-xl border border-blue-100 shadow-lg',
    elevated: 'bg-white rounded-xl shadow-2xl border border-gray-100'
  };

  const hoverEffects = hover ? 'transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl' : '';
  const glowEffect = glow ? 'pulse-glow' : '';
  const cursorClass = onClick ? 'cursor-pointer' : '';

  return (
    <div
      className={`
        ${variants[variant]}
        ${hoverEffects}
        ${glowEffect}
        ${cursorClass}
        ${className}
        animate-fade-in
      `}
      onClick={onClick}
      style={style}
    >
      {children}
    </div>
  );
};

export default Card;