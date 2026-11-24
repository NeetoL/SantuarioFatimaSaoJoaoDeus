import 'server-only';
import { mkdirSync } from 'node:fs';
import path from 'node:path';
import { type SQL, sql } from 'drizzle-orm';
import { type PgDatabase, type PgQueryResultHKT } from 'drizzle-orm/pg-core';
import { modoDoBanco } from '@/config/ambiente';
import { logger } from '../logger';
import { esquema } from './esquema';
import { MIGRACOES } from './migracoes';

/** Banco do site (o mesmo tipo para o Postgres no ar e o banco local). */
export type Banco = PgDatabase<PgQueryResultHKT, typeof esquema>;

type Conexao = {
  banco: Banco;
  /** Executa SQL puro (várias instruções; sem parâmetros). */
  executar: (texto: string) => Promise<void>;
  /** Executa várias etapas com uma trava exclusiva (evita duas migrações ao mesmo tempo). */
  comTrava: <T>(tarefa: () => Promise<T>) => Promise<T>;
};

/** Linhas de uma consulta em SQL puro (o tipo do resultado varia com o driver; as linhas, não). */
export async function consultar<T>(banco: Banco, consulta: SQL): Promise<T[]> {
  return ((await banco.execute(consulta)) as unknown as { rows: T[] }).rows;
}

/** Pasta do banco local (fora do Git). */
export const PASTA_DE_DADOS = path.join(process.cwd(), '.dados');

async function conectarPostgres(url: string): Promise<Conexao> {
  const { Pool } = await import('pg');
  const { drizzle } = await import('drizzle-orm/node-postgres');
  const pool = new Pool({ connectionString: url, max: 5, idleTimeoutMillis: 10_000 });
  const banco = drizzle(pool, { schema: esquema }) as unknown as Banco;
  return {
    banco,
    executar: async (texto) => {
      await pool.query(texto);
    },
    comTrava: async (tarefa) => {
      const cliente = await pool.connect();
      try {
        await cliente.query('select pg_advisory_lock(727272)');
        return await tarefa();
      } finally {
        await cliente.query('select pg_advisory_unlock(727272)').catch(() => {});
        cliente.release();
      }
    },
  };
}

async function conectarLocal(pasta: string | null): Promise<Conexao> {
  const { PGlite } = await import('@electric-sql/pglite');
  const { drizzle } = await import('drizzle-orm/pglite');
  if (pasta) mkdirSync(pasta, { recursive: true });
  const cliente = pasta ? new PGlite(pasta) : new PGlite();
  await cliente.waitReady;
  const banco = drizzle(cliente, { schema: esquema }) as unknown as Banco;
  return {
    banco,
    executar: async (texto) => {
      await cliente.exec(texto);
    },
    comTrava: (tarefa) => tarefa(), // um único processo usa o banco local
  };
}

/** Aplica as migrações que faltam, cada uma numa transação. */
export async function migrar(conexao: Conexao): Promise<string[]> {
  return conexao.comTrava(async () => {
    await conexao.executar(
      'create table if not exists _migracoes (nome text primary key, aplicada_em timestamptz not null default now())',
    );
    const linhas = await consultar<{ nome: string }>(conexao.banco, sql`select nome from _migracoes`);
    const feitas = new Set(linhas.map((l) => l.nome));
    const aplicadas: string[] = [];
    for (const m of MIGRACOES) {
      if (feitas.has(m.nome)) continue;
      await conexao.executar(`begin;\n${m.sql}\ninsert into _migracoes (nome) values ('${m.nome}');\ncommit;`);
      aplicadas.push(m.nome);
    }
    return aplicadas;
  });
}

type Global = typeof globalThis & { __bancoDoSantuario?: Promise<Conexao> };

/** Abre o banco uma única vez por processo, migra e (se estiver vazio) copia o conteúdo inicial. */
async function abrir(): Promise<Conexao> {
  const modo = modoDoBanco();
  const conexao =
    modo === 'postgres'
      ? await conectarPostgres(process.env.DATABASE_URL ?? '')
      : await conectarLocal(path.join(PASTA_DE_DADOS, 'banco'));
  const aplicadas = await migrar(conexao);
  if (aplicadas.length) logger.info('banco.migrado', { migracoes: aplicadas.join(', ') });
  const { semear } = await import('./semente');
  await semear(conexao.banco, { contasLocais: modo === 'local' });
  return conexao;
}

/** O banco, ou null quando o site roda sem banco (testes, ou site no ar ainda sem DATABASE_URL). */
export async function obterBanco(): Promise<Banco | null> {
  if (modoDoBanco() === 'nenhum') return null;
  const global = globalThis as Global;
  global.__bancoDoSantuario ??= abrir().catch((erro: unknown) => {
    global.__bancoDoSantuario = undefined; // tenta de novo na próxima requisição
    throw erro;
  });
  return (await global.__bancoDoSantuario).banco;
}

/** Igual a `obterBanco`, mas exige que exista (usado pelo painel). */
export async function exigirBanco(): Promise<Banco> {
  const banco = await obterBanco();
  if (!banco) throw new Error('Banco de dados não configurado.');
  return banco;
}

/** Banco em memória, novo, já migrado — para os testes. */
export async function bancoDeTeste(): Promise<Banco> {
  const conexao = await conectarLocal(null);
  await migrar(conexao);
  return conexao.banco;
}
