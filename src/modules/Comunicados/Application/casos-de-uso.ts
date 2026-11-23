import { type Paginacao, paginar } from '@/shared/Application/paginacao';
import {
  linkSeguro,
  type Noticia,
  ordenarPorData,
  ordenarRecados,
  type RepositorioDeNoticias,
  type RepositorioDeRecados,
} from '../Domain/comunicado';

export function criarCasosDeUsoDeComunicados(noticias: RepositorioDeNoticias, recados: RepositorioDeRecados) {
  /** Notícias da mais recente para a mais antiga, com links inseguros descartados. */
  async function ordenadas(): Promise<Noticia[]> {
    return ordenarPorData(await noticias.listar()).map((n) => ({ ...n, link: linkSeguro(n.link) }));
  }

  return {
    async listarNoticias({ categoria, paginacao }: { categoria?: string; paginacao: Paginacao }) {
      const lista = (await ordenadas()).filter(
        (n) => !categoria || n.categoria.toLowerCase() === categoria.toLowerCase(),
      );
      return paginar(lista, paginacao);
    },

    /** Página inicial: as N mais recentes. */
    async ultimasNoticias(quantidade: number) {
      return (await ordenadas()).slice(0, quantidade);
    },

    /** Página Notícias: a mais recente em destaque e as demais. */
    async noticiasDaPagina() {
      const [destaque, ...demais] = await ordenadas();
      return { destaque: destaque ?? null, demais };
    },

    /** Recados com os importantes primeiro. */
    async listarRecados(limite?: number) {
      const lista = ordenarRecados(await recados.listar());
      return limite ? lista.slice(0, limite) : lista;
    },
  };
}

export type CasosDeUsoDeComunicados = ReturnType<typeof criarCasosDeUsoDeComunicados>;
