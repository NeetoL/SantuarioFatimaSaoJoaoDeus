import { describe, expect, it } from 'vitest';
import { esquemaMensagemDeContato, montarLinkDeEmail } from './mensagem';

describe('mensagem de contato', () => {
  it('aceita dados válidos e remove espaços', () => {
    const r = esquemaMensagemDeContato.parse({
      nome: '  Maria  ',
      telefone: '(21) 99999-0000',
      assunto: 'Batismo',
      mensagem: 'Olá, gostaria de informações.',
    });
    expect(r.nome).toBe('Maria');
  });

  it('recusa nome vazio, assunto desconhecido, telefone com letras e campos a mais não passam', () => {
    const r = esquemaMensagemDeContato.safeParse({
      nome: '',
      telefone: 'abc',
      assunto: 'Spam',
      mensagem: 'x',
      admin: true,
    });
    expect(r.success).toBe(false);
    if (!r.success)
      expect(r.error.issues.map((i) => i.path[0]).sort()).toEqual(['assunto', 'mensagem', 'nome', 'telefone']);
    const ok = esquemaMensagemDeContato.parse({
      nome: 'Ana',
      assunto: 'Outro assunto',
      mensagem: 'Mensagem ok',
      admin: true,
    });
    expect('admin' in ok).toBe(false);
  });

  it('monta o e-mail com assunto e corpo codificados', () => {
    const link = montarLinkDeEmail(
      { nome: 'Ana', telefone: '', assunto: 'Batismo', mensagem: 'Oi & tchau' },
      'santuario@exemplo.org',
    );
    expect(link.startsWith('mailto:santuario@exemplo.org?subject=')).toBe(true);
    expect(decodeURIComponent(link.split('subject=')[1]!.split('&')[0]!)).toBe('[Site] Batismo — Ana');
    expect(link).toContain(encodeURIComponent('Oi & tchau'));
  });
});
