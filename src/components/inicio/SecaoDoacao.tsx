import Link from 'next/link';

/** Doações: um painel com moldura dupla dourada e a luz vindo do alto (a página completa é /doacoes). */
export function SecaoDoacao() {
  return (
    <section id="doacoes" className="grao relative scroll-mt-24 overflow-hidden secao-escura text-white py-20 sm:py-28">
      <div className="relative mx-auto max-w-4xl px-4 sm:px-6 reveal">
        <div className="moldura-dupla relative isolate overflow-hidden rounded-md bg-gradient-to-b from-gold-500/[.12] via-navy-900/25 to-transparent px-6 sm:px-16 pt-14 sm:pt-20 pb-12 sm:pb-16 text-center">
          {/* luz que entra pelo alto */}
          <div
            className="pointer-events-none absolute left-1/2 top-0 -z-10 -translate-x-1/2 -translate-y-1/3"
            aria-hidden="true"
          >
            <div className="respira h-[24rem] w-[24rem] sm:h-[32rem] sm:w-[32rem] rounded-full bg-[radial-gradient(circle,rgba(230,207,143,.32)_0%,rgba(201,162,39,.09)_40%,transparent_68%)]"></div>
          </div>

          <p className="eyebrow claro">Ofertório e Contribuições</p>
          <h2 className="mt-5 font-serif font-semibold text-[2.5rem] sm:text-6xl leading-[1.02] tracking-[-0.015em]">
            Sua generosidade sustenta esta casa
          </h2>
          <p className="mt-7 citacao text-xl sm:text-[1.6rem] text-white/85 leading-snug">
            “Cada um dê conforme decidiu em seu coração, não com tristeza nem por obrigação, pois Deus ama quem dá com
            alegria.” <span className="whitespace-nowrap">(2Cor 9,7)</span>
          </p>
          <div className="mt-10 flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/doacoes" className="btn btn-ouro">
              <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M12 21s-7-4.4-9.5-9A5.5 5.5 0 0 1 12 6a5.5 5.5 0 0 1 9.5 6c-2.5 4.6-9.5 9-9.5 9z"></path>
              </svg>
              Faça sua doação
            </Link>
            <Link href="/doacoes#dizimo" className="btn btn-vidro">
              Seja dizimista
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
