import { esquemaPaginacao } from '@/shared/Application/paginacao';
import { respostaSucesso } from '@/shared/Presentation/resposta-api';
import { lerQuery } from '@/shared/Presentation/rota-api';
import { type CasosDeUsoDaGaleria } from '../Application/casos-de-uso';

export function criarControladorDaGaleria(casos: CasosDeUsoDaGaleria) {
  return {
    /** ?pagina=1&porPagina=10 */
    async listar(requisicao: Request) {
      const { pagina, porPagina } = lerQuery(requisicao, esquemaPaginacao);
      const resultado = await casos.listarAlbunsPaginados({ pagina, porPagina });
      return respostaSucesso(resultado.itens, { meta: resultado.meta });
    },
  };
}
