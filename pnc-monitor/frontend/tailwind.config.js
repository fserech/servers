/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      fontFamily: {
        mono: ['"Share Tech Mono"', '"Fira Code"', 'monospace'],
        rajdhani: ['Rajdhani', 'sans-serif'],
        orbitron: ['Orbitron', 'monospace'],
      },
      colors: {
        cyber: {
          bg: '#060810',
          card: 'rgba(255,255,255,0.025)',
          border: 'rgba(255,255,255,0.07)',
          blue: '#00d4ff',
          green: '#00ff88',
          red: '#ff3535',
          amber: '#f59e0b',
          purple: '#a78bfa',
        }
      },
      animation: {
        'pulse-dot': 'pulseDot 2s ease-in-out infinite',
        'blink': 'blink 1s step-end infinite',
        'scan': 'scan 7s linear infinite',
        'fade-up': 'fadeUp 0.3s ease both',
        'slide-right': 'slideRight 0.3s ease both',
        'toast-in': 'toastIn 0.28s ease',
        'net-pulse': 'netPulse 2.2s ease-out infinite',
      },
      keyframes: {
        pulseDot: { '0%,100%': {opacity: '1'}, '50%': {opacity: '0.2'} },
        blink: { '0%,100%': {opacity: '1'}, '50%': {opacity: '0'} },
        scan: { '0%': {top: '-3%'}, '100%': {top: '103%'} },
        fadeUp: { 'from': {transform: 'translateY(14px)', opacity: '0'}, 'to': {transform: 'translateY(0)', opacity: '1'} },
        slideRight: { 'from': {transform: 'translateX(-18px)', opacity: '0'}, 'to': {transform: 'translateX(0)', opacity: '1'} },
        toastIn: { 'from': {transform: 'translateX(110%)', opacity: '0'}, 'to': {transform: 'translateX(0)', opacity: '1'} },
        netPulse: { '0%': {r: '4', opacity: '0.9'}, '100%': {r: '20', opacity: '0'} },
      }
    },
  },
  plugins: [],
}
