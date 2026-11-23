import Image from 'next/image';
import Link from 'next/link';
import { ItemRecado } from '@/components/comunicados/ItemRecado';
import { IconeSeta } from '@/components/ui/icones';
import { dataCurta, type Noticia, type Recado } from '@/modules/Comunicados/Domain/comunicado';

/** Selo pequeno (categoria e data) sobre as notícias. */
const selo = 'rounded-sm px-2.5 py-1 font-caps text-[.72rem] font-semibold tracking-[.18em]';

/**
 * Notícias e Comunicados, como a capa de uma revista: a notícia mais recente em destaque,
 * a seguinte ao lado e o quadro de recados. Conteúdo em src/mocks/comunicados.ts.
 */
export function SecaoMural({ noticias, recados }: { noticias: Noticia[]; recados: Recado[] }) {
  const [principal, ...outras] = noticias;
  return (
    <section id="noticias" className={`relative scroll-mt-24 bg-white pt-20 sm:pt-28 pb-20 sm:pb-28`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <header className="grid gap-6 lg:grid-cols-2 lg:items-end reveal">
          <div className="text-center lg:text-left">
            <p className="eyebrow">Mural do Santuário</p>
            <h2 className="mt-5 font-serif font-semibold text-[2.7rem] sm:text-6xl lg:text-7xl leading-[1] tracking-[-0.015em] text-navy-900">
              Notícias e Comunicados
            </h2>
          </div>
          <div className="flex flex-col items-center lg:items-end gap-5 text-center lg:text-right">
            <p className="max-w-md text-lg text-slate-600">
              O que o Santuário tem a anunciar: notícias, comunicados e recados para toda a comunidade.
            </p>
            <Link href="/noticias" className="btn btn-sm btn-linha group">
              Ver todas as notícias
              <IconeSeta className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>
        </header>

        <div className="mt-14 grid gap-6 lg:grid-cols-12">
          {principal ? (
            <article className="group relative isolate flex min-h-[28rem] sm:min-h-[34rem] flex-col justify-end overflow-hidden rounded-lg img-fallback lg:col-span-7 lg:row-span-2 reveal">
              {principal.imagem && (
                <Image
                  src={principal.imagem}
                  alt=""
                  fill
                  sizes="(min-width: 1280px) 720px, (min-width: 1024px) 58vw, 100vw"
                  className="-z-10 object-cover transition-transform duration-[1500ms] group-hover:scale-105"
                />
              )}
              <div className="absolute inset-0 -z-10 bg-gradient-to-t from-navy-950 via-navy-950/55 to-navy-950/5"></div>
              <div className="p-7 sm:p-10 text-white">
                <div className="flex flex-wrap gap-2">
                  <span className={`${selo} bg-gold-500 text-navy-950`}>{principal.categoria}</span>
                  <span className={`${selo} bg-white/10 text-white ring-1 ring-inset ring-white/25 backdrop-blur-md`}>
                    {dataCurta(principal.data)}
                  </span>
                </div>
                <h3 className="mt-5 max-w-2xl font-serif font-semibold text-3xl sm:text-5xl leading-[1.05]">
                  <Link
                    href={`/noticias#${principal.id}`}
                    className="after:absolute after:inset-0 hover:text-gold-200 transition-colors"
                  >
                    {principal.titulo}
                  </Link>
                </h3>
                <p className="mt-4 max-w-xl text-lg leading-relaxed text-white/80">{principal.resumo}</p>
                <span className="mt-6 inline-flex items-center gap-2 font-semibold text-gold-300" aria-hidden="true">
                  Ler a notícia <IconeSeta className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </span>
              </div>
            </article>
          ) : (
            <p className="lg:col-span-7 font-texto italic text-xl text-slate-600">
              Nenhuma notícia publicada no momento.
            </p>
          )}

          {outras.map((n) => (
            <article
              key={n.id}
              className="group relative flex items-center gap-5 rounded-lg bg-ivory-50 p-4 sm:p-5 ring-1 ring-ivory-200 hover:ring-gold-400 transition lg:col-span-5 reveal"
            >
              <div className="relative h-28 w-28 sm:h-32 sm:w-32 shrink-0 overflow-hidden rounded-md img-fallback">
                {n.imagem && <Image src={n.imagem} alt="" fill sizes="128px" className="object-cover" />}
              </div>
              <div className="min-w-0">
                <p className="font-caps text-[.72rem] font-semibold tracking-[.18em] text-[#7a5c12]">
                  {n.categoria} · {dataCurta(n.data)}
                </p>
                <h3 className="mt-2 font-serif font-semibold text-2xl leading-tight text-navy-900">
                  <Link
                    href={`/noticias#${n.id}`}
                    className="after:absolute after:inset-0 hover:text-gold-700 transition-colors"
                  >
                    {n.titulo}
                  </Link>
                </h3>
                <p className="mt-2 text-base leading-relaxed text-slate-600 line-clamp-3">{n.resumo}</p>
              </div>
            </article>
          ))}

          {/* Recados paroquiais (os 3 primeiros) */}
          <aside
            className="rounded-lg bg-ivory-100 p-7 sm:p-9 ring-1 ring-ivory-200 lg:col-span-5 reveal"
            aria-labelledby="recados-titulo"
          >
            <div className="flex items-center gap-3">
              <span className="h-3 w-3 rounded-full bg-wine-700 ring-4 ring-wine-700/15" aria-hidden="true"></span>
              <h3 id="recados-titulo" className="font-serif font-semibold text-3xl text-navy-900">
                Recados Paroquiais
              </h3>
            </div>
            <ul className="mt-6 space-y-6">
              {recados.map((recado) => (
                <ItemRecado key={recado.id} recado={recado} />
              ))}
            </ul>
            <Link href="/noticias#recados" className="btn btn-sm btn-linha group mt-8">
              Todos os recados
              <IconeSeta className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </aside>
        </div>
      </div>
    </section>
  );
}
