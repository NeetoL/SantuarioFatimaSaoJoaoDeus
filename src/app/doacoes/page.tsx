import { type Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { BotaoCopiar } from '@/components/doacoes/BotaoCopiar';
import { QrCodePix } from '@/components/doacoes/QrCodePix';
import { casosDeUso } from '@/config/container';

export const metadata: Metadata = {
  title: 'Doações',
  description:
    'Faça sua doação ao Santuário Nossa Senhora de Fátima e São João de Deus: PIX, transferência bancária e dízimo.',
  alternates: { canonical: '/doacoes' },
};

export default async function PaginaDoacoes() {
  const doacao = await casosDeUso.doacoes.obter();

  return (
    <>
      {/* =====================================================
         ABERTURA
         ===================================================== */}
      <section id="topo" className="relative min-h-[58svh] flex items-end overflow-hidden img-fallback bg-navy-950">
        <Image
          src="/assets/img/sobre/dedicacao-altar.jpg"
          alt=""
          aria-hidden="true"
          className="absolute inset-0 w-full h-full object-cover"
          fill
          sizes="100vw"
          preload
        />
        <div className="absolute inset-0 bg-navy-950/35"></div>
        <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-navy-950/80 to-transparent"></div>
        <div className="absolute inset-x-0 bottom-0 h-3/4 bg-gradient-to-t from-navy-950 via-navy-950/70 to-transparent"></div>
        <div className="relative w-full max-w-5xl mx-auto px-4 sm:px-6 pt-32 pb-16 sm:pb-20 text-center">
          <p className="eyebrow claro">Ofertório e Contribuições</p>
          <h1 className="font-serif font-semibold text-white text-[3.2rem] sm:text-7xl leading-none mt-5 tracking-[-0.01em]">
            Faça sua Doação
          </h1>
          <div className="divisor mt-7" aria-hidden="true">
            <svg viewBox="0 0 12 20">
              <path d="M5 0h2v4h3v2H7v2h5v2H7v10H5V10H0V8h5V6H2V4h3z"></path>
            </svg>
          </div>
          <p className="mt-7 font-texto italic text-xl sm:text-2xl text-white/85 max-w-2xl mx-auto leading-relaxed">
            “Cada um dê conforme decidiu em seu coração, não com tristeza nem por obrigação, pois Deus ama quem dá com
            alegria.” (2Cor 9,7)
          </p>
        </div>
      </section>
      {/* Onde a doação é aplicada */}
      <section id="destino" className="scroll-mt-20 py-20 sm:py-24 bg-ivory-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <header className="text-center max-w-3xl mx-auto reveal">
            <p className="eyebrow">Sua oferta em ação</p>
            <h2 className="font-serif font-semibold text-4xl sm:text-5xl lg:text-6xl text-navy-900 mt-4 leading-[1.05]">
              Sua generosidade sustenta esta casa
            </h2>
            <div className="divisor mt-6" aria-hidden="true">
              <svg viewBox="0 0 12 20">
                <path d="M5 0h2v4h3v2H7v2h5v2H7v10H5V10H0V8h5V6H2V4h3z"></path>
              </svg>
            </div>
          </header>
          <div className="mt-12 grid gap-6 sm:grid-cols-3 reveal">
            {doacao.destinos.map((destino) => (
              <div key={destino.titulo} className="rounded-md bg-white ring-1 ring-ivory-200 p-8 text-center">
                <p className="font-serif font-semibold text-6xl text-gold-600">{destino.percentual}%</p>
                <p className="mt-3 font-serif font-semibold text-2xl text-navy-900">{destino.titulo}</p>
                <p className="mt-2 text-base text-slate-600 leading-relaxed">{destino.descricao}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      {/* Como doar: PIX e transferência (dados em src/mocks/doacoes.ts) */}
      <section id="como-doar" className="scroll-mt-20 secao-escura text-white py-20 sm:py-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <header className="text-center max-w-3xl mx-auto reveal">
            <p className="eyebrow claro">Como doar</p>
            <h2 className="font-serif font-semibold text-4xl sm:text-5xl lg:text-6xl text-white mt-4 leading-[1.05]">
              PIX ou transferência
            </h2>
            <div className="divisor mt-6" aria-hidden="true">
              <svg viewBox="0 0 12 20">
                <path d="M5 0h2v4h3v2H7v2h5v2H7v10H5V10H0V8h5V6H2V4h3z"></path>
              </svg>
            </div>
            <p className="mt-6 text-lg text-white/85">Escolha a forma mais prática para você.</p>
          </header>
          <div className="mt-12 grid lg:grid-cols-2 gap-6">
            {/* PIX */}
            <div className="reveal rounded-md bg-ivory-50 text-slate-700 p-6 sm:p-10 shadow-2xl">
              <div className="flex items-center gap-3">
                <span className="grid place-items-center w-11 h-11 rounded-xl bg-[#32bcad]/15 text-[#1f9c8f]">
                  <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path d="M12 2.5l4.2 4.2-2.5 2.5L12 7.5l-1.7 1.7-2.5-2.5zM6.7 7.8l2.5 2.5L7.5 12l1.7 1.7-2.5 2.5L2.5 12zm10.6 0L21.5 12l-4.2 4.2-2.5-2.5L16.5 12l-1.7-1.7zM12 16.5l1.7-1.7 2.5 2.5L12 21.5l-4.2-4.2 2.5-2.5z"></path>
                  </svg>
                </span>
                <h3 className="font-serif font-semibold text-3xl text-navy-900">Doação via PIX</h3>
              </div>
              <div className="mt-8 flex flex-col sm:flex-row gap-8 items-center">
                <QrCodePix />
                <div className="w-full">
                  <p className="font-caps text-[.875rem] font-semibold tracking-[.2em] text-slate-600">
                    Chave PIX ({doacao.pix.tipoDeChave})
                  </p>
                  <div className="mt-2 flex items-stretch rounded-sm border border-ivory-300 overflow-hidden">
                    <code
                      id="pix-chave"
                      className="flex-1 px-4 py-3 bg-white text-navy-900 font-semibold text-base sm:text-base break-all"
                    >
                      {doacao.pix.chave}
                    </code>{' '}
                    <BotaoCopiar
                      texto={doacao.pix.chave}
                      className="copiar px-4 bg-navy-900 text-white text-sm font-semibold uppercase tracking-[.14em] hover:bg-navy-800 transition-colors"
                    />
                  </div>
                  <p className="mt-4 text-base">
                    <span className="text-slate-600">Favorecido:</span>{' '}
                    <strong className="text-navy-900">Santuário Nossa Senhora de Fátima</strong>
                  </p>
                  <p className="mt-3 text-sm text-slate-600">
                    * QR Code e chave meramente ilustrativos. Substitua pelos dados oficiais.
                  </p>
                </div>
              </div>
            </div>
            {/* Transferência */}
            <div className="reveal rounded-md bg-white/[.04] border border-gold-500/20 p-6 sm:p-10">
              <div className="flex items-center gap-3">
                <span className="grid place-items-center w-11 h-11 rounded-xl bg-gold-500/15 text-gold-400">
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path d="M3 10l9-6 9 6M5 10v8m4-8v8m6-8v8m4-8v8M3 21h18"></path>
                  </svg>
                </span>
                <h3 className="font-serif font-semibold text-3xl">Transferência bancária</h3>
              </div>
              <dl className="mt-8 divide-y divide-white/10">
                <div className="flex justify-between gap-4 py-3">
                  <dt className="text-white/80">Banco</dt>
                  <dd className="font-semibold text-right">{doacao.banco.banco}</dd>
                </div>
                <div className="flex justify-between gap-4 py-3">
                  <dt className="text-white/80">Agência</dt>
                  <dd className="font-semibold">{doacao.banco.agencia}</dd>
                </div>
                <div className="flex justify-between gap-4 py-3 items-center">
                  <dt className="text-white/80">Conta corrente</dt>
                  <dd className="flex items-center gap-3">
                    <span id="conta" className="font-semibold">
                      {doacao.banco.conta}
                    </span>{' '}
                    <BotaoCopiar
                      texto={doacao.banco.conta}
                      className="copiar text-[.8rem] font-semibold uppercase tracking-[.14em] px-3 py-1.5 rounded-sm border border-gold-400 text-gold-400 hover:bg-gold-500 hover:text-navy-950 transition-colors"
                    />
                  </dd>
                </div>
                <div className="flex justify-between gap-4 py-3">
                  <dt className="text-white/80">CNPJ</dt>
                  <dd className="font-semibold">{doacao.banco.cnpj}</dd>
                </div>
                <div className="flex justify-between gap-4 py-3">
                  <dt className="text-white/80">Titular</dt>
                  <dd className="font-semibold text-right">{doacao.banco.titular}</dd>
                </div>
              </dl>
              <p className="mt-6 text-sm text-white/75">
                * Dados bancários ilustrativos. Substitua pelos dados oficiais.
              </p>
            </div>
          </div>
        </div>
      </section>
      {/* Dízimo */}
      <section id="dizimo" className="scroll-mt-20 py-20 sm:py-24 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-2 gap-14 items-center">
          <div className="reveal">
            <p className="eyebrow">Dízimo</p>
            <h2 className="font-serif font-semibold text-4xl sm:text-5xl text-navy-900 mt-4 leading-[1.05]">
              Seja dizimista
            </h2>
            <div className="divisor esquerda mt-6" aria-hidden="true">
              <svg viewBox="0 0 12 20">
                <path d="M5 0h2v4h3v2H7v2h5v2H7v10H5V10H0V8h5V6H2V4h3z"></path>
              </svg>
            </div>
            <div className="texto-corrido mt-8">
              <p>Deseja se tornar dizimista? Procure a secretaria paroquial e faça seu cadastro.</p>
              <p>
                A transparência é um compromisso: a prestação de contas é afixada mensalmente no mural do Santuário.
              </p>
            </div>
            <Link href="/contato" className="btn btn-escuro mt-9">
              <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
                <rect x="3" y="5" width="18" height="14" rx="2"></rect>
                <path d="M3 7l9 6 9-6"></path>
              </svg>
              Falar com a secretaria
            </Link>
          </div>
          <figure className="reveal pr-4 sm:pr-5 pb-4">
            <div className="moldura">
              <Image
                src="/assets/img/sobre/placa.jpg"
                alt="Placa em bronze na parede do Santuário"
                className="w-full aspect-[4/3] object-cover img-fallback"
                width={1280}
                height={960}
              />
            </div>
          </figure>
        </div>
      </section>
    </>
  );
}
