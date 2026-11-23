import { QUADRO_DE_HORARIOS } from '@/mocks/horarios';
import { type QuadroDeHorarios } from '../Domain/horarios';
import { type RepositorioDeHorarios } from '../Domain/repositorio';

export class RepositorioDeHorariosEmMemoria implements RepositorioDeHorarios {
  constructor(private readonly fonte: QuadroDeHorarios = QUADRO_DE_HORARIOS) {}

  async obterQuadro(): Promise<QuadroDeHorarios> {
    return structuredClone(this.fonte);
  }
}
