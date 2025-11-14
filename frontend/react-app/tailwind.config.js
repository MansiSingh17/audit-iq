/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      // Professional Corporate Color Palette
      colors: {
        // Primary - Deep Navy/Slate
        corporate: {
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a',
          950: '#020617',
        },
        // Accent - Professional Gold
        gold: {
          50: '#fffbeb',
          100: '#fef3c7',
          200: '#fde68a',
          300: '#fcd34d',
          400: '#fbbf24',
          500: '#f59e0b',
          600: '#d97706',
          700: '#b45309',
          800: '#92400e',
          900: '#78350f',
        },
        // Success - Corporate Green
        success: {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#22c55e',
          600: '#059669',
          700: '#047857',
          800: '#065f46',
          900: '#064e3b',
        },
        // Professional Blue
        professional: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e3a8a',
          900: '#1e40af',
        },
      },
      
      // Professional Fonts
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        display: ['Poppins', 'Inter', 'system-ui', 'sans-serif'],
        mono: ['SF Mono', 'Monaco', 'Cascadia Code', 'monospace'],
      },
      
      // Professional Spacing
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
      },
      
      // Professional Border Radius
      borderRadius: {
        'xl': '1rem',
        '2xl': '1.25rem',
        '3xl': '1.5rem',
        '4xl': '2rem',
      },
      
      // Professional Box Shadows
      boxShadow: {
        'corporate': '0 4px 6px -1px rgba(15, 23, 42, 0.1), 0 2px 4px -1px rgba(15, 23, 42, 0.06)',
        'corporate-lg': '0 10px 15px -3px rgba(15, 23, 42, 0.1), 0 4px 6px -2px rgba(15, 23, 42, 0.05)',
        'corporate-xl': '0 20px 25px -5px rgba(15, 23, 42, 0.1), 0 10px 10px -5px rgba(15, 23, 42, 0.04)',
        'elevated': '0 10px 40px -10px rgba(15, 23, 42, 0.15)',
        'premium': '0 20px 60px -15px rgba(15, 23, 42, 0.2)',
        'gold': '0 4px 14px 0 rgba(217, 119, 6, 0.25)',
        'gold-lg': '0 8px 24px 0 rgba(217, 119, 6, 0.3)',
        'inner-corporate': 'inset 0 2px 4px 0 rgba(15, 23, 42, 0.06)',
      },
      
      // Professional Animations
      animation: {
        'fade-in': 'fadeIn 0.6s ease-out',
        'slide-up': 'slideUp 0.7s cubic-bezier(0.4, 0, 0.2, 1)',
        'scale-in': 'scaleIn 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
        'float-subtle': 'floatSubtle 6s ease-in-out infinite',
        'shimmer': 'shimmer 3s linear infinite',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'spin-slow': 'spin 8s linear infinite',
      },
      
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.92)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        floatSubtle: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-1000px 0' },
          '100%': { backgroundPosition: '1000px 0' },
        },
      },
      
      // Professional Background Images
      backgroundImage: {
        'audit-pattern': "url(\"data:image/svg+xml,%3Csvg width='300' height='300' xmlns='http://www.w3.org/2000/svg'%3E%3Cdefs%3E%3Cpattern id='audit-icons' x='0' y='0' width='300' height='300' patternUnits='userSpaceOnUse'%3E%3C!-- ISO 27001 Shield --%3E%3Cpath d='M60 40 L75 47 L75 68 Q75 82 60 90 Q45 82 45 68 L45 47 Z' fill='none' stroke='%231e3a8a' stroke-width='2' opacity='0.3'/%3E%3Ctext x='60' y='68' font-family='Inter' font-size='8' font-weight='800' fill='%231e3a8a' text-anchor='middle' opacity='0.4'%3EISO%3C/text%3E%3Ctext x='60' y='76' font-family='Inter' font-size='6' font-weight='700' fill='%230f172a' text-anchor='middle' opacity='0.3'%3E27001%3C/text%3E%3C!-- HIPAA Medical Cross --%3E%3Cpath d='M220 50 L220 35 L235 35 L235 50 L250 50 L250 65 L235 65 L235 80 L220 80 L220 65 L205 65 L205 50 Z' fill='none' stroke='%23059669' stroke-width='2' opacity='0.3'/%3E%3Ctext x='227' y='95' font-family='Inter' font-size='7' font-weight='800' fill='%23059669' text-anchor='middle' opacity='0.35'%3EHIPAA%3C/text%3E%3C!-- GDPR Privacy Shield --%3E%3Cpath d='M140 170 L155 177 L155 198 Q155 212 140 220 Q125 212 125 198 L125 177 Z' fill='none' stroke='%23d97706' stroke-width='2' opacity='0.3'/%3E%3Cpath d='M135 195 L138 198 L145 190' stroke='%23d97706' stroke-width='2.5' fill='none' opacity='0.35'/%3E%3Ctext x='140' y='235' font-family='Inter' font-size='7' font-weight='800' fill='%23d97706' text-anchor='middle' opacity='0.35'%3EGDPR%3C/text%3E%3C!-- Audit Checklist --%3E%3Crect x='180' y='170' width='60' height='75' rx='2' fill='none' stroke='%23475569' stroke-width='1.5' opacity='0.25'/%3E%3Cpath d='M188 183 L225 183 M188 195 L230 195 M188 207 L220 207 M188 219 L230 219' stroke='%2394a3b8' stroke-width='1.2' opacity='0.2'/%3E%3Ccircle cx='184' cy='183' r='2' fill='%23d97706' opacity='0.3'/%3E%3Cpath d='M182 194 L184 197 L187 191' stroke='%23059669' stroke-width='1.5' fill='none' opacity='0.3'/%3E%3C!-- Magnifying Glass --%3E%3Ccircle cx='50' cy='200' r='12' fill='none' stroke='%230f172a' stroke-width='2' opacity='0.25'/%3E%3Cpath d='M59 209 L70 220' stroke='%230f172a' stroke-width='2.5' opacity='0.25'/%3E%3C!-- Lock --%3E%3Crect x='250' y='175' width='18' height='22' rx='2' fill='none' stroke='%231e3a8a' stroke-width='2' opacity='0.3'/%3E%3Cpath d='M253 175 L253 170 Q253 164 259 164 Q265 164 265 170 L265 175' fill='none' stroke='%231e3a8a' stroke-width='2' opacity='0.3'/%3E%3C!-- Clipboard --%3E%3Cpath d='M30 150 L30 145 L40 145 L40 150' fill='%23cbd5e1' opacity='0.2'/%3E%3Crect x='25' y='150' width='20' height='30' rx='1' fill='none' stroke='%23475569' stroke-width='1.5' opacity='0.25'/%3E%3C!-- Certificate --%3E%3Ccircle cx='260' cy='240' r='15' fill='none' stroke='%23d97706' stroke-width='1.5' opacity='0.3'/%3E%3Cpath d='M260 228 L264 235 L272 235 L266 240 L269 248 L260 243 L251 248 L254 240 L248 235 L256 235 Z' fill='none' stroke='%23d97706' stroke-width='1.5' opacity='0.35'/%3E%3C/pattern%3E%3C/defs%3E%3Crect width='300' height='300' fill='url(%23audit-icons)'/%3E%3C/svg%3E\")",
        'shield-pattern': "url(\"data:image/svg+xml,%3Csvg width='100' height='100' xmlns='http://www.w3.org/2000/svg'%3E%3Cdefs%3E%3Cpattern id='shields-multi' x='0' y='0' width='100' height='100' patternUnits='userSpaceOnUse'%3E%3C!-- ISO Shield --%3E%3Cpath d='M30 20 L40 25 L40 42 Q40 52 30 58 Q20 52 20 42 L20 25 Z' fill='none' stroke='%231e3a8a' stroke-width='1.5' opacity='0.25'/%3E%3Ctext x='30' y='42' font-family='Inter' font-size='6' font-weight='800' fill='%231e3a8a' text-anchor='middle' opacity='0.3'%3EISO%3C/text%3E%3C!-- GDPR Lock --%3E%3Crect x='63' y='25' width='12' height='15' rx='1' fill='none' stroke='%23d97706' stroke-width='1.5' opacity='0.25'/%3E%3Cpath d='M65 25 L65 21 Q65 17 69 17 Q73 17 73 21 L73 25' fill='none' stroke='%23d97706' stroke-width='1.5' opacity='0.25'/%3E%3C!-- HIPAA Cross --%3E%3Cpath d='M75 68 L75 60 L83 60 L83 68 L91 68 L91 76 L83 76 L83 84 L75 84 L75 76 L67 76 L67 68 Z' fill='none' stroke='%23059669' stroke-width='1.5' opacity='0.25'/%3E%3C!-- Checkmark --%3E%3Cpath d='M18 73 L22 77 L32 66' stroke='%23059669' stroke-width='2' fill='none' opacity='0.2'/%3E%3C/pattern%3E%3C/defs%3E%3Crect width='100' height='100' fill='url(%23shields-multi)'/%3E%3C/svg%3E\")",
        'checklist-pattern': "url(\"data:image/svg+xml,%3Csvg width='120' height='100' xmlns='http://www.w3.org/2000/svg'%3E%3Cdefs%3E%3Cpattern id='checklist-real' x='0' y='0' width='120' height='100' patternUnits='userSpaceOnUse'%3E%3Crect x='15' y='15' width='90' height='70' rx='2' fill='%23f8fafc' stroke='%23cbd5e1' stroke-width='1' opacity='0.5'/%3E%3Cpath d='M25 28 L75 28 M25 40 L80 40 M25 52 L70 52 M25 64 L80 64 M25 76 L75 76' stroke='%2394a3b8' stroke-width='1' opacity='0.3'/%3E%3Ccircle cx='20' cy='28' r='2.5' fill='%23d97706' opacity='0.4'/%3E%3Cpath d='M18 39 L20 42 L24 36' stroke='%23059669' stroke-width='1.5' fill='none' opacity='0.5'/%3E%3Ccircle cx='20' cy='52' r='2.5' fill='%23d97706' opacity='0.4'/%3E%3Ccircle cx='20' cy='64' r='2.5' fill='%23d97706' opacity='0.4'/%3E%3Cpath d='M18 75 L20 78 L24 72' stroke='%23059669' stroke-width='1.5' fill='none' opacity='0.5'/%3E%3C/pattern%3E%3C/defs%3E%3Crect width='120' height='100' fill='url(%23checklist-real)'/%3E%3C/svg%3E\")",
        'document-grid': "linear-gradient(rgba(226, 232, 240, 0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(226, 232, 240, 0.3) 1px, transparent 1px)",
        'corporate-gradient': 'linear-gradient(135deg, #0f172a 0%, #1e3a8a 100%)',
        'gold-gradient': 'linear-gradient(135deg, #d97706 0%, #f59e0b 100%)',
        'success-gradient': 'linear-gradient(135deg, #059669 0%, #10b981 100%)',
        'certified-pattern': "url(\"data:image/svg+xml,%3Csvg width='150' height='150' xmlns='http://www.w3.org/2000/svg'%3E%3Cdefs%3E%3Cpattern id='badges' x='0' y='0' width='150' height='150' patternUnits='userSpaceOnUse'%3E%3Ccircle cx='75' cy='75' r='35' fill='none' stroke='%231e3a8a' stroke-width='2' opacity='0.1'/%3E%3Ccircle cx='75' cy='75' r='30' fill='none' stroke='%23d97706' stroke-width='1.5' opacity='0.12' stroke-dasharray='3,3'/%3E%3Cpath d='M75 50 L82 60 L95 60 L86 68 L90 80 L75 72 L60 80 L64 68 L55 60 L68 60 Z' fill='none' stroke='%23d97706' stroke-width='1.5' opacity='0.15'/%3E%3Ctext x='75' y='78' font-family='Inter' font-size='8' font-weight='700' fill='%230f172a' text-anchor='middle' opacity='0.08'%3EAUDIT%3C/text%3E%3C/pattern%3E%3C/defs%3E%3Crect width='150' height='150' fill='url(%23badges)'/%3E%3C/svg%3E\")",
      },
      
      // Professional Background Sizes
      backgroundSize: {
        'pattern': '150px 150px',  // Smaller = more repetition across screen
        'shield': '100px 100px',
        'grid': '20px 20px',
        'certified': '150px 150px',
      },
      
      // Professional Letter Spacing
      letterSpacing: {
        'corporate': '0.02em',
        'display': '-0.03em',
      },
      
      // Professional Line Heights
      lineHeight: {
        'corporate': '1.6',
      },
      
      // Professional Z-index Scale
      zIndex: {
        'dropdown': '1000',
        'sticky': '1020',
        'fixed': '1030',
        'modal-backdrop': '1040',
        'modal': '1050',
        'popover': '1060',
        'tooltip': '1070',
      },
    },
  },
  plugins: [],
}