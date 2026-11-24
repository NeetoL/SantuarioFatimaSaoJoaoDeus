import { DADOS_INSTITUCIONAIS } from '@/mocks/institucional';
import { type Banco } from '@/shared/Infrastructure/banco/conexao';
import { gravarConfiguracao, lerConfiguracao } from '@/shared/Infrastructure/banco/configuracao';
import { type DadosInstitucionais, esquemaDadosInstitucionais, type GestaoInstitucional } from '../Domain/institucional';

/** Informações do site no banco (configuração "institucional"); sem registro válido, o conteúdo original. */
export class RepositorioInstitucionalBanco implements GestaoInstitucional {
  constructor(private readonly banco: () => Promise<Banco>) {}

  async obter(): Promise<DadosInstitucionais> {
    return (
      (await lerConfiguracao(await this.banco(), 'institucional', esquemaDadosInstitucionais)) ??
      structuredClone(DADOS_INSTITUCIONAIS)
    );
  }

  async salvar(dados: DadosInstitucionais) {
    await gravarConfiguracao(await this.banco(), 'institucional', dados);
  }
}
