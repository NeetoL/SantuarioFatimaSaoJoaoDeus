import { anotador, type Ator, descreverMudancas, type Registrar } from '@/modules/Atividades/Domain/atividade';
import { validar } from '@/shared/Application/validacao';
import { ErroNaoEncontrado } from '@/shared/Domain/erros';
import {
  emReais,
  esquemaContribuicao,
  esquemaDizimista,
  type FiltroDeContribuicoes,
  FORMAS_DE_PAGAMENTO,
  type RepositorioDeContribuicoes,
  type RepositorioDeDizimistas,
  TIPOS_DE_CONTRIBUICAO,
} from '../Domain/secretaria';

const ROTULOS_DIZIMISTA = {
  nome: 'nome',
  telefone: 'telefone',
  email: 'e-mail',
  endereco: 'endereço',
  observacoes: 'observações',
  ativo: 'situação',
};

/**
 * Painel: secretaria (dizimistas e contribuições).
 * Registro de atividades sem dados pessoais: só os campos alterados (LGPD).
 */
export function criarGestaoDaSecretaria({
  dizimistas,
  contribuicoes,
  registrar,
}: {
  dizimistas: RepositorioDeDizimistas;
  contribuicoes: RepositorioDeContribuicoes;
  registrar: Registrar;
}) {
  async function dizimista(id: string) {
    const d = await dizimistas.buscar(id);
    if (!d) throw new ErroNaoEncontrado('Dizimista');
    return d;
  }
  const log = (ator: Ator) => anotador(registrar, ator, 'secretaria');
  /** No registro, o cadastro aparece pelo código (sem nome: dado pessoal fica fora do log). */
  const cadastro = (id: string) => `Cadastro de dizimista nº ${id.slice(0, 8)}`;

  return {
    listarDizimistas: dizimistas.listar.bind(dizimistas),
    buscarDizimista: dizimista,
    contarDizimistasAtivos: () => dizimistas.contarAtivos(),
    historicoDoDizimista: (id: string) => contribuicoes.ultimasDoDizimista(id, 24),

    async criarDizimista(ator: Ator, dados: unknown) {
      const novo = validar(esquemaDizimista, dados);
      const id = await dizimistas.criar(novo);
      await log(ator)('criou', cadastro(id), descreverMudancas(null, novo, ROTULOS_DIZIMISTA, { ocultarValores: true }));
      return id;
    },

    async editarDizimista(ator: Ator, id: string, dados: unknown) {
      const antes = await dizimista(id);
      const depois = validar(esquemaDizimista, dados);
      await dizimistas.atualizar(id, depois);
      await log(ator)('editou', cadastro(id), descreverMudancas(antes, depois, ROTULOS_DIZIMISTA, { ocultarValores: true }));
    },

    async excluirDizimista(ator: Ator, id: string) {
      await dizimista(id);
      await dizimistas.excluir(id);
      await log(ator)('excluiu', cadastro(id), 'As contribuições continuam registradas, sem o vínculo com o cadastro.');
    },

    listarContribuicoes: (filtro: FiltroDeContribuicoes) => contribuicoes.listar(filtro),
    totaisPorMes: (ano: number) => contribuicoes.totaisPorMes(ano),

    async registrarContribuicao(ator: Ator, dados: unknown) {
      const { valor, ...resto } = validar(esquemaContribuicao, dados);
      if (resto.dizimistaId) await dizimista(resto.dizimistaId);
      const id = await contribuicoes.criar({ ...resto, valorCentavos: valor, registradoPor: ator.id });
      await log(ator)(
        'criou',
        `Contribuição: ${TIPOS_DE_CONTRIBUICAO[resto.tipo]} de ${emReais(valor)}`,
        `${FORMAS_DE_PAGAMENTO[resto.forma]} · ${resto.data}${resto.dizimistaId ? ` · do ${cadastro(resto.dizimistaId).toLowerCase()}` : resto.doadorNome ? ' · com nome do doador' : ' · anônima'}`,
      );
      return id;
    },

    async excluirContribuicao(ator: Ator, id: string) {
      const c = await contribuicoes.buscar(id);
      if (!c) throw new ErroNaoEncontrado('Contribuição');
      await contribuicoes.excluir(id);
      await log(ator)('excluiu', `Contribuição: ${TIPOS_DE_CONTRIBUICAO[c.tipo]} de ${emReais(c.valorCentavos)}`, `${FORMAS_DE_PAGAMENTO[c.forma]} · ${c.data}`);
    },
  };
}
