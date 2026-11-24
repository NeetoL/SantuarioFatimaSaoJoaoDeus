import { and, count, eq, gt, lt, ne } from 'drizzle-orm';
import { type Banco } from '@/shared/Infrastructure/banco/conexao';
import { sessoes, usuarios } from '@/shared/Infrastructure/banco/esquema';
import {
  ehPapel,
  type Papel,
  type RepositorioDeSessoes,
  type RepositorioDeUsuarios,
  type UsuarioDoPainel,
} from '../Domain/acesso';

type Linha = typeof usuarios.$inferSelect;

function paraUsuario(l: Linha): UsuarioDoPainel {
  return {
    id: l.id,
    nome: l.nome,
    email: l.email,
    papel: ehPapel(l.papel) ? l.papel : 'pascom', // valor inválido nunca ganha mais acesso
    ativo: l.ativo,
    trocarSenha: l.trocarSenha,
    ultimoAcesso: l.ultimoAcesso,
    criadoEm: l.criadoEm,
  };
}

export class RepositorioDeUsuariosBanco implements RepositorioDeUsuarios {
  constructor(private readonly banco: () => Promise<Banco>) {}

  async listar() {
    const linhas = await (await this.banco()).select().from(usuarios).orderBy(usuarios.nome);
    return linhas.map(paraUsuario);
  }

  async buscarPorId(id: string) {
    const [l] = await (await this.banco()).select().from(usuarios).where(eq(usuarios.id, id)).limit(1);
    return l ? paraUsuario(l) : null;
  }

  async buscarParaEntrar(email: string) {
    const [l] = await (await this.banco()).select().from(usuarios).where(eq(usuarios.email, email)).limit(1);
    return l ? { ...paraUsuario(l), senhaHash: l.senhaHash, falhasLogin: l.falhasLogin, bloqueadoAte: l.bloqueadoAte } : null;
  }

  async buscarResumoDaSenha(id: string) {
    const [l] = await (await this.banco())
      .select({ senhaHash: usuarios.senhaHash })
      .from(usuarios)
      .where(eq(usuarios.id, id))
      .limit(1);
    return l?.senhaHash ?? null;
  }

  async criar(dados: { nome: string; email: string; papel: Papel; senhaHash: string; trocarSenha: boolean }) {
    const [l] = await (await this.banco()).insert(usuarios).values(dados).returning({ id: usuarios.id });
    if (!l) throw new Error('Usuário não criado.');
    return l.id;
  }

  async atualizar(id: string, dados: { nome: string; email: string; papel: Papel; ativo: boolean }) {
    await (await this.banco())
      .update(usuarios)
      .set({ ...dados, atualizadoEm: new Date() })
      .where(eq(usuarios.id, id));
  }

  async definirSenha(id: string, senhaHash: string, trocarSenha: boolean) {
    await (await this.banco())
      .update(usuarios)
      .set({ senhaHash, trocarSenha, falhasLogin: 0, bloqueadoAte: null, atualizadoEm: new Date() })
      .where(eq(usuarios.id, id));
  }

  async registrarFalha(id: string, falhas: number, bloqueadoAte: Date | null) {
    await (await this.banco()).update(usuarios).set({ falhasLogin: falhas, bloqueadoAte }).where(eq(usuarios.id, id));
  }

  async registrarAcesso(id: string) {
    await (await this.banco())
      .update(usuarios)
      .set({ ultimoAcesso: new Date(), falhasLogin: 0, bloqueadoAte: null })
      .where(eq(usuarios.id, id));
  }

  async emailEmUso(email: string, excetoId?: string) {
    const onde = excetoId ? and(eq(usuarios.email, email), ne(usuarios.id, excetoId)) : eq(usuarios.email, email);
    const [l] = await (await this.banco()).select({ n: count() }).from(usuarios).where(onde);
    return (l?.n ?? 0) > 0;
  }

  async quantosAdminsAtivos() {
    const [l] = await (await this.banco())
      .select({ n: count() })
      .from(usuarios)
      .where(and(eq(usuarios.papel, 'admin'), eq(usuarios.ativo, true)));
    return l?.n ?? 0;
  }
}

export class RepositorioDeSessoesBanco implements RepositorioDeSessoes {
  constructor(private readonly banco: () => Promise<Banco>) {}

  async criar(resumoDoCodigo: string, usuarioId: string, expiraEm: Date) {
    await (await this.banco()).insert(sessoes).values({ id: resumoDoCodigo, usuarioId, expiraEm });
  }

  async buscarUsuario(resumoDoCodigo: string) {
    const [l] = await (await this.banco())
      .select({ usuario: usuarios })
      .from(sessoes)
      .innerJoin(usuarios, eq(sessoes.usuarioId, usuarios.id))
      .where(and(eq(sessoes.id, resumoDoCodigo), gt(sessoes.expiraEm, new Date()), eq(usuarios.ativo, true)))
      .limit(1);
    return l ? paraUsuario(l.usuario) : null;
  }

  async excluir(resumoDoCodigo: string) {
    await (await this.banco()).delete(sessoes).where(eq(sessoes.id, resumoDoCodigo));
  }

  async excluirDoUsuario(usuarioId: string) {
    await (await this.banco()).delete(sessoes).where(eq(sessoes.usuarioId, usuarioId));
  }

  async excluirExpiradas() {
    await (await this.banco()).delete(sessoes).where(lt(sessoes.expiraEm, new Date()));
  }
}
