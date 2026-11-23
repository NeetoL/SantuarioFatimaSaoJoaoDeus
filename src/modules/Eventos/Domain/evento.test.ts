import { describe, expect, it } from 'vitest';
import {
  diasAteOEvento,
  estaVisivel,
  type Evento,
  eventoPrincipal,
  horaDoEvento,
  inicioDoEvento,
  ordenarPorInicio,
  rotuloDoAvisoNoTopo,
  seloDeTempo,
} from './evento';
import { escolherFoto, fotoGrande } from './fotos';
import { gerarIcs, nomeDeArquivo } from './ics';

const evento = (parcial: Partial<Evento> = {}): Evento => ({
  id: 'teste',
  categoria: 'Missa',
  titulo: 'Missa de Teste',
  data: '2026-11-28',
  hora: '18h00',
  local: 'Igreja',
  descricao: 'Descrição',
  ...parcial,
});
/** Instante no horário de Brasília */
const em = (iso: string) => new Date(`${iso}-03:00`);

describe('horário do evento', () => {
  it('lê "19h30", "9h" e "18h00"', () => {
    expect(horaDoEvento({ hora: '19h30' })).toEqual(['19', '30']);
    expect(horaDoEvento({ hora: '9h' })).toEqual(['09', '00']);
    expect(horaDoEvento({ hora: '' })).toBeNull();
  });

  it('começa no horário de Brasília (-03:00), em qualquer fuso do servidor', () => {
    expect(inicioDoEvento(evento()).toISOString()).toBe('2026-11-28T21:00:00.000Z');
  });
});

describe('visibilidade (o evento sai do site 2 horas depois de começar)', () => {
  it('aparece antes e até 2 h depois do início', () => {
    expect(estaVisivel(evento(), em('2026-11-28T19:59'))).toBe(true);
    expect(estaVisivel(evento(), em('2026-11-28T20:00'))).toBe(false);
  });

  it('sem hora, fica até o fim do dia', () => {
    expect(estaVisivel(evento({ hora: '' }), em('2026-11-28T23:58'))).toBe(true);
    expect(estaVisivel(evento({ hora: '' }), em('2026-11-29T00:00'))).toBe(false);
  });
});

describe('selo de tempo', () => {
  it('"Começa em…" no mesmo dia', () => {
    expect(seloDeTempo(evento(), em('2026-11-28T17:20'))).toEqual({ texto: 'Começa em 40 min', vivo: true });
    expect(seloDeTempo(evento(), em('2026-11-28T15:55'))).toEqual({ texto: 'Começa em 2h 05min', vivo: true });
  });

  it('"Acontecendo agora" depois do início', () => {
    expect(seloDeTempo(evento(), em('2026-11-28T18:30'))).toEqual({ texto: 'Acontecendo agora', vivo: true });
  });

  it('"Amanhã às…" e "Em N dias" (até 6 dias); vazio depois disso', () => {
    expect(seloDeTempo(evento(), em('2026-11-27T23:00')).texto).toBe('Amanhã às 18h00');
    expect(seloDeTempo(evento(), em('2026-11-24T10:00')).texto).toBe('Em 4 dias');
    expect(seloDeTempo(evento(), em('2026-11-20T10:00')).texto).toBe('');
  });

  it('conta os dias pelo calendário de Brasília (servidor em UTC já virou o dia)', () => {
    // 22h em Brasília = 01h UTC do dia seguinte
    expect(diasAteOEvento(evento(), em('2026-11-27T22:00'))).toBe(1);
  });

  it('aviso sobre o vídeo inclui a hora quando faltam 2 dias ou mais', () => {
    expect(rotuloDoAvisoNoTopo(evento(), em('2026-11-25T10:00'))).toBe('Em 3 dias · 18h00');
    expect(rotuloDoAvisoNoTopo(evento(), em('2026-11-27T10:00'))).toBe('Amanhã às 18h00');
  });
});

describe('ordem e destaque', () => {
  it('ordena pelo início e escolhe o destaque marcado (ou o mais próximo)', () => {
    const a = evento({ id: 'a', data: '2026-12-01' });
    const b = evento({ id: 'b', data: '2026-11-29', destaque: false });
    const c = evento({ id: 'c', data: '2026-12-10', destaque: true });
    expect(ordenarPorInicio([a, b, c]).map((e) => e.id)).toEqual(['b', 'a', 'c']);
    expect(eventoPrincipal([b, a, c])?.id).toBe('c');
    expect(eventoPrincipal([b, a])?.id).toBe('b');
  });
});

describe('fotos automáticas', () => {
  it('usa a imagem do evento quando existe', () => {
    expect(escolherFoto(evento({ imagem: '/x.jpg' }), new Set())).toBe('/x.jpg');
  });

  it('não repete a mesma foto na página', () => {
    const usadas = new Set<string>();
    const fotos = ['A', 'B', 'C', 'D', 'E'].map((t) => fotoGrande(escolherFoto(evento({ titulo: t }), usadas)));
    expect(new Set(fotos).size).toBe(5);
  });
});

describe('arquivo de agenda (.ics)', () => {
  it('gera horários em UTC e escapa vírgulas e ponto e vírgula', () => {
    const ics = gerarIcs(evento({ titulo: 'Festa, música; alegria' }), 'Rua X, 1', new Date('2026-11-01T12:00:00Z'));
    expect(ics).toContain('DTSTART:20261128T210000Z');
    expect(ics).toContain('DTEND:20261128T223000Z');
    expect(ics).toContain('SUMMARY:Festa\\, música\\; alegria');
    expect(ics.split('\r\n')[0]).toBe('BEGIN:VCALENDAR');
  });

  it('nome de arquivo sem acentos nem espaços', () => {
    expect(nomeDeArquivo('Solenidade de Santa Maria, Mãe de Deus')).toBe('solenidade-de-santa-maria-mae-de-deus');
  });
});
