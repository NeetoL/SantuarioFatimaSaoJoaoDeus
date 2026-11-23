import { z } from 'zod';
import { esquemaPaginacao } from '@/shared/Application/paginacao';
import { ErroDeValidacao } from '@/shared/Domain/erros';
import { respostaSucesso } from '@/shared/Presentation/resposta-api';
import { lerQuery } from '@/shared/Presentation/rota-api';
import { type CasosDeUsoDeEventos } from '../Application/casos-de-uso';
import { CATEGORIAS_DE_EVENTO } from '../Domain/evento';

/** ?categoria=Missa&pagina=1&porPagina=20 */
export const esquemaListagemDeEventos = esquemaPaginacao.extend({
  categoria: z.enum(CATEGORIAS_DE_EVENTO, { error: 'Categoria inválida.' }).optional(),
});

/** Identificadores são "slugs": letras minúsculas, números e hífens. */
export const esquemaIdDeEvento = z.string().regex(/^[a-z0-9-]{1,120}$/, 'Identificador inválido.');

function validarId(id: string) {
  const lido = esquemaIdDeEvento.safeParse(id);
  if (!lido.success) throw new ErroDeValidacao([{ campo: 'id', mensagem: 'Identificador inválido.' }]);
  return lido.data;
}

export function criarControladorDeEventos(casos: CasosDeUsoDeEventos) {
  return {
    async listar(requisicao: Request) {
      const { categoria, pagina, porPagina } = lerQuery(requisicao, esquemaListagemDeEventos);
      const resultado = await casos.listarProximos({ agora: new Date(), categoria, paginacao: { pagina, porPagina } });
      return respostaSucesso(resultado.itens, { meta: resultado.meta });
    },

    async detalhar(id: string) {
      return respostaSucesso(await casos.buscar(validarId(id)));
    },

    async arquivoDeAgenda(id: string) {
      const { nomeDoArquivo, conteudo } = await casos.arquivoDeAgenda(validarId(id), new Date());
      return new Response(conteudo, {
        headers: {
          'Content-Type': 'text/calendar; charset=utf-8',
          'Content-Disposition': `attachment; filename="${nomeDoArquivo}"`,
        },
      });
    },
  };
}
