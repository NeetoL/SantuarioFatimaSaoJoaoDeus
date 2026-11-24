import { eq } from 'drizzle-orm';
import { type z } from 'zod';
import { logger } from '../logger';
import { type Banco } from './conexao';
import { configuracoes } from './esquema';

/**
 * Configurações guardadas como JSON (informações do site, horários, doações).
 * Na leitura, o JSON é validado: se algo estiver inválido, volta `null` e o site usa o padrão.
 */
export async function lerConfiguracao<T>(banco: Banco, chave: string, esquema: z.ZodType<T>): Promise<T | null> {
  const [linha] = await banco.select().from(configuracoes).where(eq(configuracoes.chave, chave)).limit(1);
  if (!linha) return null;
  const lido = esquema.safeParse(linha.valor);
  if (!lido.success) {
    logger.aviso('configuracao.invalida', { chave });
    return null;
  }
  return lido.data;
}

export async function gravarConfiguracao(banco: Banco, chave: string, valor: unknown) {
  await banco
    .insert(configuracoes)
    .values({ chave, valor, atualizadoEm: new Date() })
    .onConflictDoUpdate({ target: configuracoes.chave, set: { valor, atualizadoEm: new Date() } });
}
