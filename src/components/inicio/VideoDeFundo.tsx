'use client';

import { useEffect, useRef } from 'react';

/**
 * Vídeo de fundo da página inicial (hospedado no próprio site, sem som, em loop).
 * Tela deitada recebe a versão 16:9; celular em pé, a versão vertical. O "poster" aparece enquanto carrega.
 *
 * O <video> é escrito como HTML puro de propósito: assim o atributo "muted" chega ao navegador
 * já no primeiro carregamento (o React não escreve "muted" no HTML), condição para tocar sozinho no celular.
 */
const HTML_DO_VIDEO =
  '<video id="hero-video" class="absolute inset-0 w-full h-full object-cover" autoplay muted loop playsinline preload="auto" ' +
  'poster="/assets/img/hero-poster.jpg" disablepictureinpicture disableremoteplayback aria-hidden="true" tabindex="-1">' +
  '<source src="/assets/video/hero-paisagem.mp4" type="video/mp4" media="(orientation: landscape)" />' +
  '<source src="/assets/video/hero-retrato.mp4" type="video/mp4" />' +
  '</video>';

const INTERACOES = ['touchstart', 'pointerdown', 'scroll', 'keydown'] as const;

export function VideoDeFundo() {
  const envoltorio = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // O site abre quando o vídeo começa a tocar (a tela de carregamento some sozinha em até 10 s)
    const abrirSite = () => document.documentElement.classList.remove('carregando');
    const video = envoltorio.current?.querySelector('video');
    if (!video) {
      abrirSite();
      return;
    }

    const tocar = () => video.play();
    const retomar = () => void tocar().catch(() => {});
    video.muted = true; // navegadores só tocam sozinhos vídeo sem som
    video.addEventListener('playing', abrirSite, { once: true });
    video.addEventListener('error', abrirSite, true); // erro no <source> não sobe: por isso a captura

    if (!video.paused && video.readyState >= 3) {
      abrirSite();
    } else {
      tocar().catch(() => {
        // Aparelho bloqueou o vídeo automático (ex.: economia de bateria): abre com a imagem e tenta no primeiro toque
        abrirSite();
        INTERACOES.forEach((ev) => window.addEventListener(ev, retomar, { once: true, passive: true }));
      });
    }

    // Economiza bateria e dados: pausa fora da tela e retoma quando volta
    const observador = new IntersectionObserver(([e]) => {
      if (e?.isIntersecting) retomar();
      else video.pause();
    });
    observador.observe(video);
    // Alguns celulares pausam ao trocar de aba/aplicativo: retoma ao voltar
    const aoVoltar = () => {
      if (!document.hidden && video.getBoundingClientRect().bottom > 0) retomar();
    };
    document.addEventListener('visibilitychange', aoVoltar);

    return () => {
      observador.disconnect();
      document.removeEventListener('visibilitychange', aoVoltar);
      INTERACOES.forEach((ev) => window.removeEventListener(ev, retomar));
      abrirSite();
    };
  }, []);

  return <div ref={envoltorio} className="contents" dangerouslySetInnerHTML={{ __html: HTML_DO_VIDEO }} />;
}
