import { type NextRequest, NextResponse } from 'next/server';

/**
 * Content-Security-Policy com nonce único por requisição.
 * Só scripts do próprio site (com o nonce) rodam; mapas do Google podem aparecer em iframe;
 * vídeos, fotos e fontes vêm do próprio site.
 */
function montarPolitica(nonce: string): string {
  const dev = process.env.NODE_ENV === 'development';
  // Barra de comentários da Vercel nas versões de pré-visualização (preview)
  const preview = process.env.VERCEL_ENV === 'preview';
  const vercelLive = preview ? ' https://vercel.live' : '';

  const diretivas = [
    `default-src 'self'`,
    `script-src 'self' 'nonce-${nonce}' 'strict-dynamic'${dev ? ` 'unsafe-eval'` : ''}${vercelLive}`,
    // Estilos inline são necessários para o posicionamento das imagens otimizadas (next/image)
    `style-src 'self' 'unsafe-inline'${vercelLive}`,
    `img-src 'self' blob: data:${preview ? ' https://vercel.live https://vercel.com' : ''}`,
    `font-src 'self'${preview ? ' https://vercel.live https://assets.vercel.com' : ''}`,
    `media-src 'self'`,
    `connect-src 'self'${preview ? ' https://vercel.live wss://ws-us3.pusher.com' : ''}`,
    `frame-src https://www.google.com https://maps.google.com${vercelLive}`,
    `object-src 'none'`,
    `base-uri 'self'`,
    `form-action 'self'`,
    `frame-ancestors 'none'`,
    ...(dev ? [] : ['upgrade-insecure-requests']),
  ];
  return diretivas.join('; ');
}

export function proxy(request: NextRequest) {
  const nonce = Buffer.from(crypto.randomUUID()).toString('base64');
  const politica = montarPolitica(nonce);

  const cabecalhos = new Headers(request.headers);
  cabecalhos.set('x-nonce', nonce);
  cabecalhos.set('Content-Security-Policy', politica);

  const resposta = NextResponse.next({ request: { headers: cabecalhos } });
  resposta.headers.set('Content-Security-Policy', politica);
  return resposta;
}

export const config = {
  matcher: [
    {
      // Páginas apenas (API, arquivos do Next, fotos, vídeos e ícones ficam de fora)
      source: '/((?!api|_next/static|_next/image|assets|favicon.ico|robots.txt|sitemap.xml).*)',
      missing: [
        { type: 'header', key: 'next-router-prefetch' },
        { type: 'header', key: 'purpose', value: 'prefetch' },
      ],
    },
  ],
};
