/**
 * MIGRAÇÕES DO BANCO, em SQL, aplicadas em ordem e uma única vez (tabela `_migracoes`).
 * Para mudar o banco: acrescente uma nova migração no fim da lista — nunca altere uma que já foi aplicada.
 * Ficam no código (e não em arquivos .sql) para irem junto com o site nas funções da Vercel.
 */
export const MIGRACOES: readonly { nome: string; sql: string }[] = [
  {
    nome: '0001_inicial',
    sql: `
create table configuracoes (
  chave text primary key,
  valor jsonb not null,
  atualizado_em timestamptz not null default now()
);

create table usuarios (
  id uuid primary key default gen_random_uuid(),
  nome text not null,
  email text not null unique,
  senha_hash text not null,
  papel text not null check (papel in ('admin', 'padre', 'pascom', 'secretaria')),
  ativo boolean not null default true,
  trocar_senha boolean not null default false,
  falhas_login integer not null default 0,
  bloqueado_ate timestamptz,
  ultimo_acesso timestamptz,
  criado_em timestamptz not null default now(),
  atualizado_em timestamptz not null default now()
);

create table sessoes (
  id text primary key,
  usuario_id uuid not null references usuarios(id) on delete cascade,
  expira_em timestamptz not null,
  criado_em timestamptz not null default now()
);
create index sessoes_usuario_idx on sessoes (usuario_id);

create table eventos (
  id text primary key,
  categoria text not null check (categoria in ('Missa', 'Novena', 'Festa', 'Aviso')),
  titulo text not null,
  data date not null,
  hora text not null,
  local text not null,
  descricao text not null,
  destaque boolean not null default false,
  imagem text,
  criado_em timestamptz not null default now(),
  atualizado_em timestamptz not null default now()
);

create table noticias (
  id text primary key,
  data date not null,
  categoria text not null,
  titulo text not null,
  resumo text not null,
  imagem text,
  link text,
  criado_em timestamptz not null default now(),
  atualizado_em timestamptz not null default now()
);

create table recados (
  id text primary key,
  titulo text not null,
  texto text not null,
  importante boolean not null default false,
  ordem integer not null default 0,
  criado_em timestamptz not null default now(),
  atualizado_em timestamptz not null default now()
);

create table albuns (
  id text primary key,
  titulo text not null,
  data date,
  descricao text,
  capa integer not null default 0,
  criado_em timestamptz not null default now(),
  atualizado_em timestamptz not null default now()
);

create table fotos_album (
  id uuid primary key default gen_random_uuid(),
  album_id text not null references albuns(id) on delete cascade,
  arquivo text not null,
  legenda text not null default '',
  ordem integer not null default 0,
  criado_em timestamptz not null default now()
);
create index fotos_album_idx on fotos_album (album_id, ordem);

create table dizimistas (
  id uuid primary key default gen_random_uuid(),
  nome text not null,
  telefone text,
  email text,
  endereco text,
  observacoes text,
  ativo boolean not null default true,
  criado_em timestamptz not null default now(),
  atualizado_em timestamptz not null default now()
);

create table contribuicoes (
  id uuid primary key default gen_random_uuid(),
  tipo text not null check (tipo in ('dizimo', 'oferta', 'doacao', 'campanha')),
  valor_centavos integer not null check (valor_centavos > 0),
  data date not null,
  forma text not null check (forma in ('pix', 'dinheiro', 'transferencia', 'cartao', 'outro')),
  dizimista_id uuid references dizimistas(id) on delete set null,
  doador_nome text,
  observacao text,
  registrado_por uuid,
  criado_em timestamptz not null default now()
);
create index contribuicoes_data_idx on contribuicoes (data);

create table registro_atividades (
  id uuid primary key default gen_random_uuid(),
  usuario_id uuid,
  usuario_nome text,
  acao text not null,
  area text not null,
  alvo text,
  detalhe text,
  ip text,
  criado_em timestamptz not null default now()
);
create index registro_atividades_data_idx on registro_atividades (criado_em desc);

-- O registro de atividades é permanente: o banco recusa alterar ou apagar uma linha.
create function registro_atividades_imutavel() returns trigger language plpgsql as $$
begin
  raise exception 'O registro de atividades não pode ser alterado nem apagado.';
end;
$$;
create trigger registro_atividades_somente_inclusao
  before update or delete on registro_atividades
  for each row execute function registro_atividades_imutavel();
`,
  },
];
