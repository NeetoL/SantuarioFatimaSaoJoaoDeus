import Image from 'next/image';
import { type DadosInstitucionais, linkDoMapa, logoDoSite } from '@/modules/Institucional/Domain/institucional';

const ICONES_DAS_REDES = {
  Instagram: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
      <rect x="3" y="3" width="18" height="18" rx="5"></rect>
      <circle cx="12" cy="12" r="4"></circle>
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor"></circle>
    </svg>
  ),
  YouTube: (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M23 7.2a3 3 0 0 0-2.1-2.1C19 4.6 12 4.6 12 4.6s-7 0-8.9.5A3 3 0 0 0 1 7.2 31 31 0 0 0 .5 12 31 31 0 0 0 1 16.8a3 3 0 0 0 2.1 2.1c1.9.5 8.9.5 8.9.5s7 0 8.9-.5a3 3 0 0 0 2.1-2.1 31 31 0 0 0 .5-4.8 31 31 0 0 0-.5-4.8zM9.8 15.1V8.9l5.7 3.1z"></path>
    </svg>
  ),
  Facebook: (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M14 8V6c0-.9.6-1 1-1h3V1h-4c-3.3 0-4 2.4-4 4v3H7v4h3v11h4V12h3.4l.6-4z"></path>
    </svg>
  ),
} as const;

const titulo = 'font-caps text-[.8rem] font-semibold tracking-[.26em] text-gold-300';

/**
 * Rodapé de todas as páginas: o brasão no alto, ao centro, e embaixo endereço, secretaria e contatos.
 * Endereço, horário da secretaria e contatos vêm dos módulos (fonte única).
 */
export function Rodape({ institucional, secretaria }: { institucional: DadosInstitucionais; secretaria: string[] }) {
  const { endereco, telefone, email } = institucional;
  const logo = logoDoSite(institucional);
  return (
    <footer id="contato" className="grao relative overflow-hidden bg-navy-950 text-white/80">
      <div className="fio-ouro"></div>
      <div
        className="pointer-events-none absolute left-1/2 top-0 h-[22rem] w-[44rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gold-500/10 blur-3xl"
        aria-hidden="true"
      ></div>
      <div className="relative max-w-6xl mx-auto px-5 sm:px-6 lg:px-8 pt-20 pb-10">
        {/* Identidade */}
        <div className="flex flex-col items-center text-center">
          <Image
            src={logo.url}
            alt="Brasão do Santuário"
            width={logo.largura}
            height={logo.altura}
            className="h-24 w-auto drop-shadow-[0_6px_20px_rgba(201,162,39,.25)]"
          />
          <p className="mt-6 font-caps text-[.8rem] font-semibold tracking-[.3em] text-gold-300">
            Santuário Arquidiocesano
          </p>
          <p className="mt-2 font-serif font-semibold text-3xl sm:text-4xl leading-tight text-white">
            Nossa Senhora de Fátima <span className="italic font-medium text-white/85">e São João de Deus</span>
          </p>
          <p className="mt-4 citacao text-lg sm:text-xl text-white/75">
            &quot;Por fim, o meu Imaculado Coração triunfará.&quot;
          </p>
          {/* Redes sociais */}
          <div className="mt-7 flex gap-3">
            {institucional.redesSociais.map((rede) => (
              <a
                key={rede.rede}
                href={rede.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={rede.rotulo}
                className="grid place-items-center w-12 h-12 rounded-full ring-1 ring-inset ring-white/20 hover:bg-gold-500 hover:text-navy-950 hover:ring-gold-500 transition-colors"
              >
                {ICONES_DAS_REDES[rede.rede]}
              </a>
            ))}
          </div>
        </div>

        <div className="mt-16 grid gap-10 border-t border-white/10 pt-12 sm:grid-cols-3 text-center sm:text-left">
          <div>
            <h2 className={titulo}>Endereço</h2>
            <address className="not-italic mt-4 text-base leading-relaxed">
              {endereco.logradouro}
              <br /> {endereco.bairro} — {endereco.cidade} / {endereco.uf}
            </address>
            <a
              href={linkDoMapa(institucional)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block mt-3 text-base text-gold-300 hover:text-gold-200 hover:underline"
            >
              Ver no mapa →
            </a>
          </div>
          <div>
            <h2 className={titulo}>Secretaria Paroquial</h2>
            <ul className="mt-4 space-y-2 text-base">
              {secretaria.map((linha) => (
                <li key={linha}>{linha}</li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className={titulo}>Contato</h2>
            <ul className="mt-4 space-y-2 text-base">
              <li>
                <a href={`tel:${telefone.internacional}`} className="hover:text-gold-300">
                  {telefone.exibicao}
                </a>
              </li>
              <li>
                <a href={`mailto:${email}`} className="hover:text-gold-300 break-all">
                  {email}
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-14 flex flex-col sm:flex-row gap-2 justify-between border-t border-white/10 pt-6 text-sm text-white/70 text-center sm:text-left">
          <p>
            © {new Date().getFullYear()} Santuário Nossa Senhora de Fátima e São João de Deus. Todos os direitos
            reservados.
          </p>
          <p>Desenvolvido com fé pela PASCOM.</p>
        </div>
      </div>
    </footer>
  );
}
