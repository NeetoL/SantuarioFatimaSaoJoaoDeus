'use client';

import Link from 'next/link';

/**
 * Falha inesperada ao montar uma página: mensagem simples, sem detalhes técnicos
 * (o detalhe fica só no log do servidor).
 */
export default function ErroNaPagina({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <section className="secao-escura text-white min-h-[80svh] flex items-center">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 pt-32 pb-20 text-center">
        <p className="eyebrow claro">Algo não saiu como esperado</p>
        <h1 className="font-serif font-semibold text-5xl sm:text-6xl mt-5 leading-[1.05]">
          Não foi possível abrir esta página
        </h1>
        <p className="mt-7 font-texto italic text-xl sm:text-2xl text-white/85 leading-relaxed">
          Tente novamente em instantes. Se o problema continuar, fale com a secretaria.
        </p>
        <div className="mt-10 flex flex-col sm:flex-row gap-3 justify-center">
          <button type="button" onClick={reset} className="btn btn-ouro">
            Tentar de novo
          </button>
          <Link href="/" className="btn btn-vidro">
            Página inicial
          </Link>
        </div>
      </div>
    </section>
  );
}
