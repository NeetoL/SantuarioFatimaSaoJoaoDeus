import { type Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { CardEvento } from '@/components/eventos/CardEvento';
import { CalendarioMissas } from '@/components/horarios/CalendarioMissas';
import { Devocoes } from '@/components/horarios/Devocoes';
import { HojeNoSantuario } from '@/components/horarios/HojeNoSantuario';
import { MissasMensais } from '@/components/horarios/MissasMensais';
import { TabelaDeHorarios } from '@/components/horarios/TabelaDeHorarios';
import { casosDeUso } from '@/config/container';
import { instanteDaRequisicao } from '@/lib/requisicao';

export const metadata: Metadata = {
  title: 'Horários',
  description:
    'Horários do Santuário Nossa Senhora de Fátima e São João de Deus, em Realengo (RJ): missas de domingo a sábado, missas votivas, confissões, terços, adoração ao Santíssimo, igreja aberta e secretaria.',
  alternates: { canonical: '/missas' },
};

export default async function PaginaMissas() {
  const agora = await instanteDaRequisicao(); // eventos e horários dependem da hora atual
  const [quadro, missasEspeciais] = await Promise.all([
    casosDeUso.horarios.obterQuadro(),
    casosDeUso.eventos.missasEspeciais(new Date(agora)),
  ]);

  return (
    <>
      {/* =====================================================
         ABERTURA
         ===================================================== */}
      <section id="topo" className="relative min-h-[58svh] flex items-end overflow-hidden img-fallback bg-navy-950">
        <Image
          src="/assets/img/sobre/celebracao-altar.jpg"
          alt=""
          aria-hidden="true"
          className="absolute inset-0 w-full h-full object-cover"
          fill
          sizes="100vw"
          preload
        />
        <div className="absolute inset-0 bg-navy-950/35"></div>
        <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-navy-950/80 to-transparent"></div>
        <div className="absolute inset-x-0 bottom-0 h-3/4 bg-gradient-to-t from-navy-950 via-navy-950/70 to-transparent"></div>
        <div className="relative w-full max-w-5xl mx-auto px-4 sm:px-6 pt-32 pb-24 sm:pb-28 text-center">
          <p className="eyebrow claro">Celebrações e atendimento</p>
          <h1 className="font-serif font-semibold text-white text-[3.2rem] sm:text-7xl leading-none mt-5 tracking-[-0.01em]">
            Horários do Santuário
          </h1>
          <div className="divisor mt-7" aria-hidden="true">
            <svg viewBox="0 0 12 20">
              <path d="M5 0h2v4h3v2H7v2h5v2H7v10H5V10H0V8h5V6H2V4h3z"></path>
            </svg>
          </div>
          <p className="mt-7 font-texto italic text-xl sm:text-2xl text-white/85 max-w-2xl mx-auto leading-relaxed">
            Missas, confissões, orações e atendimento da secretaria, semana a semana.
          </p>
          <nav aria-label="Nesta página" className="mt-9 flex flex-wrap justify-center gap-2">
            <a href="#calendario" className="btn btn-vidro btn-sm">
              Missas
            </a>{' '}
            <a href="#confissoes" className="btn btn-vidro btn-sm">
              Confissões e orações
            </a>{' '}
            <a href="#secretaria" className="btn btn-vidro btn-sm">
              Igreja e secretaria
            </a>
          </nav>
        </div>
      </section>
      {/* Hoje no Santuário: programação do dia, montada por src/mocks/horarios.ts */}
      <section id="hoje" className="relative z-10 bg-ivory-100" aria-label="Hoje no Santuário">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 -mt-14 sm:-mt-16">
          <div
            className="rounded-md bg-white ring-1 ring-ivory-200 shadow-2xl shadow-navy-950/25 overflow-hidden"
            data-hoje-santuario=""
          >
            <HojeNoSantuario variante="completo" quadro={quadro} agoraInicial={agora} />
          </div>
        </div>
      </section>
      {/* Calendário semanal (horários em src/mocks/horarios.ts) */}
      <section id="calendario" className="scroll-mt-20 pt-16 sm:pt-20 pb-20 sm:pb-24 bg-ivory-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <header className="text-center max-w-3xl mx-auto reveal">
            <p className="eyebrow">Calendário semanal</p>
            <h2 className="font-serif font-semibold text-4xl sm:text-5xl lg:text-6xl text-navy-900 mt-4 leading-[1.05]">
              Missas de domingo a sábado
            </h2>
            <div className="divisor mt-6" aria-hidden="true">
              <svg viewBox="0 0 12 20">
                <path d="M5 0h2v4h3v2H7v2h5v2H7v10H5V10H0V8h5V6H2V4h3z"></path>
              </svg>
            </div>
            <p className="mt-6 text-lg text-slate-600">
              Celebrações fixas do Santuário, todas as semanas. O dia de hoje aparece em destaque.
            </p>
          </header>
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
        </div>
      </section>
      {/* Missas de uma vez por mês: próxima data calculada sozinha */}
      <section id="mensais" className="scroll-mt-20 py-20 sm:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <header className="text-center max-w-3xl mx-auto reveal">
            <p className="eyebrow">Uma vez por mês</p>
            <h2 className="font-serif font-semibold text-4xl sm:text-5xl lg:text-6xl text-navy-900 mt-4 leading-[1.05]">
              Missas votivas
            </h2>
            <div className="divisor mt-6" aria-hidden="true">
              <svg viewBox="0 0 12 20">
                <path d="M5 0h2v4h3v2H7v2h5v2H7v10H5V10H0V8h5V6H2V4h3z"></path>
              </svg>
            </div>
            <p className="mt-6 text-lg text-slate-600">
              Na primeira sexta-feira (às 8h e às 19h) e no primeiro sábado (às 8h) de cada mês.
            </p>
          </header>
          <div className="mt-12 grid gap-6 lg:grid-cols-2 max-w-5xl mx-auto" data-proximas-mensais="">
            <MissasMensais mensais={quadro.missasMensais} agoraInicial={agora} />
          </div>
        </div>
      </section>
      {/* Confissões, terços e adoração (horários em src/mocks/horarios.ts) */}
      <section id="confissoes" className="scroll-mt-20 py-20 sm:py-24 bg-ivory-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <header className="text-center max-w-3xl mx-auto reveal">
            <p className="eyebrow">Sacramentos e devoções</p>
            <h2 className="font-serif font-semibold text-4xl sm:text-5xl lg:text-6xl text-navy-900 mt-4 leading-[1.05]">
              Confissões, terços e adoração
            </h2>
            <div className="divisor mt-6" aria-hidden="true">
              <svg viewBox="0 0 12 20">
                <path d="M5 0h2v4h3v2H7v2h5v2H7v10H5V10H0V8h5V6H2V4h3z"></path>
              </svg>
            </div>
            <p className="mt-6 text-lg text-slate-600">Momentos de reconciliação e de oração ao longo da semana.</p>
          </header>
          <div className="mt-12 grid gap-6 lg:grid-cols-3" data-devocoes="">
            <Devocoes quadro={quadro} agoraInicial={agora} />
          </div>
        </div>
      </section>
      {/* Igreja aberta e secretaria (horários em src/mocks/horarios.ts) */}
      <section id="secretaria" className="scroll-mt-20 py-20 sm:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <header className="text-center max-w-3xl mx-auto reveal">
            <p className="eyebrow">Funcionamento</p>
            <h2 className="font-serif font-semibold text-4xl sm:text-5xl lg:text-6xl text-navy-900 mt-4 leading-[1.05]">
              Igreja aberta e secretaria
            </h2>
            <div className="divisor mt-6" aria-hidden="true">
              <svg viewBox="0 0 12 20">
                <path d="M5 0h2v4h3v2H7v2h5v2H7v10H5V10H0V8h5V6H2V4h3z"></path>
              </svg>
            </div>
            <p className="mt-6 text-lg text-slate-600">
              A igreja fica aberta para visitas e oração pessoal. A secretaria atende pedidos de sacramentos, documentos
              e intenções de missa.
            </p>
          </header>
          <div className="mt-12 grid gap-6 lg:grid-cols-2 max-w-5xl mx-auto items-start">
            <article className="reveal rounded-md bg-ivory-50 ring-1 ring-ivory-200 p-7 sm:p-8">
              <span className="grid place-items-center w-12 h-12 rounded-full bg-navy-900 text-gold-300 ring-4 ring-gold-500/15">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path d="M12 2v4M10 4h4M5 21V11l7-5 7 5v10M3 21h18M10 21v-5a2 2 0 0 1 4 0v5"></path>
                </svg>
              </span>
              <p className="mt-5 font-caps text-[.875rem] font-semibold tracking-[.22em] text-gold-700">
                Visitas e oração pessoal
              </p>
              <h3 className="mt-1.5 font-serif font-semibold text-3xl text-navy-900 leading-tight">Igreja aberta</h3>
              <ul
                className="lista-horarios mt-5"
                data-tabela-horarios="igreja"
                aria-label="Horário da igreja, de domingo a sábado"
              >
                <TabelaDeHorarios horarios={quadro.igrejaAberta} agoraInicial={agora} />
              </ul>
            </article>
            <article className="reveal rounded-md bg-ivory-50 ring-1 ring-ivory-200 p-7 sm:p-8">
              <span className="grid place-items-center w-12 h-12 rounded-full bg-navy-900 text-gold-300 ring-4 ring-gold-500/15">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <circle cx="12" cy="12" r="9"></circle>
                  <path d="M12 7v5l3 2"></path>
                </svg>
              </span>
              <p className="mt-5 font-caps text-[.875rem] font-semibold tracking-[.22em] text-gold-700">Atendimento</p>
              <h3 className="mt-1.5 font-serif font-semibold text-3xl text-navy-900 leading-tight">
                Secretaria do Santuário
              </h3>
              <ul
                className="lista-horarios mt-5"
                data-tabela-horarios="secretaria"
                aria-label="Horário da secretaria, de domingo a sábado"
              >
                <TabelaDeHorarios
                  horarios={quadro.secretaria}
                  fechaNosFeriados={quadro.secretariaFechaNosFeriados}
                  agoraInicial={agora}
                />
              </ul>
              <div className="mt-6 rounded-sm border-l-2 border-wine-700 bg-white px-5 py-4">
                <p className="font-caps text-[.8rem] font-semibold tracking-[.2em] text-wine-700">Intenções de missa</p>
                <p className="mt-1.5 text-slate-700 leading-relaxed">
                  São recebidas <strong className="font-semibold text-navy-900">presencialmente na secretaria</strong>{' '}
                  do Santuário, nos horários acima.
                </p>
              </div>
              <div className="mt-5 flex flex-wrap gap-x-6 gap-y-2 text-base">
                <a
                  href="tel:+5521964322134"
                  className="inline-flex items-center gap-2 text-navy-800 hover:text-gold-700"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2"></path>
                  </svg>
                  (21) 96432-2134
                </a>{' '}
                <Link href="/contato" className="inline-flex items-center gap-2 text-navy-800 hover:text-gold-700">
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <rect x="3" y="5" width="18" height="14" rx="2"></rect>
                    <path d="M3 7l9 6 9-6"></path>
                  </svg>
                  Fale conosco
                </Link>
              </div>
            </article>
          </div>
        </div>
      </section>
      {/* Celebrações especiais: eventos da categoria Missa (src/mocks/eventos.ts) */}
      {missasEspeciais.length > 0 && (
        <section id="bloco-missas-especiais" className="py-20 sm:py-24 bg-ivory-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-5">
              <div>
                <p className="eyebrow">Agenda</p>
                <h2 className="font-serif font-semibold text-4xl sm:text-5xl lg:text-6xl text-navy-900 mt-3 leading-[1.05]">
                  Celebrações especiais
                </h2>
              </div>
              <Link
                href="/eventos"
                className="group inline-flex items-center gap-2 text-[.84rem] font-semibold uppercase tracking-[.16em] text-navy-800 hover:text-gold-700"
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
            </div>
            <div id="missas-especiais" className="mt-12 grid gap-x-7 gap-y-9 md:grid-cols-2 xl:grid-cols-3">
              {missasEspeciais.map((evento) => (
                <CardEvento key={evento.id} evento={evento} agoraInicial={agora} comDescricao />
              ))}
            </div>
          </div>
        </section>
      )}
      {/* Como chegar */}
      <section id="como-chegar" className="secao-escura text-white py-20 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-2 gap-14 items-center">
          <div className="reveal">
            <p className="eyebrow claro">Venha nos visitar</p>
            <h2 className="font-serif font-semibold text-4xl sm:text-5xl lg:text-6xl mt-4 leading-[1.05]">
              Como chegar
            </h2>
            <div className="divisor esquerda mt-6" aria-hidden="true">
              <svg viewBox="0 0 12 20">
                <path d="M5 0h2v4h3v2H7v2h5v2H7v10H5V10H0V8h5V6H2V4h3z"></path>
              </svg>
            </div>
            <p className="mt-7 font-texto text-xl leading-relaxed text-white/85">
              Estrada Manuel Nogueira de Sá, 1421
              <br />
              Realengo — Rio de Janeiro / RJ
            </p>
            <div className="mt-9 flex flex-col sm:flex-row gap-3">
              <a
                href="https://www.google.com/maps/search/?api=1&amp;query=-22.892126,-43.417065"
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-ouro"
              >
                <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M12 21s-7-6.2-7-11.5A7 7 0 0 1 19 9.5C19 14.8 12 21 12 21z"></path>
                  <circle cx="12" cy="9.5" r="2.5"></circle>
                </svg>
                Abrir no mapa
              </a>{' '}
              <Link href="/contato" className="btn btn-vidro">
                <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
                  <rect x="3" y="5" width="18" height="14" rx="2"></rect>
                  <path d="M3 7l9 6 9-6"></path>
                </svg>
                Fale conosco
              </Link>
            </div>
          </div>
          <div className="reveal pr-4 sm:pr-5 pb-4">
            <div className="moldura">
              <div className="bg-navy-900 aspect-[4/3]">
                <iframe
                  src="https://maps.google.com/maps?q=-22.892126,-43.417065&amp;hl=pt-BR&amp;z=17&amp;output=embed"
                  title="Mapa: localização do Santuário em Realengo"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="w-full h-full border-0"
                ></iframe>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
