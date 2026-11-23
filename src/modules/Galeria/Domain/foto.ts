export type FotoDaGaleria = {
  id: string;
  /** Foto grande (abre ao ampliar). */
  foto: string;
  legenda: string;
  /** Ocupa o dobro do espaço na grade. */
  grande?: boolean;
};

/** Miniatura usada na grade: "foto.jpg" → "foto-p.jpg" (as fotos grandes da grade usam a original). */
export const miniaturaDe = (f: Pick<FotoDaGaleria, 'foto' | 'grande'>) =>
  f.grande ? f.foto : f.foto.replace(/\.jpg$/, '-p.jpg');

export interface RepositorioDeFotos {
  listar(): Promise<FotoDaGaleria[]>;
}
