'use client';

import { DESCRICAO_DO_PAPEL, NOME_DO_PAPEL, PAPEIS, type UsuarioDoPainel } from '@/modules/Acesso/Domain/acesso';
import { type AcaoDeFormulario } from '@/modules/Acesso/Presentation/estado';
import { SenhaTemporaria } from './Conta';
import { AcoesDoFormulario, BotaoSalvar, Campo, Formulario, Marcar, Opcoes } from './Formulario';

const OPCOES_DE_PERFIL = PAPEIS.map((p) => ({ valor: p, rotulo: NOME_DO_PAPEL[p], descricao: DESCRICAO_DO_PAPEL[p] }));

export function FormularioDeUsuario({
  acao,
  usuario,
  ehVoceMesmo = false,
}: {
  acao: AcaoDeFormulario;
  usuario?: Pick<UsuarioDoPainel, 'nome' | 'email' | 'papel' | 'ativo'>;
  ehVoceMesmo?: boolean;
}) {
  const novo = !usuario;
  return (
    <Formulario acao={acao} limparAoSalvar={novo}>
      {novo && <SenhaTemporaria />}
      <div className="grid gap-6 sm:grid-cols-2">
        <Campo nome="nome" rotulo="Nome" valor={usuario?.nome} obrigatorio maxLength={120} autoComplete="off" />
        <Campo
          nome="email"
          rotulo="E-mail (ou nome de usuário)"
          valor={usuario?.email}
          obrigatorio
          maxLength={200}
          autoComplete="off"
          ajuda="É com ele que a pessoa entra no painel."
        />
      </div>
      {ehVoceMesmo ? (
        <p className="rounded-md bg-slate-50 px-4 py-3 text-sm text-slate-700 ring-1 ring-slate-200">
          Este é você. Por segurança, ninguém muda o próprio perfil nem desativa a própria conta — peça a outro Admin master.
          <input type="hidden" name="papel" value={usuario?.papel} />
          <input type="hidden" name="ativo" value="on" />
        </p>
      ) : (
        <>
          <Opcoes nome="papel" rotulo="Perfil de acesso" valor={usuario?.papel ?? 'pascom'} opcoes={OPCOES_DE_PERFIL} />
          {!novo && (
            <Marcar
              nome="ativo"
              rotulo="Conta ativa"
              ajuda="Desmarque para bloquear o acesso sem apagar o histórico. A pessoa sai do painel na hora."
              marcado={usuario.ativo}
            />
          )}
        </>
      )}
      {novo && (
        <p className="text-sm text-slate-600">
          O painel gera uma senha temporária. No primeiro acesso, a pessoa cria a própria senha.
        </p>
      )}
      <AcoesDoFormulario principal={<BotaoSalvar>{novo ? 'Criar usuário' : 'Salvar alterações'}</BotaoSalvar>} />
    </Formulario>
  );
}
