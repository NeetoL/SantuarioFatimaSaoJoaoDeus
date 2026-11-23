'use client';

import { type FormEvent, useState } from 'react';
import { ASSUNTOS, esquemaMensagemDeContato, montarLinkDeEmail } from '@/modules/Contato/Domain/mensagem';

type Erros = Partial<Record<'nome' | 'telefone' | 'assunto' | 'mensagem', string>>;
const CAMPO =
  'mt-2 w-full rounded-sm border border-ivory-300 bg-ivory-50 px-4 py-3 text-navy-900 placeholder:text-slate-500 focus:border-gold-500 focus:ring-2 focus:ring-gold-500/30 focus:outline-none transition';
const ROTULO = 'block font-caps text-[.875rem] font-semibold tracking-[.2em] text-navy-800';

/**
 * "Envie uma mensagem": valida os campos (Zod) e abre o aplicativo de e-mail da pessoa com a mensagem pronta.
 * Nada é enviado nem guardado pelo site (mesmo comportamento do site estático).
 */
export function FormularioDeContato({ email }: { email: string }) {
  const [erros, setErros] = useState<Erros>({});
  const [abriuEmail, setAbriuEmail] = useState(false);

  function enviar(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formulario = e.currentTarget;
    if (!formulario.reportValidity()) return;
    const lido = esquemaMensagemDeContato.safeParse(Object.fromEntries(new FormData(formulario)));
    if (!lido.success) {
      const novos: Erros = {};
      lido.error.issues.forEach((i) => {
        const campo = i.path[0] as keyof Erros;
        novos[campo] ??= i.message;
      });
      setErros(novos);
      return;
    }
    setErros({});
    window.location.href = montarLinkDeEmail(lido.data, email);
    setAbriuEmail(true);
  }

  const erro = (campo: keyof Erros) =>
    erros[campo] ? (
      <p id={`erro-${campo}`} className="mt-1.5 text-base text-wine-700">
        {erros[campo]}
      </p>
    ) : null;
  const descrito = (campo: keyof Erros) =>
    erros[campo] ? { 'aria-invalid': true, 'aria-describedby': `erro-${campo}` } : {};

  return (
    <form id="form-contato" className="mt-9 space-y-5" noValidate onSubmit={enviar}>
      <div className="grid sm:grid-cols-2 gap-5">
        <div>
          <label htmlFor="nome" className={ROTULO}>
            Nome
          </label>
          <input
            id="nome"
            name="nome"
            type="text"
            required
            maxLength={100}
            autoComplete="name"
            className={CAMPO}
            placeholder="Seu nome"
            {...descrito('nome')}
          />
          {erro('nome')}
        </div>
        <div>
          <label htmlFor="telefone" className={ROTULO}>
            Telefone / WhatsApp{' '}
            <span className="normal-case tracking-normal font-sans font-normal text-slate-600">(opcional)</span>
          </label>
          <input
            id="telefone"
            name="telefone"
            type="tel"
            maxLength={30}
            autoComplete="tel"
            className={CAMPO}
            placeholder="(21) 00000-0000"
            {...descrito('telefone')}
          />
          {erro('telefone')}
        </div>
      </div>
      <div>
        <label htmlFor="assunto" className={ROTULO}>
          Assunto
        </label>
        <select id="assunto" name="assunto" required className={CAMPO} {...descrito('assunto')}>
          {ASSUNTOS.map((assunto) => (
            <option key={assunto}>{assunto}</option>
          ))}
        </select>
        {erro('assunto')}
      </div>
      <div>
        <label htmlFor="mensagem-texto" className={ROTULO}>
          Mensagem
        </label>
        <textarea
          id="mensagem-texto"
          name="mensagem"
          rows={6}
          required
          maxLength={2000}
          className={`${CAMPO} resize-y`}
          placeholder="Escreva sua mensagem"
          {...descrito('mensagem')}
        ></textarea>
        {erro('mensagem')}
      </div>
      <div className="flex flex-col sm:flex-row sm:items-center gap-4 pt-1">
        <button type="submit" className="btn btn-escuro">
          <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
            <rect x="3" y="5" width="18" height="14" rx="2"></rect>
            <path d="M3 7l9 6 9-6"></path>
          </svg>
          Enviar mensagem
        </button>
        <p className="text-base text-slate-600">Seu aplicativo de e-mail vai abrir com a mensagem pronta.</p>
      </div>
      {abriuEmail && (
        <p id="form-aviso" className="text-base text-wine-700" role="status">
          Se o aplicativo de e-mail não abrir, escreva para{' '}
          <a className="underline" href={`mailto:${email}`}>
            {email}
          </a>
          .
        </p>
      )}
    </form>
  );
}
