import { anotador, type Ator, descreverMudancas, type Registrar } from '@/modules/Atividades/Domain/atividade';
import { identificadorLivre, slug } from '@/lib/texto';
import { validar } from '@/shared/Application/validacao';
import { ErroNaoEncontrado } from '@/shared/Domain/erros';
import { type Noticia, ordenarPorData, ordenarRecados, type Recado } from '../Domain/comunicado';
import { esquemaDadosDaNoticia, esquemaDadosDoRecado, type GestaoDeNoticias, type GestaoDeRecados } from '../Domain/gestao';

const ROTULOS_NOTICIA: Partial<Record<keyof Noticia, string>> = {
  titulo: 'Título',
  categoria: 'Categoria',
  data: 'Data',
  resumo: 'Resumo',
  imagem: 'Foto',
  link: 'Link',
};
const ROTULOS_RECADO: Partial<Record<keyof Recado, string>> = { titulo: 'Título', texto: 'Texto', importante: 'Importante' };

/** Painel: notícias e recados paroquiais, com registro de cada mudança. */
export function criarGestaoDeComunicados({
  noticias,
  recados,
  registrar,
}: {
  noticias: GestaoDeNoticias;
  recados: GestaoDeRecados;
  registrar: Registrar;
}) {
  async function noticia(id: string) {
    const n = await noticias.buscarPorId(id);
    if (!n) throw new ErroNaoEncontrado('Notícia');
    return n;
  }
  async function recado(id: string) {
    const r = await recados.buscarPorId(id);
    if (!r) throw new ErroNaoEncontrado('Recado');
    return r;
  }

  return {
    listarNoticias: async () => ordenarPorData(await noticias.listar()),
    buscarNoticia: noticia,
    listarRecados: async () => ordenarRecados(await recados.listar()),
    buscarRecado: recado,

    async criarNoticia(ator: Ator, dados: unknown) {
      const nova = validar(esquemaDadosDaNoticia, dados);
      const id = await identificadorLivre(`${nova.data}-${slug(nova.titulo)}`, (c) => noticias.existe(c));
      await noticias.inserir({ id, ...nova });
      await anotador(registrar, ator, 'comunicados')('criou', `Notícia: ${nova.titulo}`, `${nova.categoria} · ${nova.data}`);
      return id;
    },
    async editarNoticia(ator: Ator, id: string, dados: unknown) {
      const antes = await noticia(id);
      const depois = validar(esquemaDadosDaNoticia, dados);
      await noticias.atualizar(id, depois);
      await anotador(registrar, ator, 'comunicados')(
        'editou',
        `Notícia: ${depois.titulo}`,
        descreverMudancas<Noticia>(antes, { id, ...depois }, ROTULOS_NOTICIA),
      );
    },
    async excluirNoticia(ator: Ator, id: string) {
      const n = await noticia(id);
      await noticias.excluir(id);
      await anotador(registrar, ator, 'comunicados')('excluiu', `Notícia: ${n.titulo}`, n.data);
    },

    async criarRecado(ator: Ator, dados: unknown) {
      const novo = validar(esquemaDadosDoRecado, dados);
      const id = await identificadorLivre(slug(novo.titulo), (c) => recados.existe(c));
      await recados.inserir({ id, ...novo });
      await anotador(registrar, ator, 'comunicados')('criou', `Recado: ${novo.titulo}`, novo.importante ? 'Marcado como importante.' : null);
      return id;
    },
    async editarRecado(ator: Ator, id: string, dados: unknown) {
      const antes = await recado(id);
      const depois = validar(esquemaDadosDoRecado, dados);
      await recados.atualizar(id, depois);
      await anotador(registrar, ator, 'comunicados')(
        'editou',
        `Recado: ${depois.titulo}`,
        descreverMudancas<Recado>({ ...antes, importante: Boolean(antes.importante) }, { id, ...depois }, ROTULOS_RECADO),
      );
    },
    async excluirRecado(ator: Ator, id: string) {
      const r = await recado(id);
      await recados.excluir(id);
      await anotador(registrar, ator, 'comunicados')('excluiu', `Recado: ${r.titulo}`);
    },
  };
}
