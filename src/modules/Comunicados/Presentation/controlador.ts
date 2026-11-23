import { z } from 'zod';
import { esquemaPaginacao } from '@/shared/Application/paginacao';
import { respostaSucesso } from '@/shared/Presentation/resposta-api';
import { lerQuery } from '@/shared/Presentation/rota-api';
import { type CasosDeUsoDeComunicados } from '../Application/casos-de-uso';

/** ?categoria=Comunidade&pagina=1&porPagina=10 */
export const esquemaListagemDeNoticias = esquemaPaginacao.extend({
  categoria: z.string().trim().min(2).max(40).optional(),
});

export const esquemaListagemDeRecados = z.object({
  limite: z.coerce.number().int().min(1).max(50).optional(),
});

export function criarControladorDeComunicados(casos: CasosDeUsoDeComunicados) {
  return {
    async listarNoticias(requisicao: Request) {
      const { categoria, pagina, porPagina } = lerQuery(requisicao, esquemaListagemDeNoticias);
      const resultado = await casos.listarNoticias({ categoria, paginacao: { pagina, porPagina } });
      return respostaSucesso(resultado.itens, { meta: resultado.meta });
    },

    async listarRecados(requisicao: Request) {
      const { limite } = lerQuery(requisicao, esquemaListagemDeRecados);
      return respostaSucesso(await casos.listarRecados(limite));
    },
  };
}
