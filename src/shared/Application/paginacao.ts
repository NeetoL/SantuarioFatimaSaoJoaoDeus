import { z } from 'zod';

export const LIMITE_POR_PAGINA = 50;

/** Parâmetros de paginação aceitos nas listagens (?pagina=1&porPagina=20). */
export const esquemaPaginacao = z.object({
  pagina: z.coerce.number().int().min(1).max(10_000).default(1),
  porPagina: z.coerce.number().int().min(1).max(LIMITE_POR_PAGINA).default(20),
});

export type Paginacao = z.infer<typeof esquemaPaginacao>;

export type MetaPaginacao = {
  pagina: number;
  porPagina: number;
  total: number;
  totalDePaginas: number;
};

export type Pagina<T> = { itens: T[]; meta: MetaPaginacao };

export function paginar<T>(lista: readonly T[], { pagina, porPagina }: Paginacao): Pagina<T> {
  const total = lista.length;
  const inicio = (pagina - 1) * porPagina;
  return {
    itens: lista.slice(inicio, inicio + porPagina),
    meta: { pagina, porPagina, total, totalDePaginas: Math.max(1, Math.ceil(total / porPagina)) },
  };
}
