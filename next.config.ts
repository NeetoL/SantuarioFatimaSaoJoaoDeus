import type { NextConfig } from 'next';

/**
 * Cabeçalhos de segurança aplicados a todas as respostas.
 * A Content-Security-Policy (com nonce por requisição) fica em `src/proxy.ts`.
 */
const cabecalhosDeSeguranca = [
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'X-Frame-Options', value: 'DENY' },
  {
    key: 'Permissions-Policy',
    value: 'camera=(), microphone=(), geolocation=(), payment=(), usb=(), browsing-topics=()',
  },
  { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains' },
  { key: 'Cross-Origin-Opener-Policy', value: 'same-origin' },
];

/** Endereços do site antigo (arquivos .html) que continuam funcionando. */
const PAGINAS_ANTIGAS = ['sobre', 'eventos', 'missas', 'noticias', 'contato', 'doacoes'] as const;

const nextConfig: NextConfig = {
  poweredByHeader: false,
  reactStrictMode: true,
  images: {
    qualities: [75, 85],
    formats: ['image/avif', 'image/webp'],
  },
  async headers() {
    return [
      { source: '/:path*', headers: cabecalhosDeSeguranca },
      {
        // Fotos e vídeos do Santuário: o navegador confere se mudaram (troca de arquivo aparece logo)
        source: '/assets/:tipo(img|video)/:arquivo*',
        headers: [{ key: 'Cache-Control', value: 'public, max-age=0, must-revalidate' }],
      },
    ];
  },
  async redirects() {
    return [
      { source: '/index.html', destination: '/', permanent: true },
      ...PAGINAS_ANTIGAS.map((pagina) => ({
        source: `/${pagina}.html`,
        destination: `/${pagina}`,
        permanent: true,
      })),
    ];
  },
};

export default nextConfig;
