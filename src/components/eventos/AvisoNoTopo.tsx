'use client';

import { useAgora } from '@/components/hooks/useAgora';
import { type Evento, rotuloDoAvisoNoTopo } from '@/modules/Eventos/Domain/evento';

/** Aviso dourado sobre o vídeo: o evento mais próximo, quando é nos próximos dias. */
export function AvisoNoTopo({
  evento,
  agoraInicial,
}: {
  evento: Pick<Evento, 'titulo' | 'data' | 'hora'>;
  agoraInicial: number;
}) {
  const rotulo = rotuloDoAvisoNoTopo(evento, useAgora(agoraInicial));
  if (!rotulo) return null;
  return (
    <a
      id="aviso-hero"
      href="#avisos"
      className="group inline-flex max-w-full items-center gap-3 mb-7 rounded-2xl sm:rounded-full bg-navy-950/60 pl-4 pr-3.5 py-2 ring-1 ring-gold-400/50 backdrop-blur-md hover:ring-gold-400 hover:bg-navy-950/75 transition"
    >
      <span className="relative flex w-2 h-2 shrink-0">
        <span className="absolute inset-0 rounded-full bg-gold-400 opacity-75 animate-ping"></span>
        <span className="relative w-2 h-2 rounded-full bg-gold-400"></span>
      </span>
      <span className="sm:shrink-0 text-left font-caps text-[.8rem] sm:text-[.875rem] font-semibold tracking-[.22em] text-gold-300">
        {rotulo}
      </span>
      <span className="min-w-0 text-left leading-snug sm:truncate font-serif text-base sm:text-lg text-white">
        {evento.titulo}
      </span>
      <svg
        className="w-4 h-4 shrink-0 text-gold-300 group-hover:translate-x-0.5 transition-transform"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <path d="M5 12h14M13 6l6 6-6 6"></path>
      </svg>
    </a>
  );
}
