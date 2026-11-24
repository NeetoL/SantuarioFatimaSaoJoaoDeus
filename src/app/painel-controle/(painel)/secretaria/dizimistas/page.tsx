import { type Metadata } from 'next';
import Link from 'next/link';
import { AvisoDeSucesso, CabecalhoDaPagina, Etiqueta, LinkBotao, Vazio } from '@/components/painel/Pagina';
import { painel } from '@/config/container';
import { exigirPermissao } from '@/modules/Acesso/Presentation/sessao';

export const metadata: Metadata = { title: 'Dizimistas' };

const SITUACOES = [
  { valor: 'ativos', rotulo: 'Ativos' },
  { valor: 'inativos', rotulo: 'Inativos' },
  { valor: 'todos', rotulo: 'Todos' },
] as const;
type Situacao = (typeof SITUACOES)[number]['valor'];

export default async function Dizimistas({
  searchParams,
}: {
  searchParams: Promise<{ busca?: string; situacao?: string; aviso?: string }>;
}) {
  await exigirPermissao('secretaria');
  const params = await searchParams;
  const busca = (params.busca ?? '').trim().slice(0, 80);
  const situacao: Situacao = SITUACOES.some((s) => s.valor === params.situacao) ? (params.situacao as Situacao) : 'ativos';
  const dizimistas = await painel.secretaria.listarDizimistas({ busca: busca || undefined, situacao });
  const link = (s: Situacao) => `?${new URLSearchParams({ ...(busca ? { busca } : {}), situacao: s })}`;

  return (
    <>
      <CabecalhoDaPagina
        titulo="Dizimistas"
        descricao="Cadastro de quem contribui com o dízimo. Dados pessoais: use só para a secretaria."
        acao={<LinkBotao href="/painel-controle/secretaria/dizimistas/novo">+ Cadastrar dizimista</LinkBotao>}
      />
      <AvisoDeSucesso texto={params.aviso === 'excluido' ? 'Cadastro excluído. As contribuições continuam registradas.' : null} />

      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <form role="search" className="flex flex-1 gap-2 sm:max-w-md">
          <input type="hidden" name="situacao" value={situacao} />
          <label htmlFor="busca" className="sr-only">
            Buscar por nome, telefone ou e-mail
          </label>
          <input
            id="busca"
            name="busca"
            type="search"
            defaultValue={busca}
            placeholder="Buscar por nome, telefone ou e-mail"
            className="h-11 min-w-0 flex-1 rounded-md border border-slate-300 bg-white px-3.5 text-base text-navy-950 placeholder:text-slate-400 focus:border-gold-500 focus:outline-none focus:ring-2 focus:ring-gold-400/30"
          />
          <button type="submit" className="btn btn-escuro btn-sm">
            Buscar
          </button>
        </form>
        <nav aria-label="Situação" className="inline-flex rounded-md border border-slate-300 bg-white p-1">
          {SITUACOES.map((s) => (
            <Link
              key={s.valor}
              href={link(s.valor)}
              aria-current={situacao === s.valor ? 'page' : undefined}
              className={`rounded px-3.5 py-1.5 text-sm font-semibold ${situacao === s.valor ? 'bg-navy-900 text-white' : 'text-slate-700 hover:bg-slate-100'}`}
            >
              {s.rotulo}
            </Link>
          ))}
        </nav>
      </div>

      {dizimistas.length ? (
        <>
          <p className="mb-2 text-sm text-slate-600">
            {dizimistas.length} {dizimistas.length === 1 ? 'pessoa' : 'pessoas'}
            {busca && <> para “{busca}”</>}
          </p>
          <ul className="divide-y divide-slate-100 overflow-hidden rounded-lg bg-white shadow-sm ring-1 ring-black/5">
            {dizimistas.map((d) => (
              <li key={d.id}>
                <Link
                  href={`/painel-controle/secretaria/dizimistas/${d.id}`}
                  className="flex flex-col gap-1 px-5 py-3.5 transition-colors hover:bg-navy-50/60 sm:flex-row sm:items-center sm:gap-6"
                >
                  <span className="flex min-w-0 flex-1 items-center gap-2">
                    <span className="truncate font-semibold text-navy-950">{d.nome}</span>
                    {!d.ativo && <Etiqueta>inativo</Etiqueta>}
                  </span>
                  <span className="text-sm text-slate-600 sm:w-44">{d.telefone ?? '—'}</span>
                  <span className="truncate text-sm text-slate-600 sm:w-64">{d.email ?? '—'}</span>
                </Link>
              </li>
            ))}
          </ul>
        </>
      ) : (
        <Vazio>{busca ? `Ninguém encontrado para “${busca}”.` : 'Nenhum dizimista nesta lista.'}</Vazio>
      )}
    </>
  );
}
