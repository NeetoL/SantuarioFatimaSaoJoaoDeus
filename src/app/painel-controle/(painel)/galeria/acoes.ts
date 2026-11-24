'use server';

import { redirect } from 'next/navigation';
import { painel } from '@/config/container';
import { acaoDoPainel, type EstadoDoFormulario } from '@/modules/Acesso/Presentation/acao';
import { texto } from '@/modules/Acesso/Presentation/formulario';
import { ErroDeAplicacao } from '@/shared/Domain/erros';
import { apagarImagem, salvarImagem } from '@/shared/Infrastructure/arquivos/armazenamento';

const dadosDoAlbum = (dados: FormData) => ({
  titulo: texto(dados, 'titulo'),
  data: texto(dados, 'data'),
  descricao: texto(dados, 'descricao'),
});

export async function criarAlbum(_: EstadoDoFormulario, dados: FormData) {
  let id = '';
  const r = await acaoDoPainel('galeria', async (ator) => {
    id = await painel.galeria.criarAlbum(ator, dadosDoAlbum(dados));
  });
  if (r.ok) redirect(`/painel-controle/galeria/${encodeURIComponent(id)}?aviso=criado`);
  return r;
}

export async function editarAlbum(id: string, _: EstadoDoFormulario, dados: FormData) {
  return acaoDoPainel('galeria', async (ator) => {
    await painel.galeria.editarAlbum(ator, id, dadosDoAlbum(dados));
    return 'Álbum salvo.';
  });
}

export async function excluirAlbum(id: string, _: EstadoDoFormulario, _dados: FormData) {
  void _dados;
  const r = await acaoDoPainel('galeria', async (ator) => {
    const album = await painel.galeria.buscar(id);
    await painel.galeria.excluirAlbum(ator, id);
    await Promise.all(album.fotos.map((f) => apagarImagem(f.foto))); // só apaga as enviadas pelo painel
  });
  if (r.ok) redirect('/painel-controle/galeria?aviso=excluido');
  return r;
}

/** Uma foto por vez (a tela envia várias em sequência, mostrando o progresso). */
export async function adicionarFotoAoAlbum(albumId: string, _: EstadoDoFormulario, dados: FormData) {
  return acaoDoPainel(
    'galeria',
    async (ator) => {
      const arquivo = dados.get('foto');
      if (!(arquivo instanceof File)) throw new ErroDeAplicacao('Escolha uma foto.', 400, 'SEM_FOTO');
      await painel.galeria.buscar(albumId); // confere se o álbum existe antes de guardar o arquivo
      const foto = await salvarImagem(arquivo, { pasta: 'galeria' });
      try {
        await painel.galeria.adicionarFoto(ator, albumId, { arquivo: foto.url, legenda: texto(dados, 'legenda') });
      } catch (erro) {
        await apagarImagem(foto.url);
        throw erro;
      }
      return 'Foto adicionada.';
    },
    { atualizarPaginas: false }, // a tela atualiza uma vez, no fim do envio
  );
}

const fotoDoFormulario = (dados: FormData) => texto(dados, 'foto');

export async function editarLegenda(albumId: string, _: EstadoDoFormulario, dados: FormData) {
  return acaoDoPainel('galeria', async (ator) => {
    await painel.galeria.editarLegenda(ator, albumId, fotoDoFormulario(dados), texto(dados, 'legenda'));
    return 'Legenda salva.';
  });
}

export async function moverFoto(albumId: string, _: EstadoDoFormulario, dados: FormData) {
  return acaoDoPainel('galeria', async (ator) => {
    await painel.galeria.moverFoto(ator, albumId, fotoDoFormulario(dados), texto(dados, 'direcao') === '-1' ? -1 : 1);
    return 'Foto movida.';
  });
}

export async function definirCapa(albumId: string, _: EstadoDoFormulario, dados: FormData) {
  return acaoDoPainel('galeria', async (ator) => {
    await painel.galeria.definirCapa(ator, albumId, fotoDoFormulario(dados));
    return 'Capa do álbum trocada.';
  });
}

export async function excluirFoto(albumId: string, _: EstadoDoFormulario, dados: FormData) {
  return acaoDoPainel('galeria', async (ator) => {
    const url = await painel.galeria.excluirFoto(ator, albumId, fotoDoFormulario(dados));
    await apagarImagem(url);
    return 'Foto excluída.';
  });
}
