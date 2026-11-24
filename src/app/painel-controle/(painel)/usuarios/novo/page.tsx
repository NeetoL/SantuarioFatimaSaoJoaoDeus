import { type Metadata } from 'next';
import { FormularioDeUsuario } from '@/components/painel/FormularioDeUsuario';
import { CabecalhoDaPagina, Cartao } from '@/components/painel/Pagina';
import { exigirPermissao } from '@/modules/Acesso/Presentation/sessao';
import { criarUsuario } from '../acoes';

export const metadata: Metadata = { title: 'Novo usuário' };

export default async function NovoUsuario() {
  await exigirPermissao('usuarios');
  return (
    <>
      <CabecalhoDaPagina titulo="Novo usuário" voltar={{ href: '/painel-controle/usuarios', rotulo: 'Usuários' }} />
      <Cartao>
        <FormularioDeUsuario acao={criarUsuario} />
      </Cartao>
    </>
  );
}
