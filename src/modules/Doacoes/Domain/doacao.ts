export type DadosDeDoacao = {
  /** true enquanto os dados forem fictícios (aparece um aviso na API). */
  exemplo: boolean;
  pix: { tipoDeChave: 'CNPJ' | 'CPF' | 'E-mail' | 'Telefone' | 'Aleatória'; chave: string };
  banco: { banco: string; agencia: string; conta: string; cnpj: string; titular: string };
  destinos: { percentual: number; titulo: string; descricao: string }[];
};

/** Texto codificado no QR Code do PIX (o mesmo do site estático). */
export const textoDoQrCode = (d: Pick<DadosDeDoacao, 'pix'>) => `PIX ${d.pix.chave}`;

/** Os percentuais do destino das ofertas devem somar 100%. */
export function destinosSomam100(d: Pick<DadosDeDoacao, 'destinos'>): boolean {
  return d.destinos.reduce((soma, x) => soma + x.percentual, 0) === 100;
}

export interface RepositorioDeDoacoes {
  obter(): Promise<DadosDeDoacao>;
}
