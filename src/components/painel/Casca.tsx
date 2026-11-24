'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { type ReactNode, useEffect, useRef, useState } from 'react';
import { sair } from '@/app/painel-controle/acoes-de-acesso';
import { type GrupoDoMenu, ICONES, type NomeDoIcone } from './navegacao';

export function Icone({ nome, className = 'h-5 w-5' }: { nome: NomeDoIcone; className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24" aria-hidden="true">
      <path d={ICONES[nome]} />
    </svg>
  );
}

type Pessoa = { nome: string; papel: string; email: string };
type Logo = { url: string; largura: number; altura: number };

const iniciais = (nome: string) =>
  nome
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase())
    .join('');

function Menu({ grupos, aoNavegar }: { grupos: GrupoDoMenu[]; aoNavegar?: () => void }) {
  const caminho = usePathname();
  const ativo = (href: string) => (href === '/painel-controle' ? caminho === href : caminho === href || caminho.startsWith(`${href}/`));
  return (
    <nav aria-label="Painel" className="space-y-7">
      {grupos.map((grupo, i) => (
        <div key={grupo.titulo ?? i}>
          {grupo.titulo && (
            <p className="mb-2 px-3 font-caps text-[.68rem] font-semibold uppercase tracking-[.2em] text-gold-400/80">{grupo.titulo}</p>
          )}
          <ul className="space-y-0.5">
            {grupo.itens.map((item) => {
              const atual = ativo(item.href);
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={aoNavegar}
                    aria-current={atual ? 'page' : undefined}
                    className={`relative flex items-center gap-3 rounded-md px-3 py-2.5 text-[.95rem] transition-colors ${
                      atual ? 'bg-white/10 font-semibold text-white' : 'text-white/75 hover:bg-white/5 hover:text-white'
                    }`}
                  >
                    {atual && <span className="absolute inset-y-2 left-0 w-[3px] rounded-r bg-gold-500" aria-hidden="true" />}
                    <Icone nome={item.icone} className={`h-5 w-5 shrink-0 ${atual ? 'text-gold-400' : 'text-white/55'}`} />
                    {item.rotulo}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </nav>
  );
}

function Marca({ logo }: { logo: Logo }) {
  return (
    <Link href="/painel-controle" className="flex items-center gap-3">
      <Image src={logo.url} alt="" width={logo.largura} height={logo.altura} className="h-11 w-auto" />
      <span className="leading-tight">
        <span className="block font-serif text-lg font-semibold text-white">Painel de controle</span>
        <span className="block text-xs text-white/60">Santuário de Fátima · Realengo</span>
      </span>
    </Link>
  );
}

function CaixaDaPessoa({ pessoa, aoNavegar }: { pessoa: Pessoa; aoNavegar?: () => void }) {
  return (
    <div className="border-t border-white/10 pt-5">
      <div className="flex items-center gap-3 px-1">
        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-md bg-gold-500 font-semibold text-navy-950" aria-hidden="true">
          {iniciais(pessoa.nome)}
        </span>
        <span className="min-w-0 leading-tight">
          <span className="block truncate font-semibold text-white">{pessoa.nome}</span>
          <span className="block truncate text-sm text-white/60">{pessoa.papel}</span>
        </span>
      </div>
      <div className="mt-4 grid grid-cols-2 gap-2">
        <Link href="/painel-controle/conta" onClick={aoNavegar} className="flex items-center justify-center gap-2 whitespace-nowrap rounded-md border border-white/15 px-2 py-2 text-sm text-white/85 hover:bg-white/10">
          <Icone nome="conta" className="h-4 w-4" />
          Minha conta
        </Link>
        <form action={sair}>
          <button type="submit" className="flex w-full items-center justify-center gap-2 whitespace-nowrap rounded-md border border-white/15 px-2 py-2 text-sm text-white/85 hover:bg-white/10">
            <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M15 4h3a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-3M10 16l4-4-4-4M14 12H4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Sair
          </button>
        </form>
      </div>
      <a href="/" target="_blank" rel="noopener" className="mt-3 flex items-center justify-center gap-1.5 py-1 text-sm text-gold-300 hover:text-gold-200">
        Ver o site
        <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M7 17 17 7M9 7h8v8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <span className="sr-only">(abre em outra aba)</span>
      </a>
    </div>
  );
}

/** Moldura do painel: menu lateral no computador, menu de gaveta no celular. */
export function Casca({ grupos, pessoa, logo, children }: { grupos: GrupoDoMenu[]; pessoa: Pessoa; logo: Logo; children: ReactNode }) {
  const [aberto, setAberto] = useState(false);
  const botao = useRef<HTMLButtonElement>(null);
  const fechar = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!aberto) return;
    fechar.current?.focus();
    document.documentElement.classList.add('menu-aberto');
    const tecla = (e: KeyboardEvent) => e.key === 'Escape' && setAberto(false);
    window.addEventListener('keydown', tecla);
    const voltarFoco = botao.current;
    return () => {
      document.documentElement.classList.remove('menu-aberto');
      window.removeEventListener('keydown', tecla);
      voltarFoco?.focus();
    };
  }, [aberto]);

  return (
    <div className="painel-admin min-h-screen bg-[#f4f2ed]">
      {/* Computador */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-72 flex-col bg-navy-950 px-4 pb-5 pt-6 lg:flex">
        <div className="px-1">
          <Marca logo={logo} />
        </div>
        <div className="mt-8 flex-1 overflow-y-auto pr-1">
          <Menu grupos={grupos} />
        </div>
        <CaixaDaPessoa pessoa={pessoa} />
      </aside>

      {/* Celular e tablet */}
      <header className="sticky top-0 z-30 flex h-16 items-center justify-between bg-navy-950 px-4 lg:hidden">
        <Marca logo={logo} />
        <button
          ref={botao}
          type="button"
          onClick={() => setAberto(true)}
          className="grid h-11 w-11 place-items-center rounded-md text-white hover:bg-white/10"
          aria-label="Abrir menu"
          aria-expanded={aberto}
          aria-controls="menu-do-painel"
        >
          <svg className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M4 7h16M4 12h16M4 17h16" strokeLinecap="round" />
          </svg>
        </button>
      </header>
      {aberto && (
        <div className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal="true" aria-label="Menu do painel" id="menu-do-painel">
          <button type="button" className="absolute inset-0 bg-navy-950/60" aria-label="Fechar menu" tabIndex={-1} onClick={() => setAberto(false)} />
          <div className="absolute inset-y-0 left-0 flex w-[min(20rem,88vw)] flex-col bg-navy-950 px-4 pb-5 pt-4 shadow-2xl">
            <div className="flex items-center justify-between px-1">
              <Marca logo={logo} />
              <button
                ref={fechar}
                type="button"
                onClick={() => setAberto(false)}
                className="grid h-11 w-11 place-items-center rounded-md text-white hover:bg-white/10"
                aria-label="Fechar menu"
              >
                <svg className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M6 6l12 12M18 6 6 18" strokeLinecap="round" />
                </svg>
              </button>
            </div>
            <div className="mt-6 flex-1 overflow-y-auto">
              <Menu grupos={grupos} aoNavegar={() => setAberto(false)} />
            </div>
            <CaixaDaPessoa pessoa={pessoa} aoNavegar={() => setAberto(false)} />
          </div>
        </div>
      )}

      <div className="lg:pl-72">
        <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-10 lg:py-12">{children}</div>
      </div>
    </div>
  );
}
