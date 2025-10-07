/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        aurora: {
          night: {
            deep: '#0a0e27',
            dark: '#141b3b',
            mid: '#1e2a4a',
          },
          cyan: {
            light: '#67e8f9',
            DEFAULT: '#06b6d4',
            dark: '#0891b2',
          },
          violet: {
            light: '#c4b5fd',
            DEFAULT: '#8b5cf6',
            dark: '#7c3aed',
          },
          rose: {
            light: '#fda4af',
            DEFAULT: '#f43f5e',
            dark: '#e11d48',
          },
          amber: {
            light: '#fcd34d',
            DEFAULT: '#f59e0b',
            dark: '#d97706',
          }
        }
      },
      backgroundImage: {
        'aurora-night': 'linear-gradient(135deg, #0a0e27 0%, #1e2a4a 50%, #0f172a 100%)',
        'aurora-gradient': 'linear-gradient(135deg, rgba(139, 92, 246, 0.3) 0%, rgba(6, 182, 212, 0.3) 50%, rgba(244, 63, 94, 0.2) 100%)',
        'glass-gradient': 'linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%)',
        'neon-border': 'linear-gradient(90deg, #8b5cf6, #06b6d4, #f43f5e, #f59e0b)',
      },
      backdropBlur: {
        '3xl': '40px',
        '4xl': '60px',
      },
      boxShadow: {
        'glass': '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
        'glass-lg': '0 20px 60px 0 rgba(31, 38, 135, 0.5)',
        'neon-violet': '0 0 20px rgba(139, 92, 246, 0.5), 0 0 40px rgba(139, 92, 246, 0.3)',
        'neon-cyan': '0 0 20px rgba(6, 182, 212, 0.5), 0 0 40px rgba(6, 182, 212, 0.3)',
        'neon-rose': '0 0 20px rgba(244, 63, 94, 0.5), 0 0 40px rgba(244, 63, 94, 0.3)',
        'neon-amber': '0 0 20px rgba(245, 158, 11, 0.5), 0 0 40px rgba(245, 158, 11, 0.3)',
      },
      animation: {
        'aurora': 'aurora 20s ease-in-out infinite',
        'float': 'float 6s ease-in-out infinite',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'shimmer': 'shimmer 2s linear infinite',
        'border-flow': 'border-flow 3s linear infinite',
      },
      keyframes: {
        aurora: {
          '0%, 100%': { 
            backgroundPosition: '0% 50%',
            backgroundSize: '200% 200%'
          },
          '50%': { 
            backgroundPosition: '100% 50%',
            backgroundSize: '200% 200%'
          },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        'border-flow': {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        }
      }
    },
  },
  plugins: [],
}