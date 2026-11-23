import { type DataCivil, DIAS_DA_SEMANA, DIAS_EXTENSO, pad2 } from '@/lib/datas';

/** Missas de um dia da semana (índice 0 = domingo). */
export type DiaDeMissa = {
  dia: string;
  horas: string[];
  nota?: string;
  /** Nome curto usado no quadro "Hoje" (padrão: a nota). */
  missa?: string;
  /** Igreja fechada neste dia. */
  fechado?: boolean;
  /** Só acontece uma vez por mês (ex.: "1ª sexta do mês"). */
  mensal?: string;
};

export type MissaMensal = { titulo: string; quando: string; diaDaSemana: number; hora: string };
export type Confissao = { dias: number[]; horario: string };
export type Terco = { titulo: string; dias: number[]; horario: string };
export type Adoracao = { dias: number[]; horario: string; obs?: string };

export type QuadroDeHorarios = {
  missasDaSemana: DiaDeMissa[];
  missasMensais: MissaMensal[];
  confissoes: Confissao[];
  tercos: Terco[];
  adoracao: Adoracao[];
  /** Domingo → sábado; null = fechada. */
  igrejaAberta: (string | null)[];
  /** Domingo → sábado; null = fechada. */
  secretaria: (string | null)[];
  secretariaFechaNosFeriados: boolean;
};

/* ---------- Horários escritos como texto ("17h15", "9h às 10h e 17h15 às 18h") ---------- */

/** "17h15" → 1035 minutos desde 0h. */
export function minutos(texto: string | undefined): number {
  const m = /(\d{1,2})h(\d{2})?/.exec(texto ?? '');
  return m ? Number(m[1]) * 60 + (Number(m[2]) || 0) : 0;
}

export type Intervalo = { inicio: string; fim: string | null };

/** "9h às 10h e 17h15 às 18h" → [{ inicio: '9h', fim: '10h' }, { inicio: '17h15', fim: '18h' }] */
export function intervalos(texto: string): Intervalo[] {
  return texto.split(/\s+e\s+/).map((parte) => {
    const [inicio = '', fim] = parte.split(/\s+às\s+/);
    return { inicio: inicio.trim(), fim: fim ? fim.trim() : null };
  });
}

/** Cada faixa numa linha: "9h às 12h e 14h às 19h" → ['9h às 12h', '14h às 19h'] */
export const faixasDoHorario = (texto: string) => texto.split(/\s+e\s+/);

/** [1, 3, 4] → "Segunda, quarta e quinta" · [1] → "Toda segunda-feira" · [0] → "Todo domingo" */
export function nomeDosDias(dias: number[]): string {
  const [primeiro] = dias;
  if (dias.length === 1 && primeiro !== undefined) {
    return (primeiro === 0 || primeiro === 6 ? 'Todo ' : 'Toda ') + DIAS_EXTENSO[primeiro];
  }
  const nomes = dias.map((d) => (DIAS_DA_SEMANA[d] ?? '').toLowerCase());
  const texto = `${nomes.slice(0, -1).join(', ')} e ${nomes[nomes.length - 1] ?? ''}`;
  return texto.charAt(0).toUpperCase() + texto.slice(1);
}

/** "segunda-feira" → "Segunda-feira" */
export const diaPorExtensoMaiusculo = (dia: number) => {
  const nome = DIAS_EXTENSO[dia] ?? '';
  return nome.charAt(0).toUpperCase() + nome.slice(1);
};

/** As missas "mensais" (1ª sexta, 1º sábado) só valem na primeira semana do mês. */
export const ehPrimeiraSemanaDoMes = (hoje: Pick<DataCivil, 'dia'>) => hoje.dia <= 7;

/* ---------- Hoje no Santuário ---------- */

export type TipoDeAtividade = 'Missa' | 'Confissões' | 'Terço' | 'Adoração';
export type AtividadeDoDia = { inicio: string; fim: string | null; nome: string; tipo: TipoDeAtividade };

/** Tudo o que acontece num dia, em ordem de horário. */
export function programacaoDoDia(
  quadro: QuadroDeHorarios,
  hoje: Pick<DataCivil, 'diaDaSemana' | 'dia'>,
): AtividadeDoDia[] {
  const d = hoje.diaDaSemana;
  const itens: AtividadeDoDia[] = [];
  const missas = quadro.missasDaSemana[d];
  if (missas && !missas.fechado && (!missas.mensal || ehPrimeiraSemanaDoMes(hoje))) {
    missas.horas.forEach((hora) =>
      itens.push({ inicio: hora, fim: null, nome: missas.missa ?? missas.nota ?? 'Santa Missa', tipo: 'Missa' }),
    );
  }
  quadro.confissoes
    .filter((c) => c.dias.includes(d))
    .forEach((c) =>
      intervalos(c.horario).forEach((i) => itens.push({ ...i, nome: 'Atendimento de confissões', tipo: 'Confissões' })),
    );
  quadro.tercos
    .filter((t) => t.dias.includes(d))
    .forEach((t) => itens.push({ inicio: t.horario, fim: null, nome: t.titulo, tipo: 'Terço' }));
  quadro.adoracao
    .filter((a) => a.dias.includes(d))
    .forEach((a) => itens.push({ inicio: a.horario, fim: null, nome: 'Adoração ao Santíssimo', tipo: 'Adoração' }));
  return itens.sort((a, b) => minutos(a.inicio) - minutos(b.inicio));
}

export type Situacao = 'encerrado' | 'agora' | '';

/** Situação de uma atividade agora (sem hora de fim, considera 1 hora de duração). */
export function situacao(item: Pick<AtividadeDoDia, 'inicio' | 'fim'>, minutosAgora: number): Situacao {
  const ini = minutos(item.inicio);
  const fim = item.fim ? minutos(item.fim) : ini + 60;
  if (minutosAgora >= fim) return 'encerrado';
  if (minutosAgora >= ini) return 'agora';
  return '';
}

/* ---------- Missas mensais: próxima data ---------- */

/** Próxima "primeira <sexta/sábado> do mês" a partir de hoje (inclusive), como 'AAAA-MM-DD'. */
export function proximaPrimeira(diaDaSemana: number, hoje: Pick<DataCivil, 'ano' | 'mes' | 'dia'>): string {
  const hojeUtc = Date.UTC(hoje.ano, hoje.mes - 1, hoje.dia);
  for (let k = 0; k < 3; k++) {
    const d = new Date(Date.UTC(hoje.ano, hoje.mes - 1 + k, 1));
    while (d.getUTCDay() !== diaDaSemana) d.setUTCDate(d.getUTCDate() + 1);
    if (d.getTime() >= hojeUtc) return `${d.getUTCFullYear()}-${pad2(d.getUTCMonth() + 1)}-${pad2(d.getUTCDate())}`;
  }
  throw new Error('Data mensal não encontrada'); // impossível: sempre há uma em 2 meses
}

/* ---------- Secretaria: texto resumido (rodapé e página Contato) ---------- */

/**
 * Agrupa os dias com o mesmo horário, começando na segunda-feira:
 * ["Segunda, quarta, quinta e sexta: 9h às 12h e 14h às 19h", "Sábado: 8h às 12h", "Terça, domingo e feriados: fechada"]
 */
export function resumoDoHorario(porDia: (string | null)[], fechaNosFeriados: boolean): string[] {
  const ordem = [1, 2, 3, 4, 5, 6, 0];
  const abertos = new Map<string, number[]>();
  const fechados: number[] = [];
  for (const dia of ordem) {
    const horario = porDia[dia];
    if (horario) abertos.set(horario, [...(abertos.get(horario) ?? []), dia]);
    else fechados.push(dia);
  }
  const listar = (nomes: string[]) =>
    nomes.length === 1 ? (nomes[0] ?? '') : `${nomes.slice(0, -1).join(', ')} e ${nomes[nomes.length - 1] ?? ''}`;
  const capitalizar = (t: string) => t.charAt(0).toUpperCase() + t.slice(1);
  const nomeCurto = (d: number) => (DIAS_DA_SEMANA[d] ?? '').toLowerCase();

  const linhas = [...abertos].map(([horario, dias]) => `${capitalizar(listar(dias.map(nomeCurto)))}: ${horario}`);
  const nomesFechados = [...fechados.map(nomeCurto), ...(fechaNosFeriados ? ['feriados'] : [])];
  if (nomesFechados.length) linhas.push(`${capitalizar(listar(nomesFechados))}: fechada`);
  return linhas;
}
