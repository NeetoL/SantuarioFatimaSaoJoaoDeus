import Image from 'next/image';
import { Cruz } from '@/components/ui/icones';
import { dataLonga, type Noticia } from '@/modules/Comunicados/Domain/comunicado';
import { SaibaMais } from './SaibaMais';

/** Notícia mais recente, em destaque (página Notícias). */
export function NoticiaDestaque({ noticia }: { noticia: Noticia }) {
  return (
    <article className="group grid lg:grid-cols-[1.15fr_1fr] overflow-hidden rounded-md bg-white ring-1 ring-ivory-200 shadow-2xl shadow-navy-950/10">
      <div className="relative min-h-[16rem] sm:min-h-[22rem] overflow-hidden img-fallback">
        {noticia.imagem && (
          <Image
            src={noticia.imagem}
            alt=""
            fill
            sizes="(min-width: 1024px) 55vw, 100vw"
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-[2000ms] group-hover:scale-105"
          />
        )}
        <span className="absolute top-5 left-5 inline-flex items-center gap-2 rounded-sm bg-gold-500 px-3 py-1.5 font-caps text-[.8rem] font-semibold tracking-[.22em] text-navy-950 shadow-lg">
          Mais recente
        </span>
      </div>
      <div className="flex flex-col justify-center p-7 sm:p-12">
        <p className="font-caps text-[.875rem] font-semibold tracking-[.22em] text-gold-700">
          {noticia.categoria} · {dataLonga(noticia.data)}
        </p>
        <h3 className="mt-3 font-serif font-semibold text-4xl sm:text-5xl leading-[1.05] text-navy-900">
          {noticia.titulo}
        </h3>
        <div className="divisor esquerda mt-6" aria-hidden="true">
          <Cruz />
        </div>
        <p className="mt-6 font-texto text-xl leading-relaxed text-slate-700">{noticia.resumo}</p>
        <SaibaMais link={noticia.link} />
      </div>
    </article>
  );
}

/** Quando ainda não há notícias publicadas. */
export function SemNoticias() {
  return (
    <div className="text-center py-16">
      <div className="divisor" aria-hidden="true">
        <Cruz />
      </div>
      <p className="mt-6 font-serif text-3xl text-navy-900">Nenhuma notícia publicada no momento.</p>
    </div>
  );
}
