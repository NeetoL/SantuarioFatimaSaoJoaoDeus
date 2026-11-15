/* ===========================================================
   Santuário de Fátima — interações do site
   =========================================================== */

/* ------------------------------------------------------------
   DADOS EDITÁVEIS — altere aqui eventos, notícias e fotos
   ------------------------------------------------------------ */
const EVENTOS = [
  { categoria: 'Missa',  titulo: 'Missa Mensal de Fátima',        data: '2026-12-13', hora: '19h30', local: 'Igreja Matriz',      descricao: 'Missa solene em memória das aparições, seguida de procissão luminosa.' },
  { categoria: 'Novena', titulo: 'Novena de Natal em Família',    data: '2026-12-16', hora: '20h00', local: 'Casas da comunidade', descricao: 'Nove encontros de oração nas casas, preparando o coração para o Natal.' },
  { categoria: 'Missa',  titulo: 'Missa da Noite de Natal',        data: '2026-12-24', hora: '22h00', local: 'Igreja Matriz',      descricao: 'Celebração do nascimento do Senhor com o coral do Santuário.' },
  { categoria: 'Missa',  titulo: 'Solenidade de Santa Maria, Mãe de Deus', data: '2027-01-01', hora: '09h00', local: 'Igreja Matriz', descricao: 'Iniciamos o ano sob a proteção de Maria. Missa pela paz mundial.' },
  { categoria: 'Novena', titulo: 'Terço dos Homens',               data: '2026-11-19', hora: '20h00', local: 'Capela do Santíssimo', descricao: 'Toda quinta-feira os homens se reúnem para rezar o Santo Terço.' },
  { categoria: 'Festa',  titulo: 'Quermesse Beneficente',          data: '2026-11-28', hora: '18h00', local: 'Pátio do Santuário', descricao: 'Barracas, música e comidas típicas. Renda revertida às obras sociais.' },
];

const NOTICIAS = [
  { img: 'assets/img/noticia-campanha.jpg', tag: 'Comunidade', data: '10 nov 2026', titulo: 'Campanha solidária arrecada mais de 2 toneladas de alimentos', resumo: 'A generosidade dos fiéis garantiu cestas básicas para famílias atendidas pela pastoral social.' },
  { img: 'assets/img/noticia-catequese.jpg', tag: 'Formação', data: '05 nov 2026', titulo: 'Abertas as inscrições para a Catequese 2027', resumo: 'Crianças, jovens e adultos podem se inscrever na secretaria até o dia 15 de dezembro.' },
];

const GALERIA = [
  { src: 'assets/img/hero-santuario.jpg', legenda: 'Fachada do Santuário ao entardecer', classe: 'col-span-2 row-span-2' },
  { src: 'assets/img/galeria-nave.jpg', legenda: 'Nave central durante a celebração' },
  { src: 'assets/img/galeria-velas.jpg', legenda: 'Velas acesas pelas intenções dos fiéis' },
  { src: 'assets/img/galeria-arquitetura.jpg', legenda: 'Detalhes da arquitetura do templo', classe: 'row-span-2' },
  { src: 'assets/img/galeria-oracao.jpg', legenda: 'Momento de oração da comunidade' },
  { src: 'assets/img/sobre-interior.jpg', legenda: 'Altar preparado para a Santa Missa', classe: 'col-span-2 md:col-span-1' },
];

// Vídeo de fundo da página inicial (ID do YouTube: o que vem depois de "watch?v=").
// Deixe vazio ('') para usar só a imagem.
const HERO_YOUTUBE_ID = 'nwSWcDJKsHY'; // "Seja bem-vindo ao Santuario" — canal oficial do Santuário

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
   Eventos: renderização + filtros
   ------------------------------------------------------------ */
const MESES = ['JAN', 'FEV', 'MAR', 'ABR', 'MAI', 'JUN', 'JUL', 'AGO', 'SET', 'OUT', 'NOV', 'DEZ'];
const DIAS  = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];
const COR_CATEGORIA = { Missa: 'bg-navy-100 text-navy-800', Novena: 'bg-gold-50 text-gold-600', Festa: 'bg-rose-50 text-rose-700' };

function renderEventos(filtro = 'todos') {
  const lista = EVENTOS
    .filter((ev) => filtro === 'todos' || ev.categoria === filtro)
    .sort((a, b) => a.data.localeCompare(b.data));

  $('#eventos-grid').innerHTML = lista.map((ev) => {
    const d = new Date(ev.data + 'T12:00:00');
    return `
      <article class="group bg-white rounded-3xl p-6 shadow-sm ring-1 ring-slate-200/70 hover:shadow-xl hover:-translate-y-1 transition-all flex gap-5">
        <div class="shrink-0 w-16 text-center rounded-2xl bg-navy-900 text-white py-3 h-fit group-hover:bg-gold-500 group-hover:text-navy-950 transition-colors">
          <p class="font-serif text-3xl leading-none">${String(d.getDate()).padStart(2, '0')}</p>
          <p class="text-xs font-semibold tracking-wider mt-1">${MESES[d.getMonth()]}</p>
        </div>
        <div class="min-w-0">
          <span class="inline-block text-xs font-semibold px-2.5 py-1 rounded-full ${COR_CATEGORIA[ev.categoria] || ''}">${esc(ev.categoria)}</span>
          <h3 class="font-serif text-xl text-navy-900 mt-2 leading-snug">${esc(ev.titulo)}</h3>
          <ul class="mt-3 space-y-1 text-sm text-slate-500">
            <li class="flex items-center gap-2"><svg class="w-4 h-4 text-gold-500" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>${DIAS[d.getDay()]}, ${esc(ev.hora)}</li>
            <li class="flex items-center gap-2"><svg class="w-4 h-4 text-gold-500" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 21s-7-6.2-7-11a7 7 0 0 1 14 0c0 4.8-7 11-7 11z"/><circle cx="12" cy="10" r="2.5"/></svg>${esc(ev.local)}</li>
          </ul>
          <p class="mt-3 text-sm leading-relaxed">${esc(ev.descricao)}</p>
        </div>
      </article>`;
  }).join('') || '<p class="col-span-full text-center text-slate-500">Nenhum evento nesta categoria no momento.</p>';
}

function setFiltro(filtro) {
  $$('.filter-btn').forEach((b) => {
    const ativo = b.dataset.filter === filtro;
    b.setAttribute('aria-pressed', String(ativo));
    b.className = 'filter-btn px-4 py-2 rounded-full text-sm font-medium border transition-colors ' +
      (ativo ? 'bg-navy-900 text-white border-navy-900' : 'bg-white text-navy-900 border-slate-200 hover:border-gold-500');
  });
  renderEventos(filtro);
}
$$('.filter-btn').forEach((b) => b.addEventListener('click', () => setFiltro(b.dataset.filter)));
setFiltro('todos');

/* ------------------------------------------------------------
   PASCOM: notícias e galeria
   ------------------------------------------------------------ */
$('#noticias-grid').innerHTML = NOTICIAS.map((n) => `
  <article class="reveal group rounded-3xl overflow-hidden bg-white ring-1 ring-slate-200/70 shadow-sm hover:shadow-xl transition-shadow flex flex-col">
    <div class="aspect-[16/10] overflow-hidden img-fallback">
      <img src="${n.img}" alt="" loading="lazy" data-fallback class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
    </div>
    <div class="p-6 flex flex-col flex-1">
      <p class="text-xs text-slate-500"><span class="font-semibold text-gold-600 uppercase tracking-wider">${esc(n.tag)}</span> · ${esc(n.data)}</p>
      <h3 class="font-serif text-xl text-navy-900 mt-2 leading-snug">${esc(n.titulo)}</h3>
      <p class="mt-3 text-sm leading-relaxed flex-1">${esc(n.resumo)}</p>
      <a href="#pascom" class="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-navy-800 hover:text-gold-600">
        Leia mais <span class="sr-only">sobre: ${esc(n.titulo)}</span>
        <svg class="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>
      </a>
    </div>
  </article>`).join('');

$('#galeria-grid').innerHTML = GALERIA.map((g, i) => `
  <button class="gal-item group relative overflow-hidden rounded-2xl img-fallback focus:outline-none focus-visible:ring-4 focus-visible:ring-gold-400 ${g.classe || ''}" data-index="${i}" aria-label="Ampliar foto: ${esc(g.legenda)}">
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

// Vídeo do hero (YouTube, sem som, em loop). A imagem fica por baixo e aparece
// enquanto o vídeo carrega. Quem prefere menos movimento vê só a imagem estática.
const heroVideo = $('#hero-video');
// Aberto direto do computador (file://) o YouTube recusa o player (erro 153), então nesse caso fica só a imagem.
const podeUsarYouTube = location.protocol.startsWith('http');
if (heroVideo && HERO_YOUTUBE_ID && podeUsarYouTube && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  // Desliga as legendas (inclusive as automáticas, que o parâmetro cc_load_policy não bloqueia)
  const tirarLegenda = (player) => {
    try { player.unloadModule('captions'); player.unloadModule('cc'); player.setOption('captions', 'track', {}); } catch {}
  };

  // Usa a API oficial do YouTube para controlar o player
  window.onYouTubeIframeAPIReady = () => {
    new YT.Player(heroVideo.appendChild(document.createElement('div')), {
      host: 'https://www.youtube-nocookie.com',
      videoId: HERO_YOUTUBE_ID,
      playerVars: {
        autoplay: 1, mute: 1, loop: 1, playlist: HERO_YOUTUBE_ID, // "playlist" com o próprio ID é o que faz o loop funcionar
        controls: 0, disablekb: 1, cc_load_policy: 0, fs: 0, rel: 0, iv_load_policy: 3, playsinline: 1,
      },
      events: {
        onReady: (e) => {
          const iframe = e.target.getIframe();
          iframe.title = 'Vídeo de fundo do Santuário';
          iframe.tabIndex = -1;
          e.target.mute();
          e.target.playVideo();
          tirarLegenda(e.target);
        },
        onStateChange: (e) => {
          if (e.data !== YT.PlayerState.PLAYING) return;
          tirarLegenda(e.target); // repete a cada início/loop, pois o YouTube pode reativá-las
          // Mostra o vídeo só depois que o YouTube esconde o título e os botões iniciais
          setTimeout(() => heroVideo.classList.remove('opacity-0'), 3500);
        },
      },
    });
  };
  document.head.appendChild(Object.assign(document.createElement('script'), { src: 'https://www.youtube.com/iframe_api', async: true }));
}

// Animação de entrada dos blocos
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('visible'); revealObserver.unobserve(e.target); } });
}, { threshold: 0.12 });
$$('.reveal').forEach((el) => revealObserver.observe(el));

$('#ano').textContent = new Date().getFullYear();
onScroll();
