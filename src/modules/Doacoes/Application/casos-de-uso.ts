import { destinosSomam100, type RepositorioDeDoacoes, textoDoQrCode } from '../Domain/doacao';

export type DependenciasDeDoacoes = {
  repositorio: RepositorioDeDoacoes;
  gerarQrCodeSvg: (texto: string) => Promise<string>;
};

export function criarCasosDeUsoDeDoacoes({ repositorio, gerarQrCodeSvg }: DependenciasDeDoacoes) {
  return {
    async obter() {
      const dados = await repositorio.obter();
      if (!destinosSomam100(dados)) throw new Error('Os percentuais de destino das doações não somam 100%.');
      return dados;
    },

    async qrCodeDoPix(): Promise<string> {
      return gerarQrCodeSvg(textoDoQrCode(await repositorio.obter()));
    },
  };
}

export type CasosDeUsoDeDoacoes = ReturnType<typeof criarCasosDeUsoDeDoacoes>;
