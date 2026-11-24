import { DADOS_DE_DOACAO } from '@/mocks/doacoes';
import { type Banco } from '@/shared/Infrastructure/banco/conexao';
import { gravarConfiguracao, lerConfiguracao } from '@/shared/Infrastructure/banco/configuracao';
import { type DadosDeDoacao, esquemaDadosDeDoacao, type GestaoDeDoacoes } from '../Domain/doacao';

export class RepositorioDeDoacoesBanco implements GestaoDeDoacoes {
  constructor(private readonly banco: () => Promise<Banco>) {}

  async obter(): Promise<DadosDeDoacao> {
    return (
      (await lerConfiguracao(await this.banco(), 'doacoes', esquemaDadosDeDoacao)) ?? structuredClone(DADOS_DE_DOACAO)
    );
  }

  async salvar(dados: DadosDeDoacao) {
    await gravarConfiguracao(await this.banco(), 'doacoes', dados);
  }
}
