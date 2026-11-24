'use server';

import { redirect } from 'next/navigation';
import { painel } from '@/config/container';
import { acaoDoPainel, type EstadoDoFormulario } from '@/modules/Acesso/Presentation/acao';
import { marcado, texto } from '@/modules/Acesso/Presentation/formulario';
import { ErroDeValidacao } from '@/shared/Domain/erros';

const DIZIMISTAS = '/painel-controle/secretaria/dizimistas';

const dadosDoDizimista = (dados: FormData) => ({
  nome: texto(dados, 'nome'),
  telefone: texto(dados, 'telefone'),
  email: texto(dados, 'email').trim(),
  endereco: texto(dados, 'endereco'),
  observacoes: texto(dados, 'observacoes'),
  ativo: marcado(dados, 'ativo'),
});

export async function criarDizimista(_: EstadoDoFormulario, dados: FormData) {
  let id = '';
  const r = await acaoDoPainel('secretaria', async (ator) => {
    id = await painel.secretaria.criarDizimista(ator, dadosDoDizimista(dados));
  });
  if (r.ok) redirect(`${DIZIMISTAS}/${id}?aviso=criado`);
  return r;
}

export async function editarDizimista(id: string, _: EstadoDoFormulario, dados: FormData) {
  return acaoDoPainel('secretaria', async (ator) => {
    await painel.secretaria.editarDizimista(ator, id, dadosDoDizimista(dados));
    return 'Cadastro salvo.';
  });
}

export async function excluirDizimista(id: string, _: EstadoDoFormulario, _dados: FormData) {
  void _dados;
  const r = await acaoDoPainel('secretaria', async (ator) => {
    await painel.secretaria.excluirDizimista(ator, id);
  });
  if (r.ok) redirect(`${DIZIMISTAS}?aviso=excluido`);
  return r;
}

export async function registrarContribuicao(_: EstadoDoFormulario, dados: FormData) {
  return acaoDoPainel('secretaria', async (ator) => {
    const quem = texto(dados, 'quem');
    if (quem === 'dizimista' && !texto(dados, 'dizimistaId')) {
      throw new ErroDeValidacao([{ campo: 'dizimistaId', mensagem: 'Escolha o dizimista (ou marque “Outra pessoa” / “Anônimo”).' }]);
    }
    if (quem === 'doador' && !texto(dados, 'doadorNome').trim()) {
      throw new ErroDeValidacao([{ campo: 'doadorNome', mensagem: 'Escreva o nome de quem doou (ou marque “Anônimo”).' }]);
    }
    await painel.secretaria.registrarContribuicao(ator, {
      tipo: texto(dados, 'tipo'),
      valor: texto(dados, 'valor'),
      data: texto(dados, 'data'),
      forma: texto(dados, 'forma'),
      dizimistaId: quem === 'dizimista' ? texto(dados, 'dizimistaId') : '',
      doadorNome: quem === 'doador' ? texto(dados, 'doadorNome') : '',
      observacao: texto(dados, 'observacao'),
    });
    return 'Contribuição registrada.';
  });
}

export async function excluirContribuicao(_: EstadoDoFormulario, dados: FormData) {
  return acaoDoPainel('secretaria', async (ator) => {
    await painel.secretaria.excluirContribuicao(ator, texto(dados, 'id'));
    return 'Contribuição excluída.';
  });
}
