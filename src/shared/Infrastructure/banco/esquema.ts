import { boolean, date, index, integer, jsonb, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';

/**
 * TABELAS DO BANCO (PostgreSQL) — espelham as migrações em `migracoes.ts`.
 * Cada módulo lê e grava só as suas tabelas, pelos seus repositórios (camada Infrastructure).
 */

const criadoEm = () => timestamp('criado_em', { withTimezone: true }).notNull().defaultNow();
const atualizadoEm = () => timestamp('atualizado_em', { withTimezone: true }).notNull().defaultNow();

/** Configurações do site em JSON validado: 'institucional', 'horarios', 'doacoes'. */
export const configuracoes = pgTable('configuracoes', {
  chave: text('chave').primaryKey(),
  valor: jsonb('valor').notNull(),
  atualizadoEm: atualizadoEm(),
});

export const usuarios = pgTable('usuarios', {
  id: uuid('id').primaryKey().defaultRandom(),
  nome: text('nome').notNull(),
  email: text('email').notNull().unique(),
  senhaHash: text('senha_hash').notNull(),
  papel: text('papel').notNull(),
  ativo: boolean('ativo').notNull().default(true),
  trocarSenha: boolean('trocar_senha').notNull().default(false),
  falhasLogin: integer('falhas_login').notNull().default(0),
  bloqueadoAte: timestamp('bloqueado_ate', { withTimezone: true }),
  ultimoAcesso: timestamp('ultimo_acesso', { withTimezone: true }),
  criadoEm: criadoEm(),
  atualizadoEm: atualizadoEm(),
});

/** Sessões do painel. O id é o resumo (SHA-256) do código guardado no cookie: o banco nunca vê o código. */
export const sessoes = pgTable(
  'sessoes',
  {
    id: text('id').primaryKey(),
    usuarioId: uuid('usuario_id')
      .notNull()
      .references(() => usuarios.id, { onDelete: 'cascade' }),
    expiraEm: timestamp('expira_em', { withTimezone: true }).notNull(),
    criadoEm: criadoEm(),
  },
  (t) => [index('sessoes_usuario_idx').on(t.usuarioId)],
);

export const eventos = pgTable('eventos', {
  id: text('id').primaryKey(),
  categoria: text('categoria').notNull(),
  titulo: text('titulo').notNull(),
  data: date('data', { mode: 'string' }).notNull(),
  hora: text('hora').notNull(),
  local: text('local').notNull(),
  descricao: text('descricao').notNull(),
  destaque: boolean('destaque').notNull().default(false),
  imagem: text('imagem'),
  criadoEm: criadoEm(),
  atualizadoEm: atualizadoEm(),
});

export const noticias = pgTable('noticias', {
  id: text('id').primaryKey(),
  data: date('data', { mode: 'string' }).notNull(),
  categoria: text('categoria').notNull(),
  titulo: text('titulo').notNull(),
  resumo: text('resumo').notNull(),
  imagem: text('imagem'),
  link: text('link'),
  criadoEm: criadoEm(),
  atualizadoEm: atualizadoEm(),
});

export const recados = pgTable('recados', {
  id: text('id').primaryKey(),
  titulo: text('titulo').notNull(),
  texto: text('texto').notNull(),
  importante: boolean('importante').notNull().default(false),
  ordem: integer('ordem').notNull().default(0),
  criadoEm: criadoEm(),
  atualizadoEm: atualizadoEm(),
});

export const albuns = pgTable('albuns', {
  id: text('id').primaryKey(),
  titulo: text('titulo').notNull(),
  data: date('data', { mode: 'string' }),
  descricao: text('descricao'),
  capa: integer('capa').notNull().default(0),
  criadoEm: criadoEm(),
  atualizadoEm: atualizadoEm(),
});

export const fotosAlbum = pgTable(
  'fotos_album',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    albumId: text('album_id')
      .notNull()
      .references(() => albuns.id, { onDelete: 'cascade' }),
    arquivo: text('arquivo').notNull(),
    legenda: text('legenda').notNull().default(''),
    ordem: integer('ordem').notNull().default(0),
    criadoEm: criadoEm(),
  },
  (t) => [index('fotos_album_idx').on(t.albumId, t.ordem)],
);

export const dizimistas = pgTable('dizimistas', {
  id: uuid('id').primaryKey().defaultRandom(),
  nome: text('nome').notNull(),
  telefone: text('telefone'),
  email: text('email'),
  endereco: text('endereco'),
  observacoes: text('observacoes'),
  ativo: boolean('ativo').notNull().default(true),
  criadoEm: criadoEm(),
  atualizadoEm: atualizadoEm(),
});

export const contribuicoes = pgTable(
  'contribuicoes',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    tipo: text('tipo').notNull(),
    valorCentavos: integer('valor_centavos').notNull(),
    data: date('data', { mode: 'string' }).notNull(),
    forma: text('forma').notNull(),
    dizimistaId: uuid('dizimista_id').references(() => dizimistas.id, { onDelete: 'set null' }),
    doadorNome: text('doador_nome'),
    observacao: text('observacao'),
    registradoPor: uuid('registrado_por'),
    criadoEm: criadoEm(),
  },
  (t) => [index('contribuicoes_data_idx').on(t.data)],
);

/** Registro de atividades (log): não pode ser alterado nem apagado (regra no próprio banco). */
export const registroAtividades = pgTable(
  'registro_atividades',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    usuarioId: uuid('usuario_id'),
    usuarioNome: text('usuario_nome'),
    acao: text('acao').notNull(),
    area: text('area').notNull(),
    alvo: text('alvo'),
    detalhe: text('detalhe'),
    ip: text('ip'),
    criadoEm: criadoEm(),
  },
  (t) => [index('registro_atividades_data_idx').on(t.criadoEm)],
);

export const esquema = {
  configuracoes,
  usuarios,
  sessoes,
  eventos,
  noticias,
  recados,
  albuns,
  fotosAlbum,
  dizimistas,
  contribuicoes,
  registroAtividades,
};
