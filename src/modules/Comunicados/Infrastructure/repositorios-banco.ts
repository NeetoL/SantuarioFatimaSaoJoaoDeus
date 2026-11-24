import { asc, count, desc, eq, min } from 'drizzle-orm';
import { type Banco } from '@/shared/Infrastructure/banco/conexao';
import { noticias, recados } from '@/shared/Infrastructure/banco/esquema';
import { type Noticia, type Recado } from '../Domain/comunicado';
import { type GestaoDeNoticias, type GestaoDeRecados } from '../Domain/gestao';

const paraNoticia = (l: typeof noticias.$inferSelect): Noticia => ({
  id: l.id,
  data: l.data,
  categoria: l.categoria,
  titulo: l.titulo,
  resumo: l.resumo,
  ...(l.imagem ? { imagem: l.imagem } : {}),
  ...(l.link ? { link: l.link } : {}),
});

const paraRecado = (l: typeof recados.$inferSelect): Recado => ({
  id: l.id,
  titulo: l.titulo,
  texto: l.texto,
  ...(l.importante ? { importante: true } : {}),
});

export class RepositorioDeNoticiasBanco implements GestaoDeNoticias {
  constructor(private readonly banco: () => Promise<Banco>) {}

  async listar() {
    return (await (await this.banco()).select().from(noticias).orderBy(desc(noticias.data))).map(paraNoticia);
  }

  async buscarPorId(id: string) {
    const [l] = await (await this.banco()).select().from(noticias).where(eq(noticias.id, id)).limit(1);
    return l ? paraNoticia(l) : null;
  }

  async existe(id: string) {
    const [l] = await (await this.banco()).select({ n: count() }).from(noticias).where(eq(noticias.id, id));
    return (l?.n ?? 0) > 0;
  }

  async inserir(n: Noticia) {
    await (await this.banco()).insert(noticias).values({ ...n, imagem: n.imagem ?? null, link: n.link ?? null });
  }

  async atualizar(id: string, n: Omit<Noticia, 'id'>) {
    await (await this.banco())
      .update(noticias)
      .set({ ...n, imagem: n.imagem ?? null, link: n.link ?? null, atualizadoEm: new Date() })
      .where(eq(noticias.id, id));
  }

  async excluir(id: string) {
    await (await this.banco()).delete(noticias).where(eq(noticias.id, id));
  }
}

export class RepositorioDeRecadosBanco implements GestaoDeRecados {
  constructor(private readonly banco: () => Promise<Banco>) {}

  async listar() {
    return (await (await this.banco()).select().from(recados).orderBy(asc(recados.ordem), asc(recados.criadoEm))).map(
      paraRecado,
    );
  }

  async buscarPorId(id: string) {
    const [l] = await (await this.banco()).select().from(recados).where(eq(recados.id, id)).limit(1);
    return l ? paraRecado(l) : null;
  }

  async existe(id: string) {
    const [l] = await (await this.banco()).select({ n: count() }).from(recados).where(eq(recados.id, id));
    return (l?.n ?? 0) > 0;
  }

  /** O recado novo entra no topo da lista. */
  async inserir(r: Recado) {
    const banco = await this.banco();
    const [atual] = await banco.select({ menor: min(recados.ordem) }).from(recados);
    await banco.insert(recados).values({ ...r, importante: Boolean(r.importante), ordem: (atual?.menor ?? 1) - 1 });
  }

  async atualizar(id: string, r: Omit<Recado, 'id'>) {
    await (await this.banco())
      .update(recados)
      .set({ ...r, importante: Boolean(r.importante), atualizadoEm: new Date() })
      .where(eq(recados.id, id));
  }

  async excluir(id: string) {
    await (await this.banco()).delete(recados).where(eq(recados.id, id));
  }
}
