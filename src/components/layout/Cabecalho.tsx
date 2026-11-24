'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState, useSyncExternalStore } from 'react';
import { NIVEIS_DA_LETRA, useTamanhoDaLetra } from '@/components/hooks/useTamanhoDaLetra';
import { type Logo } from '@/modules/Institucional/Domain/institucional';
import { useAvisar } from './Avisos';
import { hrefDaPagina, PAGINAS } from './navegacao';

function assinarRolagem(ouvinte: () => void) {
  window.addEventListener('scroll', ouvinte, { passive: true });
  return () => window.removeEventListener('scroll', ouvinte);
}

/** Cabeçalho fixo: transparente sobre a abertura, sólido ao rolar; menu do celular em tela cheia. */
export function Cabecalho({ telefone, mapa, logo }: { telefone: string; mapa: string; logo: Logo }) {
  const caminho = usePathname();
  const [menuAberto, setMenuAberto] = useState(false);
  const rolou = useSyncExternalStore(
    assinarRolagem,
    () => window.scrollY > 40,
    () => false,
  );
  const { nivel, definir, proximo } = useTamanhoDaLetra();
  const avisar = useAvisar();

  // Menu aberto: trava a rolagem da página por trás; Esc fecha; tela larga fecha
  useEffect(() => {
    document.documentElement.classList.toggle('menu-aberto', menuAberto);
    if (!menuAberto) return;
    const aoTeclar = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setMenuAberto(false);
        document.getElementById('menu-toggle')?.focus();
      }
    };
    const aoRedimensionar = () => window.innerWidth >= 1024 && setMenuAberto(false);
    document.addEventListener('keydown', aoTeclar);
    window.addEventListener('resize', aoRedimensionar);
    return () => {
      document.removeEventListener('keydown', aoTeclar);
      window.removeEventListener('resize', aoRedimensionar);
    };
  }, [menuAberto]);

  const mudarLetra = (novo: number) => {
    definir(novo);
    avisar(NIVEIS_DA_LETRA[novo] ?? '', 1800);
  };
  const fechar = () => setMenuAberto(false);
  const atual = (href: string) => (href === '/' ? caminho === '/' : caminho.startsWith(href));
  const naInicial = caminho === '/';

  return (
    <header
      id="navbar"
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300${rolou || menuAberto ? ' scrolled' : ''}`}
    >
      <nav
        className="max-w-7xl mx-auto px-[16px] sm:px-[24px] lg:px-[32px] h-20 flex items-center justify-between"
        aria-label="Navegação principal"
      >
        {/* Logotipo */}
        <Link
          href={naInicial ? '#inicio' : '/'}
          onClick={fechar}
          className="flex items-center gap-3 group"
          aria-label="Santuário Nossa Senhora de Fátima e São João de Deus — página inicial"
        >
          <Image
            src={logo.url}
            alt=""
            width={logo.largura}
            height={logo.altura}
            preload
            className="h-[56px] w-auto drop-shadow-[0_2px_6px_rgba(0,0,0,.35)] group-hover:scale-105 transition-transform"
          />
          <span className="leading-none lg:hidden xl:block">
            <span className="block font-caps text-[10px] sm:text-[10.5px] font-semibold tracking-[.26em] text-gold-400">
              Santuário Arquidiocesano
            </span>
            <span className="block font-serif text-[19px] sm:text-[22px] font-semibold text-white mt-1">
              Nossa Senhora de Fátima
            </span>
            <span className="block font-serif italic text-[14.5px] sm:text-[15px] text-white/85 mt-0.5">
              e São João de Deus
            </span>
          </span>
        </Link>

        {/* Links do computador */}
        <ul className="hidden lg:flex items-center gap-[4px] text-[12.5px] xl:text-[13px] font-semibold uppercase tracking-[.12em] xl:tracking-[.15em] text-white">
          {PAGINAS.map((p) => (
            <li key={p.href}>
              <Link
                href={hrefDaPagina(p.href, caminho)}
                aria-current={atual(p.href) ? 'page' : undefined}
                className={`nav-link px-[8px] xl:px-[12px] py-[8px] transition-colors ${atual(p.href) ? 'text-gold-400' : 'hover:text-gold-400'}`}
              >
                {p.rotulo}
              </Link>
            </li>
          ))}
          <li className="ml-[8px]">
            <button
              type="button"
              className="btn-letra"
              title="Aumentar ou diminuir a letra"
              aria-label={`Tamanho da letra: ${NIVEIS_DA_LETRA[nivel]}. Clique para mudar.`}
              onClick={() => mudarLetra(proximo())}
            >
              A<span>+</span>
            </button>
          </li>
          <li className="ml-[8px]">
            <Link
              href="/doacoes"
              aria-current={atual('/doacoes') ? 'page' : undefined}
              className={`btn btn-ouro btn-sm${atual('/doacoes') ? ' ring-2 ring-gold-300/70 ring-offset-2 ring-offset-navy-950' : ''}`}
            >
              Doações
            </Link>
          </li>
        </ul>

        {/* Botão do menu (celular) */}
        <button
          id="menu-toggle"
          type="button"
          className="burger lg:hidden grid gap-[5px] p-3 -mr-2 rounded-md text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-gold-400"
          aria-controls="mobile-menu"
          aria-expanded={menuAberto}
          aria-label={menuAberto ? 'Fechar menu' : 'Abrir menu'}
          onClick={() => setMenuAberto((aberto) => !aberto)}
        >
          <span className="block w-6 h-0.5 bg-current rounded"></span>
          <span className="block w-6 h-0.5 bg-current rounded"></span>
          <span className="block w-6 h-0.5 bg-current rounded"></span>
        </button>
      </nav>

      {/* Menu do celular (tela cheia) */}
      <div id="mobile-menu" className={`lg:hidden${menuAberto ? ' open' : ''}`} inert={!menuAberto}>
        <div className="menu-celular-fundo" aria-hidden="true"></div>
        <div className="relative max-w-lg mx-auto px-5 pt-4 pb-12">
          <ul className="menu-celular-links">
            {PAGINAS.map((p) => (
              <li key={p.href}>
                <Link
                  href={hrefDaPagina(p.href, caminho)}
                  aria-current={atual(p.href) ? 'page' : undefined}
                  onClick={fechar}
                >
                  <span className="num">{p.numero}</span>
                  <span className="txt">
                    {p.noMenuDoCelular}
                    <small>{p.descricao}</small>
                  </span>
                  <svg
                    className="seta"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path d="M9 6l6 6-6 6"></path>
                  </svg>
                </Link>
              </li>
            ))}
          </ul>
          <div className="mt-7 grid grid-cols-2 gap-3">
            <a href={`tel:${telefone}`} className="btn btn-vidro">
              <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2"></path>
              </svg>
              Ligar
            </a>
            <a href={mapa} target="_blank" rel="noopener noreferrer" className="btn btn-vidro">
              <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M12 21s-7-6.2-7-11.5A7 7 0 0 1 19 9.5C19 14.8 12 21 12 21z"></path>
                <circle cx="12" cy="9.5" r="2.5"></circle>
              </svg>
              Como chegar
            </a>
          </div>
          <Link href="/doacoes" onClick={fechar} className="btn btn-ouro w-full mt-3">
            <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M12 21s-7-4.4-9.5-9A5.5 5.5 0 0 1 12 6a5.5 5.5 0 0 1 9.5 6c-2.5 4.6-9.5 9-9.5 9z"></path>
            </svg>
            Faça sua Doação
          </Link>

          {/* Tamanho da letra */}
          <div className="mt-9 rounded-md border border-white/15 bg-white/[.04] p-4">
            <p id="letra-titulo" className="font-caps text-[.8rem] font-semibold tracking-[.2em] text-gold-300">
              Tamanho da letra
            </p>
            <div className="mt-3 grid grid-cols-3 gap-2" role="group" aria-labelledby="letra-titulo">
              {(['Normal', 'Grande', 'Maior'] as const).map((rotulo, i) => (
                <button
                  key={rotulo}
                  type="button"
                  className="letra-opcao"
                  aria-pressed={nivel === i}
                  onClick={() => mudarLetra(i)}
                >
                  <span className={['text-[1.1rem]', 'text-[1.4rem]', 'text-[1.75rem]'][i]}>A</span>
                  {rotulo}
                </button>
              ))}
            </div>
          </div>

          <p className="mt-9 text-center font-serif italic text-lg text-white/80">
            “Por fim, o meu Imaculado Coração triunfará.”
          </p>
        </div>
      </div>
    </header>
  );
}
