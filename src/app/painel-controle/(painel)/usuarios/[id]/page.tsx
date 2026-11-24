import { type Metadata } from 'next';
import { notFound } from 'next/navigation';
import { RedefinirSenha } from '@/components/painel/Conta';
import { FormularioDeUsuario } from '@/components/painel/FormularioDeUsuario';
import { ListaDeAtividades } from '@/components/painel/ListaDeAtividades';
import { CabecalhoDaPagina, Cartao, dataHoraBR, Vazio } from '@/components/painel/Pagina';
import { painel } from '@/config/container';
import { exigirPermissao } from '@/modules/Acesso/Presentation/sessao';
import { editarUsuario, redefinirSenha } from '../acoes';

export const metadata: Metadata = { title: 'Usuário' };

export default async function EditarUsuario({ params }: { params: Promise<{ id: string }> }) {
  const eu = await exigirPermissao('usuarios');
  const { id } = await params;
  if (!/^[0-9a-f-]{36}$/i.test(id)) notFound();
  const usuario = await painel.acesso.buscarUsuario(id).catch(() => null);
  if (!usuario) notFound();
  const atividades = await painel.atividades.listar({ usuarioId: id }, 1, 10);
  const ehVoceMesmo = usuario.id === eu.id;

  return (
    <div className="space-y-6">
      <CabecalhoDaPagina
        titulo={usuario.nome}
        descricao={
          usuario.ultimoAcesso ? `Último acesso em ${dataHoraBR(usuario.ultimoAcesso)}.` : 'Esta pessoa ainda não entrou no painel.'
        }
        voltar={{ href: '/painel-controle/usuarios', rotulo: 'Usuários' }}
      />
      <Cartao titulo="Dados e perfil">
        <FormularioDeUsuario acao={editarUsuario.bind(null, id)} usuario={usuario} ehVoceMesmo={ehVoceMesmo} />
      </Cartao>
      {!ehVoceMesmo && (
        <Cartao
          titulo="Senha"
          descricao="Se a pessoa esqueceu a senha, gere uma senha temporária e envie a ela. No próximo acesso, ela cria uma nova."
        >
          <RedefinirSenha acao={redefinirSenha.bind(null, id)} />
        </Cartao>
      )}
      <Cartao titulo="Últimas atividades desta pessoa">
        {atividades.itens.length ? <ListaDeAtividades itens={atividades.itens} mostrarIp /> : <Vazio>Nenhuma atividade ainda.</Vazio>}
      </Cartao>
    </div>
  );
}
