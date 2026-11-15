/* ===========================================================
   Santuário de Fátima — interações da página "Sobre"
   (menu, voltar ao topo, animações e ampliação das fotos)
   =========================================================== */
const $  = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

// Se uma foto falhar, esconde-a e deixa o gradiente de fundo do contêiner
$$('img[data-fallback]').forEach((img) =>
  img.addEventListener('error', () => { img.style.visibility = 'hidden'; }, { once: true }));

/* ------------------------------------------------------------
   Navbar: estado ao rolar + menu mobile
   ------------------------------------------------------------ */
const navbar = $('#navbar');
const toggle = $('#menu-toggle');
const mobileMenu = $('#mobile-menu');
const toTop = $('#to-top');

function onScroll() {
  const y = window.scrollY;
  navbar.classList.toggle('scrolled', y > 40 || mobileMenu.classList.contains('open'));
  const showTop = y > 600;
  toTop.classList.toggle('opacity-0', !showTop);
  toTop.classList.toggle('pointer-events-none', !showTop);
}

function setMenu(open) {
  mobileMenu.classList.toggle('open', open);
  toggle.setAttribute('aria-expanded', String(open));
  toggle.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
  onScroll();
}

toggle.addEventListener('click', () => setMenu(!mobileMenu.classList.contains('open')));
$$('#mobile-menu a').forEach((a) => a.addEventListener('click', () => setMenu(false)));
window.addEventListener('resize', () => { if (window.innerWidth >= 1024) setMenu(false); });
window.addEventListener('scroll', onScroll, { passive: true });

/* ------------------------------------------------------------
   Fotos: clique para ampliar (setas e teclado navegam entre todas)
   ------------------------------------------------------------ */
const fotos = $$('.foto-btn');
const modal = $('#modal');
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
  img.className = 'max-h-[78vh] w-auto rounded-2xl shadow-2xl object-contain';
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

/* ------------------------------------------------------------
   Animação de entrada dos blocos + ano no rodapé
   ------------------------------------------------------------ */
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('visible'); revealObserver.unobserve(e.target); } });
}, { threshold: 0.12 });
$$('.reveal').forEach((el) => revealObserver.observe(el));

$('#ano').textContent = new Date().getFullYear();
onScroll();
