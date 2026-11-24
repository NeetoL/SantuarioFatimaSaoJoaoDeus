import { type FiltroDeAtividades, type NovaAtividade, type RepositorioDeAtividades } from '../Domain/atividade';

export function criarCasosDeUsoDeAtividades(repositorio: RepositorioDeAtividades) {
  return {
    registrar: (atividade: NovaAtividade) => repositorio.registrar(atividade),
    listar: (filtro: FiltroDeAtividades, pagina: number, porPagina = 50) =>
      repositorio.listar(filtro, { pagina: Math.max(1, pagina), porPagina }),
  };
}

export type CasosDeUsoDeAtividades = ReturnType<typeof criarCasosDeUsoDeAtividades>;
