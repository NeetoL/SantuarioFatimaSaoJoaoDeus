/**
 * Erros de aplicação com mensagem pública (pode ir para o usuário) e status HTTP.
 * Detalhes internos NUNCA entram na mensagem: ficam só no log do servidor.
 */
export type DetalheDeErro = { campo?: string; mensagem: string };

export class ErroDeAplicacao extends Error {
  constructor(
    public readonly mensagemPublica: string,
    public readonly status: number,
    public readonly codigo: string,
    public readonly detalhes: DetalheDeErro[] = [],
  ) {
    super(mensagemPublica);
    this.name = new.target.name;
  }
}

export class ErroDeValidacao extends ErroDeAplicacao {
  constructor(detalhes: DetalheDeErro[], mensagem = 'Os dados enviados são inválidos.') {
    super(mensagem, 400, 'VALIDACAO', detalhes);
  }
}

export class ErroNaoEncontrado extends ErroDeAplicacao {
  constructor(recurso: string) {
    super(`${recurso} não encontrado.`, 404, 'NAO_ENCONTRADO');
  }
}

export class ErroLimiteDeRequisicoes extends ErroDeAplicacao {
  constructor(public readonly tentarNovamenteEmSegundos: number) {
    super('Muitas requisições. Tente novamente em instantes.', 429, 'LIMITE_DE_REQUISICOES');
  }
}

export class ErroMetodoNaoPermitido extends ErroDeAplicacao {
  constructor() {
    super('Método não permitido para este endereço.', 405, 'METODO_NAO_PERMITIDO');
  }
}
