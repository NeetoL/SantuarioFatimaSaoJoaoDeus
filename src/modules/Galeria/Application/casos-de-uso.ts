import { type Paginacao, paginar } from '@/shared/Application/paginacao';
import { ErroNaoEncontrado } from '@/shared/Domain/erros';
import { type AlbumParaExibir, capaDoAlbum, ordenarAlbuns, type RepositorioDeAlbuns } from '../Domain/album';

export function criarCasosDeUsoDaGaleria(repositorio: RepositorioDeAlbuns) {
  /** Álbuns com pelo menos uma foto, do mais recente ao mais antigo, já com a capa. */
  async function albuns(): Promise<AlbumParaExibir[]> {
    return ordenarAlbuns(await repositorio.listar()).flatMap((a) => {
      const fotoDeCapa = capaDoAlbum(a);
      return fotoDeCapa ? [{ ...a, fotoDeCapa, total: a.fotos.length }] : [];
    });
  }

  return {
    /** Página inicial e página Notícias: os álbuns (todos, ou os N mais recentes). */
    async listarAlbuns(limite?: number) {
      const lista = await albuns();
      return limite ? lista.slice(0, limite) : lista;
    },

    /** API: álbuns com paginação. */
    async listarAlbunsPaginados(paginacao: Paginacao) {
      return paginar(await albuns(), paginacao);
    },

    async buscarAlbum(id: string): Promise<AlbumParaExibir> {
      const album = (await albuns()).find((a) => a.id === id);
      if (!album) throw new ErroNaoEncontrado('Álbum');
      return album;
    },
  };
}

export type CasosDeUsoDaGaleria = ReturnType<typeof criarCasosDeUsoDaGaleria>;
