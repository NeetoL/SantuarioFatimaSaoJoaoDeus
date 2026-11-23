import Image from 'next/image';
import Link from 'next/link';
import { IconeSeta } from '@/components/ui/icones';
import { type DadosInstitucionais } from '@/modules/Institucional/Domain/institucional';

/** Conheça o Santuário: a fachada com moldura dourada, uma frase e a história completa (página Sobre). */
export function SecaoSantuario({ apresentacao }: { apresentacao: DadosInstitucionais['apresentacao'] }) {
  return (
    <section
      id="santuario"
      className={`relative scroll-mt-24 overflow-hidden bg-ivory-50 pt-20 sm:pt-28 pb-20 sm:pb-28`}
    >
      {/* brasão bem suave ao fundo */}
      <Image
        src="/assets/img/logo-santuario-sm.png"
        alt=""
        width={131}
        height={240}
        className="pointer-events-none absolute -right-16 top-1/2 h-[34rem] w-auto -translate-y-1/2 opacity-[.04]"
      />
      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 grid gap-16 lg:grid-cols-12 lg:gap-20 lg:items-center">
        <figure className="lg:col-span-5 px-8 sm:px-16 lg:px-0 reveal">
          <div className="moldura mx-auto max-w-sm mr-5 sm:mr-auto">
            <div className="relative aspect-[4/5] overflow-hidden rounded-sm img-fallback shadow-[0_40px_80px_-35px_rgba(8,26,51,.6)]">
              <Image
                src="/assets/img/sobre/fachada.jpg"
                alt="Fachada e torre do Santuário"
                fill
                sizes="(min-width: 1024px) 384px, 80vw"
                className="object-cover"
              />
            </div>
          </div>
        </figure>
        <div className="lg:col-span-7 text-center lg:text-left reveal">
          <p className="eyebrow">Nossa história</p>
          <h2 className="mt-5 font-serif font-semibold text-[2.7rem] sm:text-6xl lg:text-7xl leading-[1] tracking-[-0.015em] text-navy-900">
            Conheça o Santuário
          </h2>
          <p className="mt-6 font-serif italic text-2xl sm:text-3xl text-wine-700">{apresentacao.titulo}</p>
          <p className="mt-5 mx-auto lg:mx-0 max-w-xl texto-corrido">{apresentacao.texto}</p>
          <Link href="/sobre" className="btn btn-escuro group mt-10">
            Conheça a nossa história
            <IconeSeta className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>
      </div>
    </section>
  );
}
