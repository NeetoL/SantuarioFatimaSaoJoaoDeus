import { z } from 'zod';

export const ASSUNTOS = [
  'Informações gerais',
  'Batismo',
  'Casamento',
  'Intenção de missa',
  'Secretaria paroquial',
  'Outro assunto',
] as const;

/**
 * Mensagem do formulário "Fale conosco".
 * O site não guarda nem envia a mensagem: ele monta um e-mail pronto no aplicativo da pessoa
 * (mesmo comportamento do site estático). Nenhum dado pessoal passa pelo servidor.
 */
export const esquemaMensagemDeContato = z.object({
  nome: z.string().trim().min(2, 'Informe seu nome.').max(100, 'Nome muito longo.'),
  telefone: z
    .string()
    .trim()
    .max(30, 'Telefone muito longo.')
    .regex(/^[\d\s()+-]*$/, 'Use apenas números, espaços, parênteses e hífen.')
    .optional()
    .or(z.literal('')),
  assunto: z.enum(ASSUNTOS, { error: 'Escolha um assunto.' }),
  mensagem: z.string().trim().min(5, 'Escreva sua mensagem.').max(2000, 'Mensagem muito longa (máx. 2000 caracteres).'),
});

export type MensagemDeContato = z.infer<typeof esquemaMensagemDeContato>;

/** Link mailto: com assunto e corpo prontos para o e-mail do Santuário. */
export function montarLinkDeEmail(dados: MensagemDeContato, emailDoSantuario: string): string {
  const assunto = `[Site] ${dados.assunto} — ${dados.nome}`;
  const corpo = `${dados.mensagem}\n\n—\n${dados.nome}${dados.telefone ? `\nTelefone/WhatsApp: ${dados.telefone}` : ''}`;
  return `mailto:${emailDoSantuario}?subject=${encodeURIComponent(assunto)}&body=${encodeURIComponent(corpo)}`;
}
