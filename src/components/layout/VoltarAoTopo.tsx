'use client';

import { useSyncExternalStore } from 'react';

function assinar(ouvinte: () => void) {
  window.addEventListener('scroll', ouvinte, { passive: true });
  return () => window.removeEventListener('scroll', ouvinte);
}

/** Botão dourado "voltar ao topo" (aparece depois de rolar um pouco). */
export function VoltarAoTopo() {
  const visivel = useSyncExternalStore(
    assinar,
    () => window.scrollY > 600,
    () => false,
  );
  return (
    <a
      href="#"
      id="to-top"
      onClick={(e) => {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }}
      className={`fixed bottom-[88px] lg:bottom-5 right-4 lg:right-5 z-40 grid place-items-center w-12 h-12 rounded-full bg-gold-500 text-navy-950 shadow-lg transition-opacity${visivel ? '' : ' opacity-0 pointer-events-none'}`}
      aria-label="Voltar ao topo"
      tabIndex={visivel ? 0 : -1}
    >
      <svg
        className="w-5 h-5"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <path d="M18 15l-6-6-6 6"></path>
      </svg>
    </a>
  );
}
