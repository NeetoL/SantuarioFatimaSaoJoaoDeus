import { and, asc, count, eq, max } from 'drizzle-orm';
import { type Banco } from '@/shared/Infrastructure/banco/conexao';
import { albuns, fotosAlbum } from '@/shared/Infrastructure/banco/esquema';
import { type Album, type FotoDoAlbum } from '../Domain/album';
import { type AlbumNoPainel, type GestaoDeAlbuns } from '../Domain/gestao';

export class RepositorioDeAlbunsBanco implements GestaoDeAlbuns {
  constructor(private readonly banco: () => Promise<Banco>) {}

  private async montar(linhas: (typeof albuns.$inferSelect)[]): Promise<AlbumNoPainel[]> {
    if (!linhas.length) return [];
    const fotos = await (await this.banco()).select().from(fotosAlbum).orderBy(asc(fotosAlbum.ordem), asc(fotosAlbum.criadoEm));
    return linhas.map((a) => ({
      id: a.id,
      titulo: a.titulo,
      ...(a.data ? { data: a.data } : {}),
      ...(a.descricao ? { descricao: a.descricao } : {}),
      capa: a.capa,
      fotos: fotos.filter((f) => f.albumId === a.id).map((f) => ({ id: f.id, foto: f.arquivo, legenda: f.legenda })),
    }));
  }

  async listar(): Promise<Album[]> {
    return this.montar(await (await this.banco()).select().from(albuns).orderBy(asc(albuns.criadoEm)));
  }

  async buscar(id: string) {
    const linhas = await (await this.banco()).select().from(albuns).where(eq(albuns.id, id)).limit(1);
    return (await this.montar(linhas))[0] ?? null;
  }

  async existe(id: string) {
    const [l] = await (await this.banco()).select({ n: count() }).from(albuns).where(eq(albuns.id, id));
    return (l?.n ?? 0) > 0;
  }

  async criar(a: { id: string; titulo: string; data?: string; descricao?: string }) {
    await (await this.banco())
      .insert(albuns)
      .values({ id: a.id, titulo: a.titulo, data: a.data ?? null, descricao: a.descricao ?? null });
  }

  async atualizar(id: string, d: { titulo: string; data?: string; descricao?: string }) {
    await (await this.banco())
      .update(albuns)
      .set({ titulo: d.titulo, data: d.data ?? null, descricao: d.descricao ?? null, atualizadoEm: new Date() })
      .where(eq(albuns.id, id));
  }

  async definirCapa(id: string, posicao: number) {
    await (await this.banco()).update(albuns).set({ capa: posicao, atualizadoEm: new Date() }).where(eq(albuns.id, id));
  }

  async excluir(id: string) {
    await (await this.banco()).delete(albuns).where(eq(albuns.id, id)); // as fotos saem junto (cascade)
  }

  async adicionarFoto(albumId: string, foto: FotoDoAlbum) {
    const banco = await this.banco();
    const [ultima] = await banco.select({ maior: max(fotosAlbum.ordem) }).from(fotosAlbum).where(eq(fotosAlbum.albumId, albumId));
    await banco
      .insert(fotosAlbum)
      .values({ albumId, arquivo: foto.foto, legenda: foto.legenda, ordem: (ultima?.maior ?? -1) + 1 });
  }

  async editarLegenda(fotoId: string, legenda: string) {
    await (await this.banco()).update(fotosAlbum).set({ legenda }).where(eq(fotosAlbum.id, fotoId));
  }

  async moverFoto(fotoId: string, direcao: -1 | 1) {
    const banco = await this.banco();
    const [foto] = await banco.select().from(fotosAlbum).where(eq(fotosAlbum.id, fotoId)).limit(1);
    if (!foto) return;
    const irmas = await banco
      .select()
      .from(fotosAlbum)
      .where(eq(fotosAlbum.albumId, foto.albumId))
      .orderBy(asc(fotosAlbum.ordem), asc(fotosAlbum.criadoEm));
    const posicao = irmas.findIndex((f) => f.id === fotoId);
    const vizinha = irmas[posicao + direcao];
    if (!vizinha) return;
    // reordena tudo de 0 em diante, trocando as duas de lugar
    const nova = [...irmas];
    [nova[posicao], nova[posicao + direcao]] = [vizinha, foto];
    await banco.transaction(async (tx) => {
      for (const [ordem, f] of nova.entries()) {
        if (f) await tx.update(fotosAlbum).set({ ordem }).where(and(eq(fotosAlbum.id, f.id)));
      }
    });
  }

  async excluirFoto(fotoId: string) {
    await (await this.banco()).delete(fotosAlbum).where(eq(fotosAlbum.id, fotoId));
  }
}
