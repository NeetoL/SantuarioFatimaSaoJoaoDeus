/**
 * Log estruturado (JSON, uma linha por evento) para os logs da Vercel.
 * Regra: nunca registrar dados pessoais (nome, telefone, e-mail, IP completo) nem segredos.
 */
type Nivel = 'info' | 'warn' | 'error';
type Contexto = Record<string, string | number | boolean | null | undefined>;

function registrar(nivel: Nivel, mensagem: string, contexto: Contexto = {}) {
  const linha = JSON.stringify({ nivel, mensagem, ...contexto, em: new Date().toISOString() });
  if (nivel === 'error') console.error(linha);
  else if (nivel === 'warn') console.warn(linha);
  else console.info(linha);
}

export const logger = {
  info: (mensagem: string, contexto?: Contexto) => registrar('info', mensagem, contexto),
  aviso: (mensagem: string, contexto?: Contexto) => registrar('warn', mensagem, contexto),
  erro: (mensagem: string, erro: unknown, contexto?: Contexto) =>
    registrar('error', mensagem, {
      ...contexto,
      tipo: erro instanceof Error ? erro.name : typeof erro,
      // Só a mensagem técnica (sem pilha) — suficiente para investigar e sem expor caminhos do servidor.
      detalhe: erro instanceof Error ? erro.message.slice(0, 300) : undefined,
    }),
};
