import 'server-only';
import { z } from 'zod';

/**
 * Variáveis de ambiente do servidor, validadas na inicialização.
 * Nenhuma é secreta hoje. Segredos futuros (ex.: DATABASE_URL) entram aqui — nunca com prefixo NEXT_PUBLIC_.
 */
const esquema = z.object({
  SITE_URL: z.url().optional(),
  VERCEL_PROJECT_PRODUCTION_URL: z.string().optional(),
  VERCEL_ENV: z.enum(['production', 'preview', 'development']).optional(),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
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
