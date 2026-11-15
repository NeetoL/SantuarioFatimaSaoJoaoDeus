/* Configuração do Tailwind (CDN): paleta sacra e fontes do Santuário */
tailwind.config = {
  theme: {
    extend: {
      colors: {
        navy:  { 950: '#081a33', 900: '#0f2a4f', 800: '#163a6b', 700: '#1f4c8a', 100: '#e6edf7', 50: '#f3f6fb' },
        gold:  { 600: '#a8801f', 500: '#c9a227', 400: '#d9b95a', 200: '#f0e2b6', 50: '#fbf7ea' },
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
        sans:  ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
};
