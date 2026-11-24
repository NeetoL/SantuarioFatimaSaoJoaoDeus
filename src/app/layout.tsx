import './globals.css';

import { type Metadata, type Viewport } from 'next';
import { headers } from 'next/headers';
import { AnimacaoAoRolar } from '@/components/layout/AnimacaoAoRolar';
import { Avisos } from '@/components/layout/Avisos';
import { BarraDeAtalhos } from '@/components/layout/BarraDeAtalhos';
import { TelaDeCarregamento } from '@/components/inicio/TelaDeCarregamento';
import { Cabecalho } from '@/components/layout/Cabecalho';
import { Rodape } from '@/components/layout/Rodape';
import { SomenteNoSite } from '@/components/layout/SomenteNoSite';
import { VoltarAoTopo } from '@/components/layout/VoltarAoTopo';
import { urlDoSite } from '@/config/ambiente';
import { casosDeUso } from '@/config/container';
import { linkDoMapa, logoDoSite } from '@/modules/Institucional/Domain/institucional';
import { classesDasFontes } from './fontes';

const NOME = 'Santuário Nossa Senhora de Fátima e São João de Deus';

export const metadata: Metadata = {
  metadataBase: new URL(urlDoSite()),
  title: { default: NOME, template: `%s — ${NOME}` },
  description:
    'Santuário Arquidiocesano Nossa Senhora de Fátima e São João de Deus, em Realengo (RJ) — horários de missa, programação, notícias, comunicados e doações.',
  applicationName: NOME,
  icons: {
    icon: [
      { url: '/assets/img/favicon-32.png', sizes: '32x32', type: 'image/png' },
      { url: '/assets/img/favicon-512.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: '/assets/img/apple-touch-icon.png',
  },
  openGraph: {
    type: 'website',
    locale: 'pt_BR',
    siteName: NOME,
    images: [{ url: '/assets/img/hero-poster.jpg', alt: 'Santuário Nossa Senhora de Fátima e São João de Deus' }],
  },
  formatDetection: { telephone: false },
};

export const viewport: Viewport = {
  themeColor: '#0f2a4f',
  width: 'device-width',
  initialScale: 1,
};

/**
 * Roda antes de desenhar a página:
 * 1. aplica o tamanho de letra escolhido (botão A+), sem "pulo";
 * 2. na página inicial, mostra a tela de carregamento até o vídeo tocar (no máximo 10 s).
 */
const SCRIPT_INICIAL =
  "try{var f=+localStorage.getItem('fonte');if(f>0&&f<3)document.documentElement.classList.add('fonte-'+f)}catch(e){}" +
  "if(location.pathname==='/'){document.documentElement.classList.add('carregando');" +
  "setTimeout(function(){document.documentElement.classList.remove('carregando')},10000)}";

export default async function LayoutRaiz({ children }: { children: React.ReactNode }) {
  const nonce = (await headers()).get('x-nonce') ?? undefined;
  const [institucional, secretaria] = await Promise.all([
    casosDeUso.institucional.obter(),
    casosDeUso.horarios.resumoDaSecretaria(),
  ]);
  const telefone = institucional.telefone.internacional;

  return (
    <html lang="pt-BR" className={`scroll-smooth ${classesDasFontes}`} suppressHydrationWarning>
      <head>
        <script nonce={nonce} dangerouslySetInnerHTML={{ __html: SCRIPT_INICIAL }} />
      </head>
      <body className="bg-white text-slate-700 antialiased">
        <SomenteNoSite>
          <TelaDeCarregamento logo={logoDoSite(institucional)} />
        </SomenteNoSite>
        <a
          href="#conteudo"
          className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[100] focus:bg-gold-500 focus:text-navy-950 focus:px-4 focus:py-2 focus:rounded-md font-semibold"
        >
          Pular para o conteúdo
        </a>
        <Avisos>
          <SomenteNoSite>
            <Cabecalho telefone={telefone} mapa={linkDoMapa(institucional)} logo={logoDoSite(institucional)} />
          </SomenteNoSite>
          <main id="conteudo">{children}</main>
          <SomenteNoSite>
            <Rodape institucional={institucional} secretaria={secretaria} />
            <BarraDeAtalhos telefone={telefone} />
            <VoltarAoTopo />
          </SomenteNoSite>
          <AnimacaoAoRolar />
        </Avisos>
      </body>
    </html>
  );
}
