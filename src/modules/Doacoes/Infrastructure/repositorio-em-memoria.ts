import { DADOS_DE_DOACAO } from '@/mocks/doacoes';
import { type DadosDeDoacao, type RepositorioDeDoacoes } from '../Domain/doacao';

export class RepositorioDeDoacoesEmMemoria implements RepositorioDeDoacoes {
  constructor(private readonly fonte: DadosDeDoacao = DADOS_DE_DOACAO) {}

  async obter(): Promise<DadosDeDoacao> {
    return structuredClone(this.fonte);
  }
}
