import { type Metadata } from 'next';
import { notFound } from 'next/navigation';
import { enviarFoto } from '@/app/painel-controle/acoes-de-acesso';
import { BotaoDeAcao } from '@/components/painel/BotaoDeAcao';
import { FormularioDeEvento } from '@/components/painel/FormularioDeEvento';
import { CabecalhoDaPagina, Cartao } from '@/components/painel/Pagina';
import { painel } from '@/config/container';
import { hojeIsoEmBrasilia } from '@/lib/datas';
import { exigirPermissao } from '@/modules/Acesso/Presentation/sessao';
import { editarEvento, excluirEvento } from '../acoes';

export const metadata: Metadata = { title: 'Editar evento' };

export default async function EditarEvento({ params }: { params: Promise<{ id: string }> }) {
  await exigirPermissao('eventos');
  const id = decodeURIComponent((await params).id);
  const evento = await painel.eventos.buscar(id).catch(() => null);
  if (!evento) notFound();

  return (
    <>
      <CabecalhoDaPagina
        titulo={evento.titulo}
        voltar={{ href: '/painel-controle/eventos', rotulo: 'Eventos' }}
        acao={
          <BotaoDeAcao
            acao={excluirEvento.bind(null, id)}
            confirmar={`Excluir o evento "${evento.titulo}"? Ele sai do site na hora.`}
            classe="btn btn-sm border-red-200 text-red-700 hover:bg-red-50"
          >
            Excluir evento
          </BotaoDeAcao>
        }
      />
      <Cartao>
        <FormularioDeEvento
          acao={editarEvento.bind(null, id)}
          enviarFoto={enviarFoto.bind(null, 'eventos')}
          evento={evento}
          hoje={hojeIsoEmBrasilia(new Date())}
        />
      </Cartao>
    </>
  );
}
