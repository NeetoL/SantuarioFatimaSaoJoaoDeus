'use client';

import { useSyncExternalStore } from 'react';

/** Um único relógio para a página inteira, atualizado a cada 15 segundos. */
const INTERVALO_MS = 15_000;
let agoraAtual = Date.now();
const ouvintes = new Set<() => void>();
let relogio: ReturnType<typeof setInterval> | undefined;

function assinar(ouvinte: () => void) {
  ouvintes.add(ouvinte);
  if (!relogio) {
    agoraAtual = Date.now();
    relogio = setInterval(() => {
      agoraAtual = Date.now();
      ouvintes.forEach((o) => o());
    }, INTERVALO_MS);
  }
  return () => {
    ouvintes.delete(ouvinte);
    if (!ouvintes.size && relogio) {
      clearInterval(relogio);
      relogio = undefined;
    }
  };
}

/**
 * Hora atual que se atualiza sozinha (contagens "Começa em…", "Agora", "Encerrado").
 * No servidor e na primeira montagem no navegador usa `inicial` (a hora em que a página foi gerada),
 * para o HTML do servidor e o do navegador serem iguais; logo depois passa a usar o relógio do aparelho.
 */
export function useAgora(inicial: number): Date {
  const instante = useSyncExternalStore(
    assinar,
    () => agoraAtual,
    () => inicial,
  );
  return new Date(instante);
}
