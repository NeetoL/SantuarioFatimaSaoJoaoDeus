import { QUADRO_DE_HORARIOS } from '@/mocks/horarios';
import { type Banco } from '@/shared/Infrastructure/banco/conexao';
import { gravarConfiguracao, lerConfiguracao } from '@/shared/Infrastructure/banco/configuracao';
import { type QuadroDeHorarios } from '../Domain/horarios';
import { type GestaoDeHorarios } from '../Domain/repositorio';
import { esquemaQuadroDeHorarios } from '../Domain/validacao';

export class RepositorioDeHorariosBanco implements GestaoDeHorarios {
  constructor(private readonly banco: () => Promise<Banco>) {}

  async obterQuadro(): Promise<QuadroDeHorarios> {
    return (
      (await lerConfiguracao(await this.banco(), 'horarios', esquemaQuadroDeHorarios)) ??
      structuredClone(QUADRO_DE_HORARIOS)
    );
  }

  async salvar(quadro: QuadroDeHorarios) {
    await gravarConfiguracao(await this.banco(), 'horarios', quadro);
  }
}
