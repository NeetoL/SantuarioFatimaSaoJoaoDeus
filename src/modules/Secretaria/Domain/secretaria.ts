import { z } from 'zod';
import { textoOpcional } from '@/shared/Domain/imagem';

/**
 * SECRETARIA — dizimistas e contribuições recebidas.
 * São dados pessoais (LGPD): só Secretaria, Padre e Admin master acessam, e o registro de atividades
 * guarda quais campos mudaram, nunca os valores pessoais.
 */
export const TIPOS_DE_CONTRIBUICAO = {
  dizimo: 'Dízimo',
  oferta: 'Oferta',
  doacao: 'Doação',
  campanha: 'Campanha',
} as const;
export type TipoDeContribuicao = keyof typeof TIPOS_DE_CONTRIBUICAO;

export const FORMAS_DE_PAGAMENTO = {
  pix: 'PIX',
  dinheiro: 'Dinheiro',
  transferencia: 'Transferência',
  cartao: 'Cartão',
  outro: 'Outro',
} as const;
export type FormaDePagamento = keyof typeof FORMAS_DE_PAGAMENTO;

export type Dizimista = {
  id: string;
  nome: string;
  telefone?: string;
  email?: string;
  endereco?: string;
  observacoes?: string;
  ativo: boolean;
  criadoEm: Date;
};

export type Contribuicao = {
  id: string;
  tipo: TipoDeContribuicao;
  valorCentavos: number;
  /** 'AAAA-MM-DD' */
  data: string;
  forma: FormaDePagamento;
  dizimistaId?: string;
  dizimistaNome?: string;
  /** Quem doou, quando não é um dizimista cadastrado (vazio = anônimo). */
  doadorNome?: string;
  observacao?: string;
  criadoEm: Date;
};

/** "1.234,56" / "1234.56" / "50" → 123456 centavos (null se inválido). */
export function paraCentavos(texto: string): number | null {
  const limpo = texto.replace(/[R$\s]/g, '');
  if (!/^\d{1,3}(\.\d{3})*(,\d{1,2})?$|^\d+([.,]\d{1,2})?$/.test(limpo)) return null;
  const normal = limpo.includes(',') ? limpo.replace(/\./g, '').replace(',', '.') : limpo;
  const valor = Math.round(Number(normal) * 100);
  return Number.isFinite(valor) ? valor : null;
}

/** 123456 → "R$ 1.234,56" */
export const emReais = (centavos: number) =>
  (centavos / 100).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

const telefone = z
  .string()
  .trim()
  .max(30)
  .regex(/^[\d\s()+-]*$/, { error: 'Telefone só com números, espaços, parênteses e traço.' })
  .optional()
  .transform((v) => (v ? v : undefined));

export const esquemaDizimista = z.object({
  nome: z.string().trim().min(2, { error: 'Informe o nome.' }).max(120),
  telefone,
  email: z
    .union([z.email({ error: 'E-mail inválido.' }).max(160), z.literal('')])
    .optional()
    .transform((v) => (v ? v.toLowerCase() : undefined)),
  endereco: textoOpcional(200),
  observacoes: textoOpcional(500),
  ativo: z.boolean(),
});
export type DadosDoDizimista = z.infer<typeof esquemaDizimista>;

export const esquemaContribuicao = z
  .object({
    tipo: z.enum(Object.keys(TIPOS_DE_CONTRIBUICAO) as [TipoDeContribuicao], { error: 'Escolha o tipo.' }),
    valor: z.string().transform((v, ctx) => {
      const centavos = paraCentavos(v);
      if (!centavos || centavos <= 0 || centavos > 100_000_000) {
        ctx.addIssue({ code: 'custom', message: 'Valor inválido (ex.: 50,00).' });
        return 0;
      }
      return centavos;
    }),
    data: z.iso.date({ error: 'Informe a data.' }),
    forma: z.enum(Object.keys(FORMAS_DE_PAGAMENTO) as [FormaDePagamento], { error: 'Escolha a forma.' }),
    dizimistaId: z.union([z.uuid(), z.literal('')]).transform((v) => (v ? v : undefined)),
    doadorNome: textoOpcional(120),
    observacao: textoOpcional(300),
  })
  .refine((c) => !(c.dizimistaId && c.doadorNome), {
    path: ['doadorNome'],
    error: 'Escolha um dizimista ou escreva o nome de quem doou — não os dois.',
  });
export type DadosDaContribuicao = z.infer<typeof esquemaContribuicao>;

export type FiltroDeContribuicoes = { mes: string; tipo?: TipoDeContribuicao; dizimistaId?: string };

export interface RepositorioDeDizimistas {
  listar(filtro: { busca?: string; situacao?: 'ativos' | 'inativos' | 'todos' }): Promise<Dizimista[]>;
  buscar(id: string): Promise<Dizimista | null>;
  criar(dados: DadosDoDizimista): Promise<string>;
  atualizar(id: string, dados: DadosDoDizimista): Promise<void>;
  excluir(id: string): Promise<void>;
  contarAtivos(): Promise<number>;
}

export interface RepositorioDeContribuicoes {
  listar(filtro: FiltroDeContribuicoes): Promise<Contribuicao[]>;
  buscar(id: string): Promise<Contribuicao | null>;
  criar(dados: Omit<DadosDaContribuicao, 'valor'> & { valorCentavos: number; registradoPor: string }): Promise<string>;
  excluir(id: string): Promise<void>;
  /** Total por mês ('AAAA-MM') de um ano. */
  totaisPorMes(ano: number): Promise<{ mes: string; totalCentavos: number; quantidade: number }[]>;
  ultimasDoDizimista(dizimistaId: string, limite: number): Promise<Contribuicao[]>;
}
