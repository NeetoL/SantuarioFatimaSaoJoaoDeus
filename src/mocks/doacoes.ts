import { type DadosDeDoacao } from '@/modules/Doacoes/Domain/doacao';

/**
 * DOAÇÕES — dados de EXEMPLO (chave PIX, banco e percentuais fictícios, como no site estático).
 * Antes de divulgar, troque pelos dados reais do Santuário.
 */
export const DADOS_DE_DOACAO: DadosDeDoacao = {
  exemplo: true,
  pix: { tipoDeChave: 'CNPJ', chave: '00.000.000/0001-00' },
  banco: {
    banco: 'Banco Exemplo (000)',
    agencia: '0000',
    conta: '00000-0',
    cnpj: '00.000.000/0001-00',
    titular: 'Mitra / Santuário N. S. de Fátima',
  },
  destinos: [
    {
      percentual: 45,
      titulo: 'Manutenção do Santuário',
      descricao: 'Energia, água, conservação do templo e liturgia.',
    },
    { percentual: 35, titulo: 'Obras sociais', descricao: 'Cestas básicas, apoio a famílias e pastoral da saúde.' },
    { percentual: 20, titulo: 'Evangelização', descricao: 'Catequese, formação e comunicação (PASCOM).' },
  ],
};
