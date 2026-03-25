/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ['class'],
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: '#060B14',
        surface: '#0E1624',
        elevated: '#131D30',
        border: '#22314D',
        'text-primary': '#EAF2FF',
        'text-secondary': '#A8B8D8',
        'text-muted': '#7E8DA9',
        primary: '#2F7DFF',
        secondary: '#23C6D8',
        success: '#3CCB7F',
        warning: '#F0B94B',
        danger: '#EF5F77',
        ring: '#58A6FF'
      },
      borderRadius: {
        xl: '0.9rem',
        '2xl': '1.1rem'
      },
      boxShadow: {
        glow: '0 0 0 1px rgba(47,125,255,0.35), 0 0 24px rgba(35,198,216,0.18)',
        panel: '0 16px 36px rgba(2, 6, 14, 0.45)'
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        display: ['Sora', 'Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'ui-monospace', 'SFMono-Regular', 'monospace']
      }
    }
  },
  plugins: []
};
