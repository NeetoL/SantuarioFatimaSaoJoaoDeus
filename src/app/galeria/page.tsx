import { type Metadata } from 'next';
import Image from 'next/image';
import { GaleriaDeAlbuns } from '@/components/galeria/GaleriaDeAlbuns';
import { casosDeUso } from '@/config/container';

export const metadata: Metadata = {
  title: 'Galeria da comunidade',
  description:
    'Álbuns de fotos das celebrações e dos eventos do Santuário Nossa Senhora de Fátima e São João de Deus, em Realengo (RJ).',
  alternates: { canonical: '/galeria' },
};

const contar = (n: number, um: string, varios: string) => `${n} ${n === 1 ? um : varios}`;

/**
 * Galeria da comunidade: todos os álbuns de fotos, um por evento (src/mocks/galeria.ts).
 * O mais recente aparece em destaque; dá para buscar por nome ou data e filtrar por ano;
 * cada álbum tem link direto (/galeria#id-do-album) para compartilhar.
 */
export default async function PaginaGaleria() {
  const albuns = await casosDeUso.galeria.listarAlbuns();
  const totalDeFotos = albuns.reduce((soma, a) => soma + a.total, 0);
  const capa = albuns[0]?.fotoDeCapa.foto ?? '/assets/img/sobre/comunidade.jpg';

  return (
    <>
      {/* =====================================================
         ABERTURA
         ===================================================== */}
      <section
        id="topo"
        className="grao relative min-h-[60svh] flex items-end overflow-hidden img-fallback bg-navy-950"
      >
        <Image
          src={capa}
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
        <div className="relative w-full max-w-5xl mx-auto px-5 sm:px-6 pt-32 pb-20 sm:pb-24 text-center">
          <p className="eyebrow claro">Memória da comunidade</p>
          <h1 className="mt-5 font-serif font-semibold text-white text-[3.1rem] sm:text-7xl lg:text-[5.5rem] leading-[.98] tracking-[-0.02em] drop-shadow-[0_4px_30px_rgba(0,0,0,.45)]">
            Galeria da <span className="italic font-medium texto-ouro pr-1">comunidade</span>
          </h1>
          <div className="fio-ouro mx-auto mt-7 w-40"></div>
          <p className="mt-6 font-texto italic text-xl sm:text-2xl text-white/85 max-w-2xl mx-auto leading-relaxed">
            As fotos de cada celebração e evento do Santuário, reunidas em álbuns.
          </p>
          {albuns.length > 0 && (
            <p className="mt-7 font-caps text-[.8rem] font-semibold tracking-[.24em] text-gold-300">
              {contar(albuns.length, 'álbum', 'álbuns')} · {contar(totalDeFotos, 'foto', 'fotos')}
            </p>
          )}
        </div>
      </section>

      {/* =====================================================
         ÁLBUNS
         ===================================================== */}
      <section id="albuns" className="scroll-mt-24 bg-ivory-100 py-20 sm:py-28">
        <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
          {albuns.length ? (
            <GaleriaDeAlbuns albuns={albuns} tema="claro" destacarPrimeiro linkDireto busca />
          ) : (
            <p className="text-center font-texto italic text-2xl text-slate-600">Nenhum álbum publicado ainda.</p>
          )}
        </div>
      </section>
    </>
  );
}
