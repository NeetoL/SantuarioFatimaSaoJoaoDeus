/* Configuração do Tailwind (CDN): identidade visual do Santuário
   Cores tiradas do brasão (azul, ouro, vinho) + marfim como "papel". */
tailwind.config = {
  theme: {
    extend: {
      colors: {
        navy:  { 950: '#081a33', 900: '#0f2a4f', 800: '#163a6b', 700: '#1f4c8a', 100: '#e6edf7', 50: '#f3f6fb' },
        gold:  { 700: '#8a6a18', 600: '#a8801f', 500: '#c9a227', 400: '#d9b95a', 300: '#e6cf8f', 200: '#f0e2b6', 50: '#fbf7ea' },
        wine:  { 900: '#3f1316', 800: '#561a1e', 700: '#6b1f24' },
        ivory: { 50: '#fdfbf6', 100: '#f8f3e9', 200: '#ece3d0', 300: '#ddd0b5' },
        ink:   '#23262f',
      },
      fontFamily: {
        serif: ['"Cormorant Garamond"', 'Georgia', 'serif'],   // títulos
        caps:  ['Cinzel', 'Georgia', 'serif'],                  // rótulos e datas (estilo inscrição)
        texto: ['"EB Garamond"', 'Georgia', 'serif'],           // textos longos (página Sobre)
        sans:  ['Inter', 'system-ui', 'sans-serif'],            // menus, botões e textos curtos
      },
    },
  },
};
