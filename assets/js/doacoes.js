/* ===========================================================
   Santuário — DOAÇÕES (página doacoes.html)
   Chave PIX, QR Code, botões "Copiar".
   =========================================================== */
(() => {

// Chave PIX usada no QR Code (troque também o texto da chave na página doacoes.html)
const PIX_CHAVE = '00.000.000/0001-00'; // chave ilustrativa

/* ------------------------------------------------------------
   Daqui para baixo: funcionamento (não precisa mexer)
   ------------------------------------------------------------ */
const $  = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

function avisar(msg) {
  const t = $('#toast');
  if (!t) return;
  t.textContent = msg;
  t.classList.remove('opacity-0');
  clearTimeout(avisar._t);
  avisar._t = setTimeout(() => t.classList.add('opacity-0'), 2400);
}

// QR Code (biblioteca qrcodejs carregada no <head> da página)
function desenharQR(el, tamanho) {
  if (!el) return;
  el.innerHTML = '';
  if (window.QRCode) {
    new QRCode(el, { text: 'PIX ' + PIX_CHAVE, width: tamanho, height: tamanho, colorDark: '#0f2a4f', colorLight: '#ffffff' });
  } else {
    el.innerHTML = '<span class="text-xs text-slate-400">QR Code</span>';
  }
}
window.addEventListener('load', () => desenharQR($('#qr-pequeno'), 148));

// Ampliar o QR Code
const modal = $('#modal-qr');
let ultimoFoco = null;
function abrir() {
  ultimoFoco = document.activeElement;
  modal.hidden = false;
  document.body.style.overflow = 'hidden';
  desenharQR($('#qr-grande'), Math.min(280, window.innerWidth - 120));
  $('#modal-qr-fechar').focus();
}
function fechar() {
  modal.hidden = true;
  document.body.style.overflow = '';
  ultimoFoco && ultimoFoco.focus();
}
if (modal) {
  $('#qr-abrir')?.addEventListener('click', abrir);
  $('#modal-qr-fechar').addEventListener('click', fechar);
  modal.addEventListener('click', (e) => { if (e.target === modal) fechar(); });
  document.addEventListener('keydown', (e) => { if (!modal.hidden && e.key === 'Escape') fechar(); });
}

// Botões "Copiar"
$$('.copiar').forEach((btn) => btn.addEventListener('click', async () => {
  const texto = $(btn.dataset.copiar).textContent.trim();
  try {
    await navigator.clipboard.writeText(texto);
  } catch {
    const ta = Object.assign(document.createElement('textarea'), { value: texto });
    document.body.appendChild(ta); ta.select(); document.execCommand('copy'); ta.remove();
  }
  const original = btn.textContent;
  btn.textContent = 'Copiado!';
  avisar('Copiado. Deus lhe pague!');
  setTimeout(() => (btn.textContent = original), 1800);
}));
})();
