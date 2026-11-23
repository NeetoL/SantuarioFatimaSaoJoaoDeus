import { EVENTOS } from '@/mocks/eventos';
import { type Evento } from '../Domain/evento';
import { type RepositorioDeEventos } from '../Domain/repositorio';

/**
 * Repositório de demonstração: lê a lista fixa de `src/mocks/eventos.ts`.
 * Devolve cópias (quem usa não consegue alterar os dados de origem) e não guarda estado entre requisições.
 */
export class RepositorioDeEventosEmMemoria implements RepositorioDeEventos {
  constructor(private readonly fonte: readonly Evento[] = EVENTOS) {}

  async listarTodos(): Promise<Evento[]> {
    return structuredClone([...this.fonte]);
  }

  async buscarPorId(id: string): Promise<Evento | null> {
    const evento = this.fonte.find((ev) => ev.id === id);
    return evento ? structuredClone(evento) : null;
  }
}
