import { type Metadata } from 'next';
import { FormularioDeRecado } from '@/components/painel/FormulariosDeComunicados';
import { CabecalhoDaPagina, Cartao } from '@/components/painel/Pagina';
import { exigirPermissao } from '@/modules/Acesso/Presentation/sessao';
import { criarRecado } from '../../acoes';

export const metadata: Metadata = { title: 'Novo recado' };

export default async function NovoRecado() {
  await exigirPermissao('comunicados');
  return (
    <>
      <CabecalhoDaPagina titulo="Novo recado" voltar={{ href: '/painel-controle/comunicados', rotulo: 'Notícias e recados' }} />
      <Cartao>
        <FormularioDeRecado acao={criarRecado} />
      </Cartao>
    </>
  );
}
