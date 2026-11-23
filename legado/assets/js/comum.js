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
  document.documentElement.classList.toggle('menu-aberto', open);   // trava a rolagem da página por trás
  toggle.setAttribute('aria-expanded', String(open));
  toggle.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
  onScroll();
}

toggle.addEventListener('click', () => setMenu(!mobileMenu.classList.contains('open')));
$$('#mobile-menu a').forEach((a) => a.addEventListener('click', () => setMenu(false)));
document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && mobileMenu.classList.contains('open')) { setMenu(false); toggle.focus(); } });
window.addEventListener('resize', () => { if (window.innerWidth >= 1024) setMenu(false); });
window.addEventListener('scroll', onScroll, { passive: true });

/* ---------- Tamanho da letra: Normal, Grande e Maior (botão A+) ----------
   A escolha fica guardada neste aparelho e vale para todas as páginas. */
const NIVEIS_LETRA = ['Letra normal', 'Letra grande', 'Letra maior'];
let nivelLetra = 0;
try { nivelLetra = Math.min(2, Math.max(0, parseInt(localStorage.getItem('fonte'), 10) || 0)); } catch (e) { /* sem armazenamento */ }

function avisar(texto) {
  let t = $('#toast');
  if (!t) {
    t = document.createElement('div');
    t.id = 'toast';
    t.className = 'fixed bottom-[96px] lg:bottom-6 left-1/2 -translate-x-1/2 z-[70] px-5 py-3 rounded-full bg-navy-900 text-white text-base shadow-xl opacity-0 pointer-events-none transition-opacity';
    t.setAttribute('role', 'status'); t.setAttribute('aria-live', 'polite');
    document.body.appendChild(t);
  }
  t.textContent = texto;
  t.classList.remove('opacity-0');
  clearTimeout(avisar.timer);
  avisar.timer = setTimeout(() => t.classList.add('opacity-0'), 1800);
}

function aplicarLetra(n, mostrarAviso) {
  nivelLetra = n;
  const html = document.documentElement;
  html.classList.remove('fonte-1', 'fonte-2');
  if (n > 0) html.classList.add('fonte-' + n);
  try { localStorage.setItem('fonte', String(n)); } catch (e) { /* sem armazenamento */ }
  $$('[data-letra-nivel]').forEach((b) => b.setAttribute('aria-pressed', String(Number(b.dataset.letraNivel) === n)));
  $$('[data-letra]').forEach((b) => b.setAttribute('aria-label', `Tamanho da letra: ${NIVEIS_LETRA[n]}. Toque para mudar.`));
  if (mostrarAviso) avisar(NIVEIS_LETRA[n]);
}
aplicarLetra(nivelLetra, false);
$$('[data-letra]').forEach((b) => b.addEventListener('click', () => aplicarLetra((nivelLetra + 1) % 3, true)));
$$('[data-letra-nivel]').forEach((b) => b.addEventListener('click', () => aplicarLetra(Number(b.dataset.letraNivel), true)));

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
