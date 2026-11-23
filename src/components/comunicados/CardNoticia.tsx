import Image from 'next/image';
import Link from 'next/link';
import { dataCurta, type Noticia } from '@/modules/Comunicados/Domain/comunicado';
import { SaibaMais } from './SaibaMais';

/**
 * Card de notícia (página inicial e página Notícias). Na página Notícias o card tem o id da notícia;
 * na inicial, `href` faz do título um link para ela (/noticias#id).
 */
export function CardNoticia({ noticia, href }: { noticia: Noticia; href?: string }) {
  return (
    <article
      id={href ? undefined : noticia.id}
      className="cartao-alvo scroll-mt-28 group flex flex-col overflow-hidden rounded-md bg-white ring-1 ring-ivory-200 hover:shadow-2xl hover:shadow-navy-950/15 hover:-translate-y-1 transition duration-500"
    >
      <div className="relative aspect-[16/10] overflow-hidden img-fallback">
        {noticia.imagem && (
          <Image
            src={noticia.imagem}
            alt=""
            fill
            sizes="(min-width: 1024px) 400px, (min-width: 640px) 50vw, 100vw"
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
        )}
        <span className="absolute top-4 left-4 font-caps text-[.8rem] font-semibold tracking-[.2em] px-2.5 py-1 rounded-sm bg-navy-950/55 text-white ring-1 ring-white/25 backdrop-blur-sm">
          {noticia.categoria}
        </span>
      </div>
      <div className="flex flex-1 flex-col p-6">
        <p className="font-caps text-[.8rem] font-semibold tracking-[.2em] text-gold-700">{dataCurta(noticia.data)}</p>
        <h3 className="mt-2 font-serif font-semibold text-[1.65rem] leading-tight text-navy-900">
          {href ? (
            <Link href={href} className="hover:text-gold-700 transition-colors">
              {noticia.titulo}
            </Link>
          ) : (
            noticia.titulo
          )}
        </h3>
        <p className="mt-3 text-[1.0625rem] leading-relaxed text-slate-600">{noticia.resumo}</p>
        <SaibaMais link={noticia.link} />
      </div>
    </article>
  );
}
