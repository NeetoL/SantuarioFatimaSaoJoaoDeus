'use client';

import { createContext, type ReactNode, startTransition, useActionState, useContext, useEffect, useId, useRef } from 'react';
import { useAvisar } from '@/components/layout/Avisos';
import { type AcaoDeFormulario, ESTADO_INICIAL, type EstadoDoFormulario } from '@/modules/Acesso/Presentation/estado';

const ContextoDoFormulario = createContext<EstadoDoFormulario & { enviando: boolean }>({ ...ESTADO_INICIAL, enviando: false });
export const useEstadoDoFormulario = () => useContext(ContextoDoFormulario);

/**
 * Formulário do painel: envia para uma ação do servidor e mostra a resposta
 * (mensagem geral no alto e o erro de cada campo embaixo dele).
 * O envio é feito à mão (e não com `<form action>`) para o que foi digitado não sumir quando há erro.
 */
export function Formulario({
  acao,
  children,
  className = 'space-y-6',
  limparAoSalvar = false,
  confirmar,
  mensagemFlutuante = false,
}: {
  acao: AcaoDeFormulario;
  children: ReactNode;
  className?: string;
  limparAoSalvar?: boolean;
  /** Pergunta antes de enviar (ex.: redefinir senha). */
  confirmar?: string;
  /** Mensagem num aviso flutuante em vez do alto do formulário (formulários longos, com o botão lá embaixo). */
  mensagemFlutuante?: boolean;
}) {
  const [estado, enviar, enviando] = useActionState(acao, ESTADO_INICIAL);
  const formulario = useRef<HTMLFormElement>(null);
  const avisar = useAvisar();

  useEffect(() => {
    if (!estado.vez) return;
    if (mensagemFlutuante && estado.mensagem) avisar(estado.mensagem, estado.ok ? 3000 : 6000);
    if (estado.ok) {
      if (limparAoSalvar) formulario.current?.reset();
    } else {
      // leva o foco ao primeiro campo com erro
      const primeiro = Object.keys(estado.erros)[0];
      if (primeiro) formulario.current?.querySelector<HTMLElement>(`[name="${CSS.escape(primeiro)}"]`)?.focus();
    }
  }, [estado, limparAoSalvar, mensagemFlutuante, avisar]);

  return (
    <form
      ref={formulario}
      className={className}
      noValidate
      onSubmit={(e) => {
        e.preventDefault();
        if (enviando || (confirmar && !window.confirm(confirmar))) return;
        const dados = new FormData(e.currentTarget, (e.nativeEvent as SubmitEvent).submitter);
        startTransition(() => enviar(dados));
      }}
    >
      <ContextoDoFormulario.Provider value={{ ...estado, enviando }}>
        {!mensagemFlutuante && <MensagemDoFormulario />}
        {children}
      </ContextoDoFormulario.Provider>
    </form>
  );
}

export function MensagemDoFormulario() {
  const { ok, mensagem, vez } = useEstadoDoFormulario();
  if (!mensagem) return null;
  return (
    <p
      key={vez}
      role={ok ? 'status' : 'alert'}
      className={`rounded-md border px-4 py-3 text-base ${ok ? 'border-emerald-200 bg-emerald-50 text-emerald-900' : 'border-red-200 bg-red-50 text-red-900'}`}
    >
      {mensagem}
    </p>
  );
}

const estiloDoCampo =
  'w-full rounded-md border border-slate-300 bg-white px-3.5 text-base text-navy-950 placeholder:text-slate-400 focus:border-gold-500 focus:outline-none focus:ring-2 focus:ring-gold-400/30 aria-[invalid=true]:border-red-400';

type BaseDoCampo = {
  nome: string;
  rotulo: string;
  ajuda?: ReactNode;
  obrigatorio?: boolean;
  className?: string;
};

function Moldura({
  id,
  nome,
  rotulo,
  ajuda,
  obrigatorio,
  className = '',
  children,
}: BaseDoCampo & { id: string; children: (props: { 'aria-invalid': boolean; 'aria-describedby'?: string }) => ReactNode }) {
  const { erros } = useEstadoDoFormulario();
  const erro = erros[nome];
  const descricao = [ajuda ? `${id}-ajuda` : null, erro ? `${id}-erro` : null].filter(Boolean).join(' ') || undefined;
  return (
    <div className={className}>
      <label htmlFor={id} className="block text-[.95rem] font-semibold text-navy-900">
        {rotulo}
        {obrigatorio && <span className="text-wine-700"> *</span>}
      </label>
      <div className="mt-1.5">{children({ 'aria-invalid': Boolean(erro), 'aria-describedby': descricao })}</div>
      {ajuda && (
        <p id={`${id}-ajuda`} className="mt-1.5 text-sm text-slate-600">
          {ajuda}
        </p>
      )}
      {erro && (
        <p id={`${id}-erro`} className="mt-1.5 text-sm font-medium text-red-700">
          {erro}
        </p>
      )}
    </div>
  );
}

export function Campo({
  tipo = 'text',
  valor,
  ...props
}: BaseDoCampo & {
  tipo?: string;
  valor?: string | number;
  placeholder?: string;
  autoComplete?: string;
  inputMode?: 'text' | 'numeric' | 'decimal' | 'tel' | 'email';
  maxLength?: number;
}) {
  const id = useId();
  return (
    <Moldura id={id} {...props}>
      {(aria) => (
        <input
          id={id}
          name={props.nome}
          type={tipo}
          defaultValue={valor}
          required={props.obrigatorio}
          placeholder={props.placeholder}
          autoComplete={props.autoComplete}
          inputMode={props.inputMode}
          maxLength={props.maxLength}
          className={`${estiloDoCampo} h-12`}
          {...aria}
        />
      )}
    </Moldura>
  );
}

export function AreaDeTexto({ valor, linhas = 4, ...props }: BaseDoCampo & { valor?: string; linhas?: number; maxLength?: number }) {
  const id = useId();
  return (
    <Moldura id={id} {...props}>
      {(aria) => (
        <textarea
          id={id}
          name={props.nome}
          defaultValue={valor}
          rows={linhas}
          required={props.obrigatorio}
          maxLength={props.maxLength}
          className={`${estiloDoCampo} py-3 leading-relaxed`}
          {...aria}
        />
      )}
    </Moldura>
  );
}

export function Selecao({
  valor,
  opcoes,
  ...props
}: BaseDoCampo & { valor?: string; opcoes: readonly { valor: string; rotulo: string }[] }) {
  const id = useId();
  return (
    <Moldura id={id} {...props}>
      {(aria) => (
        <select id={id} name={props.nome} defaultValue={valor} className={`${estiloDoCampo} h-12 pr-8`} {...aria}>
          {opcoes.map((o) => (
            <option key={o.valor} value={o.valor}>
              {o.rotulo}
            </option>
          ))}
        </select>
      )}
    </Moldura>
  );
}

export function Marcar({ nome, rotulo, ajuda, marcado }: { nome: string; rotulo: string; ajuda?: string; marcado?: boolean }) {
  const id = useId();
  return (
    <div className="flex items-start gap-3">
      <input
        id={id}
        name={nome}
        type="checkbox"
        defaultChecked={marcado}
        className="mt-1 h-5 w-5 shrink-0 rounded border-slate-400 text-navy-900 accent-[#0f2a4f]"
      />
      <label htmlFor={id} className="text-base text-navy-950">
        <span className="font-semibold">{rotulo}</span>
        {ajuda && <span className="block text-sm text-slate-600">{ajuda}</span>}
      </label>
    </div>
  );
}

export function BotaoSalvar({
  children = 'Salvar',
  classe = 'btn-escuro',
  enviandoTexto = 'Salvando…',
}: {
  children?: ReactNode;
  classe?: string;
  enviandoTexto?: string;
}) {
  const { enviando } = useEstadoDoFormulario();
  return (
    <button type="submit" className={`btn ${classe}`} disabled={enviando} aria-disabled={enviando}>
      {enviando ? enviandoTexto : children}
    </button>
  );
}

/** Escolha única em lista (com descrição de cada opção), ex.: perfil de acesso. */
export function Opcoes({
  nome,
  rotulo,
  valor,
  opcoes,
}: {
  nome: string;
  rotulo: string;
  valor?: string;
  opcoes: readonly { valor: string; rotulo: string; descricao?: string }[];
}) {
  const id = useId();
  const { erros } = useEstadoDoFormulario();
  const erro = erros[nome];
  return (
    <fieldset aria-describedby={erro ? `${id}-erro` : undefined}>
      <legend className="block text-[.95rem] font-semibold text-navy-900">{rotulo}</legend>
      <div className="mt-2 grid gap-2 sm:grid-cols-2">
        {opcoes.map((o) => (
          <label
            key={o.valor}
            className="flex cursor-pointer items-start gap-3 rounded-md border border-slate-300 bg-white p-3.5 transition-colors hover:border-navy-800 has-[:checked]:border-navy-900 has-[:checked]:bg-navy-50 has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-gold-400"
          >
            <input type="radio" name={nome} value={o.valor} defaultChecked={o.valor === valor} className="mt-1 h-4 w-4 accent-[#0f2a4f]" />
            <span>
              <span className="block font-semibold text-navy-950">{o.rotulo}</span>
              {o.descricao && <span className="mt-0.5 block text-sm leading-snug text-slate-600">{o.descricao}</span>}
            </span>
          </label>
        ))}
      </div>
      {erro && (
        <p id={`${id}-erro`} className="mt-1.5 text-sm font-medium text-red-700">
          {erro}
        </p>
      )}
    </fieldset>
  );
}

/** Rodapé do formulário: botão principal e, opcionalmente, outras ações à direita. */
export function AcoesDoFormulario({ children, principal }: { children?: ReactNode; principal: ReactNode }) {
  return (
    <div className="flex flex-col-reverse gap-3 border-t border-slate-200 pt-6 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-wrap gap-3">{children}</div>
      <div className="flex">{principal}</div>
    </div>
  );
}
