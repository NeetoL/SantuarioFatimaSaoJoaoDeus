/* ===========================================================
   Santuário — NOTÍCIAS, RECADOS E GALERIA
   Usado na página inicial (resumo) e na página Notícias (noticias.html).
   Para publicar, edite só as listas abaixo.
   =========================================================== */
(() => {

// NOTÍCIAS — a mais recente aparece primeiro (e em destaque na página Notícias).
// Campos: data 'AAAA-MM-DD', categoria, titulo, resumo, imagem (opcional)
//         link (opcional): endereço para "Saiba mais" — ex.: um post do Instagram
const NOTICIAS = [
  { data: '2026-11-10', categoria: 'Comunidade', imagem: 'assets/img/noticia-campanha.jpg',
    titulo: 'Campanha solidária arrecada mais de 2 toneladas de alimentos',
    resumo: 'A generosidade dos fiéis garantiu cestas básicas para famílias atendidas pela pastoral social.' },
  { data: '2026-11-05', categoria: 'Formação', imagem: 'assets/img/noticia-catequese.jpg',
    titulo: 'Abertas as inscrições para a Catequese 2027',
    resumo: 'Crianças, jovens e adultos podem se inscrever na secretaria até o dia 15 de dezembro.' },
];

// RECADOS — avisos curtos da secretaria e das pastorais
const RECADOS = [
  { titulo: 'Inscrições para o Batismo',         texto: 'Preparação para pais e padrinhos no 2º sábado do mês, às 15h. Inscreva-se na secretaria.' },
  { titulo: 'Campanha do Agasalho e Alimentos',  texto: 'Doações recebidas na entrada lateral do Santuário até o fim do mês.' },
  { titulo: 'Novos voluntários na PASCOM',       texto: 'Gosta de fotografia, redes sociais ou vídeo? Venha servir conosco!' },
  { titulo: 'Secretaria em horário especial',    texto: 'Nos feriados, atendimento das 8h às 12h.' },
];

// GALERIA DA COMUNIDADE — fotos que ampliam ao clicar (página Notícias)
// grande: true deixa a foto com o dobro do tamanho na grade
const GALERIA = [
  { foto: 'assets/img/sobre/comunidade.jpg',       legenda: 'Clero e comunidade reunidos no Santuário', grande: true },
  { foto: 'assets/img/sobre/encenacao-paixao.jpg', legenda: 'Encenação da Paixão de Cristo' },
  { foto: 'assets/img/sobre/fogos-torre.jpg',      legenda: 'Noite de festa na torre do Santuário' },
  { foto: 'assets/img/sobre/celebracao-altar.jpg', legenda: 'Celebração solene ao altar' },
  { foto: 'assets/img/sobre/dedicacao-uncao.jpg',  legenda: 'Dedicação da Igreja e do Altar' },
  { foto: 'assets/img/sobre/vista-rua.jpg',        legenda: 'O Santuário visto da rua' },
  { foto: 'assets/img/sobre/entrada.jpg',          legenda: 'Entrada principal do Santuário' },
  { foto: 'assets/img/sobre/fachada.jpg',          legenda: 'Fachada e torre do Santuário', grande: true },
  { foto: 'assets/img/sobre/dedicacao-bencao.jpg', legenda: 'Dedicação da Igreja e do Altar' },
  { foto: 'assets/img/sobre/placa.jpg',            legenda: 'Placa em bronze na parede do Santuário' },
];

/* ------------------------------------------------------------
   Daqui para baixo: montagem (não precisa mexer)
   ------------------------------------------------------------ */
const $  = (sel, ctx = document) => ctx.querySelector(sel);
const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const MESES = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'];
const MESES_EXTENSO = ['janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho', 'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'];
const SETA = '<svg class="w-4 h-4 group-hover/link:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>';
const CRUZ = '<svg viewBox="0 0 12 20"><path d="M5 0h2v4h3v2H7v2h5v2H7v10H5V10H0V8h5V6H2V4h3z"/></svg>';

const ordenadas = () => [...NOTICIAS].sort((a, b) => b.data.localeCompare(a.data));
const dataCurta = (iso) => { const [a, m, d] = iso.split('-').map(Number); return `${d} ${MESES[m - 1]} ${a}`; };
const dataLonga = (iso) => { const [a, m, d] = iso.split('-').map(Number); return `${d} de ${MESES_EXTENSO[m - 1]} de ${a}`; };
const saibaMais = (n, claro) => n.link
  ? `<a href="${esc(n.link)}" target="_blank" rel="noopener" class="group/link mt-5 inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[.16em] ${claro ? 'text-gold-300 hover:text-gold-200' : 'text-navy-800 hover:text-gold-700'}">Saiba mais${SETA}</a>`
  : '';

// Card de notícia
function cardNoticia(n) {
  return `
  <article class="group flex flex-col overflow-hidden rounded-md bg-white ring-1 ring-ivory-200 hover:shadow-2xl hover:shadow-navy-950/15 hover:-translate-y-1 transition duration-500">
    <div class="relative aspect-[16/10] overflow-hidden img-fallback">
      ${n.imagem ? `<img src="${esc(n.imagem)}" alt="" loading="lazy" class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />` : ''}
      <span class="absolute top-4 left-4 font-caps text-[10px] font-semibold tracking-[.2em] px-2.5 py-1 rounded-sm bg-navy-950/55 text-white ring-1 ring-white/25 backdrop-blur-sm">${esc(n.categoria)}</span>
    </div>
    <div class="flex flex-1 flex-col p-6">
      <p class="font-caps text-[10px] font-semibold tracking-[.2em] text-gold-700">${dataCurta(n.data)}</p>
      <h3 class="mt-2 font-serif font-semibold text-[1.65rem] leading-tight text-navy-900">${esc(n.titulo)}</h3>
      <p class="mt-3 text-[15px] leading-relaxed text-slate-600">${esc(n.resumo)}</p>
      ${saibaMais(n)}
    </div>
  </article>`;
}

// Notícia em destaque (página Notícias)
function cardDestaque(n) {
  return `
  <article class="group grid lg:grid-cols-[1.15fr_1fr] overflow-hidden rounded-md bg-white ring-1 ring-ivory-200 shadow-2xl shadow-navy-950/10">
    <div class="relative min-h-[16rem] sm:min-h-[22rem] overflow-hidden img-fallback">
      ${n.imagem ? `<img src="${esc(n.imagem)}" alt="" class="absolute inset-0 w-full h-full object-cover transition-transform duration-[2000ms] group-hover:scale-105" />` : ''}
      <span class="absolute top-5 left-5 inline-flex items-center gap-2 rounded-sm bg-gold-500 px-3 py-1.5 font-caps text-[10px] font-semibold tracking-[.22em] text-navy-950 shadow-lg">Mais recente</span>
    </div>
    <div class="flex flex-col justify-center p-7 sm:p-12">
      <p class="font-caps text-[11px] font-semibold tracking-[.22em] text-gold-700">${esc(n.categoria)} · ${dataLonga(n.data)}</p>
      <h3 class="mt-3 font-serif font-semibold text-4xl sm:text-5xl leading-[1.05] text-navy-900">${esc(n.titulo)}</h3>
      <div class="divisor esquerda mt-6" aria-hidden="true">${CRUZ}</div>
      <p class="mt-6 font-texto text-xl leading-relaxed text-slate-700">${esc(n.resumo)}</p>
      ${saibaMais(n)}
    </div>
  </article>`;
}

// Recados: quadro de avisos
const itemRecado = (r) => `
  <li class="relative pl-6">
    <span class="absolute left-0 top-2 w-2 h-2 rotate-45 bg-gold-500" aria-hidden="true"></span>
    <p class="font-serif font-semibold text-xl text-navy-900 leading-snug">${esc(r.titulo)}</p>
    <p class="mt-1 text-[15px] leading-relaxed text-slate-600">${esc(r.texto)}</p>
  </li>`;

/* ---------- Página inicial: resumo ---------- */
const resumo = $('#noticias-resumo');
if (resumo) {
  const lista = ordenadas().slice(0, 2);
  resumo.innerHTML = lista.length
    ? lista.map(cardNoticia).join('')
    : '<p class="sm:col-span-2 text-slate-500">Nenhuma notícia publicada no momento.</p>';
}
const recadosResumo = $('#recados-resumo');
if (recadosResumo) recadosResumo.innerHTML = RECADOS.slice(0, 3).map(itemRecado).join('');

/* ---------- Página Notícias: completa ---------- */
const destaque = $('#noticia-destaque');
if (destaque) {
  const [primeira, ...resto] = ordenadas();
  destaque.innerHTML = primeira ? cardDestaque(primeira) : `
    <div class="text-center py-16">
      <div class="divisor" aria-hidden="true">${CRUZ}</div>
      <p class="mt-6 font-serif text-3xl text-navy-900">Nenhuma notícia publicada no momento.</p>
    </div>`;
  const lista = $('#lista-noticias');
  if (lista) {
    lista.innerHTML = resto.map(cardNoticia).join('');
    if (!resto.length) $('#bloco-mais-noticias')?.classList.add('hidden');
  }
}
const recadosLista = $('#recados-lista');
if (recadosLista) recadosLista.innerHTML = RECADOS.map(itemRecado).join('');

const galeria = $('#galeria-noticias');
if (galeria) {
  galeria.innerHTML = GALERIA.map((g) => `
    <button type="button" data-foto="${esc(g.foto)}" data-legenda="${esc(g.legenda)}"
            class="foto-btn group relative overflow-hidden rounded-sm img-fallback focus:outline-none focus-visible:ring-4 focus-visible:ring-gold-400 ${g.grande ? 'col-span-2 row-span-2' : ''}">
      <img src="${esc(g.grande ? g.foto : g.foto.replace('.jpg', '-p.jpg'))}" alt="${esc(g.legenda)}" loading="lazy" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
      <span class="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-navy-950/85 to-transparent text-left font-serif italic text-lg text-white opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100 transition-opacity" aria-hidden="true">${esc(g.legenda)}</span>
    </button>`).join('');
}
})();
