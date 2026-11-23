import Link from 'next/link';
import { AmpliadorDeFotos } from '@/components/galeria/AmpliadorDeFotos';
import { MosaicoDeFotos } from '@/components/galeria/MosaicoDeFotos';
import { Cruz } from '@/components/ui/icones';
import { type FotoDaGaleria } from '@/modules/Galeria/Domain/foto';

/** Galeria da página inicial: cinco fotos reais (src/mocks/galeria.ts) que ampliam ao tocar. */
export function SecaoGaleria({ fotos }: { fotos: FotoDaGaleria[] }) {
  if (!fotos.length) return null;
  return (
    <section id="galeria" className="scroll-mt-20 py-20 sm:py-28 bg-ivory-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <header className="text-center max-w-2xl mx-auto reveal">
          <p className="eyebrow">Galeria</p>
          <h2 className="font-serif font-semibold text-4xl sm:text-5xl lg:text-6xl text-navy-900 mt-4 leading-[1.05]">
            Nossa comunidade em imagens
          </h2>
          <div className="divisor mt-6" aria-hidden="true">
            <Cruz />
          </div>
        </header>
        <div className="mt-12 reveal">
          <MosaicoDeFotos fotos={fotos} />
        </div>
        <div className="mt-10 text-center">
          <Link href="/noticias#galeria" className="btn btn-escuro">
            Ver mais fotos
          </Link>
        </div>
      </div>
      <AmpliadorDeFotos />
    </section>
  );
}
