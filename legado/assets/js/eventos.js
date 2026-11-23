/* ===========================================================
   Santuário — EVENTOS E AVISOS
   Usado na página inicial (index.html) e na página de eventos (eventos.html).
   =========================================================== */
(() => {

/* ------------------------------------------------------------
   LISTA DE EVENTOS — para cadastrar um evento, copie uma linha e troque os dados.

   Cada evento aparece sozinho:
     • na página inicial, em "Acontece no Santuário" (o destaque + os 3 seguintes);
     • no aviso dourado em cima do vídeo, quando faltam 7 dias ou menos;
     • na página Eventos (eventos.html), com a agenda completa, separada por mês.
   O evento sai do site sozinho 2 horas depois de começar.

   Campos:
     categoria: 'Missa' | 'Novena' | 'Festa' | 'Aviso'
     data: 'AAAA-MM-DD'      hora: '19h30'
     destaque: true          (opcional) coloca o evento no card grande, mesmo que não seja o mais próximo
     imagem: 'assets/img/…'  (opcional) foto do evento; sem ela, usa uma foto do Santuário conforme a categoria
   ------------------------------------------------------------ */
const EVENTOS = [
  // Evento fictício de exemplo (15/11/2026) — pode apagar esta linha
  { categoria: 'Missa',  titulo: 'Missa com Bênção dos Enfermos', data: '2026-11-15', hora: '18h00', local: 'Igreja do Santuário', destaque: true,
    imagem: 'assets/img/hero-poster.jpg',
    descricao: 'Ao final da missa dominical, bênção especial para os doentes, os idosos e quem cuida deles. Traga quem precisa de oração e conforto.' },
  { categoria: 'Missa',  titulo: 'Missa Mensal de Fátima',        data: '2026-12-13', hora: '19h30', local: 'Igreja Matriz',      descricao: 'Missa solene em memória das aparições, seguida de procissão luminosa.' },
  { categoria: 'Novena', titulo: 'Novena de Natal em Família',    data: '2026-12-16', hora: '20h00', local: 'Casas da comunidade', descricao: 'Nove encontros de oração nas casas, preparando o coração para o Natal.' },
  { categoria: 'Missa',  titulo: 'Missa da Noite de Natal',        data: '2026-12-24', hora: '22h00', local: 'Igreja Matriz',      descricao: 'Celebração do nascimento do Senhor com o coral do Santuário.' },
  { categoria: 'Missa',  titulo: 'Solenidade de Santa Maria, Mãe de Deus', data: '2027-01-01', hora: '09h00', local: 'Igreja Matriz', descricao: 'Iniciamos o ano sob a proteção de Maria. Missa pela paz mundial.' },
  { categoria: 'Novena', titulo: 'Terço dos Homens',               data: '2026-11-19', hora: '20h00', local: 'Capela do Santíssimo', descricao: 'Toda quinta-feira os homens se reúnem para rezar o Santo Terço.' },
  { categoria: 'Festa',  titulo: 'Quermesse Beneficente',          data: '2026-11-28', hora: '18h00', local: 'Pátio do Santuário', descricao: 'Barracas, música e comidas típicas. Renda revertida às obras sociais.' },
];

/* ------------------------------------------------------------
   Daqui para baixo: montagem dos cards (não precisa mexer)
   ------------------------------------------------------------ */
const $  = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];
const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

const MESES = ['JAN', 'FEV', 'MAR', 'ABR', 'MAI', 'JUN', 'JUL', 'AGO', 'SET', 'OUT', 'NOV', 'DEZ'];
const MESES_EXTENSO = ['janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho', 'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'];
const DIAS = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];
const PLURAL = { Missa: 'Missas', Novena: 'Novenas', Festa: 'Festas', Aviso: 'Avisos' };
const ENDERECO = 'Santuário N. Sra. de Fátima e S. João de Deus — Estrada Manuel Nogueira de Sá, 1421, Realengo, Rio de Janeiro - RJ';

// Fotos do próprio Santuário usadas quando o evento não tem "imagem" (variam entre eventos da mesma categoria)
const FOTOS = {
  Missa:  ['assets/img/sobre/celebracao-altar-p.jpg', 'assets/img/sobre/dedicacao-bencao-p.jpg', 'assets/img/sobre/comunidade-p.jpg', 'assets/img/sobre/dedicacao-oracao-p.jpg', 'assets/img/sobre/dedicacao-uncao-p.jpg'],
  Novena: ['assets/img/hero-poster.jpg', 'assets/img/sobre/placa-p.jpg', 'assets/img/sobre/dedicacao-altar-p.jpg'],
  Festa:  ['assets/img/sobre/fogos-torre-p.jpg', 'assets/img/sobre/fachada-p.jpg', 'assets/img/sobre/vista-rua-p.jpg'],
  Aviso:  ['assets/img/sobre/entrada-p.jpg', 'assets/img/sobre/vista-rua-p.jpg'],
};

const CRUZ = '<svg viewBox="0 0 12 20"><path d="M5 0h2v4h3v2H7v2h5v2H7v10H5V10H0V8h5V6H2V4h3z"/></svg>';
const icone = {
  relogio: (c) => `<svg class="w-4 h-4 shrink-0 ${c}" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>`,
  local:   (c) => `<svg class="w-4 h-4 shrink-0 ${c}" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 21s-7-6.2-7-11a7 7 0 0 1 14 0c0 4.8-7 11-7 11z"/><circle cx="12" cy="10" r="2.5"/></svg>`,
  agenda:  (c = '') => `<svg class="${c}" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="5" width="18" height="16" rx="1"/><path d="M3 10h18M8 3v4M16 3v4M12 13v5M9.5 15.5h5"/></svg>`,
  partilha:(c = '') => `<svg class="${c}" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" aria-hidden="true"><circle cx="18" cy="5" r="2.5"/><circle cx="6" cy="12" r="2.5"/><circle cx="18" cy="19" r="2.5"/><path d="M8.2 10.8l7.6-4.4M8.2 13.2l7.6 4.4"/></svg>`,
};
const PONTO_PULSANTE = (cor) => `<span class="relative flex w-2 h-2"><span class="absolute inset-0 rounded-full ${cor} opacity-75 animate-ping"></span><span class="relative w-2 h-2 rounded-full ${cor}"></span></span>`;

/* ---------- Datas e horários (sempre no horário de Brasília) ---------- */
const pad2 = (n) => String(n).padStart(2, '0');
const dataDe = (ev) => new Date(ev.data + 'T12:00:00');
const horaDe = (ev) => { const m = String(ev.hora || '').match(/(\d{1,2})\s*h\s*(\d{2})?/i); return m ? [pad2(m[1]), m[2] || '00'] : null; };
const inicioDe = (ev) => { const h = horaDe(ev); return new Date(`${ev.data}T${h ? `${h[0]}:${h[1]}` : '00:00'}:00-03:00`); };
// O evento continua no site até 2 horas depois do início (sem hora: até o fim do dia)
const visivelAte = (ev) => (horaDe(ev) ? inicioDe(ev).getTime() + 2 * 3600e3 : new Date(`${ev.data}T23:59:59-03:00`).getTime());
function diasAte(ev) {
  const [a, m, d] = ev.data.split('-').map(Number);
  const hoje = new Date(); hoje.setHours(0, 0, 0, 0);
  return Math.round((new Date(a, m - 1, d) - hoje) / 86400000);
}
// Selo de tempo: "Começa em 2h 05min", "Acontecendo agora", "Amanhã às 18h00", "Em 3 dias"
function quando(ev) {
  const agora = Date.now(), n = diasAte(ev);
  if (horaDe(ev)) {
    const ini = inicioDe(ev).getTime();
    if (agora >= ini) return { texto: 'Acontecendo agora', vivo: true };
    if (n === 0) {
      const min = Math.ceil((ini - agora) / 60000);
      return { texto: `Começa em ${min < 60 ? `${min} min` : `${Math.floor(min / 60)}h ${pad2(min % 60)}min`}`, vivo: true };
    }
  } else if (n === 0) {
    return { texto: 'Hoje', vivo: true };
  }
  if (n === 1) return { texto: `Amanhã${ev.hora ? ` às ${ev.hora}` : ''}`, vivo: false };
  if (n > 1 && n <= 6) return { texto: `Em ${n} dias`, vivo: false };
  return { texto: '', vivo: false };
}
const proximosEventos = () => EVENTOS
  .filter((ev) => visivelAte(ev) > Date.now())
  .sort((a, b) => inicioDe(a) - inicioDe(b));
const eventoPrincipal = (lista) => lista.find((ev) => ev.destaque) || lista[0];

// Escolhe a foto do evento; "usadas" evita repetir a mesma foto em cards da mesma página
const fotoBase = (f) => f.replace('-p.jpg', '.jpg');
function fotoDe(ev, grande = false, usadas = null) {
  if (ev.imagem) { if (usadas) usadas.add(fotoBase(ev.imagem)); return ev.imagem; }
  const opcoes = FOTOS[ev.categoria] || FOTOS.Missa;
  const n = [...ev.titulo].reduce((a, c) => (a * 31 + c.charCodeAt(0)) >>> 0, 7) % opcoes.length;
  let foto = opcoes[n];
  if (usadas) {
    foto = [...opcoes.slice(n), ...opcoes.slice(0, n)].find((f) => !usadas.has(fotoBase(f))) || foto;
    usadas.add(fotoBase(foto));
  }
  return grande ? fotoBase(foto) : foto;
}

/* ---------- Selo de tempo (atualiza sozinho a cada 30 s) ---------- */
const conteudoSelo = (q, tema) => (q.vivo ? PONTO_PULSANTE(tema === 'claro' ? 'bg-gold-400' : 'bg-wine-700') : '') + esc(q.texto);
function selo(ev, tema) {
  const q = quando(ev);
  const cor = tema === 'claro' ? 'text-gold-300' : 'text-wine-700';
  return `<span class="inline-flex items-center gap-2 font-caps text-[.8rem] font-semibold tracking-[.2em] ${cor}${q.texto ? '' : ' hidden'}"
    data-contagem="${EVENTOS.indexOf(ev)}" data-tema="${tema}">${conteudoSelo(q, tema)}</span>`;
}

/* ---------- Placa da data (moldura dupla dourada) ---------- */
const placaData = (d, classes, tam) => `
  <div class="placa-data ${classes}" aria-hidden="true">
    <span class="font-caps font-semibold text-gold-300 ${tam[0]}">${tam[3] ? DIAS[d.getDay()] : DIAS[d.getDay()].slice(0, 3)}</span>
    <span class="font-serif font-semibold leading-none ${tam[1]}">${pad2(d.getDate())}</span>
    <span class="font-caps font-semibold ${tam[2]}">${tam[3] ? MESES_EXTENSO[d.getMonth()] : MESES[d.getMonth()]}</span>
  </div>`;

/* ---------- Card grande: banner com foto, placa da data e contagem ---------- */
function cardDestaque(ev, usadas = null) {
  const d = dataDe(ev), i = EVENTOS.indexOf(ev);
  return `
  <article class="group relative isolate overflow-hidden rounded-md ring-1 ring-gold-500/30 shadow-[0_40px_90px_-30px_rgba(0,0,0,.75)]">
    <img src="${esc(fotoDe(ev, true, usadas))}" alt="" class="absolute inset-0 -z-20 w-full h-full object-cover transition-transform duration-[2500ms] ease-out group-hover:scale-105" />
    <div class="absolute inset-0 -z-10 bg-gradient-to-t from-navy-950 via-navy-950/80 to-navy-950/5 lg:bg-gradient-to-r lg:from-navy-950 lg:via-navy-950/85 lg:to-navy-950/0"></div>
    <div class="flex flex-col lg:flex-row lg:items-center gap-7 lg:gap-12 px-6 pt-52 pb-8 sm:px-10 sm:pt-72 sm:pb-11 lg:px-14 lg:py-14 lg:min-h-[33rem]">
      ${placaData(d, 'w-[7.5rem] h-[8.75rem] sm:w-36 sm:h-[10.5rem] shrink-0 shadow-2xl', ['text-[.8rem] tracking-[.26em]', 'text-6xl sm:text-7xl mt-1.5', 'text-[.8rem] tracking-[.26em] mt-1.5', true])}
      <div class="max-w-2xl text-white">
        <div class="flex flex-wrap items-center gap-x-4 gap-y-2">
          <span class="font-caps text-[.8rem] font-semibold tracking-[.22em] px-2.5 py-1 border border-gold-400/60 text-gold-300 rounded-sm">${esc(ev.categoria)}</span>
          ${selo(ev, 'claro')}
        </div>
        <h3 class="mt-4 font-serif font-semibold text-[2.15rem] sm:text-5xl lg:text-[3.6rem] leading-[1.05]">${esc(ev.titulo)}</h3>
        <div class="divisor esquerda mt-6" aria-hidden="true">${CRUZ}</div>
        <ul class="mt-5 flex flex-wrap gap-x-7 gap-y-2 text-[1.0625rem] text-white/85">
          <li class="flex items-center gap-2">${icone.relogio('text-gold-400')}${DIAS[d.getDay()]}, ${d.getDate()} de ${MESES_EXTENSO[d.getMonth()]} · ${esc(ev.hora)}</li>
          <li class="flex items-center gap-2">${icone.local('text-gold-400')}${esc(ev.local)}</li>
        </ul>
        <p class="mt-5 font-texto italic text-lg sm:text-xl leading-relaxed text-white/80">${esc(ev.descricao)}</p>
        <div class="mt-8 flex flex-wrap gap-3">
          <button type="button" class="btn btn-ouro" data-agenda="${i}">${icone.agenda()}Salvar na agenda</button>
          <button type="button" class="btn btn-vidro" data-compartilhar="${i}">${icone.partilha()}Compartilhar</button>
        </div>
      </div>
    </div>
  </article>`;
}

/* ---------- Card de evento: foto, placa da data sobre a borda, detalhes ---------- */
function cardEvento(ev, { comDescricao = false, usadas = null } = {}) {
  const d = dataDe(ev), i = EVENTOS.indexOf(ev);
  return `
  <article class="group flex flex-col overflow-hidden rounded-md bg-white ring-1 ring-ivory-200 shadow-[0_1px_2px_rgba(8,26,51,.05)] hover:shadow-2xl hover:shadow-navy-950/20 hover:-translate-y-1 transition duration-500">
    <div class="relative aspect-[16/10] img-fallback">
      <div class="absolute inset-0 overflow-hidden">
        <img src="${esc(fotoDe(ev, false, usadas))}" alt="" loading="lazy" class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
      </div>
      <div class="absolute inset-0 bg-gradient-to-t from-navy-950/70 via-navy-950/5 to-navy-950/20"></div>
      <span class="absolute top-4 left-4 font-caps text-[.8rem] font-semibold tracking-[.2em] px-2.5 py-1 rounded-sm bg-navy-950/55 text-white ring-1 ring-white/25 backdrop-blur-sm">${esc(ev.categoria)}</span>
      ${placaData(d, 'absolute left-5 -bottom-10 w-[4.9rem] h-[5.75rem] shadow-xl', ['text-[.75rem] tracking-[.22em]', 'text-[2.6rem] mt-0.5', 'text-[.75rem] tracking-[.22em] mt-0.5', false])}
    </div>
    <div class="flex flex-1 flex-col px-6 pb-5 pt-[3.25rem]">
      <div class="flex flex-wrap items-center gap-x-3 gap-y-1">
        <p class="font-caps text-[.8rem] font-semibold tracking-[.18em] text-gold-700">${esc(ev.hora)} · ${esc(ev.local)}</p>
        ${selo(ev, 'escuro')}
      </div>
      <h3 class="mt-2 font-serif font-semibold text-[1.65rem] leading-tight text-navy-900">${esc(ev.titulo)}</h3>
      ${comDescricao ? `<p class="mt-2.5 text-[1.0625rem] leading-relaxed text-slate-600">${esc(ev.descricao)}</p>` : ''}
      <div class="mt-auto pt-5">
        <div class="flex items-center gap-6 border-t border-ivory-200 pt-4 text-[.875rem] font-semibold uppercase tracking-[.14em] text-navy-800">
          <button type="button" class="inline-flex items-center gap-1.5 hover:text-gold-700 transition-colors" data-agenda="${i}">${icone.agenda('w-4 h-4')}Agenda</button>
          <button type="button" class="inline-flex items-center gap-1.5 hover:text-gold-700 transition-colors" data-compartilhar="${i}">${icone.partilha('w-4 h-4')}Compartilhar</button>
        </div>
      </div>
    </div>
  </article>`;
}

/* ---------- Página inicial: "Acontece no Santuário" (só alguns) + aviso no vídeo ---------- */
function rotuloAvisoTopo(ev) {
  const q = quando(ev);
  return q.texto && diasAte(ev) >= 2 ? `${q.texto} · ${ev.hora}` : q.texto;
}
function renderInicio() {
  const secao = $('#avisos');
  if (!secao) return;
  const lista = proximosEventos();
  if (!lista.length) {
    secao.classList.add('hidden');
    $$('a[href="#avisos"]').forEach((a) => { a.href = '#horarios'; }); // seta do vídeo pula para os horários
    return;
  }
  const principal = eventoPrincipal(lista);
  const usadas = new Set();
  $('#aviso-destaque').innerHTML = cardDestaque(principal, usadas);
  $('#avisos-proximos').innerHTML = lista.filter((ev) => ev !== principal).slice(0, 3).map((ev) => cardEvento(ev, { usadas })).join('');
  const total = $('[data-total-eventos]');
  if (total) total.textContent = lista.length;

  // Aviso em cima do vídeo: o evento mais próximo, se for nos próximos 7 dias
  const chip = $('#aviso-hero');
  if (chip && rotuloAvisoTopo(lista[0])) {
    chip.dataset.evento = EVENTOS.indexOf(lista[0]);
    $('[data-quando]', chip).textContent = rotuloAvisoTopo(lista[0]);
    $('[data-titulo]', chip).textContent = lista[0].titulo;
    chip.classList.replace('hidden', 'inline-flex');
  }
}

/* ---------- Página Eventos: destaque + agenda completa por mês, com filtros ---------- */
function renderPaginaEventos() {
  const alvo = $('#lista-eventos');
  if (!alvo) return;
  const lista = proximosEventos();

  if (!lista.length) {
    const bloco = $('#bloco-destaque');
    if (bloco) bloco.classList.add('hidden');
    alvo.innerHTML = `
      <div class="text-center py-16">
        <div class="divisor" aria-hidden="true">${CRUZ}</div>
        <p class="mt-6 font-serif text-3xl text-navy-900">Nenhum evento agendado no momento.</p>
        <p class="mt-3 text-slate-600">Acompanhe os horários de missa e volte em breve.</p>
      </div>`;
    $('#filtros-eventos').innerHTML = '';
    return;
  }

  const destaque = eventoPrincipal(lista);
  $('#evento-destaque').innerHTML = cardDestaque(destaque);

  // Filtros só com as categorias que têm evento
  const categorias = [...new Set(lista.map((ev) => ev.categoria))];
  const filtros = $('#filtros-eventos');
  filtros.innerHTML = ['todos', ...categorias].map((c) => `
    <button type="button" class="filtro px-4 py-2 rounded-sm text-[.875rem] font-semibold uppercase tracking-[.16em] transition-colors" data-filtro="${esc(c)}">
      ${c === 'todos' ? 'Todos' : esc(PLURAL[c] || c)}
    </button>`).join('');

  const mostrar = (filtro) => {
    $$('.filtro', filtros).forEach((b) => {
      const ativo = b.dataset.filtro === filtro;
      b.setAttribute('aria-pressed', String(ativo));
      b.classList.toggle('bg-navy-900', ativo);
      b.classList.toggle('text-white', ativo);
      b.classList.toggle('text-navy-900', !ativo);
      b.classList.toggle('hover:bg-ivory-100', !ativo);
    });
    const filtrados = lista.filter((ev) => filtro === 'todos' || ev.categoria === filtro);
    const usadas = new Set([fotoBase(fotoDe(destaque, true))]); // não repete a foto do destaque

    // Agrupa por mês
    const meses = new Map();
    filtrados.forEach((ev) => {
      const chave = ev.data.slice(0, 7);
      if (!meses.has(chave)) meses.set(chave, []);
      meses.get(chave).push(ev);
    });
    alvo.innerHTML = [...meses].map(([chave, evs]) => {
      const [ano, mes] = chave.split('-').map(Number);
      return `
      <section aria-labelledby="mes-${chave}">
        <header class="flex items-end gap-4 sm:gap-6">
          <h3 id="mes-${chave}" class="font-serif italic font-medium text-5xl sm:text-6xl text-navy-900 leading-none capitalize">${MESES_EXTENSO[mes - 1]}</h3>
          <span class="font-caps text-base font-semibold tracking-[.3em] text-gold-700 pb-1">${ano}</span>
          <span class="flex-1 h-px mb-2.5 bg-gradient-to-r from-gold-500/70 to-transparent"></span>
          <span class="hidden sm:block pb-1 text-[.875rem] font-semibold uppercase tracking-[.16em] text-slate-600">${evs.length} ${evs.length === 1 ? 'evento' : 'eventos'}</span>
        </header>
        <div class="mt-9 grid gap-x-7 gap-y-9 md:grid-cols-2 xl:grid-cols-3">
          ${evs.map((ev) => cardEvento(ev, { comDescricao: true, usadas })).join('')}
        </div>
      </section>`;
    }).join('') || '<p class="text-center text-slate-600 py-10">Nenhum evento nesta categoria no momento.</p>';
  };

  filtros.addEventListener('click', (e) => {
    const b = e.target.closest('[data-filtro]');
    if (b) mostrar(b.dataset.filtro);
  });
  mostrar('todos');
}

/* ---------- Atualiza a contagem ("Começa em…", "Acontecendo agora") a cada 30 s ---------- */
setInterval(() => {
  $$('[data-contagem]').forEach((el) => {
    const q = quando(EVENTOS[+el.dataset.contagem]);
    el.innerHTML = conteudoSelo(q, el.dataset.tema);
    el.classList.toggle('hidden', !q.texto);
  });
  const chip = $('#aviso-hero[data-evento]');
  if (chip) $('[data-quando]', chip).textContent = rotuloAvisoTopo(EVENTOS[+chip.dataset.evento]);
}, 30000);

/* ---------- Salvar na agenda (.ics) e compartilhar ---------- */
function avisar(msg) {
  const t = $('#toast');
  if (!t) return;
  t.textContent = msg;
  t.classList.remove('opacity-0');
  clearTimeout(avisar._t);
  avisar._t = setTimeout(() => t.classList.add('opacity-0'), 2600);
}

function salvarNaAgenda(ev) {
  const inicio = inicioDe(ev);
  const fim = new Date(inicio.getTime() + 90 * 60000); // duração estimada: 1h30
  const utc = (d) => d.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
  const txt = (s) => String(s).replace(/[\\,;]/g, (c) => '\\' + c).replace(/\n/g, '\\n');
  const nome = ev.titulo.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  const ics = [
    'BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Santuario N. Sra. de Fatima e S. Joao de Deus//Site//PT-BR', 'CALSCALE:GREGORIAN', 'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `UID:${ev.data}-${nome}@santuariofatimasaojoaodeus`,
    `DTSTAMP:${utc(new Date())}`,
    `DTSTART:${utc(inicio)}`,
    `DTEND:${utc(fim)}`,
    `SUMMARY:${txt(ev.titulo)}`,
    `LOCATION:${txt(`${ev.local} — ${ENDERECO}`)}`,
    `DESCRIPTION:${txt(ev.descricao)}`,
    'END:VEVENT', 'END:VCALENDAR',
  ].join('\r\n');
  const url = URL.createObjectURL(new Blob([ics], { type: 'text/calendar;charset=utf-8' }));
  const a = Object.assign(document.createElement('a'), { href: url, download: `${nome}.ics` });
  document.body.appendChild(a); a.click(); a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 2000);
  avisar('Abra o arquivo baixado para adicionar à sua agenda');
}

async function compartilharEvento(ev) {
  const d = dataDe(ev);
  const texto = `${ev.titulo}\n${DIAS[d.getDay()]}, ${d.getDate()} de ${MESES_EXTENSO[d.getMonth()]}, às ${ev.hora}\n${ev.local} — Santuário N. Sra. de Fátima e S. João de Deus`;
  const url = new URL('eventos.html', location.href).href;
  if (navigator.share) {               // celular: abre a lista de apps (WhatsApp, Instagram…)
    try { await navigator.share({ title: ev.titulo, text: texto, url }); } catch {}
    return;
  }
  window.open(`https://wa.me/?text=${encodeURIComponent(`${texto}\n${url}`)}`, '_blank', 'noopener');
}

document.addEventListener('click', (e) => {
  const ag = e.target.closest('[data-agenda]');
  if (ag) return salvarNaAgenda(EVENTOS[+ag.dataset.agenda]);
  const cp = e.target.closest('[data-compartilhar]');
  if (cp) compartilharEvento(EVENTOS[+cp.dataset.compartilhar]);
});

/* ---------- Página Missas: próximas celebrações especiais (eventos da categoria Missa) ---------- */
function renderMissasEspeciais() {
  const alvo = $('#missas-especiais');
  if (!alvo) return;
  const missas = proximosEventos().filter((ev) => ev.categoria === 'Missa').slice(0, 3);
  if (!missas.length) { $('#bloco-missas-especiais')?.classList.add('hidden'); return; }
  const usadas = new Set();
  alvo.innerHTML = missas.map((ev) => cardEvento(ev, { comDescricao: true, usadas })).join('');
}

renderInicio();
renderPaginaEventos();
renderMissasEspeciais();
})();
