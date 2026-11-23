import { type QuadroDeHorarios } from './horarios';

export interface RepositorioDeHorarios {
  obterQuadro(): Promise<QuadroDeHorarios>;
}
