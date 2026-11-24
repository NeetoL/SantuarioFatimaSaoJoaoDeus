import { type Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { AvisoDeSucesso, CabecalhoDaPagina, dataBR, Etiqueta, LinkBotao, Vazio } from '@/components/painel/Pagina';
import { painel } from '@/config/container';
import { exigirPermissao } from '@/modules/Acesso/Presentation/sessao';

export const metadata: Metadata = { title: 'Notícias e recados' };

const AVISOS: Record<string, string> = {
  'noticia-criada': 'Notícia publicada. Ela já aparece no site.',
  'recado-criado': 'Recado publicado. Ele já aparece no site.',
  excluido: 'Excluído.',
};

const Seta = () => (
  <svg className="h-4 w-4 shrink-0 text-slate-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
    <path d="m9 18 6-6-6-6" />
  </svg>
);

export default async function Comunicados({ searchParams }: { searchParams: Promise<{ aviso?: string }> }) {
  await exigirPermissao('comunicados');
  const [{ aviso }, noticias, recados] = await Promise.all([
    searchParams,
    painel.comunicados.listarNoticias(),
    painel.comunicados.listarRecados(),
  ]);

  return (
    <>
      <CabecalhoDaPagina titulo="Notícias e recados" descricao="Recados são avisos curtos; notícias têm foto, data e texto maior." />
      <AvisoDeSucesso texto={aviso ? AVISOS[aviso] : null} />

      <section>
        <div className="mb-3 flex items-end justify-between gap-4">
          <h2 className="font-serif text-2xl font-semibold text-navy-900">Recados paroquiais</h2>
          <LinkBotao href="/painel-controle/comunicados/recados/novo" classe="btn-linha">
            + Novo recado
          </LinkBotao>
        </div>
        {recados.length ? (
          <ul className="divide-y divide-slate-100 overflow-hidden rounded-lg bg-white shadow-sm ring-1 ring-black/5">
            {recados.map((r) => (
              <li key={r.id}>
                <Link
                  href={`/painel-controle/comunicados/recados/${encodeURIComponent(r.id)}`}
                  className="flex items-center gap-4 px-5 py-3.5 transition-colors hover:bg-navy-50/60"
                >
                  <span className="min-w-0 flex-1">
                    <span className="flex flex-wrap items-center gap-2">
                      <span className="font-semibold text-navy-950">{r.titulo}</span>
                      {r.importante && <Etiqueta cor="vermelha">importante</Etiqueta>}
                    </span>
                    <span className="line-clamp-1 text-sm text-slate-600">{r.texto}</span>
                  </span>
                  <Seta />
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <Vazio>Nenhum recado no momento.</Vazio>
        )}
      </section>

      <section className="mt-10">
        <div className="mb-3 flex items-end justify-between gap-4">
          <h2 className="font-serif text-2xl font-semibold text-navy-900">Notícias</h2>
          <LinkBotao href="/painel-controle/comunicados/noticias/nova">+ Nova notícia</LinkBotao>
        </div>
        {noticias.length ? (
          <ul className="divide-y divide-slate-100 overflow-hidden rounded-lg bg-white shadow-sm ring-1 ring-black/5">
            {noticias.map((n) => (
              <li key={n.id}>
                <Link
                  href={`/painel-controle/comunicados/noticias/${encodeURIComponent(n.id)}`}
                  className="flex items-center gap-4 px-4 py-3.5 transition-colors hover:bg-navy-50/60 sm:px-5"
                >
                  <span className="relative h-14 w-20 shrink-0 overflow-hidden rounded bg-slate-100">
                    {n.imagem && <Image src={n.imagem} alt="" fill sizes="80px" className="object-cover" />}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block font-semibold text-navy-950">{n.titulo}</span>
                    <span className="block text-sm text-slate-600">
                      {n.categoria} · {dataBR(n.data)}
                    </span>
                  </span>
                  <Seta />
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <Vazio>Nenhuma notícia publicada.</Vazio>
        )}
      </section>
    </>
  );
}
