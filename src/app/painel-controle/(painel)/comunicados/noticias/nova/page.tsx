import { type Metadata } from 'next';
import { enviarFoto } from '@/app/painel-controle/acoes-de-acesso';
import { FormularioDeNoticia } from '@/components/painel/FormulariosDeComunicados';
import { CabecalhoDaPagina, Cartao } from '@/components/painel/Pagina';
import { painel } from '@/config/container';
import { hojeIsoEmBrasilia } from '@/lib/datas';
import { exigirPermissao } from '@/modules/Acesso/Presentation/sessao';
import { criarNoticia } from '../../acoes';

export const metadata: Metadata = { title: 'Nova notícia' };

export default async function NovaNoticia() {
  await exigirPermissao('comunicados');
  const categorias = [...new Set((await painel.comunicados.listarNoticias()).map((n) => n.categoria))];
  return (
    <>
      <CabecalhoDaPagina titulo="Nova notícia" voltar={{ href: '/painel-controle/comunicados', rotulo: 'Notícias e recados' }} />
      <Cartao>
        <FormularioDeNoticia
          acao={criarNoticia}
          enviarFoto={enviarFoto.bind(null, 'noticias')}
          hoje={hojeIsoEmBrasilia(new Date())}
          categorias={categorias}
        />
      </Cartao>
    </>
  );
}
