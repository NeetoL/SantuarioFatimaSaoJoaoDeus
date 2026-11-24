import { redirect } from 'next/navigation';
import { Casca } from '@/components/painel/Casca';
import { MENU_DO_PAINEL } from '@/components/painel/navegacao';
import { casosDeUso } from '@/config/container';
import { NOME_DO_PAPEL, pode } from '@/modules/Acesso/Domain/acesso';
import { ENDERECO_DE_ENTRADA, usuarioAtual } from '@/modules/Acesso/Presentation/sessao';
import { logoDoSite } from '@/modules/Institucional/Domain/institucional';

/**
 * Moldura das páginas internas do painel.
 * Atenção: a proteção de verdade está em cada página e em cada ação (exigirPermissao),
 * porque o Next.js pode renderizar a página sem passar por este layout.
 */
export default async function LayoutDoPainel({ children }: { children: React.ReactNode }) {
  const usuario = await usuarioAtual();
  if (!usuario) redirect(ENDERECO_DE_ENTRADA);
  const institucional = await casosDeUso.institucional.obter();

  const grupos = usuario.trocarSenha
    ? []
    : MENU_DO_PAINEL.map((g) => ({ ...g, itens: g.itens.filter((i) => !i.permissao || pode(usuario.papel, i.permissao)) })).filter(
        (g) => g.itens.length,
      );

  return (
    <Casca
      grupos={grupos}
      pessoa={{ nome: usuario.nome, email: usuario.email, papel: NOME_DO_PAPEL[usuario.papel] }}
      logo={logoDoSite(institucional)}
    >
      {children}
    </Casca>
  );
}
