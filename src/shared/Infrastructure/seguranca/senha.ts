import { createHash, randomBytes, scrypt as scryptCallback, timingSafeEqual, type ScryptOptions } from 'node:crypto';

/**
 * Senhas: guardadas só como resumo scrypt (com sal aleatório). Ninguém — nem o banco — conhece a senha.
 * Formato: scrypt$N$r$p$sal$resumo (base64url).
 */
const PARAMETROS = { N: 32768, r: 8, p: 1 } as const;
const TAMANHO = 64;
const MEMORIA_MAXIMA = 96 * 1024 * 1024;

function scrypt(senha: string, sal: Buffer, opcoes: ScryptOptions): Promise<Buffer> {
  return new Promise((resolver, rejeitar) =>
    scryptCallback(senha.normalize('NFKC'), sal, TAMANHO, opcoes, (erro, chave) =>
      erro ? rejeitar(erro) : resolver(chave),
    ),
  );
}

export async function gerarResumoDeSenha(senha: string): Promise<string> {
  const sal = randomBytes(16);
  const { N, r, p } = PARAMETROS;
  const resumo = await scrypt(senha, sal, { N, r, p, maxmem: MEMORIA_MAXIMA });
  return ['scrypt', N, r, p, sal.toString('base64url'), resumo.toString('base64url')].join('$');
}

export async function senhaConfere(senha: string, guardado: string): Promise<boolean> {
  const [algoritmo, n, r, p, sal, resumo] = guardado.split('$');
  if (algoritmo !== 'scrypt' || !n || !r || !p || !sal || !resumo) return false;
  const esperado = Buffer.from(resumo, 'base64url');
  const calculado = await scrypt(senha, Buffer.from(sal, 'base64url'), {
    N: Number(n),
    r: Number(r),
    p: Number(p),
    maxmem: MEMORIA_MAXIMA,
  });
  return esperado.length === calculado.length && timingSafeEqual(esperado, calculado);
}

/** Resumo de uma senha qualquer, usado quando o e-mail não existe (o tempo de resposta fica igual). */
let resumoFalso: Promise<string> | undefined;
export function resumoDeSenhaFalso(): Promise<string> {
  resumoFalso ??= gerarResumoDeSenha(randomBytes(18).toString('base64url'));
  return resumoFalso;
}

/** Código aleatório e forte (cookie da sessão, senhas temporárias). */
export const codigoAleatorio = (bytes = 32) => randomBytes(bytes).toString('base64url');

/** Resumo SHA-256: o que fica no banco no lugar do código da sessão. */
export const resumir = (texto: string) => createHash('sha256').update(texto).digest('base64url');

/** Senha temporária legível (sem letras parecidas), para o admin entregar a quem vai usar o painel. */
export function senhaTemporaria(): string {
  const letras = 'abcdefghjkmnpqrstuvwxyzABCDEFGHJKMNPQRSTUVWXYZ23456789';
  const bytes = randomBytes(14);
  let senha = '';
  for (const b of bytes) senha += letras[b % letras.length];
  return `${senha.slice(0, 5)}-${senha.slice(5, 10)}-${senha.slice(10)}`;
}
