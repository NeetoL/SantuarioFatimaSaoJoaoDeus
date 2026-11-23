import { type Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { AgendaEventos } from '@/components/eventos/AgendaEventos';
import { CardEventoDestaque } from '@/components/eventos/CardEventoDestaque';
import { casosDeUso } from '@/config/container';
import { instanteDaRequisicao } from '@/lib/requisicao';

export const metadata: Metadata = {
  title: 'Eventos',
  description:
    'Agenda de eventos do Santuário Arquidiocesano Nossa Senhora de Fátima e São João de Deus, em Realengo (RJ): missas especiais, novenas, festas e avisos da comunidade.',
  alternates: { canonical: '/eventos' },
};

export default async function PaginaEventos() {
  const agora = await instanteDaRequisicao(); // eventos e horários dependem da hora atual
  const agenda = await casosDeUso.eventos.agendaCompleta(new Date(agora));

  return (
    <>
      {/* =====================================================
         ABERTURA
         ===================================================== */}
      <section id="topo" className="relative min-h-[58svh] flex items-end overflow-hidden img-fallback bg-navy-950">
        <Image
          src="/assets/img/sobre/fogos-torre.jpg"
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
        <div className="relative w-full max-w-5xl mx-auto px-4 sm:px-6 pt-32 pb-16 sm:pb-20 text-center">
          <p className="eyebrow claro">Agenda do Santuário</p>
          <h1 className="font-serif font-semibold text-white text-[3.2rem] sm:text-7xl leading-none mt-5 tracking-[-0.01em]">
            Eventos e Celebrações
          </h1>
          <div className="divisor mt-7" aria-hidden="true">
            <svg viewBox="0 0 12 20">
              <path d="M5 0h2v4h3v2H7v2h5v2H7v10H5V10H0V8h5V6H2V4h3z"></path>
            </svg>
          </div>
          <p className="mt-7 font-texto italic text-xl sm:text-2xl text-white/85 max-w-2xl mx-auto leading-relaxed">
            Missas especiais, novenas, festas e avisos da nossa comunidade.
          </p>
        </div>
      </section>
      {/* =====================================================
         DESTAQUE — faixa azul emendada na abertura
         Tudo é montado sozinho a partir da lista de eventos (src/mocks/eventos.ts)
         ===================================================== */}
      {agenda && (
        <section
          id="bloco-destaque"
          className="relative bg-navy-950 pb-16 sm:pb-24 overflow-hidden"
          aria-label="Evento em destaque"
        >
          <div
            className="pointer-events-none absolute inset-x-0 top-1/4 h-[30rem] bg-[radial-gradient(ellipse_at_center,rgba(201,162,39,.10),transparent_65%)]"
            aria-hidden="true"
          ></div>
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <p className="eyebrow claro ornament">Em destaque</p>
            <div id="evento-destaque" className="mt-8">
              <CardEventoDestaque evento={agenda.destaque} agoraInicial={agora} />
            </div>
          </div>
        </section>
      )}
      {/* =====================================================
         AGENDA COMPLETA
         ===================================================== */}
      <section id="agenda" className="scroll-mt-20 py-16 sm:py-24 bg-ivory-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AgendaEventos
            agenda={agenda}
            agoraInicial={agora}
            titulo={
              <div>
                <p className="eyebrow">Agenda completa</p>
                <h2 className="font-serif font-semibold text-4xl sm:text-5xl lg:text-6xl text-navy-900 mt-3 leading-[1.05]">
                  Próximos eventos
                </h2>
              </div>
            }
          />
        </div>
      </section>
      {/* Convite para os horários fixos */}
      <section className="secao-escura text-white" aria-label="Horários de Missa">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-16 sm:py-20 text-center">
          <p className="eyebrow claro">Todas as semanas</p>
          <h2 className="font-serif font-semibold text-4xl sm:text-5xl mt-3">Horários de Missa</h2>
          <div className="divisor mt-6" aria-hidden="true">
            <svg viewBox="0 0 12 20">
              <path d="M5 0h2v4h3v2H7v2h5v2H7v10H5V10H0V8h5V6H2V4h3z"></path>
            </svg>
          </div>
          <p className="mt-6 text-lg text-white/80 leading-relaxed">
            Além dos eventos especiais, o Santuário celebra missas aos domingos, segundas, quartas e quintas-feiras, e
            missas votivas na primeira sexta e no primeiro sábado de cada mês.
          </p>
          <Link href="/missas" className="btn btn-ouro mt-9">
            <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
              <circle cx="12" cy="12" r="9"></circle>
              <path d="M12 7v5l3 2"></path>
            </svg>{' '}
            Ver horários de missa
          </Link>
        </div>
      </section>
    </>
  );
}
