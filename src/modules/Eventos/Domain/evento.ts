import { DESLOCAMENTO_BRASILIA, diasEntre, hojeIsoEmBrasilia, pad2 } from '@/lib/datas';

export const CATEGORIAS_DE_EVENTO = ['Missa', 'Novena', 'Festa', 'Aviso'] as const;
export type CategoriaDeEvento = (typeof CATEGORIAS_DE_EVENTO)[number];

export const PLURAL_DA_CATEGORIA: Record<CategoriaDeEvento, string> = {
  Missa: 'Missas',
  Novena: 'Novenas',
  Festa: 'Festas',
  Aviso: 'Avisos',
};

export type Evento = {
  id: string;
  categoria: CategoriaDeEvento;
  titulo: string;
  /** 'AAAA-MM-DD' (horário de Brasília) */
  data: string;
  /** '19h30' — opcional na regra, presente em todos os eventos atuais */
  hora: string;
  local: string;
  descricao: string;
  destaque?: boolean;
  imagem?: string;
};

/** Tempo que o evento continua no site depois de começar. */
export const PERMANENCIA_APOS_INICIO_MS = 2 * 60 * 60 * 1000;
/** Duração estimada usada no arquivo de agenda (.ics). */
export const DURACAO_ESTIMADA_MS = 90 * 60 * 1000;

/** '19h30' → ['19', '30']; '9h' → ['09', '00']; sem hora → null */
export function horaDoEvento(evento: Pick<Evento, 'hora'>): [string, string] | null {
  const m = String(evento.hora || '').match(/(\d{1,2})\s*h\s*(\d{2})?/i);
  return m?.[1] ? [pad2(Number(m[1])), m[2] ?? '00'] : null;
}

/** Início do evento como instante (sempre em Brasília, -03:00). */
export function inicioDoEvento(evento: Pick<Evento, 'data' | 'hora'>): Date {
  const h = horaDoEvento(evento);
  return new Date(`${evento.data}T${h ? `${h[0]}:${h[1]}` : '00:00'}:00${DESLOCAMENTO_BRASILIA}`);
}

/** O evento fica no site até 2 horas depois do início (sem hora: até o fim do dia). */
export function visivelAte(evento: Pick<Evento, 'data' | 'hora'>): number {
  return horaDoEvento(evento)
    ? inicioDoEvento(evento).getTime() + PERMANENCIA_APOS_INICIO_MS
    : new Date(`${evento.data}T23:59:59${DESLOCAMENTO_BRASILIA}`).getTime();
}

export function estaVisivel(evento: Pick<Evento, 'data' | 'hora'>, agora: Date): boolean {
  return visivelAte(evento) > agora.getTime();
}

/** Dias de calendário (em Brasília) entre hoje e a data do evento. */
export function diasAteOEvento(evento: Pick<Evento, 'data'>, agora: Date): number {
  return diasEntre(hojeIsoEmBrasilia(agora), evento.data);
}

export type SeloDeTempo = { texto: string; vivo: boolean };

/** "Começa em 2h 05min", "Acontecendo agora", "Amanhã às 18h00", "Em 3 dias" (vazio quando falta mais). */
export function seloDeTempo(evento: Pick<Evento, 'data' | 'hora'>, agora: Date): SeloDeTempo {
  const n = diasAteOEvento(evento, agora);
  const instante = agora.getTime();
  if (horaDoEvento(evento)) {
    const inicio = inicioDoEvento(evento).getTime();
    if (instante >= inicio) return { texto: 'Acontecendo agora', vivo: true };
    if (n === 0) {
      const min = Math.ceil((inicio - instante) / 60_000);
      return {
        texto: `Começa em ${min < 60 ? `${min} min` : `${Math.floor(min / 60)}h ${pad2(min % 60)}min`}`,
        vivo: true,
      };
    }
  } else if (n === 0) {
    return { texto: 'Hoje', vivo: true };
  }
  if (n === 1) return { texto: `Amanhã${evento.hora ? ` às ${evento.hora}` : ''}`, vivo: false };
  if (n > 1 && n <= 6) return { texto: `Em ${n} dias`, vivo: false };
  return { texto: '', vivo: false };
}

/** Texto do aviso dourado sobre o vídeo da página inicial (só para eventos nos próximos dias). */
export function rotuloDoAvisoNoTopo(evento: Pick<Evento, 'data' | 'hora'>, agora: Date): string {
  const selo = seloDeTempo(evento, agora);
  return selo.texto && diasAteOEvento(evento, agora) >= 2 ? `${selo.texto} · ${evento.hora}` : selo.texto;
}

export function ordenarPorInicio<T extends Pick<Evento, 'data' | 'hora'>>(eventos: readonly T[]): T[] {
  return [...eventos].sort((a, b) => inicioDoEvento(a).getTime() - inicioDoEvento(b).getTime());
}

/** O evento do card grande: o marcado como destaque ou, se nenhum, o mais próximo. */
export function eventoPrincipal<T extends Pick<Evento, 'destaque'>>(lista: readonly T[]): T | undefined {
  return lista.find((ev) => ev.destaque) ?? lista[0];
}
