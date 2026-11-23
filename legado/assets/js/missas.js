/* ===========================================================
   Santuário — HORÁRIOS (missas, confissões, orações, igreja e secretaria)
   Usado na página inicial e na página Missas (missas.html).
   Para mudar um horário, edite só as listas abaixo: as duas páginas mudam juntas.
   Dias da semana em número: 0 = domingo, 1 = segunda … 6 = sábado.
   Horários escritos como "18h", "17h15" ou "9h às 10h e 17h15 às 18h".
   =========================================================== */
(() => {

// Missas de domingo a sábado (calendário). "missa" é o nome curto usado no quadro "Hoje".
const HORARIOS = [
  { dia: 'Domingo', horas: ['7h', '10h', '18h'], nota: 'Missa dominical' },
  { dia: 'Segunda', horas: ['19h'], nota: 'Missa da Luz · Missa pelos falecidos', missa: 'Missa da Luz' },
  { dia: 'Terça',   fechado: true },                         // igreja fechada
  { dia: 'Quarta',  horas: ['19h'], nota: 'Santa Missa' },
  { dia: 'Quinta',  horas: ['19h'], nota: 'Santa Missa · Adoração ao Santíssimo às 19h30', missa: 'Santa Missa' },
  { dia: 'Sexta',   horas: ['8h', '19h'], nota: 'Missa votiva ao Sagrado Coração de Jesus', mensal: '1ª sexta do mês' },
  { dia: 'Sábado',  horas: ['8h'],  nota: 'Missa votiva à Nossa Senhora', mensal: '1º sábado do mês' },
];

// Missas de uma vez por mês (a página Missas mostra a próxima data de cada uma)
const MENSAIS = [
  { titulo: 'Missa votiva ao Sagrado Coração de Jesus', quando: 'Primeira sexta-feira do mês', diaDaSemana: 5, hora: '8h e 19h' },
  { titulo: 'Missa votiva à Nossa Senhora',             quando: 'Primeiro sábado do mês',      diaDaSemana: 6, hora: '8h' },
];

// Confissões
const CONFISSOES = [
  { dias: [1, 3, 4], horario: '18h às 19h' },                // segunda, quarta e quinta
  { dias: [0],       horario: '9h às 10h e 17h15 às 18h' },  // domingo
];

// Terços
const TERCOS = [
  { titulo: 'Terço Mariano',    dias: [1], horario: '18h' },
  { titulo: 'Terço dos Homens', dias: [1], horario: '20h' },
];

// Adoração ao Santíssimo
const ADORACAO = [
  { dias: [4], horario: '19h30', obs: 'Logo após a Santa Missa das 19h' },
];

// Igreja aberta para visitas e oração pessoal (domingo → sábado; null = fechada)
const IGREJA_ABERTA = ['7h às 13h e 17h às 20h', '8h às 19h', null, '8h às 19h', '8h às 19h', '8h às 19h', '8h às 17h'];

// Secretaria do Santuário (domingo → sábado; null = fechada). Também fecha nos feriados.
const SECRETARIA = [null, '9h às 12h e 14h às 19h', null, '9h às 12h e 14h às 19h', '9h às 12h e 14h às 19h', '9h às 12h e 14h às 19h', '8h às 12h'];

/* ------------------------------------------------------------
   Daqui para baixo: montagem (não precisa mexer)
   ------------------------------------------------------------ */
const $  = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];
const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const DIAS = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];
const DIAS_EXTENSO = ['domingo', 'segunda-feira', 'terça-feira', 'quarta-feira', 'quinta-feira', 'sexta-feira', 'sábado'];
const MESES = ['JAN', 'FEV', 'MAR', 'ABR', 'MAI', 'JUN', 'JUL', 'AGO', 'SET', 'OUT', 'NOV', 'DEZ'];
const MESES_EXTENSO = ['janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho', 'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'];
const CADEADO = '<svg class="w-6 h-6 text-white/60" fill="none" stroke="currentColor" stroke-width="1.6" viewBox="0 0 24 24" aria-hidden="true"><rect x="5" y="11" width="14" height="10" rx="1.5"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/></svg>';
const SETA = '<svg class="w-4 h-4 group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>';
const ICONES = {
  confissao: '<svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 5h16v10H9l-5 4z"/><path d="M12 7.5v5M9.5 10h5"/></svg>',
  terco: '<svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="9" r="6"/><circle cx="12" cy="3" r=".8" fill="currentColor"/><circle cx="6" cy="9" r=".8" fill="currentColor"/><circle cx="18" cy="9" r=".8" fill="currentColor"/><path d="M12 15v6M10 18h4"/></svg>',
  adoracao: '<svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="9" r="3.2"/><path d="M12 2v2M12 14v2M5 9H3M21 9h-2M7 4l1.4 1.4M17 4l-1.4 1.4M7 14l1.4-1.4M17 14l-1.4-1.4M12 16v6M9 22h6"/></svg>',
};

// "17h15" → 1035 minutos
const minutos = (t) => { const m = /(\d{1,2})h(\d{2})?/.exec(t || ''); return m ? +m[1] * 60 + (+m[2] || 0) : 0; };
// "9h às 10h e 17h15 às 18h" → [{inicio:'9h', fim:'10h'}, {inicio:'17h15', fim:'18h'}]
const intervalos = (txt) => txt.split(/\s+e\s+/).map((p) => { const [inicio, fim] = p.split(/\s+às\s+/); return { inicio: inicio.trim(), fim: fim ? fim.trim() : null }; });
// [1,3,4] → "Segunda, quarta e quinta" · [1] → "Toda segunda-feira"
function nomeDosDias(dias) {
  if (dias.length === 1) return (dias[0] === 0 || dias[0] === 6 ? 'Todo ' : 'Toda ') + DIAS_EXTENSO[dias[0]];
  const n = dias.map((d) => DIAS[d].toLowerCase());
  const txt = n.slice(0, -1).join(', ') + ' e ' + n[n.length - 1];
  return txt.charAt(0).toUpperCase() + txt.slice(1);
}
// Horário com várias faixas, uma por linha
const linhasHorario = (txt) => txt.split(/\s+e\s+/).map((p) => `<span class="block">${esc(p)}</span>`).join('');
const primeiraDoMes = (data) => data.getDate() <= 7;

/* ---------- Calendário de domingo a sábado ---------- */
function renderCalendario(ol) {
  ol.innerHTML = HORARIOS.map((h, i) => {
    const corpo = h.fechado
      ? `${CADEADO}<p class="font-serif italic text-xl text-white/75 mt-1">Igreja fechada</p>`
      : `${h.mensal ? `<span class="mensal">${esc(h.mensal)}</span>` : ''}
         <ul class="horas">${h.horas.map((x) => `<li>${esc(x)}</li>`).join('')}</ul>
         ${h.nota ? `<p class="nota">${esc(h.nota)}</p>` : ''}`;
    return `
      <li data-dia="${i}" class="dia${h.fechado ? ' fechado' : ''}">
        <div class="dia-topo">
          <p class="font-caps text-[.8rem] font-semibold tracking-[.26em] text-gold-400">${DIAS[i].slice(0, 3)}</p>
          <p class="font-serif font-semibold text-xl lg:text-[1.6rem] leading-none mt-1.5">${esc(h.dia)}</p>
        </div>
        <div class="dia-corpo">${corpo}</div>
      </li>`;
  }).join('');

  // Destaca o dia da semana de hoje
  const hoje = $(`[data-dia="${new Date().getDay()}"]`, ol);
  if (hoje) {
    hoje.classList.add('hoje');
    hoje.setAttribute('aria-current', 'date');
    hoje.insertAdjacentHTML('afterbegin', '<span class="selo-hoje">Hoje</span>');
  }
}
$$('[data-calendario-missas]').forEach(renderCalendario);

/* ---------- Hoje no Santuário ---------- */
// Tudo o que acontece num dia, em ordem de horário
function programacaoDoDia(data) {
  const d = data.getDay();
  const itens = [];
  const h = HORARIOS[d];
  if (!h.fechado && (!h.mensal || primeiraDoMes(data))) {
    h.horas.forEach((x) => itens.push({ inicio: x, nome: h.missa || h.nota, tipo: 'Missa' }));
  }
  CONFISSOES.filter((c) => c.dias.includes(d)).forEach((c) =>
    intervalos(c.horario).forEach((i) => itens.push({ ...i, nome: 'Atendimento de confissões', tipo: 'Confissões' })));
  TERCOS.filter((t) => t.dias.includes(d)).forEach((t) => itens.push({ inicio: t.horario, nome: t.titulo, tipo: 'Terço' }));
  ADORACAO.filter((a) => a.dias.includes(d)).forEach((a) => itens.push({ inicio: a.horario, nome: 'Adoração ao Santíssimo', tipo: 'Adoração' }));
  return itens.sort((a, b) => minutos(a.inicio) - minutos(b.inicio));
}

// Situação de cada item agora: encerrado, agora ou em breve
function situacao(item, agora) {
  const ini = minutos(item.inicio);
  const fim = item.fim ? minutos(item.fim) : ini + 60;
  if (agora >= fim) return 'encerrado';
  if (agora >= ini) return 'agora';
  return '';
}

function renderHoje(alvo) {
  const compacto = alvo.dataset.hojeSantuario === 'compacto';
  const data = new Date();
  const d = data.getDay();
  const agora = data.getHours() * 60 + data.getMinutes();
  const itens = programacaoDoDia(data);
  const aberta = IGREJA_ABERTA[d];
  const secretaria = SECRETARIA[d];
  const titulo = `${DIAS_EXTENSO[d].charAt(0).toUpperCase() + DIAS_EXTENSO[d].slice(1)}, ${data.getDate()} de ${MESES_EXTENSO[data.getMonth()]}`;

  // Versão curta (página inicial)
  if (compacto) {
    const lista = itens.length
      ? itens.map((it) => {
          const s = situacao(it, agora);
          return `<li class="chip-dia${s ? ' ' + s : ''}"><strong>${esc(it.inicio)}</strong>${esc(it.tipo === 'Confissões' ? 'Confissões' : it.nome)}${s === 'agora' ? '<span class="agora-tag">Agora</span>' : ''}</li>`;
        }).join('')
      : `<li class="text-slate-600 italic font-texto text-lg">${aberta ? 'Sem celebrações fixas hoje.' : 'Sem celebrações hoje.'}</li>`;
    alvo.innerHTML = `
      <div class="rounded-md bg-white ring-1 ring-ivory-200 px-5 sm:px-7 py-5 flex flex-col lg:flex-row lg:items-center gap-4 lg:gap-8">
        <div class="shrink-0">
          <p class="eyebrow">Hoje no Santuário</p>
          <p class="font-serif font-semibold text-2xl text-navy-900 mt-1">${esc(titulo)}</p>
          <p class="text-base text-slate-600 mt-0.5">${aberta ? `Igreja aberta: ${esc(aberta)}` : 'Igreja fechada'}</p>
        </div>
        <ul class="flex flex-wrap gap-2 lg:border-l lg:border-ivory-200 lg:pl-8">${lista}</ul>
      </div>`;
    return;
  }

  // Versão completa (página Missas)
  const linhas = itens.length
    ? itens.map((it) => {
        const s = situacao(it, agora);
        return `
          <li class="item-dia${s ? ' ' + s : ''}">
            <p class="hora">${esc(it.inicio)}${it.fim ? `<small>até ${esc(it.fim)}</small>` : ''}</p>
            <div class="min-w-0">
              <p class="font-caps text-[.8rem] font-semibold tracking-[.2em] text-gold-700">${esc(it.tipo)}</p>
              <p class="font-serif font-semibold text-xl sm:text-[1.45rem] leading-tight text-navy-900 mt-0.5">${esc(it.nome)}</p>
            </div>
            ${s === 'agora' ? '<span class="agora-tag">Agora</span>' : s === 'encerrado' ? '<span class="font-caps text-[.75rem] tracking-[.18em] text-slate-600">Encerrado</span>' : '<span></span>'}
          </li>`;
      }).join('')
    : `<li class="py-6">
         <p class="font-serif italic text-2xl text-navy-900">${aberta ? 'Hoje não há celebrações fixas.' : 'Hoje a igreja não abre.'}</p>
         <p class="mt-2 text-slate-600">${aberta ? `A igreja está aberta para oração pessoal: ${esc(aberta)}.` : 'Confira abaixo a programação dos outros dias da semana.'}</p>
         <a href="eventos.html" class="group mt-4 inline-flex items-center gap-2 text-[.875rem] font-semibold uppercase tracking-[.16em] text-navy-800 hover:text-gold-700">Ver eventos ${SETA}</a>
       </li>`;

  alvo.innerHTML = `
    <div class="grid md:grid-cols-[18rem_1fr]">
      <div class="secao-escura text-white p-7 sm:p-8 flex md:flex-col gap-6 md:gap-7">
        <div class="placa-data w-[5.25rem] h-[6.25rem] shrink-0" aria-hidden="true">
          <span class="font-caps font-semibold text-gold-300 text-[.75rem] tracking-[.22em]">${DIAS[d].slice(0, 3)}</span>
          <span class="font-serif font-semibold leading-none text-[2.8rem] mt-0.5">${String(data.getDate()).padStart(2, '0')}</span>
          <span class="font-caps font-semibold text-[.75rem] tracking-[.22em] mt-0.5">${MESES[data.getMonth()]}</span>
        </div>
        <div class="min-w-0">
          <p class="eyebrow claro">Hoje no Santuário</p>
          <h2 class="font-serif font-semibold text-[1.7rem] leading-tight mt-2">${esc(titulo)}</h2>
          <dl class="mt-4 space-y-2.5 text-base">
            <div><dt class="font-caps text-[.78rem] tracking-[.2em] text-gold-300">Igreja</dt><dd class="text-white/85">${aberta ? `Aberta: ${esc(aberta)}` : 'Fechada hoje'}</dd></div>
            <div><dt class="font-caps text-[.78rem] tracking-[.2em] text-gold-300">Secretaria</dt><dd class="text-white/85">${secretaria ? esc(secretaria) : 'Fechada hoje'}</dd></div>
          </dl>
        </div>
      </div>
      <ol class="programacao px-6 sm:px-8 py-3" aria-label="Programação de hoje">${linhas}</ol>
    </div>`;
}
const alvosHoje = $$('[data-hoje-santuario]');
alvosHoje.forEach(renderHoje);
if (alvosHoje.length) setInterval(() => alvosHoje.forEach(renderHoje), 60000);

/* ---------- Confissões, terços e adoração (página Missas) ---------- */
const alvoDevocoes = $('[data-devocoes]');
if (alvoDevocoes) {
  const hoje = new Date().getDay();
  const linha = (rotulo, sub, horario, dias) => `
    <li${dias.includes(hoje) ? ' class="e-hoje"' : ''}>
      <span class="rotulo">${esc(rotulo)}${dias.includes(hoje) ? '<span class="tag-hoje">Hoje</span>' : ''}${sub ? `<small>${esc(sub)}</small>` : ''}</span>
      <span class="pontos" aria-hidden="true"></span>
      <span class="hora">${linhasHorario(horario)}</span>
    </li>`;
  const cartao = (icone, eyebrow, titulo, linhas, rodape = '') => `
    <article class="reveal flex flex-col rounded-md bg-white ring-1 ring-ivory-200 p-7 sm:p-8 hover:shadow-xl hover:shadow-navy-950/10 transition-shadow">
      <span class="grid place-items-center w-12 h-12 rounded-full bg-navy-900 text-gold-300 ring-4 ring-gold-500/15">${ICONES[icone]}</span>
      <p class="mt-5 font-caps text-[.875rem] font-semibold tracking-[.22em] text-gold-700">${esc(eyebrow)}</p>
      <h3 class="mt-1.5 font-serif font-semibold text-3xl text-navy-900 leading-tight">${esc(titulo)}</h3>
      <ul class="lista-horarios mt-5">${linhas}</ul>
      ${rodape ? `<p class="mt-auto pt-5 text-base text-slate-600 leading-relaxed">${rodape}</p>` : ''}
    </article>`;

  alvoDevocoes.innerHTML =
    cartao('confissao', 'Sacramento da Reconciliação', 'Confissões',
      CONFISSOES.map((c) => linha(nomeDosDias(c.dias), '', c.horario, c.dias)).join(''),
      'Chegue com antecedência: o atendimento termina no horário indicado.') +
    cartao('terco', 'Oração do Rosário', 'Terços',
      TERCOS.map((t) => linha(t.titulo, nomeDosDias(t.dias), t.horario, t.dias)).join(''),
      'Todos são bem-vindos para rezar juntos.') +
    cartao('adoracao', 'Diante de Jesus Eucarístico', 'Adoração ao Santíssimo',
      ADORACAO.map((a) => linha(nomeDosDias(a.dias), a.obs, a.horario, a.dias)).join(''),
      'Um tempo de silêncio e oração diante do Santíssimo Sacramento.');
}

/* ---------- Igreja aberta e secretaria (página Missas) ---------- */
$$('[data-tabela-horarios]').forEach((ul) => {
  const lista = ul.dataset.tabelaHorarios === 'secretaria' ? SECRETARIA : IGREJA_ABERTA;
  const hoje = new Date().getDay();
  ul.innerHTML = lista.map((h, i) => `
    <li class="${i === hoje ? 'e-hoje' : ''}${h ? '' : ' fechada'}">
      <span class="rotulo">${DIAS_EXTENSO[i].charAt(0).toUpperCase() + DIAS_EXTENSO[i].slice(1)}${i === hoje ? '<span class="tag-hoje">Hoje</span>' : ''}</span>
      <span class="pontos" aria-hidden="true"></span>
      <span class="hora">${h ? linhasHorario(h) : 'Fechada'}</span>
    </li>`).join('') + (ul.dataset.tabelaHorarios === 'secretaria' ? `
    <li class="fechada">
      <span class="rotulo">Feriados</span>
      <span class="pontos" aria-hidden="true"></span>
      <span class="hora">Fechada</span>
    </li>` : '');
});

/* ---------- Próximas missas mensais (página Missas) ---------- */
// Primeira <sexta/sábado> do mês, a partir de hoje
function proximaPrimeira(diaDaSemana) {
  const hoje = new Date(); hoje.setHours(0, 0, 0, 0);
  for (let k = 0; k < 3; k++) {
    const d = new Date(hoje.getFullYear(), hoje.getMonth() + k, 1);
    while (d.getDay() !== diaDaSemana) d.setDate(d.getDate() + 1);
    if (d >= hoje) return d;
  }
  return null;
}

const alvoMensais = $('[data-proximas-mensais]');
if (alvoMensais) {
  alvoMensais.innerHTML = MENSAIS.map((m) => {
    const d = proximaPrimeira(m.diaDaSemana);
    if (!d) return '';
    const dias = Math.round((d - new Date().setHours(0, 0, 0, 0)) / 86400000);
    const rotulo = dias === 0 ? 'É hoje' : dias === 1 ? 'Amanhã' : `Em ${dias} dias`;
    return `
      <article class="group flex items-center gap-6 rounded-md bg-white ring-1 ring-ivory-200 p-5 sm:p-6 hover:shadow-xl hover:shadow-navy-950/10 transition-shadow">
        <div class="placa-data w-[5.25rem] h-[6.25rem] shrink-0" aria-hidden="true">
          <span class="font-caps font-semibold text-gold-300 text-[.75rem] tracking-[.22em]">${DIAS[d.getDay()].slice(0, 3)}</span>
          <span class="font-serif font-semibold leading-none text-[2.8rem] mt-0.5">${String(d.getDate()).padStart(2, '0')}</span>
          <span class="font-caps font-semibold text-[.75rem] tracking-[.22em] mt-0.5">${MESES[d.getMonth()]}</span>
        </div>
        <div class="min-w-0">
          <p class="font-caps text-[.8rem] font-semibold tracking-[.2em] text-gold-700">${esc(m.quando)} · ${esc(m.hora)}</p>
          <h3 class="mt-1.5 font-serif font-semibold text-2xl sm:text-[1.7rem] leading-tight text-navy-900">${esc(m.titulo)}</h3>
          <p class="mt-2 text-base text-slate-600">Próxima: <strong class="font-semibold text-navy-800">${DIAS_EXTENSO[d.getDay()]}, ${d.getDate()} de ${MESES_EXTENSO[d.getMonth()]}</strong>
            <span class="ml-1 font-caps text-[.8rem] font-semibold tracking-[.16em] text-wine-700">${rotulo}</span></p>
        </div>
      </article>`;
  }).join('');
}
})();
