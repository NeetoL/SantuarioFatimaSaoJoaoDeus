/* ===========================================================
   Santuário — HORÁRIOS DE MISSA
   Usado na página inicial e na página Missas (missas.html).
   Para mudar um horário, edite só a lista abaixo: o calendário das duas páginas muda junto.
   =========================================================== */
(() => {

const HORARIOS = [
  { dia: 'Domingo', horas: ['7h', '10h', '18h'], nota: 'Missa dominical' },
  { dia: 'Segunda', horas: ['19h'], nota: 'Missa da Luz · Missa pelos falecidos' },
  { dia: 'Terça',   fechado: true },                         // igreja fechada
  { dia: 'Quarta',  horas: ['19h'], nota: 'Santa Missa' },
  { dia: 'Quinta',  horas: ['19h'], nota: 'Missa e Adoração ao Santíssimo' },
  { dia: 'Sexta',   horas: ['8h'],  nota: 'Missa votiva ao Sagrado Coração de Jesus', mensal: '1ª sexta do mês' },
  { dia: 'Sábado',  horas: ['8h'],  nota: 'Missa votiva à Nossa Senhora', mensal: '1º sábado do mês' },
];

// Missas de uma vez por mês (a página Missas mostra a próxima data de cada uma)
const MENSAIS = [
  { titulo: 'Missa votiva ao Sagrado Coração de Jesus', quando: 'Primeira sexta-feira do mês', diaDaSemana: 5, hora: '8h' },
  { titulo: 'Missa votiva à Nossa Senhora',             quando: 'Primeiro sábado do mês',      diaDaSemana: 6, hora: '8h' },
];

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
const CADEADO = '<svg class="w-6 h-6 text-white/35" fill="none" stroke="currentColor" stroke-width="1.6" viewBox="0 0 24 24" aria-hidden="true"><rect x="5" y="11" width="14" height="10" rx="1.5"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/></svg>';

/* ---------- Calendário de domingo a sábado ---------- */
function renderCalendario(ol) {
  ol.innerHTML = HORARIOS.map((h, i) => {
    const corpo = h.fechado
      ? `${CADEADO}<p class="font-serif italic text-xl text-white/55 mt-1">Igreja fechada</p>`
      : `${h.mensal ? `<span class="mensal">${esc(h.mensal)}</span>` : ''}
         <ul class="horas">${h.horas.map((x) => `<li>${esc(x)}</li>`).join('')}</ul>
         ${h.nota ? `<p class="nota">${esc(h.nota)}</p>` : ''}`;
    return `
      <li data-dia="${i}" class="dia${h.fechado ? ' fechado' : ''}">
        <div class="dia-topo">
          <p class="font-caps text-[10px] font-semibold tracking-[.26em] text-gold-400">${DIAS[i].slice(0, 3)}</p>
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
          <span class="font-caps font-semibold text-gold-300 text-[9px] tracking-[.22em]">${DIAS[d.getDay()].slice(0, 3)}</span>
          <span class="font-serif font-semibold leading-none text-[2.8rem] mt-0.5">${String(d.getDate()).padStart(2, '0')}</span>
          <span class="font-caps font-semibold text-[9px] tracking-[.22em] mt-0.5">${MESES[d.getMonth()]}</span>
        </div>
        <div class="min-w-0">
          <p class="font-caps text-[10px] font-semibold tracking-[.2em] text-gold-700">${esc(m.quando)} · ${esc(m.hora)}</p>
          <h3 class="mt-1.5 font-serif font-semibold text-2xl sm:text-[1.7rem] leading-tight text-navy-900">${esc(m.titulo)}</h3>
          <p class="mt-2 text-sm text-slate-500">Próxima: <strong class="font-semibold text-navy-800">${DIAS_EXTENSO[d.getDay()]}, ${d.getDate()} de ${MESES_EXTENSO[d.getMonth()]}</strong>
            <span class="ml-1 font-caps text-[10px] font-semibold tracking-[.16em] text-wine-700">${rotulo}</span></p>
        </div>
      </article>`;
  }).join('');
}
})();
