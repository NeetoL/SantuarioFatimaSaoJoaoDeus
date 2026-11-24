import { z } from 'zod';
import { pad2 } from '@/lib/datas';
import { esquemaImagem } from '@/shared/Domain/imagem';
import { CATEGORIAS_DE_EVENTO, type Evento } from './evento';
import { type RepositorioDeEventos } from './repositorio';

/** "19h", "19h30", "9h" → "19h00", "19h30", "09h00" (como os eventos já cadastrados). */
export function normalizarHora(hora: string): string | null {
  const m = /^\s*(\d{1,2})\s*h\s*(\d{2})?\s*$/i.exec(hora);
  if (!m) return null;
  const h = Number(m[1]);
  const min = Number(m[2] ?? 0);
  if (h > 23 || min > 59) return null;
  return `${pad2(h)}h${pad2(min)}`;
}

/** Validação do formulário de evento do painel. */
export const esquemaDadosDoEvento = z.object({
  titulo: z.string().trim().min(3, { error: 'Informe o título.' }).max(120),
  categoria: z.enum(CATEGORIAS_DE_EVENTO, { error: 'Escolha a categoria.' }),
  data: z.iso.date({ error: 'Informe a data.' }),
  hora: z
    .string()
    .transform((h, ctx) => {
      const normal = normalizarHora(h);
      if (!normal) ctx.addIssue({ code: 'custom', message: 'Hora no formato 19h ou 19h30.' });
      return normal ?? h;
    }),
  local: z.string().trim().min(2, { error: 'Informe o local.' }).max(120),
  descricao: z.string().trim().min(5, { error: 'Escreva uma descrição curta.' }).max(600),
  destaque: z.boolean(),
  imagem: z.union([esquemaImagem, z.literal('')]).transform((v) => (v ? v : undefined)),
});
export type DadosDoEvento = z.infer<typeof esquemaDadosDoEvento>;

export interface GestaoDeEventos extends RepositorioDeEventos {
  listarParaPainel(): Promise<Evento[]>;
  existe(id: string): Promise<boolean>;
  inserir(evento: Evento): Promise<void>;
  atualizar(id: string, evento: Omit<Evento, 'id'>): Promise<void>;
  excluir(id: string): Promise<void>;
}
