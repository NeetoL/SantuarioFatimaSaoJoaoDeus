import { sql } from 'drizzle-orm';
import { describe, expect, it } from 'vitest';
import { bancoDeTeste, consultar } from './conexao';
import { registroAtividades } from './esquema';
import { semear } from './semente';

const contar = async (banco: Awaited<ReturnType<typeof bancoDeTeste>>, tabela: string) =>
  Number((await consultar<{ n: number }>(banco, sql.raw(`select count(*)::int as n from ${tabela}`)))[0]?.n ?? 0);

describe('banco de dados', () => {
  it('cria as tabelas e copia o conteúdo atual do site uma única vez', async () => {
    const banco = await bancoDeTeste();
    await semear(banco, { contasLocais: false });
    await semear(banco, { contasLocais: false }); // de novo: não duplica
    expect(await contar(banco, 'configuracoes')).toBe(3);
    expect(await contar(banco, 'eventos')).toBeGreaterThan(0);
    expect(await contar(banco, 'albuns')).toBeGreaterThan(0);
    expect(await contar(banco, 'fotos_album')).toBeGreaterThan(await contar(banco, 'albuns'));
    expect(await contar(banco, 'usuarios')).toBe(0);
  });

  it('o registro de atividades aceita novas linhas, mas recusa alterar ou apagar', async () => {
    const banco = await bancoDeTeste();
    await banco.insert(registroAtividades).values({ acao: 'criou', area: 'eventos', alvo: 'Teste' });
    await expect(banco.execute(sql`update registro_atividades set alvo = 'outro'`)).rejects.toThrow();
    await expect(banco.execute(sql`delete from registro_atividades`)).rejects.toThrow();
    expect(await contar(banco, 'registro_atividades')).toBe(1);
  });

  it('recusa valores fora das regras (perfil inexistente, valor zero)', async () => {
    const banco = await bancoDeTeste();
    await expect(
      banco.execute(sql`insert into usuarios (nome, email, senha_hash, papel) values ('x', 'x@x.com', 'h', 'chefe')`),
    ).rejects.toThrow();
    await expect(
      banco.execute(sql`insert into contribuicoes (tipo, valor_centavos, data, forma) values ('dizimo', 0, '2026-11-01', 'pix')`),
    ).rejects.toThrow();
  });
});
