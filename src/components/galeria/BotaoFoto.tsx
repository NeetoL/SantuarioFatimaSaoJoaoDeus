import Image from 'next/image';
import type { FotoDaGaleria } from '@/modules/Galeria/Domain/foto';

/** Foto da galeria que amplia ao clicar (o <AmpliadorDeFotos /> da página cuida da ampliação). */
export function BotaoFoto({ foto }: { foto: FotoDaGaleria & { miniatura: string } }) {
  return (
    <button
      type="button"
      data-foto={foto.foto}
      data-legenda={foto.legenda}
      aria-label={`Ampliar foto: ${foto.legenda}`}
      className={`foto-btn group relative overflow-hidden rounded-sm img-fallback focus:outline-none focus-visible:ring-4 focus-visible:ring-gold-400${foto.grande ? ' col-span-2 row-span-2' : ''}`}
    >
      <Image
        src={foto.miniatura}
        alt={foto.legenda}
        fill
        sizes={foto.grande ? '(min-width: 640px) 50vw, 100vw' : '(min-width: 640px) 25vw, 50vw'}
        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
      />
      <span
        className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-navy-950/85 to-transparent text-left font-serif italic text-lg text-white opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100 transition-opacity"
        aria-hidden="true"
      >
        {foto.legenda}
      </span>
    </button>
  );
}
