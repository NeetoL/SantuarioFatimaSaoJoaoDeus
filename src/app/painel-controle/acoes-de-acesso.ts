'use server';

import { redirect } from 'next/navigation';
import { painel, painelDisponivel } from '@/config/container';
import { type Permissao } from '@/modules/Acesso/Domain/acesso';
import { acaoDoPainel, type EstadoDoFormulario } from '@/modules/Acesso/Presentation/acao';
import { texto } from '@/modules/Acesso/Presentation/formulario';
import {
  apagarSessao,
  atorAtual,
  codigoDaSessao,
  ENDERECO_DE_ENTRADA,
  gravarSessao,
  ipDaRequisicao,
  usuarioAtual,
} from '@/modules/Acesso/Presentation/sessao';
import { anotador, type Area } from '@/modules/Atividades/Domain/atividade';
import { ErroDeAplicacao } from '@/shared/Domain/erros';
import { type PastaDeImagens, salvarImagem } from '@/shared/Infrastructure/arquivos/armazenamento';
import { logger } from '@/shared/Infrastructure/logger';

/** Entrada no painel (e-mail e senha). */
export async function entrar(_: EstadoDoFormulario, dados: FormData): Promise<EstadoDoFormulario> {
  const vez = Date.now();
  if (!painelDisponivel()) {
    return { ok: false, mensagem: 'O painel ainda não foi configurado neste servidor (falta o banco de dados).', erros: {}, vez };
  }
  let destino = '/painel-controle';
  try {
    const r = await painel.acesso.entrar({ email: texto(dados, 'email'), senha: texto(dados, 'senha') }, await ipDaRequisicao());
    if (!r.ok) {
      const mensagem =
        r.motivo === 'bloqueado'
          ? `Muitas tentativas erradas. Por segurança, o acesso está bloqueado por ${r.minutos} minuto${r.minutos > 1 ? 's' : ''}.`
          : 'Usuário ou senha incorretos.';
      return { ok: false, mensagem, erros: {}, vez };
    }
    await gravarSessao(r.codigo, r.expiraEm);
    if (r.usuario.trocarSenha) destino = '/painel-controle/conta?primeiro-acesso=1';
  } catch (erro) {
    if (erro instanceof ErroDeAplicacao) {
      const erros: Record<string, string> = {};
      for (const d of erro.detalhes) if (d.campo && !erros[d.campo]) erros[d.campo] = d.mensagem;
      return { ok: false, mensagem: 'Confira os campos abaixo.', erros, vez };
    }
    logger.erro('painel.entrar', erro);
    return { ok: false, mensagem: 'Não foi possível entrar agora. Tente de novo em instantes.', erros: {}, vez };
  }
  redirect(destino);
}

/** Saída do painel: apaga a sessão no banco e o cookie. */
export async function sair() {
  const codigo = await codigoDaSessao();
  if (codigo && painelDisponivel()) {
    const usuario = await usuarioAtual();
    await painel.acesso.sair(codigo, usuario ? await atorAtual(usuario) : null);
  }
  await apagarSessao();
  redirect(`${ENDERECO_DE_ENTRADA}?saiu=1`);
}

/** Troca da própria senha (também usada no primeiro acesso, com a senha temporária). */
export async function trocarSenha(_: EstadoDoFormulario, dados: FormData): Promise<EstadoDoFormulario> {
  const primeiroAcesso = texto(dados, 'primeiro-acesso') === '1';
  const r = await acaoDoPainel('conta', async (ator) => {
    const sessao = await painel.acesso.trocarSenha(ator, {
      atual: texto(dados, 'atual'),
      nova: texto(dados, 'nova'),
      confirmacao: texto(dados, 'confirmacao'),
    });
    await gravarSessao(sessao.codigo, sessao.expiraEm); // as outras sessões foram encerradas
    return 'Senha trocada. Se você estava logado em outro aparelho, será preciso entrar de novo lá.';
  });
  if (r.ok && primeiroAcesso) redirect('/painel-controle?bem-vindo=1');
  return r;
}

/** Onde cada tipo de foto é enviado e quem pode enviar. */
const DESTINOS: Record<PastaDeImagens, { permissao: Permissao; area: Area; larguraMaxima: number; rotulo: string }> = {
  site: { permissao: 'site', area: 'site', larguraMaxima: 800, rotulo: 'Imagem do site (logo)' },
  eventos: { permissao: 'eventos', area: 'eventos', larguraMaxima: 2000, rotulo: 'Foto de evento' },
  noticias: { permissao: 'comunicados', area: 'comunicados', larguraMaxima: 2000, rotulo: 'Foto de notícia' },
  galeria: { permissao: 'galeria', area: 'galeria', larguraMaxima: 2400, rotulo: 'Foto da galeria' },
};

/**
 * Envio de uma foto avulsa (capa de evento, foto de notícia, logo).
 * A permissão é conferida pela pasta de destino, e o envio fica no registro de atividades.
 */
export async function enviarFoto(pasta: string, _: EstadoDoFormulario, dados: FormData): Promise<EstadoDoFormulario> {
  const destino = DESTINOS[pasta as PastaDeImagens];
  if (!destino) return { ok: false, mensagem: 'Destino de foto inválido.', erros: {}, vez: Date.now() };
  return acaoDoPainel(
    destino.permissao,
    async (ator) => {
      const arquivo = dados.get('foto');
      if (!(arquivo instanceof File)) throw new ErroDeAplicacao('Escolha uma foto.', 400, 'SEM_FOTO');
      const foto = await salvarImagem(arquivo, { pasta: pasta as PastaDeImagens, larguraMaxima: destino.larguraMaxima });
      await anotador(painel.atividades.registrar, ator, destino.area)(
        'enviou-foto',
        destino.rotulo,
        `${foto.largura}×${foto.altura} px — ${foto.url}`,
      );
      return { mensagem: 'Foto enviada.', extra: { url: foto.url, largura: foto.largura, altura: foto.altura } };
    },
    { atualizarPaginas: false },
  );
}
