/* ===========================================================
   Santuário — comportamento comum das páginas internas
   (Sobre, Eventos): menu, voltar ao topo, animações e rodapé.
   A página inicial usa o main.js, que já inclui tudo isso.
   =========================================================== */
const $  = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

// Se uma foto falhar, esconde-a e deixa o gradiente de fundo do contêiner
$$('img[data-fallback]').forEach((img) =>
  img.addEventListener('error', () => { img.style.visibility = 'hidden'; }, { once: true }));

/* ---------- Navbar: estado ao rolar + menu mobile ---------- */
const navbar = $('#navbar');
const toggle = $('#menu-toggle');
const mobileMenu = $('#mobile-menu');
const toTop = $('#to-top');

function onScroll() {
  const y = window.scrollY;
  navbar.classList.toggle('scrolled', y > 40 || mobileMenu.classList.contains('open'));
  if (toTop) {
    const showTop = y > 600;
    toTop.classList.toggle('opacity-0', !showTop);
    toTop.classList.toggle('pointer-events-none', !showTop);
  }
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

/* ---------- Animação de entrada dos blocos + ano no rodapé ---------- */
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('visible'); revealObserver.unobserve(e.target); } });
}, { threshold: 0.12 });
$$('.reveal').forEach((el) => revealObserver.observe(el));

const ano = $('#ano');
if (ano) ano.textContent = new Date().getFullYear();
onScroll();

// Voltou pelo botão "voltar" e o navegador mostrou uma cópia guardada da página?
// Recarrega para garantir a versão mais nova do site.
window.addEventListener('pageshow', (e) => { if (e.persisted) location.reload(); });
