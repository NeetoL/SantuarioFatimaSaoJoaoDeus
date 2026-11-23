import Link from 'next/link';
import { GaleriaDeAlbuns } from '@/components/galeria/GaleriaDeAlbuns';
import { type AlbumParaExibir } from '@/modules/Galeria/Domain/album';

/** Galeria da página inicial: os álbuns mais recentes (um por evento, em src/mocks/galeria.ts); a página completa é /galeria. */
export function SecaoGaleria({ albuns, totalDeAlbuns }: { albuns: AlbumParaExibir[]; totalDeAlbuns: number }) {
  if (!albuns.length) return null;
  return (
    <section id="galeria" className="grao relative scroll-mt-24 overflow-hidden bg-navy-950 text-white py-20 sm:py-28">
      <div
        className="pointer-events-none absolute left-1/2 top-0 h-[26rem] w-[56rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gold-500/10 blur-3xl"
        aria-hidden="true"
      ></div>
      <div className="relative max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
        <header className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between reveal">
          <div className="text-center lg:text-left">
            <p className="eyebrow claro">Galeria</p>
            <h2 className="mt-5 font-serif font-semibold text-[2.7rem] sm:text-6xl lg:text-7xl leading-[1] tracking-[-0.015em]">
              Nossa comunidade em imagens
            </h2>
            <p className="mt-5 text-lg text-white/75">As fotos de cada evento, reunidas em álbuns.</p>
          </div>
          {totalDeAlbuns > 0 && (
            <Link href="/galeria" className="btn btn-vidro shrink-0 whitespace-nowrap self-center lg:self-auto">
              Ver a galeria completa
            </Link>
          )}
        </header>
        <div className="mt-14 sm:mt-16 reveal">
          <GaleriaDeAlbuns albuns={albuns} />
        </div>
      </div>
    </section>
  );
}
