import 'server-only';
import { revalidatePath } from 'next/cache';
import { unstable_rethrow } from 'next/navigation';
import { type Ator } from '@/modules/Atividades/Domain/atividade';
import { ErroDeAplicacao } from '@/shared/Domain/erros';
import { logger } from '@/shared/Infrastructure/logger';
import { type Permissao, type UsuarioDoPainel } from '../Domain/acesso';
import { type EstadoDoFormulario } from './estado';
import { atorAtual, exigirPermissao, exigirUsuario } from './sessao';

export { ESTADO_INICIAL, type EstadoDoFormulario } from './estado';

type Retorno = string | { mensagem: string; extra?: Record<string, string | number> } | void;

/**
 * Toda ação do painel passa por aqui:
 * 1. confere no servidor se a pessoa está logada e tem a permissão da área
 *    ('conta' = qualquer pessoa logada, mesmo com senha temporária — só para "Minha conta");
 * 2. executa (o caso de uso valida os dados e grava o registro de atividades);
 * 3. atualiza as páginas (site e painel) para mostrarem o dado novo;
 * 4. erros conhecidos viram mensagem para a tela; erros inesperados viram mensagem genérica
 *    (o detalhe técnico fica só no log do servidor).
 */
export async function acaoDoPainel(
  permissao: Permissao | 'conta',
  tarefa: (ator: Ator, usuario: UsuarioDoPainel) => Promise<Retorno>,
  { atualizarPaginas = true }: { atualizarPaginas?: boolean } = {},
): Promise<EstadoDoFormulario> {
  const usuario = permissao === 'conta' ? await exigirUsuario({ permitirSenhaTemporaria: true }) : await exigirPermissao(permissao);
  const vez = Date.now();
  try {
    const retorno = await tarefa(await atorAtual(usuario), usuario);
    if (atualizarPaginas) revalidatePath('/', 'layout');
    if (typeof retorno === 'object') return { ok: true, mensagem: retorno.mensagem, erros: {}, extra: retorno.extra, vez };
    return { ok: true, mensagem: retorno ?? 'Salvo com sucesso.', erros: {}, vez };
  } catch (erro) {
    unstable_rethrow(erro); // redirecionamentos do Next.js seguem normalmente
    if (erro instanceof ErroDeAplicacao) {
      const erros: Record<string, string> = {};
      for (const d of erro.detalhes) if (d.campo && !erros[d.campo]) erros[d.campo] = d.mensagem;
      return { ok: false, mensagem: erro.mensagemPublica, erros, vez };
    }
    logger.erro('painel.acao', erro, { permissao });
    return { ok: false, mensagem: 'Não foi possível concluir. Tente de novo em instantes.', erros: {}, vez };
  }
}
