import { achatar, anotador, type Ator, descreverMudancas, type Registrar } from '@/modules/Atividades/Domain/atividade';
import { validar } from '@/shared/Application/validacao';
import { esquemaDadosDeDoacao, type GestaoDeDoacoes } from '../Domain/doacao';

const ROTULOS: Record<string, string> = {
  exemplo: 'Dados de exemplo',
  'pix.tipoDeChave': 'Tipo da chave PIX',
  'pix.chave': 'Chave PIX',
  'banco.banco': 'Banco',
  'banco.agencia': 'Agência',
  'banco.conta': 'Conta',
  'banco.cnpj': 'CNPJ',
  'banco.titular': 'Titular',
};

/** Painel: dados de doação mostrados no site (PIX, conta e destino das ofertas). */
export function criarGestaoDeDoacoes({ repositorio, registrar }: { repositorio: GestaoDeDoacoes; registrar: Registrar }) {
  return {
    obter: () => repositorio.obter(),

    async salvar(ator: Ator, dados: unknown) {
      const novo = validar(esquemaDadosDeDoacao, dados);
      const antes = await repositorio.obter();
      await repositorio.salvar(novo);
      const destinosMudaram = JSON.stringify(antes.destinos) !== JSON.stringify(novo.destinos);
      const detalhe = descreverMudancas(achatar(antes), achatar(novo), ROTULOS);
      await anotador(registrar, ator, 'doacoes')(
        'editou',
        'Dados de doação',
        destinosMudaram ? `${detalhe === 'Nenhuma mudança.' ? '' : `${detalhe}; `}Destino das ofertas alterado.` : detalhe,
      );
    },
  };
}
