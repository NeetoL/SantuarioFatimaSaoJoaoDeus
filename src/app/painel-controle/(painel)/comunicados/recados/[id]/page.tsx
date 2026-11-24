import { type Metadata } from 'next';
import { notFound } from 'next/navigation';
import { BotaoDeAcao } from '@/components/painel/BotaoDeAcao';
import { FormularioDeRecado } from '@/components/painel/FormulariosDeComunicados';
import { CabecalhoDaPagina, Cartao } from '@/components/painel/Pagina';
import { painel } from '@/config/container';
import { exigirPermissao } from '@/modules/Acesso/Presentation/sessao';
import { editarRecado, excluirRecado } from '../../acoes';

export const metadata: Metadata = { title: 'Editar recado' };

export default async function EditarRecado({ params }: { params: Promise<{ id: string }> }) {
  await exigirPermissao('comunicados');
  const id = decodeURIComponent((await params).id);
  const recado = await painel.comunicados.buscarRecado(id).catch(() => null);
  if (!recado) notFound();

  return (
    <>
      <CabecalhoDaPagina
        titulo={recado.titulo}
        voltar={{ href: '/painel-controle/comunicados', rotulo: 'Notícias e recados' }}
        acao={
          <BotaoDeAcao
            acao={excluirRecado.bind(null, id)}
            confirmar={`Excluir o recado "${recado.titulo}"?`}
            classe="btn btn-sm border-red-200 text-red-700 hover:bg-red-50"
          >
            Excluir recado
          </BotaoDeAcao>
        }
      />
      <Cartao>
        <FormularioDeRecado acao={editarRecado.bind(null, id)} recado={recado} />
      </Cartao>
    </>
  );
}
