import { type Metadata } from 'next';
import { FormularioDeSenha } from '@/components/painel/Conta';
import { CabecalhoDaPagina, Cartao, dataHoraBR } from '@/components/painel/Pagina';
import { DESCRICAO_DO_PAPEL, NOME_DO_PAPEL } from '@/modules/Acesso/Domain/acesso';
import { exigirUsuario } from '@/modules/Acesso/Presentation/sessao';

export const metadata: Metadata = { title: 'Minha conta' };

export default async function MinhaConta() {
  const usuario = await exigirUsuario({ permitirSenhaTemporaria: true });
  const primeiroAcesso = usuario.trocarSenha;

  return (
    <div className="space-y-6">
      <CabecalhoDaPagina
        titulo={primeiroAcesso ? 'Crie a sua senha' : 'Minha conta'}
        descricao={
          primeiroAcesso
            ? 'Você entrou com uma senha temporária. Para continuar, crie uma senha pessoal — só você vai saber qual é.'
            : 'Seus dados de acesso ao painel.'
        }
      />

      {!primeiroAcesso && (
        <Cartao titulo="Seus dados">
          <dl className="grid gap-5 sm:grid-cols-2">
            <div>
              <dt className="text-sm font-medium text-slate-600">Nome</dt>
              <dd className="mt-0.5 text-base font-semibold text-navy-950">{usuario.nome}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-slate-600">E-mail (usado para entrar)</dt>
              <dd className="mt-0.5 text-base font-semibold text-navy-950">{usuario.email}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-slate-600">Perfil</dt>
              <dd className="mt-0.5 text-base font-semibold text-navy-950">{NOME_DO_PAPEL[usuario.papel]}</dd>
              <dd className="text-sm text-slate-600">{DESCRICAO_DO_PAPEL[usuario.papel]}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-slate-600">Conta criada em</dt>
              <dd className="mt-0.5 text-base font-semibold text-navy-950">{dataHoraBR(usuario.criadoEm)}</dd>
            </div>
          </dl>
          <p className="mt-6 text-sm text-slate-600">Para mudar nome, e-mail ou perfil, fale com o Admin master.</p>
        </Cartao>
      )}

      <Cartao
        titulo={primeiroAcesso ? 'Nova senha' : 'Trocar senha'}
        descricao={primeiroAcesso ? undefined : 'Ao trocar, o painel encerra o acesso nos outros aparelhos onde você estiver logado.'}
      >
        <FormularioDeSenha primeiroAcesso={primeiroAcesso} />
      </Cartao>
    </div>
  );
}
