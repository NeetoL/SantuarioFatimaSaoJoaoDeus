import { type Metadata } from 'next';
import Link from 'next/link';
import { ListaDeAtividades } from '@/components/painel/ListaDeAtividades';
import { CabecalhoDaPagina, Vazio } from '@/components/painel/Pagina';
import { painel } from '@/config/container';
import { exigirPermissao } from '@/modules/Acesso/Presentation/sessao';
import { type Area, AREAS, type FiltroDeAtividades } from '@/modules/Atividades/Domain/atividade';

export const metadata: Metadata = { title: 'Registro de atividades' };

const POR_PAGINA = 50;
const DATA = /^\d{4}-\d{2}-\d{2}$/;

const estilo =
  'h-11 w-full rounded-md border border-slate-300 bg-white px-3 text-base text-navy-950 focus:border-gold-500 focus:outline-none focus:ring-2 focus:ring-gold-400/30';

export default async function Atividades({
  searchParams,
}: {
  searchParams: Promise<{ area?: string; usuario?: string; desde?: string; ate?: string; pagina?: string }>;
}) {
  await exigirPermissao('atividades');
  const p = await searchParams;
  const filtro: FiltroDeAtividades = {
    area: p.area && p.area in AREAS ? (p.area as Area) : undefined,
    usuarioId: p.usuario && /^[0-9a-f-]{36}$/i.test(p.usuario) ? p.usuario : undefined,
    desde: p.desde && DATA.test(p.desde) ? p.desde : undefined,
    ate: p.ate && DATA.test(p.ate) ? p.ate : undefined,
  };
  const pagina = Math.max(1, Math.min(10_000, Number(p.pagina) || 1));
  const [{ itens, total }, usuarios] = await Promise.all([
    painel.atividades.listar(filtro, pagina, POR_PAGINA),
    painel.acesso.listarUsuarios(),
  ]);
  const paginas = Math.max(1, Math.ceil(total / POR_PAGINA));
  const link = (n: number) =>
    `?${new URLSearchParams({
      ...(filtro.area ? { area: filtro.area } : {}),
      ...(filtro.usuarioId ? { usuario: filtro.usuarioId } : {}),
      ...(filtro.desde ? { desde: filtro.desde } : {}),
      ...(filtro.ate ? { ate: filtro.ate } : {}),
      pagina: String(n),
    })}`;
  const filtrando = Boolean(filtro.area || filtro.usuarioId || filtro.desde || filtro.ate);

  return (
    <>
      <CabecalhoDaPagina
        titulo="Registro de atividades"
        descricao="Tudo o que é feito no painel: quem, o quê, onde e quando. O registro não pode ser alterado nem apagado — nem pelo Admin master."
      />

      <form className="mb-6 grid gap-3 rounded-lg bg-white p-4 shadow-sm ring-1 ring-black/5 sm:grid-cols-2 lg:grid-cols-[1fr_1fr_10rem_10rem_auto] lg:items-end">
        <div>
          <label htmlFor="area" className="mb-1 block text-sm font-semibold text-navy-900">
            Área
          </label>
          <select id="area" name="area" defaultValue={filtro.area ?? ''} className={estilo}>
            <option value="">Todas</option>
            {(Object.keys(AREAS) as Area[]).map((a) => (
              <option key={a} value={a}>
                {AREAS[a]}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="usuario" className="mb-1 block text-sm font-semibold text-navy-900">
            Pessoa
          </label>
          <select id="usuario" name="usuario" defaultValue={filtro.usuarioId ?? ''} className={estilo}>
            <option value="">Todas</option>
            {usuarios.map((u) => (
              <option key={u.id} value={u.id}>
                {u.nome}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="desde" className="mb-1 block text-sm font-semibold text-navy-900">
            De
          </label>
          <input id="desde" name="desde" type="date" defaultValue={filtro.desde} className={estilo} />
        </div>
        <div>
          <label htmlFor="ate" className="mb-1 block text-sm font-semibold text-navy-900">
            Até
          </label>
          <input id="ate" name="ate" type="date" defaultValue={filtro.ate} className={estilo} />
        </div>
        <div className="flex gap-2">
          <button type="submit" className="btn btn-escuro btn-sm flex-1 lg:flex-none">
            Filtrar
          </button>
          {filtrando && (
            <Link href="?" className="btn btn-sm text-navy-800 hover:bg-slate-100">
              Limpar
            </Link>
          )}
        </div>
      </form>

      <section className="rounded-lg bg-white p-5 shadow-sm ring-1 ring-black/5 sm:p-7">
        <p className="mb-5 text-sm text-slate-600">
          {total} {total === 1 ? 'registro' : 'registros'}
          {paginas > 1 && ` · página ${pagina} de ${paginas}`}
        </p>
        {itens.length ? <ListaDeAtividades itens={itens} mostrarIp /> : <Vazio>Nenhum registro encontrado.</Vazio>}
        {paginas > 1 && (
          <nav aria-label="Páginas" className="mt-6 flex items-center justify-between border-t border-slate-100 pt-5">
            {pagina > 1 ? (
              <Link href={link(pagina - 1)} className="btn btn-linha btn-sm">
                ← Mais recentes
              </Link>
            ) : (
              <span />
            )}
            {pagina < paginas && (
              <Link href={link(pagina + 1)} className="btn btn-linha btn-sm">
                Mais antigos →
              </Link>
            )}
          </nav>
        )}
      </section>
    </>
  );
}
