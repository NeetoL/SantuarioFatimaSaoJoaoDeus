'use client';

import { usePathname } from 'next/navigation';
import { useEffect } from 'react';

/**
 * Entrada suave dos blocos (classe "reveal") ao aparecerem na tela — a cada troca de página.
 * Quem prefere menos movimento vê tudo direto (regra no CSS).
 * Também recarrega a página quando o navegador mostra uma cópia antiga guardada (botão "voltar").
 */
export function AnimacaoAoRolar() {
  const caminho = usePathname();

  useEffect(() => {
    const observador = new IntersectionObserver(
      (entradas) => {
        entradas.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add('visible');
            observador.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12 },
    );
    const observar = () => document.querySelectorAll('.reveal:not(.visible)').forEach((el) => observador.observe(el));
    observar();
    // Blocos que aparecem depois (ex.: filtros da agenda) também entram com animação
    const mutacoes = new MutationObserver(observar);
    mutacoes.observe(document.getElementById('conteudo') ?? document.body, { childList: true, subtree: true });
    return () => {
      observador.disconnect();
      mutacoes.disconnect();
    };
  }, [caminho]);

  useEffect(() => {
    const aoMostrar = (e: PageTransitionEvent) => e.persisted && window.location.reload();
    window.addEventListener('pageshow', aoMostrar);
    return () => window.removeEventListener('pageshow', aoMostrar);
  }, []);

  return null;
}
