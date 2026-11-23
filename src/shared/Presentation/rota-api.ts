import { type z } from 'zod';
import { ErroLimiteDeRequisicoes, ErroMetodoNaoPermitido } from '@/shared/Domain/erros';
import { chaveDoCliente, LimitadorEmMemoria } from '@/shared/Infrastructure/limite-de-requisicoes';
import { tratarErro } from '@/shared/Presentation/resposta-api';

/** Limite padrão das rotas públicas: 120 requisições por minuto, por cliente (por instância). */
const limitadorPadrao = new LimitadorEmMemoria(120, 60_000);

type Contexto<P> = { params: Promise<P> };
type Manipulador<P> = (requisicao: Request, contexto: Contexto<P>) => Promise<Response> | Response;

/**
 * Envolve um Route Handler com: limite de requisições, tratamento centralizado de erros
 * e cabeçalhos padrão (sem cache no navegador; CDN pode guardar por pouco tempo).
 */
export function rotaPublica<P = Record<string, never>>(
  nome: string,
  manipulador: Manipulador<P>,
  { cacheSegundos = 60 } = {},
) {
  return async (requisicao: Request, contexto: Contexto<P>): Promise<Response> => {
    try {
      const uso = limitadorPadrao.consumir(`${nome}:${chaveDoCliente(requisicao)}`);
      if (!uso.permitido) throw new ErroLimiteDeRequisicoes(uso.tentarNovamenteEmSegundos);

      const resposta = await manipulador(requisicao, contexto);
      if (resposta.ok && !resposta.headers.has('Cache-Control')) {
        resposta.headers.set(
          'Cache-Control',
          `public, max-age=0, s-maxage=${cacheSegundos}, stale-while-revalidate=${cacheSegundos * 5}`,
        );
      }
      return resposta;
    } catch (erro) {
      return tratarErro(erro, nome);
    }
  };
}

/** Lê e valida a query string com um esquema Zod (campos desconhecidos são ignorados). */
export function lerQuery<E extends z.ZodType>(requisicao: Request, esquema: E): z.infer<E> {
  const parametros = Object.fromEntries(new URL(requisicao.url).searchParams);
  return esquema.parse(parametros);
}

/** Respostas padronizadas para métodos que a API pública não aceita (POST, PUT, PATCH, DELETE). */
const naoPermitido = () => tratarErro(new ErroMetodoNaoPermitido(), 'metodo');
export const metodosSomenteLeitura = {
  POST: naoPermitido,
  PUT: naoPermitido,
  PATCH: naoPermitido,
  DELETE: naoPermitido,
};
