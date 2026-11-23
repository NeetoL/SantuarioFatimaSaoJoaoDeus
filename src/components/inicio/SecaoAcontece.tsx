import Image from 'next/image';
import Link from 'next/link';
import { AcoesDoEvento } from '@/components/eventos/AcoesDoEvento';
import { SeloDeTempo } from '@/components/eventos/SeloDeTempo';
import { IconeLocal, IconeSeta } from '@/components/ui/icones';
import { DIAS_EXTENSO, MESES_ABREV, MESES_EXTENSO, pad2, partesDaData } from '@/lib/datas';
import { type EventoComFoto } from '@/modules/Eventos/Application/casos-de-uso';

type Resumo = { destaque: EventoComFoto; seguintes: EventoComFoto[]; total: number };

/**
 * Acontece no Santuário: o evento em destaque (foto com moldura e data grande em dourado)
 * e os próximos numa lista; cada um leva ao evento na agenda (/eventos#id).
 */
export function SecaoAcontece({ resumo, agora }: { resumo: Resumo; agora: number }) {
  const { destaque } = resumo;
  const data = partesDaData(destaque.data);
  return (
    <section
      id="avisos"
      className="grao relative scroll-mt-24 overflow-hidden bg-navy-950 text-white pt-16 sm:pt-24 pb-20 sm:pb-28"
    >
      {/* brilhos suaves */}
      <div
        className="pointer-events-none absolute -right-40 top-20 h-[36rem] w-[36rem] rounded-full bg-gold-500/10 blur-3xl"
        aria-hidden="true"
      ></div>
      <div
        className="pointer-events-none absolute -left-40 bottom-40 h-[30rem] w-[30rem] rounded-full bg-navy-700/30 blur-3xl"
        aria-hidden="true"
      ></div>

      <div className="relative max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
        <header className="text-center reveal">
          <p className="eyebrow claro">Avisos da comunidade</p>
          <h2 className="mt-5 font-serif font-semibold text-[2.7rem] sm:text-6xl lg:text-7xl leading-[1] tracking-[-0.015em]">
            Acontece no Santuário
          </h2>
          <div className="fio-ouro mx-auto mt-8 w-40"></div>
        </header>

        {/* Evento em destaque */}
        <article className="mt-16 sm:mt-20 grid gap-12 lg:grid-cols-12 lg:gap-16 lg:items-center">
          <div className="lg:col-span-5 px-4 sm:px-10 lg:px-0 reveal">
            <div className="moldura mx-auto max-w-md mr-5 sm:mr-auto">
              <div className="relative aspect-[4/5] overflow-hidden rounded-sm img-fallback shadow-[0_40px_90px_-30px_rgba(0,0,0,.8)]">
                <Image
                  src={destaque.foto}
                  alt=""
                  fill
                  sizes="(min-width: 1024px) 420px, 90vw"
                  className="object-cover transition-transform duration-[2000ms] hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-navy-950/60 via-transparent to-transparent"></div>
              </div>
            </div>
          </div>
          <div className="lg:col-span-7 text-center lg:text-left reveal">
            <div className="flex items-end justify-center lg:justify-start gap-5">
              <span className="font-serif font-semibold text-[6.5rem] sm:text-[8.5rem] leading-[.78] texto-ouro">
                {pad2(data.dia)}
              </span>
              <span className="pb-1 text-left">
                <span className="block font-caps text-[.85rem] font-semibold tracking-[.28em] text-gold-300">
                  {MESES_EXTENSO[data.mes - 1]}
                </span>
                <span className="mt-1.5 block text-base text-white/75">
                  {DIAS_EXTENSO[data.diaDaSemana]} · {destaque.hora}
                </span>
              </span>
            </div>
            <div className="mt-8 flex flex-wrap items-center justify-center lg:justify-start gap-3">
              <span className="rounded-sm bg-gold-500/15 px-3 py-1 font-caps text-[.74rem] font-semibold tracking-[.2em] text-gold-300 ring-1 ring-inset ring-gold-400/40">
                {destaque.categoria}
              </span>
              <SeloDeTempo evento={destaque} agoraInicial={agora} tema="claro" />
            </div>
            <h3 className="mt-5 font-serif font-semibold text-4xl sm:text-5xl lg:text-[3.75rem] leading-[1.02]">
              <Link href={`/eventos#${destaque.id}`} className="hover:text-gold-200 transition-colors">
                {destaque.titulo}
              </Link>
            </h3>
            <p className="mt-4 inline-flex items-center gap-2 text-lg text-white/80">
              <IconeLocal className="w-5 h-5 text-gold-400" />
              {destaque.local}
            </p>
            <p className="mt-5 mx-auto lg:mx-0 max-w-xl font-texto italic text-xl leading-relaxed text-white/80">
              {destaque.descricao}
            </p>
            <div className="flex justify-center lg:justify-start">
              <AcoesDoEvento evento={destaque} variante="destaque" />
            </div>
          </div>
        </article>

        {/* Próximos eventos */}
        {resumo.seguintes.length > 0 && (
          <div className="mt-20 sm:mt-28 reveal">
            <p className="font-caps text-[.8rem] font-semibold tracking-[.3em] text-gold-300 text-center lg:text-left">
              Em seguida
            </p>
            <ul className="mt-5 border-y border-white/10 divide-y divide-white/10">
              {resumo.seguintes.map((ev) => {
                const d = partesDaData(ev.data);
                return (
                  <li key={ev.id}>
                    <Link
                      href={`/eventos#${ev.id}`}
                      className="group grid grid-cols-[4.25rem_1fr_auto] sm:grid-cols-[6rem_1fr_auto_auto] items-center gap-4 sm:gap-7 py-6 sm:py-7 px-2 sm:px-5 -mx-2 sm:-mx-5 rounded-md hover:bg-white/[.04] transition-colors"
                    >
                      <span className="text-center">
                        <span className="block font-serif font-semibold text-5xl sm:text-6xl leading-none text-gold-300 group-hover:text-gold-200 transition-colors">
                          {pad2(d.dia)}
                        </span>
                        <span className="mt-1 block font-caps text-[.72rem] font-semibold tracking-[.24em] text-white/70">
                          {MESES_ABREV[d.mes - 1]}
                        </span>
                      </span>
                      <span className="min-w-0">
                        <span className="block font-caps text-[.72rem] font-semibold tracking-[.22em] text-gold-300/90">
                          {ev.categoria}
                        </span>
                        <span className="mt-1 block font-serif font-semibold text-2xl sm:text-[2rem] leading-tight text-white group-hover:text-gold-200 transition-colors">
                          {ev.titulo}
                        </span>
                        <span className="mt-1 block text-base text-white/70">
                          {ev.hora} · {ev.local}
                        </span>
                      </span>
                      <span className="relative hidden sm:block h-20 w-28 overflow-hidden rounded-sm img-fallback opacity-80 group-hover:opacity-100 transition-opacity">
                        <Image src={ev.foto} alt="" fill sizes="112px" className="object-cover" />
                      </span>
                      <span
                        className="grid h-11 w-11 sm:h-12 sm:w-12 place-items-center rounded-md ring-1 ring-inset ring-white/25 text-white group-hover:bg-gold-500 group-hover:text-navy-950 group-hover:ring-gold-500 transition"
                        aria-hidden="true"
                      >
                        <IconeSeta className="w-4 h-4" />
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        )}

        <div className="mt-14 text-center">
          <Link href="/eventos" className="btn btn-vidro">
            Ver todos os eventos
            <span className="inline-grid place-items-center min-w-[1.7rem] h-[1.7rem] px-1.5 rounded-sm bg-gold-500 text-navy-950 text-[.85rem]">
              {resumo.total}
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
}
