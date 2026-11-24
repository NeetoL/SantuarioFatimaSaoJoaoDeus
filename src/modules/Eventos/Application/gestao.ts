import { anotador, type Ator, descreverMudancas, type Registrar } from '@/modules/Atividades/Domain/atividade';
import { identificadorLivre, slug } from '@/lib/texto';
import { validar } from '@/shared/Application/validacao';
import { ErroNaoEncontrado } from '@/shared/Domain/erros';
import { type Evento } from '../Domain/evento';
import { esquemaDadosDoEvento, type GestaoDeEventos } from '../Domain/gestao';

const ROTULOS: Partial<Record<keyof Evento, string>> = {
  titulo: 'Título',
  categoria: 'Categoria',
  data: 'Data',
  hora: 'Hora',
  local: 'Local',
  descricao: 'Descrição',
  destaque: 'Destaque',
  imagem: 'Foto',
};

/** Painel: eventos da agenda (criar, editar, excluir), com registro de cada mudança. */
export function criarGestaoDeEventos({ repositorio, registrar }: { repositorio: GestaoDeEventos; registrar: Registrar }) {
  async function buscar(id: string) {
    const evento = await repositorio.buscarPorId(id);
    if (!evento) throw new ErroNaoEncontrado('Evento');
    return evento;
  }

  return {
    listar: () => repositorio.listarParaPainel(),
    buscar,

    async criar(ator: Ator, dados: unknown) {
      const novo = validar(esquemaDadosDoEvento, dados);
      const id = await identificadorLivre(`${novo.data}-${slug(novo.titulo)}`, (c) => repositorio.existe(c));
      await repositorio.inserir({ id, ...novo });
      await anotador(registrar, ator, 'eventos')('criou', novo.titulo, `${novo.categoria} · ${novo.data} às ${novo.hora} · ${novo.local}`);
      return id;
    },

    async editar(ator: Ator, id: string, dados: unknown) {
      const antes = await buscar(id);
      const depois = validar(esquemaDadosDoEvento, dados);
      await repositorio.atualizar(id, depois);
      await anotador(registrar, ator, 'eventos')(
        'editou',
        depois.titulo,
        descreverMudancas<Evento>({ ...antes, destaque: Boolean(antes.destaque) }, { id, ...depois }, ROTULOS),
      );
    },

    async excluir(ator: Ator, id: string) {
      const evento = await buscar(id);
      await repositorio.excluir(id);
      await anotador(registrar, ator, 'eventos')('excluiu', evento.titulo, `${evento.categoria} · ${evento.data} às ${evento.hora}`);
    },
  };
}

export type GestaoDeEventosDoPainel = ReturnType<typeof criarGestaoDeEventos>;
