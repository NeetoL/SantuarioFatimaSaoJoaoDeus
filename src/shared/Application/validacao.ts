import { type z } from 'zod';
import { ErroDeValidacao } from '@/shared/Domain/erros';

/** Valida com o Zod; se algo estiver errado, lança ErroDeValidacao com a mensagem de cada campo. */
export function validar<T extends z.ZodType>(esquema: T, dados: unknown): z.infer<T> {
  const resultado = esquema.safeParse(dados);
  if (resultado.success) return resultado.data;
  throw new ErroDeValidacao(
    resultado.error.issues.map((i) => ({
      campo: i.path.length ? i.path.join('.') : undefined,
      mensagem: i.message,
    })),
    'Confira os campos destacados.',
  );
}
