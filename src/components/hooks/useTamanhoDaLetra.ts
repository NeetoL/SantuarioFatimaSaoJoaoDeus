'use client';

import { useCallback, useSyncExternalStore } from 'react';

/**
 * Tamanho da letra (botão A+): 0 = normal, 1 = grande (112,5%), 2 = maior (125%).
 * A escolha fica guardada neste aparelho (é só uma preferência de leitura, não um dado do site)
 * e vale para todas as páginas. O script no <head> (layout) aplica antes de desenhar.
 */
export const NIVEIS_DA_LETRA = ['Letra normal', 'Letra grande', 'Letra maior'] as const;
const CHAVE = 'fonte';
const EVENTO = 'santuario:tamanho-da-letra';

function ler(): number {
  try {
    const n = Number.parseInt(localStorage.getItem(CHAVE) ?? '0', 10);
    return Number.isNaN(n) ? 0 : Math.min(2, Math.max(0, n));
  } catch {
    return 0;
  }
}

function assinar(ouvinte: () => void) {
  window.addEventListener(EVENTO, ouvinte);
  window.addEventListener('storage', ouvinte);
  return () => {
    window.removeEventListener(EVENTO, ouvinte);
    window.removeEventListener('storage', ouvinte);
  };
}

export function useTamanhoDaLetra() {
  const nivel = useSyncExternalStore(assinar, ler, () => 0);

  const definir = useCallback((novo: number) => {
    const html = document.documentElement;
    html.classList.remove('fonte-1', 'fonte-2');
    if (novo > 0) html.classList.add(`fonte-${novo}`);
    try {
      localStorage.setItem(CHAVE, String(novo));
    } catch {
      /* navegação privada: vale só nesta página */
    }
    window.dispatchEvent(new Event(EVENTO));
  }, []);

  return { nivel, definir, proximo: () => (nivel + 1) % 3 };
}
