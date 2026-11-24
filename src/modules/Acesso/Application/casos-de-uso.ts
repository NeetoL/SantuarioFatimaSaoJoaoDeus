import { validar } from '@/shared/Application/validacao';
import { ErroDeAplicacao, ErroDeValidacao, ErroNaoEncontrado } from '@/shared/Domain/erros';
import { type NovaAtividade } from '@/modules/Atividades/Domain/atividade';
import {
  esquemaEdicaoDeUsuario,
  esquemaEntrada,
  esquemaNovoUsuario,
  esquemaTrocaDeSenha,
  REGRAS_DE_ACESSO,
  type RepositorioDeSessoes,
  type RepositorioDeUsuarios,
  type UsuarioDoPainel,
} from '../Domain/acesso';

/** Ferramentas de criptografia (vêm da Infrastructure; nos testes podem ser trocadas). */
export type Cripto = {
  gerarResumoDeSenha: (senha: string) => Promise<string>;
  senhaConfere: (senha: string, resumo: string) => Promise<boolean>;
  resumoDeSenhaFalso: () => Promise<string>;
  codigoAleatorio: () => string;
  resumir: (texto: string) => string;
  senhaTemporaria: () => string;
};

export type Ator = Pick<UsuarioDoPainel, 'id' | 'nome'> & { ip: string | null };

type Dependencias = {
  usuarios: RepositorioDeUsuarios;
  sessoes: RepositorioDeSessoes;
  registrar: (atividade: NovaAtividade) => Promise<void>;
  cripto: Cripto;
  agora?: () => Date;
};

export type ResultadoDaEntrada =
  | { ok: true; codigo: string; expiraEm: Date; usuario: UsuarioDoPainel }
  | { ok: false; motivo: 'credenciais' }
  | { ok: false; motivo: 'bloqueado'; minutos: number };

export function criarCasosDeUsoDeAcesso({ usuarios, sessoes, registrar, cripto, agora = () => new Date() }: Dependencias) {
  async function abrirSessao(usuarioId: string) {
    const codigo = cripto.codigoAleatorio();
    const expiraEm = new Date(agora().getTime() + REGRAS_DE_ACESSO.horasDeSessao * 3_600_000);
    await sessoes.criar(cripto.resumir(codigo), usuarioId, expiraEm);
    return { codigo, expiraEm };
  }

  /** Garante que o site nunca fique sem um Admin master ativo. */
  async function garantirUmAdmin(alvo: UsuarioDoPainel, depois: { papel: string; ativo: boolean }) {
    const deixaDeSerAdmin = alvo.papel === 'admin' && alvo.ativo && (depois.papel !== 'admin' || !depois.ativo);
    if (deixaDeSerAdmin && (await usuarios.quantosAdminsAtivos()) <= 1) {
      throw new ErroDeValidacao(
        [{ campo: 'papel', mensagem: 'É preciso manter pelo menos um Admin master ativo.' }],
        'É preciso manter pelo menos um Admin master ativo.',
      );
    }
  }

  return {
    /**
     * Entrada no painel. A mensagem de erro é sempre a mesma (não revela se o e-mail existe);
     * depois de várias tentativas erradas a conta fica bloqueada por alguns minutos.
     */
    async entrar(dados: unknown, ip: string | null): Promise<ResultadoDaEntrada> {
      const { email, senha } = validar(esquemaEntrada, dados);
      const usuario = await usuarios.buscarParaEntrar(email);
      const falha = (detalhe: string, u?: { id: string; nome: string }) =>
        registrar({
          usuarioId: u?.id ?? null,
          usuarioNome: u?.nome ?? null,
          acao: 'falhou-ao-entrar',
          area: 'acesso',
          alvo: email,
          detalhe,
          ip,
        });

      if (!usuario || !usuario.ativo) {
        await cripto.senhaConfere(senha, await cripto.resumoDeSenhaFalso()); // mesmo tempo de resposta
        await falha(usuario ? 'Conta desativada.' : 'E-mail não cadastrado.');
        return { ok: false, motivo: 'credenciais' };
      }

      if (usuario.bloqueadoAte && usuario.bloqueadoAte > agora()) {
        await falha('Conta bloqueada no momento.', usuario);
        const minutos = Math.ceil((usuario.bloqueadoAte.getTime() - agora().getTime()) / 60_000);
        return { ok: false, motivo: 'bloqueado', minutos };
      }

      if (!(await cripto.senhaConfere(senha, usuario.senhaHash))) {
        const falhas = usuario.falhasLogin + 1;
        if (falhas >= REGRAS_DE_ACESSO.falhasAteBloquear) {
          const ate = new Date(agora().getTime() + REGRAS_DE_ACESSO.minutosDeBloqueio * 60_000);
          await usuarios.registrarFalha(usuario.id, 0, ate);
          await registrar({
            usuarioId: usuario.id,
            usuarioNome: usuario.nome,
            acao: 'bloqueado',
            area: 'acesso',
            alvo: email,
            detalhe: `${falhas} senhas erradas seguidas. Bloqueado por ${REGRAS_DE_ACESSO.minutosDeBloqueio} minutos.`,
            ip,
          });
          return { ok: false, motivo: 'bloqueado', minutos: REGRAS_DE_ACESSO.minutosDeBloqueio };
        }
        await usuarios.registrarFalha(usuario.id, falhas, null);
        await falha(`Senha errada (${falhas}ª tentativa).`, usuario);
        return { ok: false, motivo: 'credenciais' };
      }

      await usuarios.registrarAcesso(usuario.id);
      await sessoes.excluirExpiradas();
      const { codigo, expiraEm } = await abrirSessao(usuario.id);
      await registrar({ usuarioId: usuario.id, usuarioNome: usuario.nome, acao: 'entrou', area: 'acesso', alvo: null, detalhe: null, ip });
      const { senhaHash, falhasLogin, bloqueadoAte, ...publico } = usuario;
      void senhaHash;
      void falhasLogin;
      void bloqueadoAte;
      return { ok: true, codigo, expiraEm, usuario: publico };
    },

    async sair(codigo: string, ator: Ator | null) {
      await sessoes.excluir(cripto.resumir(codigo));
      if (ator)
        await registrar({ usuarioId: ator.id, usuarioNome: ator.nome, acao: 'saiu', area: 'acesso', alvo: null, detalhe: null, ip: ator.ip });
    },

    usuarioDaSessao: (codigo: string) => sessoes.buscarUsuario(cripto.resumir(codigo)),

    /** Troca a própria senha. Encerra as outras sessões e devolve uma sessão nova. */
    async trocarSenha(ator: Ator, dados: unknown) {
      const { atual, nova } = validar(esquemaTrocaDeSenha, dados);
      const resumo = await usuarios.buscarResumoDaSenha(ator.id);
      if (!resumo || !(await cripto.senhaConfere(atual, resumo))) {
        throw new ErroDeValidacao([{ campo: 'atual', mensagem: 'Senha atual incorreta.' }], 'Senha atual incorreta.');
      }
      await usuarios.definirSenha(ator.id, await cripto.gerarResumoDeSenha(nova), false);
      await sessoes.excluirDoUsuario(ator.id);
      await registrar({ usuarioId: ator.id, usuarioNome: ator.nome, acao: 'trocou-senha', area: 'acesso', alvo: null, detalhe: 'As outras sessões foram encerradas.', ip: ator.ip });
      return abrirSessao(ator.id);
    },

    // ---------- Gestão de usuários (Admin master) ----------

    listarUsuarios: () => usuarios.listar(),

    async buscarUsuario(id: string) {
      const u = await usuarios.buscarPorId(id);
      if (!u) throw new ErroNaoEncontrado('Usuário');
      return u;
    },

    /** Cria o usuário com uma senha temporária (mostrada uma única vez ao admin); a pessoa troca no 1º acesso. */
    async criarUsuario(ator: Ator, dados: unknown) {
      const novo = validar(esquemaNovoUsuario, dados);
      if (await usuarios.emailEmUso(novo.email)) {
        throw new ErroDeValidacao([{ campo: 'email', mensagem: 'Já existe um usuário com este e-mail.' }]);
      }
      const senha = cripto.senhaTemporaria();
      const id = await usuarios.criar({ ...novo, senhaHash: await cripto.gerarResumoDeSenha(senha), trocarSenha: true });
      await registrar({
        usuarioId: ator.id,
        usuarioNome: ator.nome,
        acao: 'criou',
        area: 'usuarios',
        alvo: novo.nome,
        detalhe: `Perfil: ${novo.papel}. Senha temporária gerada (troca obrigatória no primeiro acesso).`,
        ip: ator.ip,
      });
      return { id, senhaTemporaria: senha };
    },

    async editarUsuario(ator: Ator, id: string, dados: unknown) {
      const depois = validar(esquemaEdicaoDeUsuario, dados);
      const antes = await usuarios.buscarPorId(id);
      if (!antes) throw new ErroNaoEncontrado('Usuário');
      if (id === ator.id && (!depois.ativo || depois.papel !== antes.papel)) {
        throw new ErroDeValidacao([], 'Você não pode desativar a própria conta nem mudar o próprio perfil.');
      }
      if (await usuarios.emailEmUso(depois.email, id)) {
        throw new ErroDeValidacao([{ campo: 'email', mensagem: 'Já existe um usuário com este e-mail.' }]);
      }
      await garantirUmAdmin(antes, depois);
      await usuarios.atualizar(id, depois);
      if (!depois.ativo || depois.papel !== antes.papel) await sessoes.excluirDoUsuario(id); // vale na hora
      const mudancas = (['nome', 'email', 'papel', 'ativo'] as const)
        .filter((c) => antes[c] !== depois[c])
        .map((c) => ({ nome: 'nome', email: 'e-mail', papel: 'perfil', ativo: 'ativo' })[c]);
      await registrar({
        usuarioId: ator.id,
        usuarioNome: ator.nome,
        acao: 'editou',
        area: 'usuarios',
        alvo: depois.nome,
        detalhe: mudancas.length ? `Alterado: ${mudancas.join(', ')}.` : 'Nenhuma mudança.',
        ip: ator.ip,
      });
    },

    async redefinirSenha(ator: Ator, id: string) {
      const alvo = await usuarios.buscarPorId(id);
      if (!alvo) throw new ErroNaoEncontrado('Usuário');
      if (alvo.id === ator.id) throw new ErroDeAplicacao('Para a sua própria senha, use "Minha conta".', 400, 'PROPRIA_SENHA');
      const senha = cripto.senhaTemporaria();
      await usuarios.definirSenha(id, await cripto.gerarResumoDeSenha(senha), true);
      await sessoes.excluirDoUsuario(id);
      await registrar({
        usuarioId: ator.id,
        usuarioNome: ator.nome,
        acao: 'redefiniu-senha',
        area: 'usuarios',
        alvo: alvo.nome,
        detalhe: 'Senha temporária gerada; sessões da pessoa encerradas.',
        ip: ator.ip,
      });
      return { senhaTemporaria: senha };
    },
  };
}

export type CasosDeUsoDeAcesso = ReturnType<typeof criarCasosDeUsoDeAcesso>;
