/** Foto de um álbum. */
export type FotoDoAlbum = { foto: string; legenda: string };

/** Álbum de fotos: um por evento ou celebração (ex.: as fotos da Quermesse). */
export type Album = {
  id: string;
  titulo: string;
  /** 'AAAA-MM-DD' — data do evento, quando se sabe. */
  data?: string;
  /** Uma frase sobre o álbum (opcional). */
  descricao?: string;
  /** Posição da foto de capa na lista (padrão: a primeira). */
  capa?: number;
  fotos: FotoDoAlbum[];
};

/** Álbum pronto para exibir: com a foto de capa e o total de fotos. */
export type AlbumParaExibir = Album & { fotoDeCapa: FotoDoAlbum; total: number };

/** Os mais recentes primeiro; os álbuns sem data vêm depois, na ordem em que foram cadastrados. */
export function ordenarAlbuns(albuns: readonly Album[]): Album[] {
  const comData = albuns.filter((a) => a.data).sort((a, b) => (b.data ?? '').localeCompare(a.data ?? ''));
  return [...comData, ...albuns.filter((a) => !a.data)];
}

/** Foto de capa (a indicada em `capa` ou, se não houver, a primeira). */
export const capaDoAlbum = (a: Pick<Album, 'fotos' | 'capa'>): FotoDoAlbum | undefined =>
  a.fotos[a.capa ?? 0] ?? a.fotos[0];

export interface RepositorioDeAlbuns {
  listar(): Promise<Album[]>;
}
