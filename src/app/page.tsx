import { type Metadata } from 'next';
import { Abertura } from '@/components/inicio/Abertura';
import { SecaoAcontece } from '@/components/inicio/SecaoAcontece';
import { SecaoDoacao } from '@/components/inicio/SecaoDoacao';
import { SecaoGaleria } from '@/components/inicio/SecaoGaleria';
import { SecaoHorarios } from '@/components/inicio/SecaoHorarios';
import { SecaoMural } from '@/components/inicio/SecaoMural';
import { SecaoSantuario } from '@/components/inicio/SecaoSantuario';
import { casosDeUso } from '@/config/container';
import { instanteDaRequisicao } from '@/lib/requisicao';

export const metadata: Metadata = {
  title: { absolute: 'Santuário Nossa Senhora de Fátima e São João de Deus' },
  description:
    'Santuário Arquidiocesano Nossa Senhora de Fátima e São João de Deus, em Realengo (RJ) — horários de missa, programação, notícias, comunicados e doações.',
  alternates: { canonical: '/' },
};

/**
 * Página inicial: a abertura com o vídeo do Santuário, eventos, horários (em vitrais), mural,
 * galeria por álbuns, a história e o convite à doação.
 * Todo o conteúdo vem dos casos de uso (src/config/container.ts), que leem src/mocks.
 */
export default async function PaginaInicial() {
  const agora = await instanteDaRequisicao(); // eventos e horários dependem da hora atual
  const [resumo, quadro, noticias, recados, albuns, institucional] = await Promise.all([
    casosDeUso.eventos.resumoDaPaginaInicial(new Date(agora)),
    casosDeUso.horarios.obterQuadro(),
    casosDeUso.comunicados.ultimasNoticias(2),
    casosDeUso.comunicados.listarRecados(3),
    casosDeUso.galeria.listarAlbuns(),
    casosDeUso.institucional.obter(),
  ]);

  return (
    <>
      <Abertura eventoMaisProximo={resumo?.maisProximo ?? null} agora={agora} />
      {/* Sem eventos futuros, a seção some */}
      {resumo && <SecaoAcontece resumo={resumo} agora={agora} />}
      <SecaoHorarios quadro={quadro} agora={agora} />
      <SecaoMural noticias={noticias} recados={recados} />
      <SecaoGaleria albuns={albuns.slice(0, 3)} totalDeAlbuns={albuns.length} />
      <SecaoSantuario apresentacao={institucional.apresentacao} />
      <SecaoDoacao />
    </>
  );
}
