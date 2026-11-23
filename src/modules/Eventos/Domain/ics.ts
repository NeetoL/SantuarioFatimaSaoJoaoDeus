import { DURACAO_ESTIMADA_MS, type Evento, inicioDoEvento } from './evento';

/** Nome de arquivo seguro: "Missa da Noite de Natal" → "missa-da-noite-de-natal" */
export function nomeDeArquivo(titulo: string): string {
  return (
    titulo
      .normalize('NFD')
      .replace(/[̀-ͯ]/g, '')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '') || 'evento'
  );
}

const utc = (d: Date) =>
  d
    .toISOString()
    .replace(/[-:]/g, '')
    .replace(/\.\d{3}/, '');
/** Escapa texto conforme o padrão iCalendar (RFC 5545). */
const textoIcs = (s: string) => s.replace(/[\\,;]/g, (c) => `\\${c}`).replace(/\r?\n/g, '\\n');

/** Arquivo de agenda (.ics) do evento, em UTC a partir do horário de Brasília. */
export function gerarIcs(evento: Evento, enderecoCompleto: string, agora: Date): string {
  const inicio = inicioDoEvento(evento);
  const fim = new Date(inicio.getTime() + DURACAO_ESTIMADA_MS);
  return [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Santuario N. Sra. de Fatima e S. Joao de Deus//Site//PT-BR',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `UID:${evento.id}@santuariofatimasaojoaodeus`,
    `DTSTAMP:${utc(agora)}`,
    `DTSTART:${utc(inicio)}`,
    `DTEND:${utc(fim)}`,
    `SUMMARY:${textoIcs(evento.titulo)}`,
    `LOCATION:${textoIcs(`${evento.local} — ${enderecoCompleto}`)}`,
    `DESCRIPTION:${textoIcs(evento.descricao)}`,
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n');
}
