import { respostaSucesso } from '@/shared/Presentation/resposta-api';
import { type CasosDeUsoDaGaleria } from '../Application/casos-de-uso';

export function criarControladorDaGaleria(casos: CasosDeUsoDaGaleria) {
  return {
    async listar() {
      return respostaSucesso(await casos.listar());
    },
  };
}
