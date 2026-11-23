import { resumoDoHorario } from '../Domain/horarios';
import { type RepositorioDeHorarios } from '../Domain/repositorio';

export function criarCasosDeUsoDeHorarios(repositorio: RepositorioDeHorarios) {
  return {
    /** Quadro completo: missas, mensais, confissões, terços, adoração, igreja e secretaria. */
    obterQuadro: () => repositorio.obterQuadro(),

    /** Horário da secretaria em poucas linhas (rodapé e página Contato). */
    async resumoDaSecretaria(): Promise<string[]> {
      const quadro = await repositorio.obterQuadro();
      return resumoDoHorario(quadro.secretaria, quadro.secretariaFechaNosFeriados);
    },
  };
}

export type CasosDeUsoDeHorarios = ReturnType<typeof criarCasosDeUsoDeHorarios>;
