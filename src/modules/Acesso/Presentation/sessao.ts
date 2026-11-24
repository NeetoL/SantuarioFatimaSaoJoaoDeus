import 'server-only';
import { cookies, headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { cache } from 'react';
import { painel, painelDisponivel } from '@/config/container';
import { type Ator } from '@/modules/Atividades/Domain/atividade';
import { type Permissao, pode, type UsuarioDoPainel } from '../Domain/acesso';

/**
 * Sessão do painel: um código aleatório num cookie protegido
 * (HttpOnly: o JavaScript da página não lê; SameSite=Strict: outro site não usa; Secure no site no ar).
 * O banco guarda só o resumo do código.
 */
const NO_AR = process.env.NODE_ENV === 'production';
export const NOME_DO_COOKIE = NO_AR ? '__Host-painel' : 'painel';
export const ENDERECO_DE_ENTRADA = '/painel-controle/entrar';

export async function gravarSessao(codigo: string, expiraEm: Date) {
  (await cookies()).set(NOME_DO_COOKIE, codigo, {
    httpOnly: true,
    secure: NO_AR,
    sameSite: 'strict',
    path: '/',
    expires: expiraEm,
  });
}

export async function apagarSessao() {
  (await cookies()).delete({ name: NOME_DO_COOKIE, path: '/' });
}

export async function codigoDaSessao(): Promise<string | null> {
  const codigo = (await cookies()).get(NOME_DO_COOKIE)?.value;
  return codigo && /^[\w-]{20,100}$/.test(codigo) ? codigo : null;
}

/** IP de quem está usando o painel (para o registro de atividades). */
export async function ipDaRequisicao(): Promise<string | null> {
  const h = await headers();
  return h.get('x-forwarded-for')?.split(',')[0]?.trim() || h.get('x-real-ip') || null;
}

/** Usuário logado (uma consulta por requisição), ou null. */
export const usuarioAtual = cache(async (): Promise<UsuarioDoPainel | null> => {
  if (!painelDisponivel()) return null;
  const codigo = await codigoDaSessao();
  return codigo ? painel.acesso.usuarioDaSessao(codigo) : null;
});

export async function atorAtual(usuario: UsuarioDoPainel): Promise<Ator> {
  return { id: usuario.id, nome: usuario.nome, ip: await ipDaRequisicao() };
}

/** Exige alguém logado; sem sessão, vai para a tela de entrada. */
export async function exigirUsuario({ permitirSenhaTemporaria = false } = {}): Promise<UsuarioDoPainel> {
  const usuario = await usuarioAtual();
  if (!usuario) redirect(ENDERECO_DE_ENTRADA);
  if (usuario.trocarSenha && !permitirSenhaTemporaria) redirect('/painel-controle/conta?primeiro-acesso=1');
  return usuario;
}

/** Exige a permissão da área; sem ela, volta ao início do painel com um aviso. */
export async function exigirPermissao(permissao: Permissao): Promise<UsuarioDoPainel> {
  const usuario = await exigirUsuario();
  if (!pode(usuario.papel, permissao)) redirect('/painel-controle?sem-permissao=1');
  return usuario;
}
