import Image from 'next/image';
import Link from 'next/link';
import { Cruz } from '@/components/ui/icones';
import { type DadosInstitucionais } from '@/modules/Institucional/Domain/institucional';

/** Conheça o Santuário: foto, uma frase e o convite para a história completa (página Sobre). */
export function SecaoSantuario({ apresentacao }: { apresentacao: DadosInstitucionais['apresentacao'] }) {
  return (
    <section id="santuario" className="scroll-mt-20 py-20 sm:py-28 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 grid gap-12 lg:grid-cols-2 lg:gap-16 lg:items-center">
        <figure className="moldura mr-4 sm:mr-6 reveal">
          <div className="relative aspect-[4/3] overflow-hidden rounded-sm img-fallback shadow-2xl shadow-navy-950/15">
            <Image
              src="/assets/img/sobre/fachada.jpg"
              alt="Fachada e torre do Santuário"
              fill
              sizes="(min-width: 1152px) 540px, (min-width: 1024px) 48vw, 100vw"
              className="object-cover"
            />
          </div>
        </figure>
        <div className="text-center lg:text-left reveal">
          <p className="eyebrow">Nossa história</p>
          <h2 className="font-serif font-semibold text-4xl sm:text-5xl lg:text-6xl text-navy-900 mt-4 leading-[1.05]">
            Conheça o Santuário
          </h2>
          <div className="divisor esquerda-lg mt-6" aria-hidden="true">
            <Cruz />
          </div>
          <p className="mt-6 font-serif italic text-2xl text-wine-700">{apresentacao.titulo}</p>
          <p className="mt-4 text-lg leading-relaxed text-slate-600">{apresentacao.texto}</p>
          <Link href="/sobre" className="btn btn-escuro mt-9">
            Conheça a nossa história
          </Link>
        </div>
      </div>
    </section>
  );
}
