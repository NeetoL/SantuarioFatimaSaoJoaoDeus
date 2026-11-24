import { z } from 'zod';

export type DadosDeDoacao = {
  /** true enquanto os dados forem fictícios (aparece um aviso na API). */
  exemplo: boolean;
  pix: { tipoDeChave: (typeof TIPOS_DE_CHAVE_PIX)[number]; chave: string };
  banco: { banco: string; agencia: string; conta: string; cnpj: string; titular: string };
  destinos: { percentual: number; titulo: string; descricao: string }[];
};

export const TIPOS_DE_CHAVE_PIX = ['CNPJ', 'CPF', 'E-mail', 'Telefone', 'Aleatória'] as const;

const campo = (max: number, rotulo: string) =>
  z.string().trim().min(1, { error: `Preencha: ${rotulo}.` }).max(max);

/** Validação dos dados de doação (painel e leitura do banco). */
export const esquemaDadosDeDoacao = z.object({
  exemplo: z.boolean(),
  pix: z.object({ tipoDeChave: z.enum(TIPOS_DE_CHAVE_PIX), chave: campo(140, 'chave PIX') }),
  banco: z.object({
    banco: campo(80, 'banco'),
    agencia: campo(20, 'agência'),
    conta: campo(30, 'conta'),
    cnpj: campo(30, 'CNPJ'),
    titular: campo(120, 'titular'),
  }),
  destinos: z
    .array(
      z.object({
        percentual: z.coerce.number().int().min(0).max(100),
        titulo: campo(80, 'destino'),
        descricao: campo(200, 'descrição do destino'),
      }),
    )
    .min(1)
    .max(6)
    .refine((d) => d.reduce((soma, x) => soma + x.percentual, 0) === 100, {
      error: 'Os percentuais do destino das ofertas precisam somar 100%.',
    }),
});

/** Texto codificado no QR Code do PIX (o mesmo do site estático). */
export const textoDoQrCode = (d: Pick<DadosDeDoacao, 'pix'>) => `PIX ${d.pix.chave}`;

/** Os percentuais do destino das ofertas devem somar 100%. */
export function destinosSomam100(d: Pick<DadosDeDoacao, 'destinos'>): boolean {
  return d.destinos.reduce((soma, x) => soma + x.percentual, 0) === 100;
}

export interface RepositorioDeDoacoes {
  obter(): Promise<DadosDeDoacao>;
}

export interface GestaoDeDoacoes extends RepositorioDeDoacoes {
  salvar(dados: DadosDeDoacao): Promise<void>;
}
