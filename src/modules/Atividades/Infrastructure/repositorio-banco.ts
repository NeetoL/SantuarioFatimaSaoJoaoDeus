import { and, count, desc, eq, gte, lt, type SQL } from 'drizzle-orm';
import { type Banco } from '@/shared/Infrastructure/banco/conexao';
import { registroAtividades } from '@/shared/Infrastructure/banco/esquema';
import { type Atividade, type FiltroDeAtividades, type RepositorioDeAtividades } from '../Domain/atividade';

export class RepositorioDeAtividadesBanco implements RepositorioDeAtividades {
  constructor(private readonly banco: () => Promise<Banco>) {}

  async registrar(a: Omit<Atividade, 'id' | 'criadoEm'>) {
    await (await this.banco()).insert(registroAtividades).values({
      usuarioId: a.usuarioId,
      usuarioNome: a.usuarioNome?.slice(0, 120) ?? null,
      acao: a.acao,
      area: a.area,
      alvo: a.alvo?.slice(0, 200) ?? null,
      detalhe: a.detalhe?.slice(0, 2000) ?? null,
      ip: a.ip?.slice(0, 64) ?? null,
    });
  }

  async listar(filtro: FiltroDeAtividades, { pagina, porPagina }: { pagina: number; porPagina: number }) {
    const banco = await this.banco();
    const condicoes: SQL[] = [];
    if (filtro.area) condicoes.push(eq(registroAtividades.area, filtro.area));
    if (filtro.usuarioId) condicoes.push(eq(registroAtividades.usuarioId, filtro.usuarioId));
    if (filtro.desde) condicoes.push(gte(registroAtividades.criadoEm, new Date(`${filtro.desde}T00:00:00-03:00`)));
    if (filtro.ate) {
      const fim = new Date(`${filtro.ate}T00:00:00-03:00`);
      fim.setDate(fim.getDate() + 1);
      condicoes.push(lt(registroAtividades.criadoEm, fim));
    }
    const onde = condicoes.length ? and(...condicoes) : undefined;
    const [linhas, [total]] = await Promise.all([
      banco
        .select()
        .from(registroAtividades)
        .where(onde)
        .orderBy(desc(registroAtividades.criadoEm))
        .limit(porPagina)
        .offset((pagina - 1) * porPagina),
      banco.select({ n: count() }).from(registroAtividades).where(onde),
    ]);
    return { itens: linhas as Atividade[], total: total?.n ?? 0 };
  }
}
