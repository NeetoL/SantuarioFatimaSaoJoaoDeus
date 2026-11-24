import { type QuadroDeHorarios } from './horarios';

export interface RepositorioDeHorarios {
  obterQuadro(): Promise<QuadroDeHorarios>;
}

export interface GestaoDeHorarios extends RepositorioDeHorarios {
  salvar(quadro: QuadroDeHorarios): Promise<void>;
}
