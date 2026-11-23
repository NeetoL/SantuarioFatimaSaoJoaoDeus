import { type DadosInstitucionais } from '@/modules/Institucional/Domain/institucional';

/**
 * DADOS INSTITUCIONAIS — reais e públicos (endereço, telefone e e-mail da secretaria).
 * As redes sociais ainda apontam para as páginas iniciais (exemplo): troque pelos perfis do Santuário.
 */
export const DADOS_INSTITUCIONAIS: DadosInstitucionais = {
  nome: 'Santuário Arquidiocesano Nossa Senhora de Fátima e São João de Deus',
  nomeCurto: 'Santuário N. Sra. de Fátima e S. João de Deus',
  endereco: {
    logradouro: 'Estrada Manuel Nogueira de Sá, 1421',
    bairro: 'Realengo',
    cidade: 'Rio de Janeiro',
    uf: 'RJ',
  },
  coordenadas: { latitude: -22.892126, longitude: -43.417065 },
  telefone: { exibicao: '(21) 96432-2134', internacional: '+5521964322134' },
  email: 'fatimaejoaodedeus@arqrio.org.br',
  redesSociais: [
    { rede: 'Instagram', url: 'https://instagram.com/', rotulo: 'Instagram do Santuário' },
    { rede: 'YouTube', url: 'https://youtube.com/', rotulo: 'Canal do Santuário no YouTube' },
    { rede: 'Facebook', url: 'https://facebook.com/', rotulo: 'Facebook do Santuário' },
  ],
};
