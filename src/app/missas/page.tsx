import { type Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { type ReactNode } from 'react';
import { CardEvento } from '@/components/eventos/CardEvento';
import { Devocoes } from '@/components/horarios/Devocoes';
import { MissasMensais } from '@/components/horarios/MissasMensais';
import { TabelaDeHorarios } from '@/components/horarios/TabelaDeHorarios';
import { VitraisDaSemana } from '@/components/inicio/VitraisDaSemana';
import { IconeSeta } from '@/components/ui/icones';
import { casosDeUso } from '@/config/container';
import { instanteDaRequisicao } from '@/lib/requisicao';
import { linkDoMapa, linkDoMapaIncorporado } from '@/modules/Institucional/Domain/institucional';

export const metadata: Metadata = {
  title: 'Horários',
  description:
    'Horários do Santuário Nossa Senhora de Fátima e São João de Deus, em Realengo (RJ): missas de domingo a sábado, missas votivas, confissões, terços, adoração ao Santíssimo, igreja aberta e secretaria.',
  alternates: { canonical: '/missas' },
};

/** Cabeçalho das seções desta página: rótulo com a cruz, título grande e uma frase. */
function Titulo({
  rotulo,
  titulo,
  texto,
  centro = true,
}: {
  rotulo: string;
  titulo: ReactNode;
  texto?: ReactNode;
  centro?: boolean;
}) {
  return (
    <header className={centro ? 'text-center max-w-3xl mx-auto' : 'max-w-3xl'}>
      <p className="eyebrow">{rotulo}</p>
      <h2 className="mt-5 font-serif font-semibold text-[2.5rem] sm:text-6xl leading-[1.02] tracking-[-0.015em] text-navy-900">
        {titulo}
      </h2>
      {texto && <p className="mt-5 text-lg leading-relaxed text-slate-600">{texto}</p>}
    </header>
  );
}

const ICONE = {
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: '1.8',
  viewBox: '0 0 24 24',
  'aria-hidden': true,
} as const;

/**
 * Página de horários: a semana em painéis (vitrais), missas votivas, confissões, terços,
 * adoração, igreja aberta, secretaria, celebrações especiais e como chegar. Tudo vem de src/mocks.
 */
export default async function PaginaMissas() {
  const agora = await instanteDaRequisicao(); // eventos e horários dependem da hora atual
  const [quadro, missasEspeciais, institucional] = await Promise.all([
    casosDeUso.horarios.obterQuadro(),
    casosDeUso.eventos.missasEspeciais(new Date(agora)),
    casosDeUso.institucional.obter(),
  ]);
  const { endereco, telefone } = institucional;

  return (
    <>
      {/* =====================================================
         ABERTURA
         ===================================================== */}
      <section
        id="topo"
        className="grao relative min-h-[64svh] flex items-end overflow-hidden img-fallback bg-navy-950"
      >
        <Image
          src="/assets/img/sobre/celebracao-altar.jpg"
          alt=""
          aria-hidden="true"
          className="absolute inset-0 -z-20 w-full h-full object-cover"
          fill
          sizes="100vw"
          preload
        />
        <div className="absolute inset-0 -z-10 bg-navy-950/45"></div>
        <div className="absolute inset-x-0 top-0 -z-10 h-40 bg-gradient-to-b from-navy-950/80 to-transparent"></div>
        <div className="absolute inset-x-0 bottom-0 -z-10 h-3/4 bg-gradient-to-t from-navy-950 via-navy-950/75 to-transparent"></div>
        <div
          className="pointer-events-none absolute left-1/2 top-1/2 -z-10 -translate-x-1/2 -translate-y-1/2"
          aria-hidden="true"
        >
          <div className="respira h-[30rem] w-[30rem] sm:h-[42rem] sm:w-[42rem] rounded-full bg-[radial-gradient(circle,rgba(230,207,143,.2)_0%,rgba(201,162,39,.07)_40%,transparent_68%)]"></div>
        </div>
        <div className="relative w-full max-w-5xl mx-auto px-5 sm:px-6 pt-32 pb-20 sm:pb-24 text-center">
          <p className="eyebrow claro">Celebrações e atendimento</p>
          <h1 className="mt-5 font-serif font-semibold text-white text-[3.1rem] sm:text-7xl lg:text-[5.5rem] leading-[.98] tracking-[-0.02em] drop-shadow-[0_4px_30px_rgba(0,0,0,.45)]">
            Horários do <span className="italic font-medium texto-ouro pr-1">Santuário</span>
          </h1>
          <div className="fio-ouro mx-auto mt-7 w-40"></div>
          <p className="mt-6 font-texto italic text-xl sm:text-2xl text-white/85 max-w-2xl mx-auto leading-relaxed">
            Missas, confissões, orações e atendimento da secretaria, semana a semana.
          </p>
          <nav aria-label="Nesta página" className="mt-9 flex flex-wrap justify-center gap-2">
            <a href="#calendario" className="btn btn-vidro btn-sm">
              <svg {...ICONE}>
                <rect x="3.5" y="5" width="17" height="15" rx="1.5"></rect>
                <path d="M3.5 10h17M8 3v4M16 3v4"></path>
              </svg>
              Missas
            </a>
            <a href="#confissoes" className="btn btn-vidro btn-sm">
              <svg {...ICONE}>
                <path d="M4 5h16v10H9l-5 4z"></path>
              </svg>
              Confissões e orações
            </a>
            <a href="#secretaria" className="btn btn-vidro btn-sm">
              <svg {...ICONE}>
                <circle cx="12" cy="12" r="9"></circle>
                <path d="M12 7v5l3 2"></path>
              </svg>
              Igreja e secretaria
            </a>
          </nav>
        </div>
      </section>

      {/* Missas de domingo a sábado, em painéis como vitrais */}
      <section id="calendario" className="scroll-mt-24 bg-ivory-100 pt-20 sm:pt-28 pb-20 sm:pb-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Titulo
            rotulo="Calendário semanal"
            titulo="Missas de domingo a sábado"
            texto="Celebrações fixas do Santuário, todas as semanas. O dia de hoje aparece em destaque."
          />
          <div className="mt-14 sm:mt-16">
            <VitraisDaSemana dias={quadro.missasDaSemana} agoraInicial={agora} />
          </div>
        </div>
      </section>

      {/* Missas de uma vez por mês: próxima data calculada sozinha */}
      <section id="mensais" className="scroll-mt-24 bg-white py-20 sm:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Titulo
            rotulo="Uma vez por mês"
            titulo="Missas votivas"
            texto="Na primeira sexta-feira (às 8h e às 19h) e no primeiro sábado (às 8h) de cada mês."
          />
          <div className="mt-14 grid gap-6 lg:grid-cols-2 max-w-6xl mx-auto" data-proximas-mensais="">
            <MissasMensais mensais={quadro.missasMensais} agoraInicial={agora} />
          </div>
        </div>
      </section>

      {/* Confissões, terços e adoração */}
      <section id="confissoes" className="scroll-mt-24 bg-ivory-100 py-20 sm:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Titulo
            rotulo="Sacramentos e devoções"
            titulo="Confissões, terços e adoração"
            texto="Momentos de reconciliação e de oração ao longo da semana."
          />
          <div className="mt-14 grid gap-6 lg:grid-cols-3" data-devocoes="">
            <Devocoes quadro={quadro} agoraInicial={agora} />
          </div>
        </div>
      </section>

      {/* Igreja aberta e secretaria */}
      <section id="secretaria" className="scroll-mt-24 bg-white py-20 sm:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Titulo
            rotulo="Funcionamento"
            titulo="Igreja aberta e secretaria"
            texto="A igreja fica aberta para visitas e oração pessoal. A secretaria atende pedidos de sacramentos, documentos e intenções de missa."
          />
          <div className="mt-14 grid gap-6 lg:grid-cols-2 max-w-6xl mx-auto items-start">
            <article className="cartao-horario">
              <div className="flex items-center gap-4">
                <span className="grid shrink-0 place-items-center w-12 h-12 rounded-md bg-navy-900 text-gold-300">
                  <svg className="w-5 h-5" {...ICONE}>
                    <path d="M12 2v4M10 4h4M5 21V11l7-5 7 5v10M3 21h18M10 21v-5a2 2 0 0 1 4 0v5"></path>
                  </svg>
                </span>
                <div>
                  <p className="font-caps text-[.75rem] font-semibold tracking-[.2em] text-[#7a5c12]">
                    Visitas e oração pessoal
                  </p>
                  <h3 className="mt-0.5 font-serif font-semibold text-[1.75rem] text-navy-900 leading-tight">
                    Igreja aberta
                  </h3>
                </div>
              </div>
              <ul
                className="lista-horarios mt-5"
                data-tabela-horarios="igreja"
                aria-label="Horário da igreja, de domingo a sábado"
              >
                <TabelaDeHorarios horarios={quadro.igrejaAberta} agoraInicial={agora} />
              </ul>
            </article>
            <article className="cartao-horario">
              <div className="flex items-center gap-4">
                <span className="grid shrink-0 place-items-center w-12 h-12 rounded-md bg-navy-900 text-gold-300">
                  <svg className="w-5 h-5" {...ICONE}>
                    <circle cx="12" cy="12" r="9"></circle>
                    <path d="M12 7v5l3 2"></path>
                  </svg>
                </span>
                <div>
                  <p className="font-caps text-[.75rem] font-semibold tracking-[.2em] text-[#7a5c12]">Atendimento</p>
                  <h3 className="mt-0.5 font-serif font-semibold text-[1.75rem] text-navy-900 leading-tight">
                    Secretaria do Santuário
                  </h3>
                </div>
              </div>
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
              <div className="mt-6 rounded-md border-l-2 border-wine-700 bg-ivory-50 px-5 py-4">
                <p className="font-caps text-[.75rem] font-semibold tracking-[.2em] text-wine-700">
                  Intenções de missa
                </p>
                <p className="mt-1.5 text-slate-700 leading-relaxed">
                  São recebidas <strong className="font-semibold text-navy-900">presencialmente na secretaria</strong>{' '}
                  do Santuário, nos horários acima.
                </p>
              </div>
              <div className="mt-6 flex flex-wrap gap-3">
                <a href={`tel:${telefone.internacional}`} className="btn btn-escuro btn-sm">
                  <svg {...ICONE}>
                    <path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2"></path>
                  </svg>
                  {telefone.exibicao}
                </a>
                <Link href="/contato" className="btn btn-linha btn-sm">
                  <svg {...ICONE}>
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
        <section id="bloco-missas-especiais" className="bg-ivory-50 py-20 sm:py-28">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
              <Titulo rotulo="Agenda" titulo="Celebrações especiais" centro={false} />
              <Link href="/eventos" className="btn btn-linha btn-sm group self-start lg:self-auto">
                Ver todos os eventos
                <IconeSeta className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </div>
            <div id="missas-especiais" className="mt-14 grid gap-x-7 gap-y-9 md:grid-cols-2 lg:grid-cols-3">
              {missasEspeciais.map((evento) => (
                <CardEvento
                  key={evento.id}
                  evento={evento}
                  agoraInicial={agora}
                  comDescricao
                  linkDosDetalhes={`/eventos#${evento.id}`}
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Como chegar */}
      <section id="como-chegar" className="grao relative overflow-hidden secao-escura text-white py-20 sm:py-28">
        <div
          className="pointer-events-none absolute -left-32 top-1/2 h-[30rem] w-[30rem] -translate-y-1/2 rounded-full bg-gold-500/10 blur-3xl"
          aria-hidden="true"
        ></div>
        <div className="relative max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 grid lg:grid-cols-2 gap-14 items-center">
          <div className="text-center lg:text-left">
            <p className="eyebrow claro">Venha nos visitar</p>
            <h2 className="mt-5 font-serif font-semibold text-[2.5rem] sm:text-6xl leading-[1.02] tracking-[-0.015em]">
              Como chegar
            </h2>
            <div className="fio-ouro mx-auto lg:mx-0 mt-7 w-40"></div>
            <p className="mt-7 font-serif text-2xl sm:text-3xl leading-snug text-white">
              {endereco.logradouro}
              <span className="block mt-1 font-sans text-lg text-white/75">
                {endereco.bairro} — {endereco.cidade} / {endereco.uf}
              </span>
            </p>
            <div className="mt-9 flex flex-col sm:flex-row gap-3 justify-center lg:justify-start">
              <a href={linkDoMapa(institucional)} target="_blank" rel="noopener noreferrer" className="btn btn-ouro">
                <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M12 21s-7-6.2-7-11.5A7 7 0 0 1 19 9.5C19 14.8 12 21 12 21z"></path>
                  <circle cx="12" cy="9.5" r="2.5"></circle>
                </svg>
                Abrir no mapa
              </a>
              <Link href="/contato" className="btn btn-vidro">
                <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
                  <rect x="3" y="5" width="18" height="14" rx="2"></rect>
                  <path d="M3 7l9 6 9-6"></path>
                </svg>
                Fale conosco
              </Link>
            </div>
          </div>
          <div className="pr-5 pb-5 sm:pr-6 sm:pb-6">
            <div className="moldura">
              <div className="relative aspect-[4/3] overflow-hidden rounded-sm bg-navy-900 shadow-[0_40px_80px_-30px_rgba(0,0,0,.7)]">
                {/* Fundo enquanto o mapa do Google carrega (ou se ele não carregar) */}
                <div className="absolute inset-0 grid place-content-center gap-3 p-6 text-center" aria-hidden="true">
                  <span className="mx-auto grid h-14 w-14 place-items-center rounded-md bg-gold-500 text-navy-950">
                    <svg className="h-7 w-7" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path d="M12 21s-7-6.2-7-11.5A7 7 0 0 1 19 9.5C19 14.8 12 21 12 21z"></path>
                      <circle cx="12" cy="9.5" r="2.5"></circle>
                    </svg>
                  </span>
                  <span className="font-serif text-xl text-white">{endereco.logradouro}</span>
                  <span className="text-sm text-white/70">Carregando o mapa…</span>
                </div>
                <iframe
                  src={linkDoMapaIncorporado(institucional)}
                  title="Mapa: localização do Santuário em Realengo"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="relative w-full h-full border-0"
                ></iframe>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
