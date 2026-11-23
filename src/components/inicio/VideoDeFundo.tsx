'use client';

import { useEffect, useRef, useState } from 'react';

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
const CHAVE = 'video-pausado';

/** Quem pediu "menos movimento" no aparelho, ou pausou o vídeo antes, recebe o vídeo parado. */
function comecaPausado() {
  try {
    if (localStorage.getItem(CHAVE) === '1') return true;
  } catch {
    /* armazenamento bloqueado: segue a preferência do aparelho */
  }
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

export function VideoDeFundo() {
  const envoltorio = useRef<HTMLDivElement>(null);
  // Pausa escolhida pela pessoa (WCAG 2.2.2: vídeo que toca sozinho precisa de um botão para parar)
  const pausadoRef = useRef(false);
  const [pausado, setPausado] = useState(false);

  function alternar() {
    const video = envoltorio.current?.querySelector('video');
    if (!video) return;
    const pausar = !pausadoRef.current;
    pausadoRef.current = pausar;
    setPausado(pausar);
    document.documentElement.classList.toggle('movimento-pausado', pausar); // para também as animações da abertura
    if (pausar) video.pause();
    else void video.play().catch(() => {});
    try {
      if (pausar) localStorage.setItem(CHAVE, '1');
      else localStorage.removeItem(CHAVE);
    } catch {
      /* sem armazenamento: vale só nesta visita */
    }
  }

  useEffect(() => {
    // O site abre quando o vídeo começa a tocar (a tela de carregamento some sozinha em até 10 s)
    const abrirSite = () => document.documentElement.classList.remove('carregando');
    const video = envoltorio.current?.querySelector('video');
    if (!video) {
      abrirSite();
      return;
    }

    const tocar = () => video.play();
    const retomar = () => {
      if (!pausadoRef.current) void tocar().catch(() => {});
    };
    video.muted = true; // navegadores só tocam sozinhos vídeo sem som

    if (comecaPausado()) {
      pausadoRef.current = true;
      setPausado(true); // eslint-disable-line react-hooks/set-state-in-effect -- preferência só existe no navegador
      document.documentElement.classList.add('movimento-pausado');
      video.pause();
      abrirSite();
      return () => {
        document.documentElement.classList.remove('movimento-pausado');
        abrirSite();
      };
    }
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
      document.documentElement.classList.remove('movimento-pausado');
      abrirSite();
    };
  }, []);

  return (
    <>
      <div ref={envoltorio} className="contents" dangerouslySetInnerHTML={{ __html: HTML_DO_VIDEO }} />
      <button
        type="button"
        onClick={alternar}
        className="absolute z-10 right-3 sm:right-6 top-[5.25rem] sm:top-24 grid place-items-center w-11 h-11 rounded-md bg-navy-950/50 text-white ring-1 ring-white/35 backdrop-blur-sm hover:bg-navy-950/75 hover:ring-gold-400 transition"
        aria-label={pausado ? 'Retomar o vídeo e as animações' : 'Pausar o vídeo e as animações'}
        title={pausado ? 'Retomar o vídeo e as animações' : 'Pausar o vídeo e as animações'}
      >
        {pausado ? (
          <svg className="w-5 h-5 ml-0.5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M7 4.5v15l13-7.5z"></path>
          </svg>
        ) : (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M6.5 4.5h4v15h-4zM13.5 4.5h4v15h-4z"></path>
          </svg>
        )}
      </button>
    </>
  );
}
