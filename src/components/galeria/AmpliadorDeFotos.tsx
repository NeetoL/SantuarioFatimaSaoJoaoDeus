'use client';

import Image from 'next/image';
import { useCallback, useEffect, useRef, useState } from 'react';

type Foto = { foto: string; legenda: string };

/**
 * Amplia em tela cheia qualquer botão da página com class="foto-btn", data-foto e data-legenda
 * (páginas Início, Sobre e Notícias). Setas, teclado e o deslizar do dedo navegam entre todas;
 * Esc fecha; o foco fica preso no modal.
 */
export function AmpliadorDeFotos() {
  const [fotos, setFotos] = useState<Foto[]>([]);
  const [atual, setAtual] = useState<number | null>(null);
  const modal = useRef<HTMLDivElement>(null);
  const fechar = useRef<HTMLButtonElement>(null);
  const ultimoFoco = useRef<HTMLElement | null>(null);
  const inicioDoToque = useRef<{ x: number; y: number } | null>(null);

  const abrir = useCallback((i: number, lista: Foto[]) => {
    ultimoFoco.current = document.activeElement as HTMLElement | null;
    setFotos(lista);
    setAtual(i);
  }, []);
  const fecharModal = useCallback(() => {
    setAtual(null);
    ultimoFoco.current?.focus();
  }, []);
  const mover = useCallback(
    (passo: number) => setAtual((i) => (i === null ? i : (i + passo + fotos.length) % fotos.length)),
    [fotos.length],
  );

  // Liga os botões de foto da página (clique abre na foto escolhida)
  useEffect(() => {
    const botoes = [...document.querySelectorAll<HTMLButtonElement>('.foto-btn')];
    // Só fotos do próprio site (caminho que começa com "/"), como exige o otimizador de imagens
    const lista = botoes.map((b) => {
      const foto = b.dataset.foto ?? '';
      return { foto: foto.startsWith('/') ? foto : `/${foto}`, legenda: b.dataset.legenda ?? '' };
    });
    const ouvintes = botoes.map((b, i) => {
      if (!b.getAttribute('aria-label')) b.setAttribute('aria-label', `Ampliar foto: ${lista[i]?.legenda ?? ''}`);
      const ouvinte = () => abrir(i, lista);
      b.addEventListener('click', ouvinte);
      return () => b.removeEventListener('click', ouvinte);
    });
    return () => ouvintes.forEach((remover) => remover());
  }, [abrir]);

  // Modal aberto: trava a rolagem, foca o "Fechar" e escuta o teclado
  useEffect(() => {
    if (atual === null) return;
    document.body.style.overflow = 'hidden';
    fechar.current?.focus();
    const aoTeclar = (e: KeyboardEvent) => {
      if (e.key === 'Escape') fecharModal();
      if (e.key === 'ArrowLeft') mover(-1);
      if (e.key === 'ArrowRight') mover(1);
      if (e.key === 'Tab' && modal.current) {
        const focaveis = [...modal.current.querySelectorAll('button')];
        const primeiro = focaveis[0];
        const ultimo = focaveis[focaveis.length - 1];
        if (e.shiftKey && document.activeElement === primeiro) {
          e.preventDefault();
          ultimo?.focus();
        } else if (!e.shiftKey && document.activeElement === ultimo) {
          e.preventDefault();
          primeiro?.focus();
        }
      }
    };
    document.addEventListener('keydown', aoTeclar);
    return () => {
      document.body.style.overflow = '';
      document.removeEventListener('keydown', aoTeclar);
    };
  }, [atual, fecharModal, mover]);

  const foto = atual === null ? null : fotos[atual];
  if (!foto || atual === null) return null;

  return (
    <div
      ref={modal}
      id="modal"
      className="modal fixed inset-0 z-[60] bg-navy-950/90 backdrop-blur-sm p-4 flex items-center justify-center"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-caption"
      onClick={(e) => e.target === e.currentTarget && fecharModal()}
      onTouchStart={(e) => {
        const t = e.touches[0];
        inicioDoToque.current = t ? { x: t.clientX, y: t.clientY } : null;
      }}
      onTouchEnd={(e) => {
        // Deslizar para o lado troca de foto (celular)
        const inicio = inicioDoToque.current;
        const t = e.changedTouches[0];
        inicioDoToque.current = null;
        if (!inicio || !t) return;
        const dx = t.clientX - inicio.x;
        const dy = t.clientY - inicio.y;
        if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy) * 1.5) mover(dx < 0 ? 1 : -1);
      }}
    >
      <button
        ref={fechar}
        type="button"
        onClick={fecharModal}
        className="absolute top-4 right-4 z-10 grid place-items-center w-12 h-12 rounded-full bg-white/10 text-white hover:bg-white/20"
        aria-label="Fechar"
      >
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path d="M6 6l12 12M18 6L6 18"></path>
        </svg>
      </button>
      <button
        type="button"
        onClick={() => mover(-1)}
        className="absolute left-2 sm:left-6 top-1/2 -translate-y-1/2 z-10 grid place-items-center w-12 h-12 rounded-full bg-white/10 text-white hover:bg-white/20"
        aria-label="Foto anterior"
      >
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path d="M15 18l-6-6 6-6"></path>
        </svg>
      </button>
      <button
        type="button"
        onClick={() => mover(1)}
        className="absolute right-2 sm:right-6 top-1/2 -translate-y-1/2 z-10 grid place-items-center w-12 h-12 rounded-full bg-white/10 text-white hover:bg-white/20"
        aria-label="Próxima foto"
      >
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path d="M9 18l6-6-6-6"></path>
        </svg>
      </button>
      <figure className="max-w-5xl w-full flex flex-col items-center">
        <div className="relative w-full h-[78vh]">
          <Image
            key={foto.foto}
            src={foto.foto}
            alt={foto.legenda}
            fill
            sizes="(min-width: 1024px) 1024px, 100vw"
            className="object-contain drop-shadow-2xl"
          />
        </div>
        <figcaption id="modal-caption" className="mt-4 text-center text-white/85 font-serif italic text-xl px-12">
          {foto.legenda} ({atual + 1}/{fotos.length})
        </figcaption>
      </figure>
    </div>
  );
}
