import Image from 'next/image';
import { type FotoDaGaleria } from '@/modules/Galeria/Domain/foto';

/** Tamanho de cada posição: a 1ª foto é grande; as outras quatro ficam em 2×2 (classes em globals.css, .mosaico). */
const TAMANHOS = [
  '(min-width: 1280px) 640px, (min-width: 1024px) 50vw, 100vw',
  '(min-width: 1280px) 320px, (min-width: 1024px) 25vw, 50vw',
  '(min-width: 1280px) 320px, (min-width: 1024px) 25vw, 50vw',
  '(min-width: 1280px) 320px, (min-width: 1024px) 25vw, 50vw',
  '(min-width: 1280px) 320px, (min-width: 1024px) 25vw, 50vw',
];

/** Mosaico de fotos da página inicial. Cada foto é um botão que amplia (o <AmpliadorDeFotos /> faz a ampliação). */
export function MosaicoDeFotos({ fotos }: { fotos: FotoDaGaleria[] }) {
  return (
    <ul className="mosaico">
      {fotos.slice(0, TAMANHOS.length).map((foto, i) => (
        <li key={foto.id}>
          <button
            type="button"
            data-foto={foto.foto}
            data-legenda={foto.legenda}
            aria-label={`Ampliar foto: ${foto.legenda}`}
            className="foto-btn group absolute inset-0 overflow-hidden rounded-sm img-fallback focus:outline-none focus-visible:ring-4 focus-visible:ring-gold-400"
          >
            <Image
              src={foto.foto}
              alt={foto.legenda}
              fill
              sizes={TAMANHOS[i]}
              className="object-cover transition-transform duration-700 group-hover:scale-105"
            />
            {/* Legenda só ao passar o mouse (no celular, aparece ao ampliar) */}
            <span className="mosaico-legenda" aria-hidden="true">
              {foto.legenda}
            </span>
          </button>
        </li>
      ))}
    </ul>
  );
}
