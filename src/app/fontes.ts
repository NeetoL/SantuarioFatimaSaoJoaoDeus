import { Cinzel, Cormorant_Garamond, EB_Garamond, Inter } from 'next/font/google';

/**
 * As mesmas fontes do site, agora servidas pelo próprio site (sem pedir ao Google a cada visita):
 * mais rápido, sem rastreamento de terceiros e compatível com a política de segurança (CSP).
 */
export const fonteRotulos = Cinzel({
  subsets: ['latin'],
  weight: ['500', '600'],
  variable: '--fonte-rotulos',
  display: 'swap',
});

export const fonteTitulos = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['500', '600', '700'],
  style: ['normal', 'italic'],
  variable: '--fonte-titulos',
  display: 'swap',
});

export const fonteTexto = EB_Garamond({
  subsets: ['latin'],
  weight: ['400', '500'],
  style: ['normal', 'italic'],
  variable: '--fonte-texto',
  display: 'swap',
});

export const fonteInterface = Inter({ subsets: ['latin'], variable: '--fonte-interface', display: 'swap' });

export const classesDasFontes = [fonteRotulos, fonteTitulos, fonteTexto, fonteInterface]
  .map((f) => f.variable)
  .join(' ');
