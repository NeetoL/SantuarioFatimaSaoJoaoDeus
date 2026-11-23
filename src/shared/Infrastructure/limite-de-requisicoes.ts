/**
 * Limite de requisições por cliente (janela deslizante simples).
 *
 * IMPORTANTE — o que esta proteção é e o que não é:
 * - Funciona por instância do servidor. Na Vercel, cada função pode rodar em várias instâncias,
 *   então o limite é "por instância", não global. Ele freia abusos simples (laços, scripts ingênuos).
 * - Para limite global em produção, configure regras de Rate Limiting no Firewall da Vercel
 *   ou troque esta implementação por um armazenamento compartilhado (ex.: Redis) — a interface
 *   `LimitadorDeRequisicoes` continua a mesma.
 */
export interface LimitadorDeRequisicoes {
  consumir(chave: string): { permitido: boolean; tentarNovamenteEmSegundos: number };
}

export class LimitadorEmMemoria implements LimitadorDeRequisicoes {
  private readonly registros = new Map<string, number[]>();

  constructor(
    private readonly maximo: number,
    private readonly janelaMs: number,
    private readonly agora: () => number = Date.now,
  ) {}

  consumir(chave: string) {
    const instante = this.agora();
    const inicioJanela = instante - this.janelaMs;
    const recentes = (this.registros.get(chave) ?? []).filter((t) => t > inicioJanela);

    if (recentes.length >= this.maximo) {
      const maisAntiga = recentes[0] ?? instante;
      this.registros.set(chave, recentes);
      return {
        permitido: false,
        tentarNovamenteEmSegundos: Math.max(1, Math.ceil((maisAntiga + this.janelaMs - instante) / 1000)),
      };
    }

    recentes.push(instante);
    this.registros.set(chave, recentes);
    if (this.registros.size > 5_000) this.limparAntigos(inicioJanela);
    return { permitido: true, tentarNovamenteEmSegundos: 0 };
  }

  private limparAntigos(inicioJanela: number) {
    for (const [chave, tempos] of this.registros) {
      if (!tempos.some((t) => t > inicioJanela)) this.registros.delete(chave);
    }
  }
}

/** Identifica o cliente pelo IP informado pela Vercel (primeiro endereço de x-forwarded-for). */
export function chaveDoCliente(requisicao: Request): string {
  const encaminhado = requisicao.headers.get('x-forwarded-for');
  const ip = encaminhado?.split(',')[0]?.trim() || requisicao.headers.get('x-real-ip') || 'desconhecido';
  return ip;
}
