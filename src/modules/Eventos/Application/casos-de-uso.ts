import { type Paginacao, paginar } from '@/shared/Application/paginacao';
import { ErroNaoEncontrado } from '@/shared/Domain/erros';
import { type CategoriaDeEvento, type Evento, estaVisivel, eventoPrincipal, ordenarPorInicio } from '../Domain/evento';
import { escolherFoto, fotoGrande } from '../Domain/fotos';
import { gerarIcs, nomeDeArquivo } from '../Domain/ics';
import { type RepositorioDeEventos } from '../Domain/repositorio';

/** Evento pronto para exibir, com a foto já escolhida (sem repetir na mesma página). */
export type EventoComFoto = Evento & { foto: string };

export type DependenciasDeEventos = {
  repositorio: RepositorioDeEventos;
  /** Endereço do Santuário para o arquivo de agenda (vem do módulo Institucional). */
  enderecoCompleto: () => Promise<string>;
};

export function criarCasosDeUsoDeEventos({ repositorio, enderecoCompleto }: DependenciasDeEventos) {
  /** Eventos que ainda estão no site (até 2 h depois de começar), do mais próximo ao mais distante. */
  async function proximos(agora: Date): Promise<Evento[]> {
    const todos = await repositorio.listarTodos();
    return ordenarPorInicio(todos.filter((ev) => estaVisivel(ev, agora)));
  }

  async function buscar(id: string): Promise<Evento> {
    const evento = await repositorio.buscarPorId(id);
    if (!evento) throw new ErroNaoEncontrado('Evento');
    return evento;
  }

  return {
    buscar,

    /** API: próximos eventos, com filtro por categoria e paginação. */
    async listarProximos({
      agora,
      categoria,
      paginacao,
    }: {
      agora: Date;
      categoria?: CategoriaDeEvento;
      paginacao: Paginacao;
    }) {
      const lista = (await proximos(agora)).filter((ev) => !categoria || ev.categoria === categoria);
      return paginar(lista, paginacao);
    },

    /** Arquivo .ics para "Salvar na agenda". */
    async arquivoDeAgenda(id: string, agora: Date) {
      const evento = await buscar(id);
      return {
        nomeDoArquivo: `${nomeDeArquivo(evento.titulo)}.ics`,
        conteudo: gerarIcs(evento, await enderecoCompleto(), agora),
      };
    },

    /** Página inicial: destaque + 3 seguintes + total + o mais próximo (aviso sobre o vídeo). */
    async resumoDaPaginaInicial(agora: Date) {
      const lista = await proximos(agora);
      const principal = eventoPrincipal(lista);
      if (!principal) return null;
      const usadas = new Set<string>();
      const destaque: EventoComFoto = { ...principal, foto: fotoGrande(escolherFoto(principal, usadas)) };
      const seguintes: EventoComFoto[] = lista
        .filter((ev) => ev.id !== principal.id)
        .slice(0, 3)
        .map((ev) => ({ ...ev, foto: escolherFoto(ev, usadas) }));
      return { destaque, seguintes, total: lista.length, maisProximo: lista[0] ?? principal };
    },

    /** Página Eventos: destaque + agenda completa + categorias que têm evento (para os filtros). */
    async agendaCompleta(agora: Date) {
      const lista = await proximos(agora);
      const principal = eventoPrincipal(lista);
      if (!principal) return null;
      const destaque: EventoComFoto = { ...principal, foto: fotoGrande(escolherFoto(principal, new Set())) };
      const usadas = new Set([fotoGrande(destaque.foto)]); // a agenda não repete a foto do destaque
      const eventos: EventoComFoto[] = lista.map((ev) => ({ ...ev, foto: escolherFoto(ev, usadas) }));
      const categorias = [...new Set(lista.map((ev) => ev.categoria))];
      return { destaque, eventos, categorias };
    },

    /** Página Missas: próximas celebrações especiais (eventos da categoria Missa). */
    async missasEspeciais(agora: Date, limite = 3): Promise<EventoComFoto[]> {
      const usadas = new Set<string>();
      return (await proximos(agora))
        .filter((ev) => ev.categoria === 'Missa')
        .slice(0, limite)
        .map((ev) => ({ ...ev, foto: escolherFoto(ev, usadas) }));
    },
  };
}

export type CasosDeUsoDeEventos = ReturnType<typeof criarCasosDeUsoDeEventos>;
