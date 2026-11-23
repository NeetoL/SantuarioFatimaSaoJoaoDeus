/* ===========================================================
   Santuário — página inicial: vídeo do topo + tela de carregamento
   Vídeos em assets/video/ ("Seja bem-vindo ao Santuário", canal oficial do Santuário).
   Para trocar, substitua hero-paisagem.mp4 e hero-retrato.mp4.
   =========================================================== */
(() => {
  // O site abre quando o vídeo começa a tocar. Se demorar mais de 10 s (internet lenta), o script
  // no <head> abre o site mesmo assim, com a imagem (poster) no lugar, e o vídeo entra quando carregar.
  const heroVideo = document.querySelector('#hero-video');
  const abrirSite = () => document.documentElement.classList.remove('carregando');

  if (!heroVideo) { abrirSite(); return; }

  const tocar = () => heroVideo.play();
  heroVideo.muted = true; // navegadores só tocam sozinhos vídeo sem som
  heroVideo.addEventListener('playing', abrirSite, { once: true });
  // Erro ao baixar o vídeo (o erro acontece no <source> e não sobe: por isso a captura)
  heroVideo.addEventListener('error', abrirSite, true);

  // Já está tocando (ex.: vídeo em cache)? Abre na hora. Senão, pede para tocar.
  if (!heroVideo.paused && heroVideo.readyState >= 3) {
    abrirSite();
  } else {
    tocar().catch(() => {
      // O aparelho bloqueou o vídeo automático (ex.: iPhone em modo de economia de bateria).
      // Abre o site com a imagem e tenta de novo no primeiro toque, clique, rolagem ou tecla.
      abrirSite();
      const retomar = () => tocar().catch(() => {});
      ['touchstart', 'pointerdown', 'scroll', 'keydown'].forEach((ev) =>
        window.addEventListener(ev, retomar, { once: true, passive: true }));
    });
  }

  // Economiza bateria/dados: pausa quando o topo sai da tela e retoma quando volta
  new IntersectionObserver(([e]) => {
    if (e.isIntersecting) tocar().catch(() => {});
    else heroVideo.pause();
  }).observe(heroVideo);
  // Alguns celulares pausam o vídeo ao trocar de aba/app: retoma ao voltar
  document.addEventListener('visibilitychange', () => {
    if (!document.hidden && heroVideo.getBoundingClientRect().bottom > 0) tocar().catch(() => {});
  });
})();
