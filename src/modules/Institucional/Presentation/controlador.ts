import { respostaSucesso } from '@/shared/Presentation/resposta-api';
import { type CasosDeUsoInstitucionais } from '../Application/casos-de-uso';

export function criarControladorInstitucional(casos: CasosDeUsoInstitucionais) {
  return {
    async obter() {
      return respostaSucesso(await casos.obter(), { message: 'Dados de contato do Santuário.' });
    },
  };
}
