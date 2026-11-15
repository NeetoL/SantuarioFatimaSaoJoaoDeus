/* ===========================================================
   Santuário de Fátima — interações do site
   =========================================================== */

/* ------------------------------------------------------------
   DADOS EDITÁVEIS — altere aqui eventos, notícias e fotos
   ------------------------------------------------------------ */
// Eventos e avisos: ficam em assets/js/eventos.js

const NOTICIAS = [
  { img: 'assets/img/noticia-campanha.jpg', tag: 'Comunidade', data: '10 nov 2026', titulo: 'Campanha solidária arrecada mais de 2 toneladas de alimentos', resumo: 'A generosidade dos fiéis garantiu cestas básicas para famílias atendidas pela pastoral social.' },
  { img: 'assets/img/noticia-catequese.jpg', tag: 'Formação', data: '05 nov 2026', titulo: 'Abertas as inscrições para a Catequese 2027', resumo: 'Crianças, jovens e adultos podem se inscrever na secretaria até o dia 15 de dezembro.' },
];

const GALERIA = [
  { src: 'assets/img/galeria-nave.jpg', legenda: 'Nave central durante a celebração', classe: 'col-span-2 row-span-2' },
  { src: 'assets/img/galeria-velas.jpg', legenda: 'Velas acesas pelas intenções dos fiéis' },
  { src: 'assets/img/galeria-arquitetura.jpg', legenda: 'Detalhes da arquitetura do templo' },
  { src: 'assets/img/galeria-oracao.jpg', legenda: 'Momento de oração da comunidade' },
  { src: 'assets/img/sobre-interior.jpg', legenda: 'Altar preparado para a Santa Missa' },
];

// Vídeo de fundo da página inicial: arquivos em assets/video/ ("Seja bem-vindo ao Santuário",
// canal oficial do Santuário). Para trocar, substitua hero-paisagem.mp4 e hero-retrato.mp4.

const PIX_CHAVE = '00.000.000/0001-00'; // chave ilustrativa

/* ------------------------------------------------------------
   Utilidades
   ------------------------------------------------------------ */
const $  = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

// Escapa texto para inserir com segurança em HTML
const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

// Se uma imagem externa falhar, esconde-a e deixa o gradiente de fallback do contêiner
function attachFallback(img) {
  img.addEventListener('error', () => { img.style.visibility = 'hidden'; }, { once: true });
}

function showToast(msg) {
  const t = $('#toast');
  t.textContent = msg;
  t.classList.remove('opacity-0');
  clearTimeout(showToast._timer);
  showToast._timer = setTimeout(() => t.classList.add('opacity-0'), 2200);
}

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

// Destaca o link da seção visível
const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach((e) => {
    if (!e.isIntersecting) return;
    $$('.nav-link').forEach((l) => {
      const active = l.getAttribute('href') === '#' + e.target.id;
      l.classList.toggle('text-gold-400', active);
      active ? l.setAttribute('aria-current', 'true') : l.removeAttribute('aria-current');
    });
  });
}, { rootMargin: '-45% 0px -50% 0px' });
$$('main section[id], footer[id]').forEach((s) => sectionObserver.observe(s));

/* ------------------------------------------------------------
   Notícias e comunicados: notícias e galeria
   ------------------------------------------------------------ */
$('#noticias-grid').innerHTML = NOTICIAS.map((n) => `
  <article class="reveal group rounded-md overflow-hidden bg-white ring-1 ring-ivory-200 hover:shadow-xl hover:shadow-navy-950/10 transition-shadow flex flex-col">
    <div class="aspect-[16/10] overflow-hidden img-fallback">
      <img src="${n.img}" alt="" loading="lazy" data-fallback class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
    </div>
    <div class="p-6 flex flex-col flex-1">
      <p class="text-xs text-slate-500"><span class="font-caps font-semibold text-gold-700 tracking-[.16em]">${esc(n.tag)}</span> · ${esc(n.data)}</p>
      <h3 class="font-serif font-semibold text-2xl text-navy-900 mt-2 leading-tight">${esc(n.titulo)}</h3>
      <p class="mt-3 text-sm leading-relaxed flex-1">${esc(n.resumo)}</p>
      <a href="#noticias" class="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-navy-800 hover:text-gold-600">
        Leia mais <span class="sr-only">sobre: ${esc(n.titulo)}</span>
        <svg class="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>
      </a>
    </div>
  </article>`).join('');

$('#galeria-grid').innerHTML = GALERIA.map((g, i) => `
  <button class="gal-item group relative overflow-hidden rounded-md img-fallback focus:outline-none focus-visible:ring-4 focus-visible:ring-gold-400 ${g.classe || ''}" data-index="${i}" aria-label="Ampliar foto: ${esc(g.legenda)}">
    <img src="${g.src}" alt="${esc(g.legenda)}" loading="lazy" data-fallback class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
    <span class="absolute inset-0 bg-gradient-to-t from-navy-950/80 via-transparent opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100 transition-opacity"></span>
    <span class="absolute bottom-0 inset-x-0 p-4 text-left text-white text-sm font-medium translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all">${esc(g.legenda)}</span>
  </button>`).join('');

/* ------------------------------------------------------------
   Modal reutilizável (galeria + QR Code)
   ------------------------------------------------------------ */
const modal = $('#modal');
const modalBody = $('#modal-body');
const modalCaption = $('#modal-caption');
let galIndex = -1;          // -1 = modal não está em modo galeria
let lastFocus = null;

function openModal() {
  lastFocus = document.activeElement;
  modal.hidden = false;
  document.body.style.overflow = 'hidden';
  $('#modal-close').focus();
}
function closeModal() {
  modal.hidden = true;
  document.body.style.overflow = '';
  modalBody.innerHTML = '';
  galIndex = -1;
  lastFocus && lastFocus.focus();
}

function showFoto(i) {
  galIndex = (i + GALERIA.length) % GALERIA.length;
  const g = GALERIA[galIndex];
  modalBody.innerHTML = `<img src="${g.src}" alt="${esc(g.legenda)}" class="max-h-[78vh] w-auto rounded-2xl shadow-2xl object-contain" />`;
  modalCaption.textContent = `${g.legenda} (${galIndex + 1}/${GALERIA.length})`;
  $('#modal-prev').hidden = $('#modal-next').hidden = false;
}

$$('.gal-item').forEach((btn) => btn.addEventListener('click', () => { showFoto(+btn.dataset.index); openModal(); }));
$('#modal-prev').addEventListener('click', () => showFoto(galIndex - 1));
$('#modal-next').addEventListener('click', () => showFoto(galIndex + 1));
$('#modal-close').addEventListener('click', closeModal);
modal.addEventListener('click', (e) => { if (e.target === modal) closeModal(); });

document.addEventListener('keydown', (e) => {
  if (modal.hidden) return;
  if (e.key === 'Escape') closeModal();
  if (galIndex >= 0 && e.key === 'ArrowLeft')  showFoto(galIndex - 1);
  if (galIndex >= 0 && e.key === 'ArrowRight') showFoto(galIndex + 1);
  // Mantém o foco dentro do modal (focus trap simples)
  if (e.key === 'Tab') {
    const focaveis = $$('button:not([hidden]), [href]', modal);
    const first = focaveis[0], last = focaveis[focaveis.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  }
});

/* ------------------------------------------------------------
   PIX: QR Code ilustrativo, ampliação e cópia
   ------------------------------------------------------------ */
function drawQR(el, size) {
  el.innerHTML = '';
  if (window.QRCode) {
    new QRCode(el, { text: 'PIX ' + PIX_CHAVE, width: size, height: size, colorDark: '#0f2a4f', colorLight: '#ffffff' });
  } else {
    el.innerHTML = '<span class="text-xs text-slate-400">QR Code</span>';
  }
}
window.addEventListener('load', () => drawQR($('#qr-small'), 144));

$('#qr-open').addEventListener('click', () => {
  galIndex = -1;
  $('#modal-prev').hidden = $('#modal-next').hidden = true;
  modalBody.innerHTML = `
    <div class="bg-white rounded-3xl p-6 sm:p-8 text-center shadow-2xl">
      <div id="qr-big" class="grid place-items-center"></div>
      <p class="mt-4 text-sm text-slate-500">Chave: <strong class="text-navy-900">${esc(PIX_CHAVE)}</strong></p>
    </div>`;
  drawQR($('#qr-big'), Math.min(280, window.innerWidth - 120));
  modalCaption.textContent = 'Aponte a câmera do app do seu banco (QR Code ilustrativo)';
  openModal();
});

$$('.copy-btn').forEach((btn) => btn.addEventListener('click', async () => {
  const texto = $(btn.dataset.copy).textContent.trim();
  try {
    await navigator.clipboard.writeText(texto);
  } catch {
    // Fallback para navegadores sem Clipboard API (ex.: arquivo aberto via file://)
    const ta = Object.assign(document.createElement('textarea'), { value: texto });
    document.body.appendChild(ta); ta.select(); document.execCommand('copy'); ta.remove();
  }
  const original = btn.textContent;
  btn.textContent = 'Copiado!';
  showToast('Copiado para a área de transferência. Deus lhe pague!');
  setTimeout(() => (btn.textContent = original), 1800);
}));

/* ------------------------------------------------------------
   Inicialização geral
   ------------------------------------------------------------ */
$$('img[data-fallback]').forEach(attachFallback);

// Vídeo do topo + tela de carregamento.
// O site abre quando o vídeo começa a tocar. Se demorar mais de 10 s (internet lenta), o script
// no <head> abre o site mesmo assim, com a imagem (poster) no lugar, e o vídeo entra quando carregar.
const heroVideo = $('#hero-video');
const abrirSite = () => document.documentElement.classList.remove('carregando');

if (!heroVideo) {
  abrirSite();
} else {
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
}

// Animação de entrada dos blocos
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('visible'); revealObserver.unobserve(e.target); } });
}, { threshold: 0.12 });
$$('.reveal').forEach((el) => revealObserver.observe(el));

$('#ano').textContent = new Date().getFullYear();
onScroll();

// Calendário de missas: destaca o dia da semana de hoje
const diaDeHoje = $(`.calendario [data-dia="${new Date().getDay()}"]`);
if (diaDeHoje) {
  diaDeHoje.classList.add('hoje');
  diaDeHoje.setAttribute('aria-current', 'date');
  diaDeHoje.insertAdjacentHTML('afterbegin', '<span class="selo-hoje">Hoje</span>');
}

// Voltou pelo botão "voltar" e o navegador mostrou uma cópia guardada da página?
// Recarrega para garantir a versão mais nova do site.
window.addEventListener('pageshow', (e) => { if (e.persisted) location.reload(); });
