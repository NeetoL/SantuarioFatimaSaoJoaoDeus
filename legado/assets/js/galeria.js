/* ===========================================================
   Santuário — ampliar fotos (páginas Sobre e Notícias)
   Qualquer botão com class="foto-btn", data-foto (foto grande) e data-legenda
   abre a foto em tela cheia; setas e teclado navegam entre todas.
   =========================================================== */
(() => {
  const $  = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];
  const fotos = $$('.foto-btn');
  const modal = $('#modal');
  if (!fotos.length || !modal) return;
  const modalBody = $('#modal-body');
  const modalCaption = $('#modal-caption');
  let atual = 0;
  let lastFocus = null;

  function mostrarFoto(i) {
    atual = (i + fotos.length) % fotos.length;
    const { foto, legenda } = fotos[atual].dataset;
    const img = document.createElement('img');
    img.src = foto;
    img.alt = legenda;
    img.className = 'max-h-[78vh] w-auto rounded-md shadow-2xl object-contain';
    modalBody.replaceChildren(img);
    modalCaption.textContent = `${legenda} (${atual + 1}/${fotos.length})`;
  }
  function abrirModal(i) {
    lastFocus = document.activeElement;
    mostrarFoto(i);
    modal.hidden = false;
    document.body.style.overflow = 'hidden';
    $('#modal-close').focus();
  }
  function fecharModal() {
    modal.hidden = true;
    document.body.style.overflow = '';
    modalBody.replaceChildren();
    lastFocus && lastFocus.focus();
  }

  fotos.forEach((btn, i) => {
    btn.setAttribute('aria-label', `Ampliar foto: ${btn.dataset.legenda}`);
    btn.addEventListener('click', () => abrirModal(i));
  });
  $('#modal-prev').addEventListener('click', () => mostrarFoto(atual - 1));
  $('#modal-next').addEventListener('click', () => mostrarFoto(atual + 1));
  $('#modal-close').addEventListener('click', fecharModal);
  modal.addEventListener('click', (e) => { if (e.target === modal) fecharModal(); });

  document.addEventListener('keydown', (e) => {
    if (modal.hidden) return;
    if (e.key === 'Escape') fecharModal();
    if (e.key === 'ArrowLeft')  mostrarFoto(atual - 1);
    if (e.key === 'ArrowRight') mostrarFoto(atual + 1);
    // Mantém o foco dentro do modal
    if (e.key === 'Tab') {
      const focaveis = $$('button', modal);
      const first = focaveis[0], last = focaveis[focaveis.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  });
})();
