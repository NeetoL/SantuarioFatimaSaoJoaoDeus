import { z } from 'zod';
import { esquemaImagem, textoOpcional } from '@/shared/Domain/imagem';
import { type Album, type FotoDoAlbum, type RepositorioDeAlbuns } from './album';

export const esquemaDadosDoAlbum = z.object({
  titulo: z.string().trim().min(3, { error: 'Informe o nome do álbum.' }).max(120),
  data: z.union([z.iso.date({ error: 'Data inválida.' }), z.literal('')]).transform((v) => (v ? v : undefined)),
  descricao: textoOpcional(300),
});

export const esquemaLegenda = z.string().trim().max(200, { error: 'Legenda longa demais.' });

export const esquemaNovaFoto = z.object({ arquivo: esquemaImagem, legenda: esquemaLegenda });

/** Foto como o painel vê (com identificador, para editar, mover e excluir). */
export type FotoNoPainel = FotoDoAlbum & { id: string };
export type AlbumNoPainel = Omit<Album, 'fotos'> & { fotos: FotoNoPainel[] };

export interface GestaoDeAlbuns extends RepositorioDeAlbuns {
  buscar(id: string): Promise<AlbumNoPainel | null>;
  existe(id: string): Promise<boolean>;
  criar(album: { id: string; titulo: string; data?: string; descricao?: string }): Promise<void>;
  atualizar(id: string, dados: { titulo: string; data?: string; descricao?: string }): Promise<void>;
  definirCapa(id: string, posicao: number): Promise<void>;
  excluir(id: string): Promise<void>;
  adicionarFoto(albumId: string, foto: FotoDoAlbum): Promise<void>;
  editarLegenda(fotoId: string, legenda: string): Promise<void>;
  /** Troca a foto de lugar com a vizinha (-1 = para a esquerda, 1 = para a direita). */
  moverFoto(fotoId: string, direcao: -1 | 1): Promise<void>;
  excluirFoto(fotoId: string): Promise<void>;
}
