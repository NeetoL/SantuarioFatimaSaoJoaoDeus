'use client';

import { type ReactNode, useActionState, useEffect } from 'react';
import { useFormStatus } from 'react-dom';
import { useAvisar } from '@/components/layout/Avisos';
import { type AcaoDeFormulario, ESTADO_INICIAL } from '@/modules/Acesso/Presentation/estado';

function Botao({ children, classe, rotulo }: { children: ReactNode; classe: string; rotulo?: string }) {
  const { pending } = useFormStatus();
  return (
    <button type="submit" className={classe} disabled={pending} aria-label={rotulo} title={rotulo}>
      {pending ? '…' : children}
    </button>
  );
}

/**
 * Botão que dispara uma ação do servidor (excluir, mover, definir capa…).
 * Com `confirmar`, pergunta antes; o resultado aparece no aviso flutuante.
 */
export function BotaoDeAcao({
  acao,
  campos = {},
  confirmar,
  children,
  classe = 'btn btn-linha btn-sm',
  rotulo,
}: {
  acao: AcaoDeFormulario;
  campos?: Record<string, string>;
  confirmar?: string;
  children: ReactNode;
  classe?: string;
  rotulo?: string;
}) {
  const [estado, enviar] = useActionState(acao, ESTADO_INICIAL);
  const avisar = useAvisar();
  useEffect(() => {
    if (estado.vez && estado.mensagem) avisar(estado.mensagem, estado.ok ? 2200 : 4500);
  }, [estado, avisar]);

  return (
    <form
      action={enviar}
      onSubmit={(e) => {
        if (confirmar && !window.confirm(confirmar)) e.preventDefault();
      }}
      className="inline"
    >
      {Object.entries(campos).map(([nome, valor]) => (
        <input key={nome} type="hidden" name={nome} value={valor} />
      ))}
      <Botao classe={classe} rotulo={rotulo}>
        {children}
      </Botao>
    </form>
  );
}
