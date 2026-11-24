/**
 * REGISTRO DE ATIVIDADES (log do painel): quem fez o quê, onde e quando.
 * Toda ação que muda dados passa por aqui. O banco não deixa alterar nem apagar um registro.
 */
export const AREAS = {
  acesso: 'Acesso ao painel',
  site: 'Informações do site',
  horarios: 'Horários',
  eventos: 'Eventos',
  galeria: 'Galeria',
  comunicados: 'Notícias e recados',
  doacoes: 'Doações (dados do site)',
  secretaria: 'Secretaria',
  usuarios: 'Usuários',
} as const;
export type Area = keyof typeof AREAS;

export const ACOES = {
  entrou: 'Entrou no painel',
  saiu: 'Saiu do painel',
  'falhou-ao-entrar': 'Tentativa de entrada recusada',
  bloqueado: 'Conta bloqueada por tentativas erradas',
  criou: 'Criou',
  editou: 'Editou',
  excluiu: 'Excluiu',
  'enviou-foto': 'Enviou foto',
  'trocou-senha': 'Trocou a própria senha',
  'redefiniu-senha': 'Redefiniu a senha de um usuário',
} as const;
export type Acao = keyof typeof ACOES;

export type Atividade = {
  id: string;
  usuarioId: string | null;
  usuarioNome: string | null;
  acao: Acao;
  area: Area;
  alvo: string | null;
  detalhe: string | null;
  ip: string | null;
  criadoEm: Date;
};

export type NovaAtividade = Omit<Atividade, 'id' | 'criadoEm'>;

export type FiltroDeAtividades = { area?: Area; usuarioId?: string; desde?: string; ate?: string };

export interface RepositorioDeAtividades {
  registrar(atividade: NovaAtividade): Promise<void>;
  listar(
    filtro: FiltroDeAtividades,
    paginacao: { pagina: number; porPagina: number },
  ): Promise<{ itens: Atividade[]; total: number }>;
}

type Valor = string | number | boolean | null | undefined;

const mostrar = (v: Valor) =>
  v === null || v === undefined || v === '' ? '(vazio)' : typeof v === 'boolean' ? (v ? 'sim' : 'não') : String(v);

/**
 * Descreve o que mudou entre a versão anterior e a nova, para o registro.
 * Dados pessoais (`ocultarValores`): só os nomes dos campos, sem os valores (LGPD).
 */
export function descreverMudancas<T extends Record<string, unknown>>(
  antes: Partial<T> | null,
  depois: Partial<T>,
  rotulos: Partial<Record<keyof T, string>>,
  { ocultarValores = false }: { ocultarValores?: boolean } = {},
): string {
  const mudancas: string[] = [];
  for (const chave of Object.keys(rotulos) as (keyof T)[]) {
    const a = antes?.[chave] as Valor;
    const d = depois[chave] as Valor;
    if (antes ? mostrar(a) === mostrar(d) : mostrar(d) === '(vazio)') continue; // na criação, só o que foi preenchido
    const rotulo = rotulos[chave] ?? String(chave);
    if (ocultarValores || !antes) mudancas.push(rotulo);
    else mudancas.push(`${rotulo}: ${encurtar(mostrar(a))} → ${encurtar(mostrar(d))}`);
  }
  if (!mudancas.length) return 'Nenhuma mudança.';
  return `${antes ? 'Alterado' : 'Preenchido'}: ${mudancas.join('; ')}`;
}

const encurtar = (texto: string) => (texto.length > 80 ? `${texto.slice(0, 77)}…` : texto);

/** Quem está agindo no painel (vem da sessão). */
export type Ator = { id: string; nome: string; ip: string | null };
export type Registrar = (atividade: NovaAtividade) => Promise<void>;

/** Atalho para registrar várias ações do mesmo ator numa área. */
export const anotador =
  (registrar: Registrar, ator: Ator, area: Area) =>
  (acao: Acao, alvo: string | null, detalhe: string | null = null) =>
    registrar({ usuarioId: ator.id, usuarioNome: ator.nome, ip: ator.ip, area, acao, alvo, detalhe });

/** { endereco: { bairro: 'x' } } → { 'endereco.bairro': 'x' } (para comparar versões no registro). */
export function achatar(objeto: unknown, prefixo = ''): Record<string, string | number | boolean | null> {
  const saida: Record<string, string | number | boolean | null> = {};
  if (objeto === null || objeto === undefined) return saida;
  if (typeof objeto !== 'object') return { [prefixo]: objeto as string };
  for (const [chave, valor] of Object.entries(objeto)) {
    const nome = prefixo ? `${prefixo}.${chave}` : chave;
    if (valor !== null && typeof valor === 'object') Object.assign(saida, achatar(valor, nome));
    else saida[nome] = (valor ?? null) as string | number | boolean | null;
  }
  return saida;
}
