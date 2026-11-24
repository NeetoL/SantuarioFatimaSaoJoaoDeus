import { type Metadata } from 'next';
import { notFound } from 'next/navigation';
import { enviarFoto } from '@/app/painel-controle/acoes-de-acesso';
import { BotaoDeAcao } from '@/components/painel/BotaoDeAcao';
import { FormularioDeNoticia } from '@/components/painel/FormulariosDeComunicados';
import { CabecalhoDaPagina, Cartao } from '@/components/painel/Pagina';
import { painel } from '@/config/container';
import { hojeIsoEmBrasilia } from '@/lib/datas';
import { exigirPermissao } from '@/modules/Acesso/Presentation/sessao';
import { editarNoticia, excluirNoticia } from '../../acoes';

export const metadata: Metadata = { title: 'Editar notícia' };

export default async function EditarNoticia({ params }: { params: Promise<{ id: string }> }) {
  await exigirPermissao('comunicados');
  const id = decodeURIComponent((await params).id);
  const [noticia, todas] = await Promise.all([
    painel.comunicados.buscarNoticia(id).catch(() => null),
    painel.comunicados.listarNoticias(),
  ]);
  if (!noticia) notFound();

  return (
    <>
      <CabecalhoDaPagina
        titulo={noticia.titulo}
        voltar={{ href: '/painel-controle/comunicados', rotulo: 'Notícias e recados' }}
        acao={
          <BotaoDeAcao
            acao={excluirNoticia.bind(null, id)}
            confirmar={`Excluir a notícia "${noticia.titulo}"? Ela sai do site na hora.`}
            classe="btn btn-sm border-red-200 text-red-700 hover:bg-red-50"
          >
            Excluir notícia
          </BotaoDeAcao>
        }
      />
      <Cartao>
        <FormularioDeNoticia
          acao={editarNoticia.bind(null, id)}
          enviarFoto={enviarFoto.bind(null, 'noticias')}
          noticia={noticia}
          hoje={hojeIsoEmBrasilia(new Date())}
          categorias={[...new Set(todas.map((n) => n.categoria))]}
        />
      </Cartao>
    </>
  );
}
