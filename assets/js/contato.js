/* ===========================================================
   Santuário — CONTATO (página contato.html)
   O formulário abre o aplicativo de e-mail da pessoa com a mensagem pronta,
   endereçada ao e-mail do Santuário (não precisa de servidor).
   =========================================================== */
(() => {
const EMAIL_DO_SANTUARIO = 'fatimaejoaodedeus@arqrio.org.br';

const form = document.querySelector('#form-contato');
if (!form) return;

form.addEventListener('submit', (e) => {
  e.preventDefault();
  if (!form.reportValidity()) return;
  const dados = Object.fromEntries(new FormData(form));
  const assunto = `[Site] ${dados.assunto} — ${dados.nome}`;
  const corpo = `${dados.mensagem}\n\n—\n${dados.nome}${dados.telefone ? `\nTelefone/WhatsApp: ${dados.telefone}` : ''}`;
  window.location.href = `mailto:${EMAIL_DO_SANTUARIO}?subject=${encodeURIComponent(assunto)}&body=${encodeURIComponent(corpo)}`;
  const aviso = document.querySelector('#form-aviso');
  if (aviso) aviso.classList.remove('hidden');
});
})();
