export default {
  content: ['./index.html', './src/**/*.{vue,js}'],
  theme: {
    extend: {
      colors: {
        bg: '#0f0f0f', surface: '#171717', 'surface-2': '#1a1a1a', border: '#2a2a2a',
        red: { DEFAULT: '#c0281e', light: '#e8503a' }, ochre: '#d4850a',
        text: { DEFAULT: '#f0f0f0', muted: '#888888', disabled: '#444444' },
      },
    },
  },
  plugins: [],
}

