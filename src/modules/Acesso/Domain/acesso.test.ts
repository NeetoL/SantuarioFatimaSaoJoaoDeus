import { describe, expect, it } from 'vitest';
import { esquemaEmail } from './acesso';

describe('identificação para entrar no painel', () => {
  it.each([
    ['Maria@Exemplo.com ', 'maria@exemplo.com'],
    ['admin-teste', 'admin-teste'],
    ['Maria.Silva', 'maria.silva'],
  ])('aceita "%s"', (entrada, saida) => expect(esquemaEmail.parse(entrada)).toBe(saida));

  it.each(['', 'ab', 'nome com espaço', '-comeca-com-traco', "x'; drop table usuarios;--"])('recusa "%s"', (entrada) =>
    expect(esquemaEmail.safeParse(entrada).success).toBe(false),
  );
});
