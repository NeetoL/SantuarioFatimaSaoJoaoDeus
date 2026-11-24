import 'server-only';
import { z } from 'zod';

/**
 * Variáveis de ambiente do servidor, validadas na inicialização.
 * Segredos (DATABASE_URL, BLOB_READ_WRITE_TOKEN) ficam só aqui no servidor — nunca com prefixo NEXT_PUBLIC_.
 */
const esquema = z.object({
  SITE_URL: z.url().optional(),
  VERCEL_PROJECT_PRODUCTION_URL: z.string().optional(),
  VERCEL_ENV: z.enum(['production', 'preview', 'development']).optional(),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  /** Banco PostgreSQL no ar (ex.: Neon pela Vercel). Sem ela, em desenvolvimento usa o banco local. */
  DATABASE_URL: z.string().startsWith('postgres').optional(),
  /** "1" força o banco local (pasta .dados) mesmo em `next start`. */
  BANCO_LOCAL: z.enum(['0', '1']).optional(),
  /** Armazenamento de fotos no ar (Vercel Blob). Sem ele, as fotos ficam na pasta .dados/arquivos. */
  BLOB_READ_WRITE_TOKEN: z.string().optional(),
});

const lido = esquema.safeParse(process.env);
if (!lido.success) {
  throw new Error(`Variáveis de ambiente inválidas: ${lido.error.issues.map((i) => i.path.join('.')).join(', ')}`);
}

export const ambiente = lido.data;

/** Endereço público do site (sem barra no final). */
export function urlDoSite(): string {
  if (ambiente.SITE_URL) return ambiente.SITE_URL.replace(/\/$/, '');
  if (ambiente.VERCEL_PROJECT_PRODUCTION_URL) return `https://${ambiente.VERCEL_PROJECT_PRODUCTION_URL}`;
  return 'http://localhost:3000';
}

export type ModoDoBanco = 'postgres' | 'local' | 'nenhum';

/**
 * Qual banco usar:
 * - "postgres": DATABASE_URL definida (site no ar);
 * - "local": banco embutido na pasta .dados (desenvolvimento, ou BANCO_LOCAL=1);
 * - "nenhum": sem banco (testes, ou site no ar ainda sem DATABASE_URL) — o site usa os dados de src/mocks
 *   e o painel fica indisponível.
 */
export function modoDoBanco(): ModoDoBanco {
  if (ambiente.DATABASE_URL) return 'postgres';
  if (ambiente.BANCO_LOCAL === '1') return 'local';
  if (ambiente.NODE_ENV === 'development' && ambiente.BANCO_LOCAL !== '0') return 'local';
  return 'nenhum';
}
