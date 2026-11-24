/** Resposta de um formulário do painel (mensagem geral + erro de cada campo). Usado no servidor e na tela. */
export type EstadoDoFormulario = {
  ok: boolean;
  mensagem: string;
  erros: Record<string, string>;
  /** Dado extra para a tela (ex.: senha temporária, endereço da foto enviada). */
  extra?: Record<string, string | number>;
  /** Muda a cada envio, para a tela reagir mesmo quando a mensagem se repete. */
  vez: number;
};

export const ESTADO_INICIAL: EstadoDoFormulario = { ok: false, mensagem: '', erros: {}, vez: 0 };

export type AcaoDeFormulario = (estado: EstadoDoFormulario, dados: FormData) => Promise<EstadoDoFormulario>;
