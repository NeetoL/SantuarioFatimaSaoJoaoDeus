/**
 * Datas e horas sempre no horário de Brasília (America/Sao_Paulo), no servidor (UTC) ou no navegador.
 * O Brasil não tem horário de verão desde 2019: o fuso é sempre -03:00.
 */
export const FUSO_BRASILIA = 'America/Sao_Paulo';
export const DESLOCAMENTO_BRASILIA = '-03:00';

export const DIAS_DA_SEMANA = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'] as const;
export const DIAS_EXTENSO = [
  'domingo',
  'segunda-feira',
  'terça-feira',
  'quarta-feira',
  'quinta-feira',
  'sexta-feira',
  'sábado',
] as const;
export const MESES_ABREV = [
  'JAN',
  'FEV',
  'MAR',
  'ABR',
  'MAI',
  'JUN',
  'JUL',
  'AGO',
  'SET',
  'OUT',
  'NOV',
  'DEZ',
] as const;
export const MESES_EXTENSO = [
  'janeiro',
  'fevereiro',
  'março',
  'abril',
  'maio',
  'junho',
  'julho',
  'agosto',
  'setembro',
  'outubro',
  'novembro',
  'dezembro',
] as const;

/** Data "do calendário" em Brasília: ano, mês (1–12), dia, dia da semana (0 = domingo) e minutos desde 0h. */
export type DataCivil = { ano: number; mes: number; dia: number; diaDaSemana: number; minutosDoDia: number };

const formatador = new Intl.DateTimeFormat('en-US', {
  timeZone: FUSO_BRASILIA,
  year: 'numeric',
  month: 'numeric',
  day: 'numeric',
  hour: 'numeric',
  minute: 'numeric',
  hourCycle: 'h23',
  weekday: 'short',
});
const SEMANA_EN = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export function dataCivilEmBrasilia(instante: Date): DataCivil {
  const partes = Object.fromEntries(formatador.formatToParts(instante).map((p) => [p.type, p.value]));
  return {
    ano: Number(partes.year),
    mes: Number(partes.month),
    dia: Number(partes.day),
    diaDaSemana: SEMANA_EN.indexOf(partes.weekday ?? 'Sun'),
    minutosDoDia: Number(partes.hour) * 60 + Number(partes.minute),
  };
}

const pad2 = (n: number) => String(n).padStart(2, '0');

/** 'AAAA-MM-DD' de hoje em Brasília. */
export function hojeIsoEmBrasilia(instante: Date): string {
  const { ano, mes, dia } = dataCivilEmBrasilia(instante);
  return `${ano}-${pad2(mes)}-${pad2(dia)}`;
}

/** Diferença em dias de calendário entre duas datas 'AAAA-MM-DD'. */
export function diasEntre(deIso: string, ateIso: string): number {
  const [a1 = 0, m1 = 1, d1 = 1] = deIso.split('-').map(Number);
  const [a2 = 0, m2 = 1, d2 = 1] = ateIso.split('-').map(Number);
  return Math.round((Date.UTC(a2, m2 - 1, d2) - Date.UTC(a1, m1 - 1, d1)) / 86_400_000);
}

/** Dia da semana (0 = domingo) de uma data 'AAAA-MM-DD'. */
export function diaDaSemanaDe(dataIso: string): number {
  const [a = 0, m = 1, d = 1] = dataIso.split('-').map(Number);
  return new Date(Date.UTC(a, m - 1, d)).getUTCDay();
}

/** Partes de uma data 'AAAA-MM-DD' para exibição. */
export function partesDaData(dataIso: string) {
  const [ano = 0, mes = 1, dia = 1] = dataIso.split('-').map(Number);
  return { ano, mes, dia, diaDaSemana: diaDaSemanaDe(dataIso) };
}

/** "sábado, 28 de novembro" */
export function dataPorExtenso(dataIso: string): string {
  const { dia, mes, diaDaSemana } = partesDaData(dataIso);
  return `${DIAS_EXTENSO[diaDaSemana]}, ${dia} de ${MESES_EXTENSO[mes - 1]}`;
}

/** "Sábado, 28 de novembro" · "Segunda, 13 de dezembro" (usado nos eventos) */
export function diaEData(dataIso: string): string {
  const { dia, mes, diaDaSemana } = partesDaData(dataIso);
  return `${DIAS_DA_SEMANA[diaDaSemana]}, ${dia} de ${MESES_EXTENSO[mes - 1]}`;
}

export { pad2 };
