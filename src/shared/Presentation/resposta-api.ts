import { ZodError } from 'zod';
import { type DetalheDeErro, ErroDeAplicacao, ErroLimiteDeRequisicoes, ErroDeValidacao } from '@/shared/Domain/erros';
import { logger } from '@/shared/Infrastructure/logger';

/** Formato padrão de todas as respostas da API. */
export type RespostaSucesso<T> = { success: true; message: string; data: T; meta: unknown };
export type RespostaErro = { success: false; message: string; errors: DetalheDeErro[] };

type Opcoes = { status?: number; message?: string; meta?: unknown; headers?: HeadersInit };

export function respostaSucesso<T>(
  data: T,
  { status = 200, message = 'Operação realizada com sucesso.', meta = null, headers }: Opcoes = {},
) {
  const corpo: RespostaSucesso<T> = { success: true, message, data, meta };
  return Response.json(corpo, { status, headers });
}

export function respostaErro(status: number, message: string, errors: DetalheDeErro[] = [], headers?: HeadersInit) {
  const corpo: RespostaErro = { success: false, message, errors };
  return Response.json(corpo, { status, headers });
}

/** Converte os erros do Zod em detalhes legíveis (campo + mensagem), sem dados internos. */
export function detalhesDoZod(erro: ZodError): DetalheDeErro[] {
  return erro.issues.map((issue) => ({
    campo: issue.path.length ? issue.path.join('.') : undefined,
    mensagem: issue.message,
  }));
}

/**
 * Tratamento centralizado: erros conhecidos viram resposta com a mensagem pública;
 * qualquer outro erro vira 500 genérico (o detalhe vai só para o log, nunca para o usuário).
 */
export function tratarErro(erro: unknown, rota: string) {
  if (erro instanceof ZodError) {
    return tratarErro(new ErroDeValidacao(detalhesDoZod(erro)), rota);
  }
  if (erro instanceof ErroDeAplicacao) {
    const headers: HeadersInit = {};
    if (erro instanceof ErroLimiteDeRequisicoes) headers['Retry-After'] = String(erro.tentarNovamenteEmSegundos);
    if (erro.status >= 500) logger.erro('Erro de aplicação', erro, { rota, codigo: erro.codigo });
    return respostaErro(erro.status, erro.mensagemPublica, erro.detalhes, headers);
  }
  logger.erro('Erro inesperado na API', erro, { rota });
  return respostaErro(500, 'Não foi possível realizar a operação.');
}
