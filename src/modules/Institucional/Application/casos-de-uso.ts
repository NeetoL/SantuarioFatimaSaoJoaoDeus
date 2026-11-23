import { enderecoCompleto, type RepositorioInstitucional } from '../Domain/institucional';

export function criarCasosDeUsoInstitucionais(repositorio: RepositorioInstitucional) {
  return {
    obter: () => repositorio.obter(),
    async enderecoCompleto() {
      return enderecoCompleto(await repositorio.obter());
    },
  };
}

export type CasosDeUsoInstitucionais = ReturnType<typeof criarCasosDeUsoInstitucionais>;
