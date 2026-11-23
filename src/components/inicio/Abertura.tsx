import Link from 'next/link';
import { type CSSProperties } from 'react';
import { VideoDeFundo } from './VideoDeFundo';

/** Atraso de cada palavra/bloco da entrada (variáveis lidas em globals.css: .palavra e .surge). */
const ordem = (i: number) => ({ '--i': i }) as CSSProperties;
const atraso = (ms: number) => ({ '--atraso': `${ms}ms` }) as CSSProperties;

/**
 * Abertura: o vídeo do Santuário em tela cheia é o protagonista.
 * Pouco texto, embaixo, e sombras só nas bordas (menu no alto, texto embaixo) para o vídeo aparecer limpo.
 */
export function Abertura() {
  return (
    <section id="inicio" className="relative flex min-h-[100svh] items-end overflow-hidden bg-navy-950 img-fallback">
      <VideoDeFundo />

      {/* Sombras leves só no topo (menu) e embaixo (texto): o meio do vídeo fica limpo */}
      <div className="absolute inset-x-0 top-0 h-36 bg-gradient-to-b from-navy-950/65 to-transparent"></div>
      <div className="absolute inset-x-0 bottom-0 h-[55%] sm:h-1/2 bg-gradient-to-t from-navy-950/90 via-navy-950/35 to-transparent"></div>

      <div className="relative w-full max-w-4xl mx-auto px-5 pb-[104px] sm:pb-28 lg:pb-14 text-center">
        <h1 className="font-serif font-semibold text-white text-[2.6rem] sm:text-6xl lg:text-[4.25rem] leading-[1.02] tracking-[-0.01em] drop-shadow-[0_2px_18px_rgba(0,0,0,.55)]">
          {['Bem-vindo', 'à', 'Casa', 'da'].map((palavra, i) => (
            <span key={palavra}>
              <span className="palavra" style={ordem(i)}>
                {palavra}
              </span>{' '}
            </span>
          ))}
          <span className="palavra italic font-medium texto-ouro pr-1" style={ordem(4)}>
            Mãe de Deus
          </span>
        </h1>
        <div className="surge par-de-botoes mt-7 sm:justify-center" style={atraso(700)}>
          <a href="#horarios" className="btn btn-ouro">
            <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
              <circle cx="12" cy="12" r="9"></circle>
              <path d="M12 7v5l3 2"></path>
            </svg>
            Horários de Missa
          </a>
          <Link href="/doacoes" className="btn btn-vidro">
            <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M12 21s-7-4.4-9.5-9A5.5 5.5 0 0 1 12 6a5.5 5.5 0 0 1 9.5 6c-2.5 4.6-9.5 9-9.5 9z"></path>
            </svg>
            Faça sua Doação
          </Link>
        </div>
      </div>
    </section>
  );
}
