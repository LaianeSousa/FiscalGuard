module.exports = {
  content: ['./index.html', './src/**/*.{ts,tsx,js,jsx}'],
  theme: {
    extend: {
      colors: {
        dark: {
          bg: '#0B0B0F',
          card: '#12121A',
          border: '#6b21a8',
        },
        accent: {
          purple: '#8B5CF6',
          green: '#10B981',
        }
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite'
      }
    }
  },
  plugins: []
}

