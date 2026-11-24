import { asc, count, desc, eq } from 'drizzle-orm';
import { type Banco } from '@/shared/Infrastructure/banco/conexao';
import { eventos } from '@/shared/Infrastructure/banco/esquema';
import { type CategoriaDeEvento, CATEGORIAS_DE_EVENTO, type Evento } from '../Domain/evento';
import { type GestaoDeEventos } from '../Domain/gestao';

type Linha = typeof eventos.$inferSelect;

const paraEvento = (l: Linha): Evento => ({
  id: l.id,
  categoria: (CATEGORIAS_DE_EVENTO as readonly string[]).includes(l.categoria)
    ? (l.categoria as CategoriaDeEvento)
    : 'Aviso',
  titulo: l.titulo,
  data: l.data,
  hora: l.hora,
  local: l.local,
  descricao: l.descricao,
  ...(l.destaque ? { destaque: true } : {}),
  ...(l.imagem ? { imagem: l.imagem } : {}),
});

export class RepositorioDeEventosBanco implements GestaoDeEventos {
  constructor(private readonly banco: () => Promise<Banco>) {}

  async listarTodos() {
    const linhas = await (await this.banco()).select().from(eventos).orderBy(asc(eventos.data), asc(eventos.hora));
    return linhas.map(paraEvento);
  }

  async listarParaPainel() {
    const linhas = await (await this.banco()).select().from(eventos).orderBy(desc(eventos.data), desc(eventos.hora));
    return linhas.map(paraEvento);
  }

  async buscarPorId(id: string) {
    const [l] = await (await this.banco()).select().from(eventos).where(eq(eventos.id, id)).limit(1);
    return l ? paraEvento(l) : null;
  }

  async existe(id: string) {
    const [l] = await (await this.banco()).select({ n: count() }).from(eventos).where(eq(eventos.id, id));
    return (l?.n ?? 0) > 0;
  }

  async inserir(e: Evento) {
    await (await this.banco())
      .insert(eventos)
      .values({ ...e, destaque: Boolean(e.destaque), imagem: e.imagem ?? null });
  }

  async atualizar(id: string, e: Omit<Evento, 'id'>) {
    await (await this.banco())
      .update(eventos)
      .set({ ...e, destaque: Boolean(e.destaque), imagem: e.imagem ?? null, atualizadoEm: new Date() })
      .where(eq(eventos.id, id));
  }

  async excluir(id: string) {
    await (await this.banco()).delete(eventos).where(eq(eventos.id, id));
  }
}
