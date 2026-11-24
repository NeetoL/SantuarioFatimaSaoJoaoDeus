import { z } from 'zod';
import { esquemaImagem } from '@/shared/Domain/imagem';
import { type Noticia, type Recado, type RepositorioDeNoticias, type RepositorioDeRecados } from './comunicado';

export const esquemaDadosDaNoticia = z.object({
  titulo: z.string().trim().min(3, { error: 'Informe o título.' }).max(140),
  categoria: z.string().trim().min(2, { error: 'Informe a categoria (ex.: Comunidade).' }).max(40),
  data: z.iso.date({ error: 'Informe a data.' }),
  resumo: z.string().trim().min(10, { error: 'Escreva um resumo.' }).max(600),
  imagem: z.union([esquemaImagem, z.literal('')]).transform((v) => (v ? v : undefined)),
  link: z
    .union([
      z.url({ protocol: /^https$/, error: 'O link precisa começar com https://' }).max(400),
      z.literal(''),
    ])
    .transform((v) => (v ? v : undefined)),
});

export const esquemaDadosDoRecado = z.object({
  titulo: z.string().trim().min(3, { error: 'Informe o título.' }).max(100),
  texto: z.string().trim().min(5, { error: 'Escreva o recado.' }).max(400),
  importante: z.boolean(),
});

export interface GestaoDeNoticias extends RepositorioDeNoticias {
  buscarPorId(id: string): Promise<Noticia | null>;
  existe(id: string): Promise<boolean>;
  inserir(noticia: Noticia): Promise<void>;
  atualizar(id: string, noticia: Omit<Noticia, 'id'>): Promise<void>;
  excluir(id: string): Promise<void>;
}

export interface GestaoDeRecados extends RepositorioDeRecados {
  buscarPorId(id: string): Promise<Recado | null>;
  existe(id: string): Promise<boolean>;
  inserir(recado: Recado): Promise<void>;
  atualizar(id: string, recado: Omit<Recado, 'id'>): Promise<void>;
  excluir(id: string): Promise<void>;
}
