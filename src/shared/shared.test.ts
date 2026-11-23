import { describe, expect, it, vi } from 'vitest';
import type { ZodError } from 'zod';
import { z } from 'zod';
import { esquemaPaginacao, paginar } from './Application/paginacao';
import { ErroNaoEncontrado } from './Domain/erros';
import { LimitadorEmMemoria } from './Infrastructure/limite-de-requisicoes';
import { respostaSucesso, tratarErro } from './Presentation/resposta-api';

describe('respostas padronizadas', () => {
  it('sucesso: success, message, data e meta', async () => {
    const corpo = await respostaSucesso({ a: 1 }, { meta: { total: 1 } }).json();
    expect(corpo).toEqual({
      success: true,
      message: 'Operação realizada com sucesso.',
      data: { a: 1 },
      meta: { total: 1 },
    });
  });

  it('erro conhecido: status e mensagem pública', async () => {
    const r = tratarErro(new ErroNaoEncontrado('Evento'), 'teste');
    expect(r.status).toBe(404);
    expect(await r.json()).toEqual({ success: false, message: 'Evento não encontrado.', errors: [] });
  });

  it('erro de validação do Zod vira 400 com os campos', async () => {
    const erro = z.object({ pagina: z.number() }).safeParse({ pagina: 'x' }).error as ZodError;
    const r = tratarErro(erro, 'teste');
    expect(r.status).toBe(400);
    expect((await r.json()).errors[0].campo).toBe('pagina');
  });

  it('erro inesperado: 500 genérico, sem detalhes internos nem pilha', async () => {
    const espiao = vi.spyOn(console, 'error').mockImplementation(() => {});
    const r = tratarErro(new Error('senha=123 em /var/app/segredo.ts'), 'teste');
    const corpo = await r.json();
    expect(r.status).toBe(500);
    expect(JSON.stringify(corpo)).not.toContain('segredo');
    expect(corpo).toEqual({ success: false, message: 'Não foi possível realizar a operação.', errors: [] });
    espiao.mockRestore();
  });
});

describe('paginação', () => {
  it('valida e calcula as páginas', () => {
    expect(esquemaPaginacao.parse({})).toEqual({ pagina: 1, porPagina: 20 });
    expect(esquemaPaginacao.safeParse({ porPagina: '500' }).success).toBe(false);
    expect(paginar([1, 2, 3, 4, 5], { pagina: 2, porPagina: 2 })).toEqual({
      itens: [3, 4],
      meta: { pagina: 2, porPagina: 2, total: 5, totalDePaginas: 3 },
    });
  });
});

describe('limite de requisições', () => {
  it('bloqueia depois do máximo e libera quando a janela passa', () => {
    let agora = 0;
    const limitador = new LimitadorEmMemoria(2, 1000, () => agora);
    expect(limitador.consumir('ip').permitido).toBe(true);
    expect(limitador.consumir('ip').permitido).toBe(true);
    expect(limitador.consumir('ip')).toEqual({ permitido: false, tentarNovamenteEmSegundos: 1 });
    expect(limitador.consumir('outro-ip').permitido).toBe(true);
    agora = 1001;
    expect(limitador.consumir('ip').permitido).toBe(true);
  });
});
