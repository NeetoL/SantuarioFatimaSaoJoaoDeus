'use client';

import { useState } from 'react';
import { trocarSenha } from '@/app/painel-controle/acoes-de-acesso';
import { type AcaoDeFormulario } from '@/modules/Acesso/Presentation/estado';
import { AcoesDoFormulario, BotaoSalvar, Campo, Formulario, useEstadoDoFormulario } from './Formulario';

export function FormularioDeSenha({ primeiroAcesso }: { primeiroAcesso: boolean }) {
  return (
    <Formulario acao={trocarSenha} limparAoSalvar>
      {primeiroAcesso && <input type="hidden" name="primeiro-acesso" value="1" />}
      <Campo
        nome="atual"
        rotulo={primeiroAcesso ? 'Senha temporária (a que você recebeu)' : 'Senha atual'}
        tipo="password"
        autoComplete="current-password"
        obrigatorio
      />
      <div className="grid gap-6 sm:grid-cols-2">
        <Campo
          nome="nova"
          rotulo="Nova senha"
          tipo="password"
          autoComplete="new-password"
          obrigatorio
          ajuda="Pelo menos 10 caracteres. Uma frase fácil de lembrar é ótima."
        />
        <Campo nome="confirmacao" rotulo="Repita a nova senha" tipo="password" autoComplete="new-password" obrigatorio />
      </div>
      <AcoesDoFormulario principal={<BotaoSalvar>{primeiroAcesso ? 'Criar minha senha' : 'Trocar senha'}</BotaoSalvar>} />
    </Formulario>
  );
}

/** Mostra a senha temporária recém-gerada (uma única vez), com botão de copiar. */
export function SenhaTemporaria() {
  const { ok, extra } = useEstadoDoFormulario();
  const [copiada, setCopiada] = useState(false);
  const senha = ok && typeof extra?.senhaTemporaria === 'string' ? extra.senhaTemporaria : null;
  if (!senha) return null;
  return (
    <div className="rounded-lg border border-gold-500/40 bg-gold-50 p-5">
      <p className="font-semibold text-navy-950">Senha temporária{extra?.email ? ` de ${extra.email}` : ''}:</p>
      <div className="mt-3 flex flex-wrap items-center gap-3">
        <code className="select-all rounded-md bg-white px-4 py-2.5 font-mono text-xl tracking-wider text-navy-950 ring-1 ring-gold-500/30">
          {senha}
        </code>
        <button
          type="button"
          className="btn btn-linha btn-sm"
          onClick={() => {
            navigator.clipboard?.writeText(senha).then(() => setCopiada(true), () => setCopiada(false));
          }}
        >
          {copiada ? 'Copiada' : 'Copiar'}
        </button>
      </div>
      <p className="mt-3 text-sm leading-relaxed text-slate-700">
        Anote ou copie agora: ela <strong>não será mostrada de novo</strong>. Envie à pessoa por um canal privado. No primeiro acesso, o
        painel pede que ela crie a própria senha.
      </p>
    </div>
  );
}

/** Botão "Gerar senha temporária" de outro usuário (Admin master). */
export function RedefinirSenha({ acao }: { acao: AcaoDeFormulario }) {
  return (
    <Formulario
      acao={acao}
      className="space-y-4"
      confirmar="Gerar uma nova senha temporária? A senha atual da pessoa deixa de funcionar e ela sai do painel em todos os aparelhos."
    >
      <SenhaTemporaria />
      <BotaoSalvar classe="btn-linha btn-sm" enviandoTexto="Gerando…">
        Gerar senha temporária
      </BotaoSalvar>
    </Formulario>
  );
}
