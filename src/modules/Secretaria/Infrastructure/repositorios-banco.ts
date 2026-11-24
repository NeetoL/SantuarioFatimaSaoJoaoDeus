import { and, asc, count, desc, eq, gte, ilike, lt, or, sql } from 'drizzle-orm';
import { type Banco, consultar } from '@/shared/Infrastructure/banco/conexao';
import { contribuicoes, dizimistas } from '@/shared/Infrastructure/banco/esquema';
import {
  type Contribuicao,
  type DadosDaContribuicao,
  type DadosDoDizimista,
  type Dizimista,
  type FiltroDeContribuicoes,
  type FormaDePagamento,
  type RepositorioDeContribuicoes,
  type RepositorioDeDizimistas,
  type TipoDeContribuicao,
} from '../Domain/secretaria';

const opcional = <T>(valor: T | null) => (valor === null ? undefined : valor);

const paraDizimista = (l: typeof dizimistas.$inferSelect): Dizimista => ({
  id: l.id,
  nome: l.nome,
  telefone: opcional(l.telefone),
  email: opcional(l.email),
  endereco: opcional(l.endereco),
  observacoes: opcional(l.observacoes),
  ativo: l.ativo,
  criadoEm: l.criadoEm,
});

const colunas = (d: DadosDoDizimista) => ({
  nome: d.nome,
  telefone: d.telefone ?? null,
  email: d.email ?? null,
  endereco: d.endereco ?? null,
  observacoes: d.observacoes ?? null,
  ativo: d.ativo,
});

/** "%" e "_" digitados na busca valem como texto, não como curinga. */
const escapar = (texto: string) => texto.replace(/[\\%_]/g, (c) => `\\${c}`);

export class RepositorioDeDizimistasBanco implements RepositorioDeDizimistas {
  constructor(private readonly banco: () => Promise<Banco>) {}

  async listar({ busca, situacao = 'ativos' }: { busca?: string; situacao?: 'ativos' | 'inativos' | 'todos' }) {
    const condicoes = [];
    if (situacao !== 'todos') condicoes.push(eq(dizimistas.ativo, situacao === 'ativos'));
    if (busca?.trim()) {
      const termo = `%${escapar(busca.trim())}%`;
      condicoes.push(or(ilike(dizimistas.nome, termo), ilike(dizimistas.telefone, termo), ilike(dizimistas.email, termo)));
    }
    const linhas = await (await this.banco())
      .select()
      .from(dizimistas)
      .where(condicoes.length ? and(...condicoes) : undefined)
      .orderBy(asc(dizimistas.nome))
      .limit(500);
    return linhas.map(paraDizimista);
  }

  async buscar(id: string) {
    const [l] = await (await this.banco()).select().from(dizimistas).where(eq(dizimistas.id, id)).limit(1);
    return l ? paraDizimista(l) : null;
  }

  async criar(d: DadosDoDizimista) {
    const [l] = await (await this.banco()).insert(dizimistas).values(colunas(d)).returning({ id: dizimistas.id });
    if (!l) throw new Error('Dizimista não criado.');
    return l.id;
  }

  async atualizar(id: string, d: DadosDoDizimista) {
    await (await this.banco())
      .update(dizimistas)
      .set({ ...colunas(d), atualizadoEm: new Date() })
      .where(eq(dizimistas.id, id));
  }

  async excluir(id: string) {
    await (await this.banco()).delete(dizimistas).where(eq(dizimistas.id, id));
  }

  async contarAtivos() {
    const [l] = await (await this.banco()).select({ n: count() }).from(dizimistas).where(eq(dizimistas.ativo, true));
    return l?.n ?? 0;
  }
}

const proximoMes = (mes: string) => {
  const [ano = 0, m = 1] = mes.split('-').map(Number);
  return m === 12 ? `${ano + 1}-01-01` : `${ano}-${String(m + 1).padStart(2, '0')}-01`;
};

export class RepositorioDeContribuicoesBanco implements RepositorioDeContribuicoes {
  constructor(private readonly banco: () => Promise<Banco>) {}

  private async selecionar(onde: ReturnType<typeof and>, limite = 1000) {
    const linhas = await (await this.banco())
      .select({ c: contribuicoes, nome: dizimistas.nome })
      .from(contribuicoes)
      .leftJoin(dizimistas, eq(contribuicoes.dizimistaId, dizimistas.id))
      .where(onde)
      .orderBy(desc(contribuicoes.data), desc(contribuicoes.criadoEm))
      .limit(limite);
    return linhas.map(
      ({ c, nome }): Contribuicao => ({
        id: c.id,
        tipo: c.tipo as TipoDeContribuicao,
        valorCentavos: c.valorCentavos,
        data: c.data,
        forma: c.forma as FormaDePagamento,
        dizimistaId: opcional(c.dizimistaId),
        dizimistaNome: opcional(nome),
        doadorNome: opcional(c.doadorNome),
        observacao: opcional(c.observacao),
        criadoEm: c.criadoEm,
      }),
    );
  }

  listar(filtro: FiltroDeContribuicoes) {
    const condicoes = [gte(contribuicoes.data, `${filtro.mes}-01`), lt(contribuicoes.data, proximoMes(filtro.mes))];
    if (filtro.tipo) condicoes.push(eq(contribuicoes.tipo, filtro.tipo));
    if (filtro.dizimistaId) condicoes.push(eq(contribuicoes.dizimistaId, filtro.dizimistaId));
    return this.selecionar(and(...condicoes));
  }

  async buscar(id: string) {
    return (await this.selecionar(and(eq(contribuicoes.id, id)), 1))[0] ?? null;
  }

  async criar(d: Omit<DadosDaContribuicao, 'valor'> & { valorCentavos: number; registradoPor: string }) {
    const [l] = await (await this.banco())
      .insert(contribuicoes)
      .values({
        tipo: d.tipo,
        valorCentavos: d.valorCentavos,
        data: d.data,
        forma: d.forma,
        dizimistaId: d.dizimistaId ?? null,
        doadorNome: d.doadorNome ?? null,
        observacao: d.observacao ?? null,
        registradoPor: d.registradoPor,
      })
      .returning({ id: contribuicoes.id });
    if (!l) throw new Error('Contribuição não registrada.');
    return l.id;
  }

  async excluir(id: string) {
    await (await this.banco()).delete(contribuicoes).where(eq(contribuicoes.id, id));
  }

  async totaisPorMes(ano: number) {
    const linhas = await consultar<{ mes: string; total: string | number; quantidade: string | number }>(
      await this.banco(),
      sql`select to_char(data, 'YYYY-MM') as mes, sum(valor_centavos) as total, count(*) as quantidade
          from contribuicoes where data >= ${`${ano}-01-01`} and data < ${`${ano + 1}-01-01`}
          group by 1 order by 1`,
    );
    return linhas.map((l) => ({ mes: l.mes, totalCentavos: Number(l.total), quantidade: Number(l.quantidade) }));
  }

  ultimasDoDizimista(dizimistaId: string, limite: number) {
    return this.selecionar(and(eq(contribuicoes.dizimistaId, dizimistaId)), limite);
  }
}
