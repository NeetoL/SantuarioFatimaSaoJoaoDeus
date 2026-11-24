import { anotador, type Ator, descreverMudancas, type Registrar } from '@/modules/Atividades/Domain/atividade';
import { identificadorLivre, slug } from '@/lib/texto';
import { validar } from '@/shared/Application/validacao';
import { ErroDeValidacao, ErroNaoEncontrado } from '@/shared/Domain/erros';
import { ordenarAlbuns } from '../Domain/album';
import { type AlbumNoPainel, esquemaDadosDoAlbum, esquemaLegenda, esquemaNovaFoto, type GestaoDeAlbuns } from '../Domain/gestao';

/** Painel: álbuns de fotos (um por evento) e as suas fotos, com registro de cada mudança. */
export function criarGestaoDaGaleria({ repositorio, registrar }: { repositorio: GestaoDeAlbuns; registrar: Registrar }) {
  async function buscar(id: string): Promise<AlbumNoPainel> {
    const album = await repositorio.buscar(id);
    if (!album) throw new ErroNaoEncontrado('Álbum');
    return album;
  }
  async function fotoDoAlbum(albumId: string, fotoId: string) {
    const album = await buscar(albumId);
    const posicao = album.fotos.findIndex((f) => f.id === fotoId);
    const foto = album.fotos[posicao];
    if (!foto) throw new ErroNaoEncontrado('Foto');
    return { album, foto, posicao };
  }
  const log = (ator: Ator) => anotador(registrar, ator, 'galeria');

  return {
    listar: async () => ordenarAlbuns(await repositorio.listar()) as AlbumNoPainel[],
    buscar,

    async criarAlbum(ator: Ator, dados: unknown) {
      const novo = validar(esquemaDadosDoAlbum, dados);
      const id = await identificadorLivre(slug(novo.titulo), (c) => repositorio.existe(c));
      await repositorio.criar({ id, ...novo });
      await log(ator)('criou', `Álbum: ${novo.titulo}`, novo.data ? `Data: ${novo.data}` : null);
      return id;
    },

    async editarAlbum(ator: Ator, id: string, dados: unknown) {
      const antes = await buscar(id);
      const depois = validar(esquemaDadosDoAlbum, dados);
      await repositorio.atualizar(id, depois);
      await log(ator)(
        'editou',
        `Álbum: ${depois.titulo}`,
        descreverMudancas({ ...antes }, { ...depois }, { titulo: 'Nome', data: 'Data', descricao: 'Descrição' }),
      );
    },

    async excluirAlbum(ator: Ator, id: string) {
      const album = await buscar(id);
      await repositorio.excluir(id);
      await log(ator)('excluiu', `Álbum: ${album.titulo}`, `${album.fotos.length} foto(s) removida(s) junto.`);
    },

    async adicionarFoto(ator: Ator, albumId: string, dados: unknown) {
      const album = await buscar(albumId);
      const foto = validar(esquemaNovaFoto, dados);
      await repositorio.adicionarFoto(albumId, { foto: foto.arquivo, legenda: foto.legenda });
      await log(ator)('enviou-foto', `Álbum: ${album.titulo}`, foto.legenda ? `Legenda: ${foto.legenda}` : 'Sem legenda.');
    },

    async editarLegenda(ator: Ator, albumId: string, fotoId: string, legenda: unknown) {
      const { album, foto, posicao } = await fotoDoAlbum(albumId, fotoId);
      const nova = validar(esquemaLegenda, legenda);
      await repositorio.editarLegenda(fotoId, nova);
      await log(ator)('editou', `Álbum: ${album.titulo}`, `Legenda da foto ${posicao + 1}: ${foto.legenda || '(vazio)'} → ${nova || '(vazio)'}`);
    },

    async moverFoto(ator: Ator, albumId: string, fotoId: string, direcao: -1 | 1) {
      const { album, posicao } = await fotoDoAlbum(albumId, fotoId);
      const destino = posicao + direcao;
      if (destino < 0 || destino >= album.fotos.length) throw new ErroDeValidacao([], 'A foto já está na ponta do álbum.');
      await repositorio.moverFoto(fotoId, direcao);
      // a capa acompanha a foto que era capa
      const capa = album.capa ?? 0;
      if (capa === posicao) await repositorio.definirCapa(albumId, destino);
      else if (capa === destino) await repositorio.definirCapa(albumId, posicao);
      await log(ator)('editou', `Álbum: ${album.titulo}`, `Foto ${posicao + 1} movida para a posição ${destino + 1}.`);
    },

    async definirCapa(ator: Ator, albumId: string, fotoId: string) {
      const { album, posicao } = await fotoDoAlbum(albumId, fotoId);
      await repositorio.definirCapa(albumId, posicao);
      await log(ator)('editou', `Álbum: ${album.titulo}`, `Capa: foto ${posicao + 1}.`);
    },

    async excluirFoto(ator: Ator, albumId: string, fotoId: string) {
      const { album, foto, posicao } = await fotoDoAlbum(albumId, fotoId);
      await repositorio.excluirFoto(fotoId);
      const capa = album.capa ?? 0;
      if (capa === posicao) await repositorio.definirCapa(albumId, 0);
      else if (capa > posicao) await repositorio.definirCapa(albumId, capa - 1);
      await log(ator)('excluiu', `Foto do álbum ${album.titulo}`, foto.legenda ? `Legenda: ${foto.legenda}` : `Foto ${posicao + 1}.`);
      return foto.foto;
    },
  };
}
