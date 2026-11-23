import { type Evento } from './evento';

/**
 * Contrato de acesso aos eventos. Hoje: `RepositorioDeEventosEmMemoria` (dados de demonstração).
 * Amanhã: um repositório PostgreSQL (Prisma/Drizzle) com a mesma interface — as regras não mudam.
 */
export interface RepositorioDeEventos {
  listarTodos(): Promise<Evento[]>;
  buscarPorId(id: string): Promise<Evento | null>;
}
