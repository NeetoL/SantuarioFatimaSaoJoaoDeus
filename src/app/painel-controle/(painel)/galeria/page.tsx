import { type Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { FormularioDeAlbum } from '@/components/painel/Galeria';
import { AvisoDeSucesso, CabecalhoDaPagina, Cartao, dataBR, Vazio } from '@/components/painel/Pagina';
import { painel } from '@/config/container';
import { exigirPermissao } from '@/modules/Acesso/Presentation/sessao';
import { criarAlbum } from './acoes';

export const metadata: Metadata = { title: 'Galeria de fotos' };

export default async function Galeria({ searchParams }: { searchParams: Promise<{ aviso?: string }> }) {
  await exigirPermissao('galeria');
  const [{ aviso }, albuns] = await Promise.all([searchParams, painel.galeria.listar()]);

  return (
    <>
      <CabecalhoDaPagina
        titulo="Galeria de fotos"
        descricao="Um álbum para cada evento ou celebração. Crie o álbum e depois envie as fotos."
      />
      <AvisoDeSucesso texto={aviso === 'excluido' ? 'Álbum excluído.' : null} />

      <Cartao titulo="Novo álbum" className="mb-10">
        <FormularioDeAlbum acao={criarAlbum} />
      </Cartao>

      <h2 className="mb-4 font-serif text-2xl font-semibold text-navy-900">
        Álbuns <span className="font-sans text-base font-normal text-slate-600">({albuns.length})</span>
      </h2>
      {albuns.length ? (
        <ul className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {albuns.map((a) => {
            const capa = a.fotos[a.capa ?? 0] ?? a.fotos[0];
            return (
              <li key={a.id}>
                <Link
                  href={`/painel-controle/galeria/${encodeURIComponent(a.id)}`}
                  className="group block overflow-hidden rounded-lg bg-white shadow-sm ring-1 ring-black/5 transition hover:-translate-y-0.5 hover:shadow-md"
                >
                  <span className="relative block aspect-[16/10] bg-slate-100">
                    {capa ? (
                      <Image src={capa.foto} alt="" fill sizes="(min-width: 1280px) 30vw, (min-width: 640px) 45vw, 100vw" className="object-cover" />
                    ) : (
                      <span className="absolute inset-0 grid place-items-center text-sm text-slate-600">Sem fotos ainda</span>
                    )}
                    <span className="absolute bottom-2 right-2 rounded bg-navy-950/80 px-2 py-0.5 text-xs font-semibold text-white">
                      {a.fotos.length} foto{a.fotos.length === 1 ? '' : 's'}
                    </span>
                  </span>
                  <span className="block p-4">
                    <span className="block font-semibold text-navy-950 group-hover:text-navy-800">{a.titulo}</span>
                    <span className="block text-sm text-slate-600">{a.data ? dataBR(a.data) : 'Sem data'}</span>
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      ) : (
        <Vazio>Nenhum álbum ainda.</Vazio>
      )}
    </>
  );
}
