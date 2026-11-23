import { describe, expect, it } from 'vitest';
import { QUADRO_DE_HORARIOS } from '@/mocks/horarios';
import { dataCivilEmBrasilia } from '@/lib/datas';
import {
  intervalos,
  minutos,
  nomeDosDias,
  programacaoDoDia,
  proximaPrimeira,
  resumoDoHorario,
  situacao,
} from './horarios';

const hoje = (iso: string) => dataCivilEmBrasilia(new Date(`${iso}-03:00`));

describe('leitura dos horários', () => {
  it('converte texto em minutos e faixas', () => {
    expect(minutos('17h15')).toBe(1035);
    expect(minutos('8h')).toBe(480);
    expect(intervalos('9h às 10h e 17h15 às 18h')).toEqual([
      { inicio: '9h', fim: '10h' },
      { inicio: '17h15', fim: '18h' },
    ]);
  });

  it('escreve os dias por extenso', () => {
    expect(nomeDosDias([1, 3, 4])).toBe('Segunda, quarta e quinta');
    expect(nomeDosDias([1])).toBe('Toda segunda-feira');
    expect(nomeDosDias([0])).toBe('Todo domingo');
  });
});

describe('Hoje no Santuário', () => {
  it('segunda-feira: confissões, terço, Missa da Luz e terço dos homens em ordem', () => {
    const itens = programacaoDoDia(QUADRO_DE_HORARIOS, hoje('2026-11-16T10:00'));
    expect(itens.map((i) => `${i.inicio} ${i.nome}`)).toEqual([
      '18h Atendimento de confissões',
      '18h Terço Mariano',
      '19h Missa da Luz',
      '20h Terço dos Homens',
    ]);
  });

  it('1ª sexta do mês tem missas às 8h e 19h; sexta comum não tem', () => {
    expect(programacaoDoDia(QUADRO_DE_HORARIOS, hoje('2026-12-04T10:00')).map((i) => i.inicio)).toEqual(['8h', '19h']);
    expect(programacaoDoDia(QUADRO_DE_HORARIOS, hoje('2026-11-20T10:00'))).toEqual([]);
  });

  it('terça-feira: igreja fechada, sem programação', () => {
    expect(programacaoDoDia(QUADRO_DE_HORARIOS, hoje('2026-11-17T10:00'))).toEqual([]);
  });

  it('situação: encerrado, agora ou em breve', () => {
    expect(situacao({ inicio: '19h', fim: null }, 19 * 60 + 30)).toBe('agora');
    expect(situacao({ inicio: '18h', fim: '19h' }, 19 * 60)).toBe('encerrado');
    expect(situacao({ inicio: '20h', fim: null }, 19 * 60)).toBe('');
  });
});

describe('missas mensais', () => {
  it('próxima primeira sexta e primeiro sábado', () => {
    expect(proximaPrimeira(5, hoje('2026-11-23T10:00'))).toBe('2026-12-04');
    expect(proximaPrimeira(6, hoje('2026-12-05T10:00'))).toBe('2026-12-05'); // é hoje
    expect(proximaPrimeira(5, hoje('2026-12-05T10:00'))).toBe('2027-01-01');
  });
});

describe('resumo da secretaria', () => {
  it('agrupa os dias com o mesmo horário e põe os fechados por último', () => {
    expect(resumoDoHorario(QUADRO_DE_HORARIOS.secretaria, true)).toEqual([
      'Segunda, quarta, quinta e sexta: 9h às 12h e 14h às 19h',
      'Sábado: 8h às 12h',
      'Terça, domingo e feriados: fechada',
    ]);
  });
});
