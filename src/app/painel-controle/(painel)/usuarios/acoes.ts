'use server';

import { painel } from '@/config/container';
import { acaoDoPainel, type EstadoDoFormulario } from '@/modules/Acesso/Presentation/acao';
import { marcado, texto } from '@/modules/Acesso/Presentation/formulario';

export async function criarUsuario(_: EstadoDoFormulario, dados: FormData) {
  return acaoDoPainel('usuarios', async (ator) => {
    const email = texto(dados, 'email');
    const { senhaTemporaria } = await painel.acesso.criarUsuario(ator, {
      nome: texto(dados, 'nome'),
      email,
      papel: texto(dados, 'papel'),
    });
    return { mensagem: 'Usuário criado.', extra: { senhaTemporaria, email: email.trim().toLowerCase() } };
  });
}

export async function editarUsuario(id: string, _: EstadoDoFormulario, dados: FormData) {
  return acaoDoPainel('usuarios', async (ator) => {
    await painel.acesso.editarUsuario(ator, id, {
      nome: texto(dados, 'nome'),
      email: texto(dados, 'email'),
      papel: texto(dados, 'papel'),
      ativo: marcado(dados, 'ativo'),
    });
    return 'Alterações salvas.';
  });
}

export async function redefinirSenha(id: string, _: EstadoDoFormulario, _dados: FormData) {
  void _dados;
  return acaoDoPainel('usuarios', async (ator) => {
    const { senhaTemporaria } = await painel.acesso.redefinirSenha(ator, id);
    return { mensagem: 'Nova senha temporária gerada.', extra: { senhaTemporaria } };
  });
}
