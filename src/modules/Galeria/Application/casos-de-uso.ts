import { miniaturaDe, type RepositorioDeFotos } from '../Domain/foto';

export function criarCasosDeUsoDaGaleria(repositorio: RepositorioDeFotos) {
  return {
    /** Fotos da galeria com a miniatura já definida. */
    async listar() {
      return (await repositorio.listar()).map((f) => ({ ...f, miniatura: miniaturaDe(f) }));
    },
  };
}

export type CasosDeUsoDaGaleria = ReturnType<typeof criarCasosDeUsoDaGaleria>;
