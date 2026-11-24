import { desc } from 'drizzle-orm';
import { beforeEach, describe, expect, it } from 'vitest';
import { RepositorioDeAtividadesBanco } from '@/modules/Atividades/Infrastructure/repositorio-banco';
import { type Banco, bancoDeTeste } from '@/shared/Infrastructure/banco/conexao';
import { registroAtividades } from '@/shared/Infrastructure/banco/esquema';
import * as cripto from '@/shared/Infrastructure/seguranca/senha';
import { pode } from '../Domain/acesso';
import { RepositorioDeSessoesBanco, RepositorioDeUsuariosBanco } from '../Infrastructure/repositorio-banco';
import { criarCasosDeUsoDeAcesso } from './casos-de-uso';

let banco: Banco;
let casos: ReturnType<typeof criarCasosDeUsoDeAcesso>;
let usuarios: RepositorioDeUsuariosBanco;

const SENHA = 'senha-forte-de-teste';
const admin = async () => {
  const id = await usuarios.criar({
    nome: 'Admin',
    email: 'admin@teste.local',
    papel: 'admin',
    senhaHash: await cripto.gerarResumoDeSenha(SENHA),
    trocarSenha: false,
  });
  return { id, nome: 'Admin', ip: '127.0.0.1' };
};
const ultimaAtividade = async () =>
  (await banco.select().from(registroAtividades).orderBy(desc(registroAtividades.criadoEm)).limit(1))[0];

beforeEach(async () => {
  banco = await bancoDeTeste();
  const fonte = async () => banco;
  usuarios = new RepositorioDeUsuariosBanco(fonte);
  const atividades = new RepositorioDeAtividadesBanco(fonte);
  casos = criarCasosDeUsoDeAcesso({
    usuarios,
    sessoes: new RepositorioDeSessoesBanco(fonte),
    registrar: (a) => atividades.registrar(a),
    cripto,
  });
});

describe('entrada no painel', () => {
  it('senha certa abre uma sessão válida e fica no registro', async () => {
    await admin();
    const r = await casos.entrar({ email: ' ADMIN@teste.local ', senha: SENHA }, '127.0.0.1');
    expect(r.ok).toBe(true);
    if (!r.ok) return;
    expect((await casos.usuarioDaSessao(r.codigo))?.email).toBe('admin@teste.local');
    expect((await ultimaAtividade())?.acao).toBe('entrou');
    await casos.sair(r.codigo, { id: r.usuario.id, nome: r.usuario.nome, ip: null });
    expect(await casos.usuarioDaSessao(r.codigo)).toBeNull();
  });

  it('e-mail desconhecido e senha errada dão a mesma resposta; 5 erros bloqueiam a conta', async () => {
    await admin();
    expect(await casos.entrar({ email: 'nao@existe.com', senha: 'x' }, null)).toEqual({ ok: false, motivo: 'credenciais' });
    for (let i = 0; i < 4; i++) {
      expect((await casos.entrar({ email: 'admin@teste.local', senha: 'errada' }, null)).ok).toBe(false);
    }
    expect(await casos.entrar({ email: 'admin@teste.local', senha: 'errada' }, null)).toMatchObject({ motivo: 'bloqueado' });
    expect((await ultimaAtividade())?.acao).toBe('bloqueado');
    // bloqueada: nem a senha certa entra
    expect(await casos.entrar({ email: 'admin@teste.local', senha: SENHA }, null)).toMatchObject({ motivo: 'bloqueado' });
  });

  it('código de sessão inventado não vale', async () => {
    expect(await casos.usuarioDaSessao('codigo-inventado')).toBeNull();
  });
});

describe('senhas e usuários', () => {
  it('trocar a senha exige a atual e encerra as outras sessões', async () => {
    const ator = await admin();
    const r = await casos.entrar({ email: 'admin@teste.local', senha: SENHA }, null);
    if (!r.ok) throw new Error('não entrou');
    await expect(
      casos.trocarSenha(ator, { atual: 'errada', nova: 'nova-senha-longa', confirmacao: 'nova-senha-longa' }),
    ).rejects.toThrow('Senha atual incorreta');
    const nova = await casos.trocarSenha(ator, { atual: SENHA, nova: 'nova-senha-longa', confirmacao: 'nova-senha-longa' });
    expect(await casos.usuarioDaSessao(r.codigo)).toBeNull();
    expect(await casos.usuarioDaSessao(nova.codigo)).not.toBeNull();
    expect((await casos.entrar({ email: 'admin@teste.local', senha: 'nova-senha-longa' }, null)).ok).toBe(true);
  });

  it('novo usuário recebe senha temporária e precisa trocá-la; e-mail repetido é recusado', async () => {
    const ator = await admin();
    const { id, senhaTemporaria } = await casos.criarUsuario(ator, { nome: 'Pascom', email: 'p@teste.local', papel: 'pascom' });
    expect((await casos.buscarUsuario(id)).trocarSenha).toBe(true);
    expect((await casos.entrar({ email: 'p@teste.local', senha: senhaTemporaria }, null)).ok).toBe(true);
    await expect(casos.criarUsuario(ator, { nome: 'Outro', email: 'p@teste.local', papel: 'padre' })).rejects.toThrow();
  });

  it('não deixa o site sem Admin master nem o admin se desativar', async () => {
    const ator = await admin();
    await expect(
      casos.editarUsuario(ator, ator.id, { nome: 'Admin', email: 'admin@teste.local', papel: 'padre', ativo: true }),
    ).rejects.toThrow();
    const { id } = await casos.criarUsuario(ator, { nome: 'Padre', email: 'padre@teste.local', papel: 'padre' });
    await casos.editarUsuario(ator, id, { nome: 'Padre', email: 'padre@teste.local', papel: 'padre', ativo: false });
    expect((await casos.buscarUsuario(id)).ativo).toBe(false);
    expect((await ultimaAtividade())?.area).toBe('usuarios');
  });
});

describe('perfis de acesso', () => {
  it('cada perfil acessa só o que deve', () => {
    expect(pode('admin', 'usuarios')).toBe(true);
    expect(pode('padre', 'secretaria')).toBe(true);
    expect(pode('padre', 'usuarios')).toBe(false);
    expect(pode('pascom', 'eventos')).toBe(true);
    expect(pode('pascom', 'galeria')).toBe(true);
    expect(pode('pascom', 'site')).toBe(false);
    expect(pode('pascom', 'secretaria')).toBe(false);
    expect(pode('secretaria', 'secretaria')).toBe(true);
    expect(pode('secretaria', 'eventos')).toBe(false);
  });
});
