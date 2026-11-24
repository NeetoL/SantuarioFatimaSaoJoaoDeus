import { z } from 'zod';

/** Perfis de acesso ao painel. */
export const PAPEIS = ['admin', 'padre', 'pascom', 'secretaria'] as const;
export type Papel = (typeof PAPEIS)[number];

export const NOME_DO_PAPEL: Record<Papel, string> = {
  admin: 'Admin master',
  padre: 'Padre',
  pascom: 'PASCOM',
  secretaria: 'Secretaria',
};

export const DESCRICAO_DO_PAPEL: Record<Papel, string> = {
  admin: 'Acesso a tudo, inclusive usuários e registro de atividades.',
  padre: 'Todo o conteúdo do site e a secretaria (dizimistas e contribuições).',
  pascom: 'Eventos e fotos da galeria.',
  secretaria: 'Dizimistas e contribuições recebidas.',
};

/** Áreas do painel. Cada uma é uma permissão. */
export const PERMISSOES = [
  'site',
  'horarios',
  'eventos',
  'galeria',
  'comunicados',
  'doacoes',
  'secretaria',
  'usuarios',
  'atividades',
] as const;
export type Permissao = (typeof PERMISSOES)[number];

/** Quem pode o quê. Para mudar um perfil, mude só esta tabela (o servidor confere em toda ação). */
export const PERMISSOES_DO_PAPEL: Record<Papel, readonly Permissao[]> = {
  admin: PERMISSOES,
  padre: ['site', 'horarios', 'eventos', 'galeria', 'comunicados', 'doacoes', 'secretaria'],
  pascom: ['eventos', 'galeria'],
  secretaria: ['secretaria'],
};

export const pode = (papel: Papel, permissao: Permissao) => PERMISSOES_DO_PAPEL[papel].includes(permissao);

export const ehPapel = (valor: string): valor is Papel => (PAPEIS as readonly string[]).includes(valor);

/** Usuário do painel como as telas o veem (nunca com o resumo da senha). */
export type UsuarioDoPainel = {
  id: string;
  nome: string;
  email: string;
  papel: Papel;
  ativo: boolean;
  trocarSenha: boolean;
  ultimoAcesso: Date | null;
  criadoEm: Date;
};

/** Regras de segurança do acesso. */
export const REGRAS_DE_ACESSO = {
  /** Tentativas erradas seguidas antes de bloquear a conta. */
  falhasAteBloquear: 5,
  /** Minutos de bloqueio depois de muitas tentativas erradas. */
  minutosDeBloqueio: 15,
  /** Horas até a sessão expirar (é preciso entrar de novo). */
  horasDeSessao: 12,
} as const;

/** Nome de usuário (alternativa ao e-mail para entrar): letras minúsculas, números, ponto, traço e sublinhado. */
const USUARIO = /^[a-z0-9][a-z0-9._-]{2,39}$/;

/** Identificação para entrar no painel: e-mail ou nome de usuário (ex.: "maria.silva"). */
export const esquemaEmail = z
  .string()
  .trim()
  .toLowerCase()
  .pipe(
    z.union([z.email().max(200), z.string().regex(USUARIO)], {
      error: 'Informe um e-mail válido ou um nome de usuário (só letras, números, ponto e traço).',
    }),
  );

export const esquemaSenhaNova = z
  .string()
  .min(10, { error: 'A senha precisa ter pelo menos 10 caracteres.' })
  .max(200, { error: 'Senha longa demais.' });

export const esquemaEntrada = z.object({
  email: esquemaEmail,
  senha: z.string().min(1, { error: 'Informe a senha.' }).max(200),
});

export const esquemaNovoUsuario = z.object({
  nome: z.string().trim().min(2, { error: 'Informe o nome.' }).max(120),
  email: esquemaEmail,
  papel: z.enum(PAPEIS, { error: 'Escolha o perfil.' }),
});

export const esquemaEdicaoDeUsuario = esquemaNovoUsuario.extend({
  ativo: z.boolean(),
});

export const esquemaTrocaDeSenha = z
  .object({
    atual: z.string().min(1, { error: 'Informe a senha atual.' }).max(200),
    nova: esquemaSenhaNova,
    confirmacao: z.string(),
  })
  .refine((d) => d.nova === d.confirmacao, { path: ['confirmacao'], error: 'As senhas não são iguais.' })
  .refine((d) => d.nova !== d.atual, { path: ['nova'], error: 'A nova senha precisa ser diferente da atual.' });

export interface RepositorioDeUsuarios {
  listar(): Promise<UsuarioDoPainel[]>;
  buscarPorId(id: string): Promise<UsuarioDoPainel | null>;
  /** Com o resumo da senha e o controle de bloqueio — só para entrar e trocar a senha. */
  buscarParaEntrar(
    email: string,
  ): Promise<(UsuarioDoPainel & { senhaHash: string; falhasLogin: number; bloqueadoAte: Date | null }) | null>;
  buscarResumoDaSenha(id: string): Promise<string | null>;
  criar(dados: { nome: string; email: string; papel: Papel; senhaHash: string; trocarSenha: boolean }): Promise<string>;
  atualizar(id: string, dados: { nome: string; email: string; papel: Papel; ativo: boolean }): Promise<void>;
  definirSenha(id: string, senhaHash: string, trocarSenha: boolean): Promise<void>;
  registrarFalha(id: string, falhas: number, bloqueadoAte: Date | null): Promise<void>;
  registrarAcesso(id: string): Promise<void>;
  emailEmUso(email: string, excetoId?: string): Promise<boolean>;
  quantosAdminsAtivos(): Promise<number>;
}

export interface RepositorioDeSessoes {
  criar(resumoDoCodigo: string, usuarioId: string, expiraEm: Date): Promise<void>;
  /** Usuário dono da sessão, se ela existir e não tiver expirado (e o usuário estiver ativo). */
  buscarUsuario(resumoDoCodigo: string): Promise<UsuarioDoPainel | null>;
  excluir(resumoDoCodigo: string): Promise<void>;
  excluirDoUsuario(usuarioId: string): Promise<void>;
  excluirExpiradas(): Promise<void>;
}
