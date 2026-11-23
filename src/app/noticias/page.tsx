import { type Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { CardNoticia } from '@/components/comunicados/CardNoticia';
import { ItemRecado } from '@/components/comunicados/ItemRecado';
import { NoticiaDestaque, SemNoticias } from '@/components/comunicados/NoticiaDestaque';
import { casosDeUso } from '@/config/container';

export const metadata: Metadata = {
  title: 'Notícias e Comunicados',
  description:
    'Notícias, comunicados e recados do Santuário Nossa Senhora de Fátima e São João de Deus, em Realengo (RJ).',
  alternates: { canonical: '/noticias' },
};

export default async function PaginaNoticias() {
  const [pagina, recados, albuns] = await Promise.all([
    casosDeUso.comunicados.noticiasDaPagina(),
    casosDeUso.comunicados.listarRecados(),
    casosDeUso.galeria.listarAlbuns(),
  ]);

  return (
    <>
      {/* =====================================================
         ABERTURA
         ===================================================== */}
      <section id="topo" className="relative min-h-[58svh] flex items-end overflow-hidden img-fallback bg-navy-950">
        <Image
          src="/assets/img/sobre/comunidade.jpg"
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
          <p className="eyebrow claro">Mural do Santuário</p>
          <h1 className="font-serif font-semibold text-white text-[3.2rem] sm:text-7xl leading-none mt-5 tracking-[-0.01em]">
            Notícias e Comunicados
          </h1>
          <div className="divisor mt-7" aria-hidden="true">
            <svg viewBox="0 0 12 20">
              <path d="M5 0h2v4h3v2H7v2h5v2H7v10H5V10H0V8h5V6H2V4h3z"></path>
            </svg>
          </div>
          <p className="mt-7 font-texto italic text-xl sm:text-2xl text-white/85 max-w-2xl mx-auto leading-relaxed">
            O que o Santuário tem a anunciar: notícias, comunicados e recados para toda a comunidade.
          </p>
        </div>
      </section>
      {/* Notícias (conteúdo em src/mocks/comunicados.ts) */}
      <section id="publicacoes" className="scroll-mt-20 py-16 sm:py-24 bg-ivory-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="eyebrow ornament">Em destaque</p>
          <div id="noticia-destaque" className="mt-8">
            {pagina.destaque ? <NoticiaDestaque noticia={pagina.destaque} /> : <SemNoticias />}
          </div>
          {pagina.demais.length > 0 && (
            <div id="bloco-mais-noticias" className="mt-20">
              <p className="eyebrow">Mais notícias</p>
              <h2 className="font-serif font-semibold text-4xl sm:text-5xl text-navy-900 mt-3 leading-[1.05]">
                Últimas publicações
              </h2>
              <div id="lista-noticias" className="mt-10 grid gap-x-7 gap-y-9 md:grid-cols-2 xl:grid-cols-3">
                {pagina.demais.map((noticia) => (
                  <CardNoticia key={noticia.id} noticia={noticia} />
                ))}
              </div>
            </div>
          )}
        </div>
      </section>
      {/* Recados paroquiais */}
      <section id="recados" className="scroll-mt-20 py-20 sm:py-24 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-[1fr_1.3fr] gap-12 lg:gap-16 items-start">
          <div className="reveal lg:sticky lg:top-28">
            <p className="eyebrow">Secretaria e pastorais</p>
            <h2 className="font-serif font-semibold text-4xl sm:text-5xl text-navy-900 mt-4 leading-[1.05]">
              Recados paroquiais
            </h2>
            <div className="divisor esquerda mt-6" aria-hidden="true">
              <svg viewBox="0 0 12 20">
                <path d="M5 0h2v4h3v2H7v2h5v2H7v10H5V10H0V8h5V6H2V4h3z"></path>
              </svg>
            </div>
            <p className="mt-6 font-texto text-xl leading-relaxed text-slate-700">
              Avisos curtos para o dia a dia da comunidade. Em caso de dúvida, fale com a secretaria.
            </p>
            <Link href="/contato" className="btn btn-linha mt-8">
              <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
                <rect x="3" y="5" width="18" height="14" rx="2"></rect>
                <path d="M3 7l9 6 9-6"></path>
              </svg>
              Falar com a secretaria
            </Link>
          </div>
          <div className="reveal relative rounded-md bg-ivory-100 ring-1 ring-ivory-200 px-7 py-9 sm:px-10 sm:py-11 shadow-sm">
            <span
              className="absolute -top-3 left-1/2 -translate-x-1/2 w-6 h-6 rounded-full bg-wine-700 ring-4 ring-white shadow"
              aria-hidden="true"
            ></span>
            <ul id="recados-lista" className="space-y-7">
              {recados.map((recado) => (
                <ItemRecado key={recado.id} recado={recado} />
              ))}
            </ul>
          </div>
        </div>
      </section>
      {/* Galeria da comunidade: os álbuns ficam na página Galeria; aqui, um convite com o mais recente */}
      <section id="galeria" className="scroll-mt-20 py-20 sm:py-24 bg-ivory-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link
            href="/galeria"
            className="group grid overflow-hidden rounded-lg bg-navy-950 text-white sm:grid-cols-[1.1fr_1fr] ring-1 ring-black/5 shadow-[0_30px_70px_-40px_rgba(8,26,51,.6)]"
          >
            <span className="relative block min-h-[14rem] sm:min-h-[18rem] img-fallback">
              {albuns[0] && (
                <Image
                  src={albuns[0].fotoDeCapa.foto}
                  alt=""
                  fill
                  sizes="(min-width: 640px) 50vw, 100vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
              )}
            </span>
            <span className="flex flex-col justify-center gap-3 p-7 sm:p-10">
              <span className="eyebrow claro">Memória</span>
              <span className="font-serif font-semibold text-3xl sm:text-4xl leading-tight">Galeria da comunidade</span>
              <span className="text-lg text-white/80">
                {albuns.length} {albuns.length === 1 ? 'álbum' : 'álbuns'} com as fotos das celebrações e dos eventos.
              </span>
              <span className="mt-2 inline-flex items-center gap-2 font-semibold text-gold-300 group-hover:text-gold-200">
                Ver a galeria
                <svg
                  className="h-4 w-4 transition-transform group-hover:translate-x-1"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path d="M5 12h14M13 6l6 6-6 6"></path>
                </svg>
              </span>
            </span>
          </Link>
        </div>
      </section>
    </>
  );
}
