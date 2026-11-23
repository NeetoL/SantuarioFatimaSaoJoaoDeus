import { type Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { FormularioDeContato } from '@/components/contato/FormularioDeContato';
import { casosDeUso } from '@/config/container';
import { linkDoMapa, linkDoMapaIncorporado } from '@/modules/Institucional/Domain/institucional';

export const metadata: Metadata = {
  title: 'Contato',
  description:
    'Fale com o Santuário Nossa Senhora de Fátima e São João de Deus: endereço, telefone, e-mail e mensagem para a secretaria paroquial.',
  alternates: { canonical: '/contato' },
};

export default async function PaginaContato() {
  const [dados, secretaria] = await Promise.all([
    casosDeUso.institucional.obter(),
    casosDeUso.horarios.resumoDaSecretaria(),
  ]);

  return (
    <>
      {/* =====================================================
         ABERTURA
         ===================================================== */}
      <section id="topo" className="relative min-h-[58svh] flex items-end overflow-hidden img-fallback bg-navy-950">
        <Image
          src="/assets/img/sobre/entrada.jpg"
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
          <p className="eyebrow claro">Secretaria Paroquial</p>
          <h1 className="font-serif font-semibold text-white text-[3.2rem] sm:text-7xl leading-none mt-5 tracking-[-0.01em]">
            Fale Conosco
          </h1>
          <div className="divisor mt-7" aria-hidden="true">
            <svg viewBox="0 0 12 20">
              <path d="M5 0h2v4h3v2H7v2h5v2H7v10H5V10H0V8h5V6H2V4h3z"></path>
            </svg>
          </div>
          <p className="mt-7 font-texto italic text-xl sm:text-2xl text-white/85 max-w-2xl mx-auto leading-relaxed">
            Estamos à disposição para informações, sacramentos, intenções de missa e o que você precisar.
          </p>
        </div>
      </section>
      {/* Canais de atendimento */}
      <section id="canais" className="scroll-mt-20 py-16 sm:py-24 bg-ivory-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 reveal">
            <article className="group flex flex-col rounded-md bg-white ring-1 ring-ivory-200 p-7 hover:shadow-xl hover:shadow-navy-950/10 hover:-translate-y-0.5 transition">
              <span className="grid place-items-center w-12 h-12 rounded-full bg-navy-900 text-gold-300 ring-4 ring-gold-500/15">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path d="M12 21s-7-6.2-7-11.5A7 7 0 0 1 19 9.5C19 14.8 12 21 12 21z"></path>
                  <circle cx="12" cy="9.5" r="2.5"></circle>
                </svg>
              </span>
              <p className="mt-5 font-caps text-[.875rem] font-semibold tracking-[.22em] text-gold-700">Endereço</p>
              <div className="mt-2 font-serif text-[1.35rem] leading-snug text-navy-900 break-words">
                {dados.endereco.logradouro}
                <br />
                <span className="text-slate-600 text-lg">
                  {dados.endereco.bairro} — {dados.endereco.cidade} / {dados.endereco.uf}
                </span>
              </div>
              <a
                href={linkDoMapa(dados)}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-auto pt-5 inline-flex items-center gap-2 text-[.875rem] font-semibold uppercase tracking-[.16em] text-navy-800 hover:text-gold-700"
              >
                Como chegar{' '}
                <svg
                  className="w-4 h-4 group-hover:translate-x-0.5 transition-transform"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path d="M5 12h14M13 6l6 6-6 6"></path>
                </svg>
              </a>
            </article>
            <article className="group flex flex-col rounded-md bg-white ring-1 ring-ivory-200 p-7 hover:shadow-xl hover:shadow-navy-950/10 hover:-translate-y-0.5 transition">
              <span className="grid place-items-center w-12 h-12 rounded-full bg-navy-900 text-gold-300 ring-4 ring-gold-500/15">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2"></path>
                </svg>
              </span>
              <p className="mt-5 font-caps text-[.875rem] font-semibold tracking-[.22em] text-gold-700">Telefone</p>
              <div className="mt-2 font-serif text-[1.35rem] leading-snug text-navy-900 break-words">
                {dados.telefone.exibicao}
              </div>
              <a
                href={`tel:${dados.telefone.internacional}`}
                className="mt-auto pt-5 inline-flex items-center gap-2 text-[.875rem] font-semibold uppercase tracking-[.16em] text-navy-800 hover:text-gold-700"
              >
                Ligar agora{' '}
                <svg
                  className="w-4 h-4 group-hover:translate-x-0.5 transition-transform"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path d="M5 12h14M13 6l6 6-6 6"></path>
                </svg>
              </a>
            </article>
            <article className="group flex flex-col rounded-md bg-white ring-1 ring-ivory-200 p-7 hover:shadow-xl hover:shadow-navy-950/10 hover:-translate-y-0.5 transition">
              <span className="grid place-items-center w-12 h-12 rounded-full bg-navy-900 text-gold-300 ring-4 ring-gold-500/15">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <rect x="3" y="5" width="18" height="14" rx="2"></rect>
                  <path d="M3 7l9 6 9-6"></path>
                </svg>
              </span>
              <p className="mt-5 font-caps text-[.875rem] font-semibold tracking-[.22em] text-gold-700">E-mail</p>
              <div className="mt-2 font-serif text-[1.35rem] leading-snug text-navy-900 break-words">
                <span className="text-[1.15rem]">{dados.email}</span>
              </div>
              <a
                href={`mailto:${dados.email}`}
                className="mt-auto pt-5 inline-flex items-center gap-2 text-[.875rem] font-semibold uppercase tracking-[.16em] text-navy-800 hover:text-gold-700"
              >
                Escrever{' '}
                <svg
                  className="w-4 h-4 group-hover:translate-x-0.5 transition-transform"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path d="M5 12h14M13 6l6 6-6 6"></path>
                </svg>
              </a>
            </article>
            <article className="group flex flex-col rounded-md bg-white ring-1 ring-ivory-200 p-7 hover:shadow-xl hover:shadow-navy-950/10 hover:-translate-y-0.5 transition">
              <span className="grid place-items-center w-12 h-12 rounded-full bg-navy-900 text-gold-300 ring-4 ring-gold-500/15">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <circle cx="12" cy="12" r="9"></circle>
                  <path d="M12 7v5l3 2"></path>
                </svg>
              </span>
              <p className="mt-5 font-caps text-[.875rem] font-semibold tracking-[.22em] text-gold-700">
                Secretaria Paroquial
              </p>
              <div className="mt-2 font-serif text-[1.35rem] leading-snug text-navy-900 break-words">
                {secretaria.map((linha) => (
                  <span
                    key={linha}
                    className={linha.endsWith('fechada') ? 'block text-base text-slate-600' : 'block text-lg'}
                  >
                    {linha}
                  </span>
                ))}
                <span className="block text-base text-slate-600 mt-2">
                  Intenções de missa: presencialmente na secretaria
                </span>
              </div>
              <Link
                href="/missas#secretaria"
                className="mt-auto pt-5 inline-flex items-center gap-2 text-[.875rem] font-semibold uppercase tracking-[.16em] text-navy-800 hover:text-gold-700"
              >
                Todos os horários{' '}
                <svg
                  className="w-4 h-4 group-hover:translate-x-0.5 transition-transform"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path d="M5 12h14M13 6l6 6-6 6"></path>
                </svg>
              </Link>
            </article>
          </div>
        </div>
      </section>
      {/* Mensagem + mapa */}
      <section id="mensagem" className="scroll-mt-20 py-20 sm:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-2 gap-14 lg:gap-16 items-start">
          <div className="reveal">
            <p className="eyebrow">Escreva para nós</p>
            <h2 className="font-serif font-semibold text-4xl sm:text-5xl text-navy-900 mt-4 leading-[1.05]">
              Envie uma mensagem
            </h2>
            <div className="divisor esquerda mt-6" aria-hidden="true">
              <svg viewBox="0 0 12 20">
                <path d="M5 0h2v4h3v2H7v2h5v2H7v10H5V10H0V8h5V6H2V4h3z"></path>
              </svg>
            </div>
            {/* Ao enviar, abre o aplicativo de e-mail com a mensagem pronta (componente FormularioDeContato) */}
            <FormularioDeContato email={dados.email} />
          </div>
          <div className="reveal pr-4 sm:pr-5 pb-4 lg:mt-24">
            <div className="moldura">
              <div className="bg-navy-100 aspect-[4/3] lg:aspect-[5/6]">
                <iframe
                  src={linkDoMapaIncorporado(dados)}
                  title="Mapa: localização do Santuário em Realengo"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="w-full h-full border-0"
                ></iframe>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
