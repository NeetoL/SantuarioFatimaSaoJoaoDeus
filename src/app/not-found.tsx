import type { Metadata } from 'next';
import Link from 'next/link';
import { Cruz } from '@/components/ui/icones';

export const metadata: Metadata = { title: 'Página não encontrada' };

/** Endereço que não existe (404), no estilo do site. */
export default function NaoEncontrada() {
  return (
    <section className="secao-escura text-white min-h-[80svh] flex items-center">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 pt-32 pb-20 text-center">
        <p className="eyebrow claro">Página não encontrada</p>
        <h1 className="font-serif font-semibold text-5xl sm:text-6xl mt-5 leading-[1.05]">Este caminho não existe</h1>
        <div className="divisor mt-7" aria-hidden="true">
          <Cruz />
        </div>
        <p className="mt-7 font-texto italic text-xl sm:text-2xl text-white/85 leading-relaxed">
          O endereço pode ter mudado. Escolha abaixo para onde deseja ir.
        </p>
        <div className="mt-10 flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/" className="btn btn-ouro">
            Página inicial
          </Link>
          <Link href="/missas" className="btn btn-vidro">
            Horários de Missa
          </Link>
        </div>
      </div>
    </section>
  );
}
