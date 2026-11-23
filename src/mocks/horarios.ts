import { type QuadroDeHorarios } from '@/modules/Horarios/Domain/horarios';

/**
 * HORÁRIOS DO SANTUÁRIO — dados REAIS (site antigo do Santuário: /sobre/horários).
 * Dias da semana: 0 = domingo … 6 = sábado. Horários como "18h", "17h15" ou "9h às 10h e 17h15 às 18h".
 * Lidos apenas por `RepositorioDeHorariosEmMemoria`.
 */
export const QUADRO_DE_HORARIOS: QuadroDeHorarios = {
  // Missas de domingo a sábado. "missa" é o nome curto usado no quadro "Hoje no Santuário".
  missasDaSemana: [
    { dia: 'Domingo', horas: ['7h', '10h', '18h'], nota: 'Missa dominical' },
    { dia: 'Segunda', horas: ['19h'], nota: 'Missa da Luz · Missa pelos falecidos', missa: 'Missa da Luz' },
    { dia: 'Terça', horas: [], fechado: true },
    { dia: 'Quarta', horas: ['19h'], nota: 'Santa Missa' },
    { dia: 'Quinta', horas: ['19h'], nota: 'Santa Missa · Adoração ao Santíssimo às 19h30', missa: 'Santa Missa' },
    { dia: 'Sexta', horas: ['8h', '19h'], nota: 'Missa votiva ao Sagrado Coração de Jesus', mensal: '1ª sexta do mês' },
    { dia: 'Sábado', horas: ['8h'], nota: 'Missa votiva à Nossa Senhora', mensal: '1º sábado do mês' },
  ],
  // Missas de uma vez por mês (a página Missas mostra a próxima data de cada uma)
  missasMensais: [
    {
      titulo: 'Missa votiva ao Sagrado Coração de Jesus',
      quando: 'Primeira sexta-feira do mês',
      diaDaSemana: 5,
      hora: '8h e 19h',
    },
    { titulo: 'Missa votiva à Nossa Senhora', quando: 'Primeiro sábado do mês', diaDaSemana: 6, hora: '8h' },
  ],
  confissoes: [
    { dias: [1, 3, 4], horario: '18h às 19h' }, // segunda, quarta e quinta
    { dias: [0], horario: '9h às 10h e 17h15 às 18h' }, // domingo
  ],
  tercos: [
    { titulo: 'Terço Mariano', dias: [1], horario: '18h' },
    { titulo: 'Terço dos Homens', dias: [1], horario: '20h' },
  ],
  adoracao: [{ dias: [4], horario: '19h30', obs: 'Logo após a Santa Missa das 19h' }],
  // Igreja aberta para visitas e oração pessoal (domingo → sábado; null = fechada)
  igrejaAberta: ['7h às 13h e 17h às 20h', '8h às 19h', null, '8h às 19h', '8h às 19h', '8h às 19h', '8h às 17h'],
  // Secretaria do Santuário (domingo → sábado; null = fechada). Também fecha nos feriados.
  secretaria: [
    null,
    '9h às 12h e 14h às 19h',
    null,
    '9h às 12h e 14h às 19h',
    '9h às 12h e 14h às 19h',
    '9h às 12h e 14h às 19h',
    '8h às 12h',
  ],
  secretariaFechaNosFeriados: true,
};
