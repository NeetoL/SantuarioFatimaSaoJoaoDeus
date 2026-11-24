'use server';

import { redirect } from 'next/navigation';
import { painel } from '@/config/container';
import { acaoDoPainel, type EstadoDoFormulario } from '@/modules/Acesso/Presentation/acao';
import { marcado, texto } from '@/modules/Acesso/Presentation/formulario';
import { apagarImagem } from '@/shared/Infrastructure/arquivos/armazenamento';

const dadosDoEvento = (dados: FormData) => ({
  titulo: texto(dados, 'titulo'),
  categoria: texto(dados, 'categoria'),
  data: texto(dados, 'data'),
  hora: texto(dados, 'hora'),
  local: texto(dados, 'local'),
  descricao: texto(dados, 'descricao'),
  destaque: marcado(dados, 'destaque'),
  imagem: texto(dados, 'imagem'),
});

export async function criarEvento(_: EstadoDoFormulario, dados: FormData) {
  const r = await acaoDoPainel('eventos', async (ator) => {
    await painel.eventos.criar(ator, dadosDoEvento(dados));
  });
  if (r.ok) redirect('/painel-controle/eventos?aviso=criado');
  return r;
}

export async function editarEvento(id: string, _: EstadoDoFormulario, dados: FormData) {
  return acaoDoPainel('eventos', async (ator) => {
    const antes = await painel.eventos.buscar(id);
    const novo = dadosDoEvento(dados);
    await painel.eventos.editar(ator, id, novo);
    if (antes.imagem && antes.imagem !== novo.imagem) await apagarImagem(antes.imagem); // foto trocada ou removida
    return 'Evento salvo. O site já mostra a versão nova.';
  });
}

export async function excluirEvento(id: string, _: EstadoDoFormulario, _dados: FormData) {
  void _dados;
  const r = await acaoDoPainel('eventos', async (ator) => {
    const evento = await painel.eventos.buscar(id);
    await painel.eventos.excluir(ator, id);
    if (evento.imagem) await apagarImagem(evento.imagem); // só apaga as enviadas pelo painel
  });
  if (r.ok) redirect('/painel-controle/eventos?aviso=excluido');
  return r;
}
