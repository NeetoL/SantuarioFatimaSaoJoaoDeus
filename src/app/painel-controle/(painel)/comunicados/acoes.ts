'use server';

import { redirect } from 'next/navigation';
import { painel } from '@/config/container';
import { acaoDoPainel, type EstadoDoFormulario } from '@/modules/Acesso/Presentation/acao';
import { marcado, texto } from '@/modules/Acesso/Presentation/formulario';
import { apagarImagem } from '@/shared/Infrastructure/arquivos/armazenamento';

const LISTA = '/painel-controle/comunicados';

const dadosDaNoticia = (dados: FormData) => ({
  titulo: texto(dados, 'titulo'),
  categoria: texto(dados, 'categoria'),
  data: texto(dados, 'data'),
  resumo: texto(dados, 'resumo'),
  imagem: texto(dados, 'imagem'),
  link: texto(dados, 'link').trim(),
});

const dadosDoRecado = (dados: FormData) => ({
  titulo: texto(dados, 'titulo'),
  texto: texto(dados, 'texto'),
  importante: marcado(dados, 'importante'),
});

export async function criarNoticia(_: EstadoDoFormulario, dados: FormData) {
  const r = await acaoDoPainel('comunicados', async (ator) => {
    await painel.comunicados.criarNoticia(ator, dadosDaNoticia(dados));
  });
  if (r.ok) redirect(`${LISTA}?aviso=noticia-criada`);
  return r;
}

export async function editarNoticia(id: string, _: EstadoDoFormulario, dados: FormData) {
  return acaoDoPainel('comunicados', async (ator) => {
    const antes = await painel.comunicados.buscarNoticia(id);
    const nova = dadosDaNoticia(dados);
    await painel.comunicados.editarNoticia(ator, id, nova);
    if (antes.imagem && antes.imagem !== nova.imagem) await apagarImagem(antes.imagem);
    return 'Notícia salva.';
  });
}

export async function excluirNoticia(id: string, _: EstadoDoFormulario, _dados: FormData) {
  void _dados;
  const r = await acaoDoPainel('comunicados', async (ator) => {
    const noticia = await painel.comunicados.buscarNoticia(id);
    await painel.comunicados.excluirNoticia(ator, id);
    if (noticia.imagem) await apagarImagem(noticia.imagem);
  });
  if (r.ok) redirect(`${LISTA}?aviso=excluido`);
  return r;
}

export async function criarRecado(_: EstadoDoFormulario, dados: FormData) {
  const r = await acaoDoPainel('comunicados', async (ator) => {
    await painel.comunicados.criarRecado(ator, dadosDoRecado(dados));
  });
  if (r.ok) redirect(`${LISTA}?aviso=recado-criado`);
  return r;
}

export async function editarRecado(id: string, _: EstadoDoFormulario, dados: FormData) {
  return acaoDoPainel('comunicados', async (ator) => {
    await painel.comunicados.editarRecado(ator, id, dadosDoRecado(dados));
    return 'Recado salvo.';
  });
}

export async function excluirRecado(id: string, _: EstadoDoFormulario, _dados: FormData) {
  void _dados;
  const r = await acaoDoPainel('comunicados', async (ator) => {
    await painel.comunicados.excluirRecado(ator, id);
  });
  if (r.ok) redirect(`${LISTA}?aviso=excluido`);
  return r;
}
