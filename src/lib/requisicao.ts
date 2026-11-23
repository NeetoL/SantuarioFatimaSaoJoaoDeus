import 'server-only';
import { connection } from 'next/server';

/**
 * Instante da requisição atual (ms). Marca a página como dinâmica — montada a cada visita —
 * porque eventos e horários dependem da hora: um evento some 2 h depois de começar, "Hoje" muda à meia-noite.
 * O mesmo instante vai para os componentes do navegador como ponto de partida do relógio.
 */
export async function instanteDaRequisicao(): Promise<number> {
  await connection();
  return Date.now();
}
