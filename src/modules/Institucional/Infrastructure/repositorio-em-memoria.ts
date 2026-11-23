import { DADOS_INSTITUCIONAIS } from '@/mocks/institucional';
import { type DadosInstitucionais, type RepositorioInstitucional } from '../Domain/institucional';

export class RepositorioInstitucionalEmMemoria implements RepositorioInstitucional {
  constructor(private readonly fonte: DadosInstitucionais = DADOS_INSTITUCIONAIS) {}

  async obter(): Promise<DadosInstitucionais> {
    return structuredClone(this.fonte);
  }
}
