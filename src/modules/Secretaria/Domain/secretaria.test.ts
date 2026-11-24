import { describe, expect, it } from 'vitest';
import { descreverMudancas } from '@/modules/Atividades/Domain/atividade';
import { normalizarHora } from '@/modules/Eventos/Domain/gestao';
import { emReais, paraCentavos } from './secretaria';

describe('valores em reais', () => {
  it.each([
    ['50', 5000],
    ['50,5', 5050],
    ['1.234,56', 123456],
    ['R$ 1.234,56', 123456],
    ['1234.56', 123456],
    ['0,01', 1],
  ])('"%s" → %i centavos', (texto, centavos) => expect(paraCentavos(texto)).toBe(centavos));

  it.each(['', 'abc', '1,234,56', '12,345', '-10'])('recusa "%s"', (texto) => expect(paraCentavos(texto)).toBeNull());

  it('mostra em reais', () => expect(emReais(123456).replace(/\s/g, ' ')).toBe('R$ 1.234,56'));
});

describe('registro de mudanças', () => {
  const rotulos = { nome: 'Nome', telefone: 'Telefone', ativo: 'Ativo' };

  it('mostra antes → depois só do que mudou', () => {
    expect(descreverMudancas({ nome: 'A', telefone: '1', ativo: true }, { nome: 'B', telefone: '1', ativo: false }, rotulos)).toBe(
      'Alterado: Nome: A → B; Ativo: sim → não',
    );
  });

  it('com dados pessoais, só os nomes dos campos', () => {
    const texto = descreverMudancas({ nome: 'Maria' }, { nome: 'Maria José' }, rotulos, { ocultarValores: true });
    expect(texto).not.toContain('Maria');
    expect(texto).toContain('Nome');
  });

  it('sem mudança', () => expect(descreverMudancas({ nome: 'A' }, { nome: 'A' }, { nome: 'Nome' })).toBe('Nenhuma mudança.'));
});

describe('hora do evento', () => {
  it.each([
    ['19h', '19h00'],
    ['9h', '09h00'],
    ['19h30', '19h30'],
    [' 7 h 05 ', '07h05'],
  ])('"%s" → "%s"', (entrada, saida) => expect(normalizarHora(entrada)).toBe(saida));

  it.each(['25h', '19h60', '19:30', ''])('recusa "%s"', (entrada) => expect(normalizarHora(entrada)).toBeNull());
});
