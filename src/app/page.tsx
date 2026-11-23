import { type Metadata } from 'next';
import Link from 'next/link';
import { ItemRecado } from '@/components/comunicados/ItemRecado';
import { CardNoticia } from '@/components/comunicados/CardNoticia';
import { AvisoNoTopo } from '@/components/eventos/AvisoNoTopo';
import { CardEvento } from '@/components/eventos/CardEvento';
import { CardEventoDestaque } from '@/components/eventos/CardEventoDestaque';
import { CalendarioMissas } from '@/components/horarios/CalendarioMissas';
import { HojeNoSantuario } from '@/components/horarios/HojeNoSantuario';
import { VideoDeFundo } from '@/components/inicio/VideoDeFundo';
import { casosDeUso } from '@/config/container';
import { instanteDaRequisicao } from '@/lib/requisicao';

export const metadata: Metadata = {
  title: { absolute: 'Santuário Nossa Senhora de Fátima e São João de Deus' },
  description:
    'Santuário Arquidiocesano Nossa Senhora de Fátima e São João de Deus, em Realengo (RJ) — horários de missa, programação, notícias, comunicados e doações.',
  alternates: { canonical: '/' },
};

export default async function PaginaInicial() {
  const agora = await instanteDaRequisicao(); // eventos e horários dependem da hora atual
  const [resumo, quadro, noticias, recados] = await Promise.all([
    casosDeUso.eventos.resumoDaPaginaInicial(new Date(agora)),
    casosDeUso.horarios.obterQuadro(),
    casosDeUso.comunicados.ultimasNoticias(2),
    casosDeUso.comunicados.listarRecados(3),
  ]);
  // Sem eventos, a seta do vídeo pula direto para os horários
  const ancoraDosAvisos = resumo ? '#avisos' : '#horarios';

  return (
    <>
      {/* =====================================================
         2. HERO
         ===================================================== */}
      <section id="inicio" className="relative min-h-[100svh] flex items-end overflow-hidden img-fallback">
        {/* Vídeo de fundo hospedado no próprio site (sem som, em loop).
           Tela deitada (PC, tablet deitado) recebe a versão 16:9; celular em pé recebe a versão vertical.
           O "poster" aparece enquanto o vídeo carrega ou se o aparelho bloquear o vídeo. */}
        <VideoDeFundo />
        {/* Sombras leves só no topo (menu) e embaixo (texto): o meio do vídeo fica limpo */}
        <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-navy-950/75 to-transparent"></div>
        <div className="absolute inset-x-0 bottom-0 h-3/4 sm:h-3/5 bg-gradient-to-t from-navy-950 via-navy-950/60 sm:via-navy-950/45 to-transparent"></div>
        {/* Pouco texto, embaixo, para o vídeo aparecer */}
        <div className="relative w-full max-w-5xl mx-auto px-4 sm:px-6 text-center pb-[104px] sm:pb-28">
          {/* Aviso do próximo evento (aparece sozinho quando há evento nos próximos 7 dias — veja os eventos em src/mocks/eventos.ts) */}
          {resumo && <AvisoNoTopo evento={resumo.maisProximo} agoraInicial={agora} />}
          <h1 className="font-serif font-semibold text-[2.75rem] sm:text-6xl lg:text-7xl text-white leading-[1.02] tracking-[-0.01em] drop-shadow-[0_2px_18px_rgba(0,0,0,.55)]">
            Bem-vindo à Casa da <span className="italic font-medium text-gold-400">Mãe de Deus</span>
          </h1>
          <div className="divisor mt-6" aria-hidden="true">
            <svg viewBox="0 0 12 20">
              <path d="M5 0h2v4h3v2H7v2h5v2H7v10H5V10H0V8h5V6H2V4h3z"></path>
            </svg>
          </div>
          <div className="mt-7 flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
            <a href="#horarios" className="btn btn-ouro">
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <circle cx="12" cy="12" r="9"></circle>
                <path d="M12 7v5l3 2"></path>
              </svg>{' '}
              Horários de Missa
            </a>{' '}
            <Link href="/doacoes" className="btn btn-vidro">
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path d="M12 21s-7-4.4-9.5-9A5.5 5.5 0 0 1 12 6a5.5 5.5 0 0 1 9.5 6c-2.5 4.6-9.5 9-9.5 9z"></path>
              </svg>{' '}
              Faça sua Doação
            </Link>
          </div>
        </div>
        {/* Indicador de rolagem */}
        <a
          href={ancoraDosAvisos}
          className="hidden lg:block absolute bottom-6 left-1/2 -translate-x-1/2 text-white/80 hover:text-gold-400 animate-bounce"
          aria-label="Rolar para a próxima seção"
        >
          <svg
            className="w-7 h-7"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path d="M6 9l6 6 6-6"></path>
          </svg>
        </a>
      </section>
      {/* =====================================================
         AVISOS — "ACONTECE NO SANTUÁRIO"
         Os cards são montados sozinhos a partir da lista de eventos (src/mocks/eventos.ts).
         Sem eventos futuros, a seção some.
         ===================================================== */}
      {resumo && (
        <section
          id="avisos"
          className="relative scroll-mt-20 pt-14 pb-20 sm:pt-16 sm:pb-28 bg-navy-950 overflow-hidden"
        >
          {/* brilho suave dourado atrás dos cards */}
          <div
            className="pointer-events-none absolute inset-x-0 top-1/3 h-[28rem] bg-[radial-gradient(ellipse_at_center,rgba(201,162,39,.10),transparent_65%)]"
            aria-hidden="true"
          ></div>
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <header className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-5">
              <div>
                <p className="eyebrow claro">Avisos da comunidade</p>
                <h2 className="font-serif font-semibold text-4xl sm:text-5xl lg:text-6xl text-white mt-3 leading-[1.05]">
                  Acontece no Santuário
                </h2>
              </div>
              <Link
                href="/eventos"
                className="group inline-flex items-center gap-2 text-[.84rem] font-semibold uppercase tracking-[.16em] text-gold-300 hover:text-gold-200"
              >
                Ver todos os eventos{' '}
                <svg
                  className="w-4 h-4 group-hover:translate-x-0.5 transition-transform"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path d="M5 12h14M13 6l6 6-6 6"></path>
                </svg>
              </Link>
            </header>
            <div id="aviso-destaque" className="mt-10">
              <CardEventoDestaque evento={resumo.destaque} agoraInicial={agora} />
            </div>
            <div id="avisos-proximos" className="mt-10 grid gap-x-7 gap-y-9 md:grid-cols-3">
              {resumo.seguintes.map((evento) => (
                <CardEvento key={evento.id} evento={evento} agoraInicial={agora} />
              ))}
            </div>
            <div className="mt-14 text-center">
              <Link href="/eventos" className="btn btn-ouro">
                Ver todos os eventos{' '}
                <span
                  className="inline-grid place-items-center min-w-[1.6rem] h-[1.6rem] px-1.5 rounded-full bg-navy-950 text-gold-300 text-[.875rem] tracking-normal"
                  data-total-eventos=""
                  aria-label="eventos agendados"
                >
                  {resumo.total}
                </span>
              </Link>
            </div>
          </div>
        </section>
      )}
      {/* =====================================================
         3. HORÁRIOS DE MISSA
         (a agenda completa de eventos fica na página /eventos)
         ===================================================== */}
      <section id="horarios" className="scroll-mt-20 py-20 sm:py-28 bg-ivory-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <header className="text-center max-w-2xl mx-auto reveal">
            <p className="eyebrow">Calendário semanal</p>
            <h2 className="font-serif font-semibold text-4xl sm:text-5xl lg:text-6xl text-navy-900 mt-4 leading-[1.05]">
              Horários de Missa
            </h2>
            <div className="divisor mt-6" aria-hidden="true">
              <svg viewBox="0 0 12 20">
                <path d="M5 0h2v4h3v2H7v2h5v2H7v10H5V10H0V8h5V6H2V4h3z"></path>
              </svg>
            </div>
            <p className="mt-6 text-lg text-slate-600">Celebrações fixas do Santuário, todas as semanas.</p>
          </header>
          {/* CALENDÁRIO DE MISSAS — montado por src/mocks/horarios.ts (é lá que se mudam os horários).
             O dia de hoje ganha destaque sozinho. */}
          <div className="mt-12 rounded-md secao-escura text-white ring-1 ring-gold-500/20 shadow-2xl shadow-navy-950/25 p-3 sm:p-5 reveal">
            <CalendarioMissas dias={quadro.missasDaSemana} agoraInicial={agora} />
            <div className="flex flex-wrap justify-center gap-x-7 gap-y-2 px-3 pt-5 pb-1 text-sm text-white/80">
              <span className="inline-flex items-center gap-2">
                <span className="w-3 h-3 rounded-sm bg-gold-500"></span>Hoje
              </span>{' '}
              <span className="inline-flex items-center gap-2">
                <span className="mensal !mb-0">1º</span>Uma vez por mês
              </span>{' '}
              <span className="inline-flex items-center gap-2">
                <span className="w-3 h-3 rounded-sm dia-fechado-amostra"></span>Igreja fechada
              </span>
            </div>
          </div>
          {/* Hoje no Santuário: missas, confissões e terços do dia (src/mocks/horarios.ts) */}
          <div className="mt-6 reveal" data-hoje-santuario="compacto">
            <HojeNoSantuario variante="compacto" quadro={quadro} agoraInicial={agora} />
          </div>
          <div className="mt-10 text-center">
            <Link href="/missas" className="btn btn-escuro">
              Todos os horários
            </Link>
          </div>
        </div>
      </section>
      {/* =====================================================
         4. NOTÍCIAS E COMUNICADOS — notícias, recados e galeria
         ===================================================== */}
      <section id="noticias" className="scroll-mt-20 py-20 sm:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <header className="text-center max-w-2xl mx-auto reveal">
            <p className="eyebrow">Mural do Santuário</p>
            <h2 className="font-serif font-semibold text-4xl sm:text-5xl lg:text-6xl text-navy-900 mt-4 leading-[1.05]">
              Notícias e Comunicados
            </h2>
            <div className="divisor mt-6" aria-hidden="true">
              <svg viewBox="0 0 12 20">
                <path d="M5 0h2v4h3v2H7v2h5v2H7v10H5V10H0V8h5V6H2V4h3z"></path>
              </svg>
            </div>
            <p className="mt-6 text-lg text-slate-600">
              O que o Santuário tem a anunciar: notícias, comunicados e recados para toda a comunidade.
            </p>
          </header>
          <div className="mt-14 grid lg:grid-cols-3 gap-8 items-start">
            {/* Últimas notícias (conteúdo em src/mocks/comunicados.ts) */}
            <div id="noticias-resumo" className="lg:col-span-2 grid sm:grid-cols-2 gap-7">
              {noticias.length ? (
                noticias.map((noticia) => <CardNoticia key={noticia.id} noticia={noticia} />)
              ) : (
                <p className="sm:col-span-2 text-slate-600">Nenhuma notícia publicada no momento.</p>
              )}
            </div>
            {/* Recados paroquiais (os 3 primeiros) */}
            <aside
              className="reveal relative rounded-md bg-ivory-100 ring-1 ring-ivory-200 p-7 sm:p-8"
              aria-labelledby="recados-titulo"
            >
              <span
                className="absolute -top-3 left-1/2 -translate-x-1/2 w-6 h-6 rounded-full bg-wine-700 ring-4 ring-white shadow"
                aria-hidden="true"
              ></span>
              <h3 id="recados-titulo" className="font-serif font-semibold text-3xl text-navy-900">
                Recados Paroquiais
              </h3>
              <div className="divisor esquerda mt-4" aria-hidden="true">
                <svg viewBox="0 0 12 20">
                  <path d="M5 0h2v4h3v2H7v2h5v2H7v10H5V10H0V8h5V6H2V4h3z"></path>
                </svg>
              </div>
              <ul id="recados-resumo" className="mt-6 space-y-6">
                {recados.map((recado) => (
                  <ItemRecado key={recado.id} recado={recado} />
                ))}
              </ul>
              <Link
                href="/noticias#recados"
                className="group mt-7 inline-flex items-center gap-2 text-[.875rem] font-semibold uppercase tracking-[.16em] text-navy-800 hover:text-gold-700"
              >
                Todos os recados{' '}
                <svg
                  className="w-4 h-4 group-hover:translate-x-0.5 transition-transform"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path d="M5 12h14M13 6l6 6-6 6"></path>
                </svg>
              </Link>
            </aside>
          </div>
          <div className="mt-14 text-center">
            <Link href="/noticias" className="btn btn-escuro">
              Ver todas as notícias
            </Link>
          </div>
        </div>
      </section>
      {/* =====================================================
         5. DOAÇÕES — chamada (a página completa é /doacoes)
         ===================================================== */}
      <section id="doacoes" className="relative py-20 sm:py-28 secao-escura text-white overflow-hidden">
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center reveal">
          <p className="eyebrow claro">Ofertório e Contribuições</p>
          <h2 className="font-serif font-semibold text-4xl sm:text-5xl lg:text-6xl text-white mt-4 leading-[1.05]">
            Sua generosidade sustenta esta casa
          </h2>
          <div className="divisor mt-6" aria-hidden="true">
            <svg viewBox="0 0 12 20">
              <path d="M5 0h2v4h3v2H7v2h5v2H7v10H5V10H0V8h5V6H2V4h3z"></path>
            </svg>
          </div>
          <p className="mt-6 citacao text-2xl sm:text-[1.7rem] text-white/85 leading-snug">
            “Cada um dê conforme decidiu em seu coração, não com tristeza nem por obrigação, pois Deus ama quem dá com
            alegria.” (2Cor 9,7)
          </p>
          <div className="mt-10 flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/doacoes" className="btn btn-ouro">
              <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M12 21s-7-4.4-9.5-9A5.5 5.5 0 0 1 12 6a5.5 5.5 0 0 1 9.5 6c-2.5 4.6-9.5 9-9.5 9z"></path>
              </svg>{' '}
              Faça sua doação
            </Link>{' '}
            <Link href="/doacoes#dizimo" className="btn btn-vidro">
              Seja dizimista
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
