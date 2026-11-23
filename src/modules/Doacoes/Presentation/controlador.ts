import { respostaSucesso } from '@/shared/Presentation/resposta-api';
import { type CasosDeUsoDeDoacoes } from '../Application/casos-de-uso';

export function criarControladorDeDoacoes(casos: CasosDeUsoDeDoacoes) {
  return {
    async obter() {
      const dados = await casos.obter();
      return respostaSucesso(dados, {
        message: dados.exemplo
          ? 'Dados de EXEMPLO: ainda não são os dados bancários reais do Santuário.'
          : 'Dados para doação.',
      });
    },

    async qrCodeDoPix() {
      return new Response(await casos.qrCodeDoPix(), {
        headers: {
          'Content-Type': 'image/svg+xml; charset=utf-8',
          // SVG gerado por nós; mesmo assim, impede que seja interpretado como página com scripts
          'Content-Security-Policy': "default-src 'none'; style-src 'unsafe-inline'; sandbox",
        },
      });
    },
  };
}
