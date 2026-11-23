import { respostaSucesso } from '@/shared/Presentation/resposta-api';
import { type CasosDeUsoDeHorarios } from '../Application/casos-de-uso';

export function criarControladorDeHorarios(casos: CasosDeUsoDeHorarios) {
  return {
    async obter() {
      const [quadro, secretaria] = await Promise.all([casos.obterQuadro(), casos.resumoDaSecretaria()]);
      return respostaSucesso({ ...quadro, resumoDaSecretaria: secretaria }, { message: 'Horários do Santuário.' });
    },
  };
}
