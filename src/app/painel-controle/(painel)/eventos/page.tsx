import { type Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { AvisoDeSucesso, CabecalhoDaPagina, Etiqueta, LinkBotao, Vazio } from '@/components/painel/Pagina';
import { painel } from '@/config/container';
import { hojeIsoEmBrasilia, MESES_ABREV } from '@/lib/datas';
import { exigirPermissao } from '@/modules/Acesso/Presentation/sessao';
import { type Evento } from '@/modules/Eventos/Domain/evento';

export const metadata: Metadata = { title: 'Eventos' };

const AVISOS: Record<string, string> = { criado: 'Evento criado. Ele já aparece no site.', excluido: 'Evento excluído.' };

function Linha({ evento, passado }: { evento: Evento; passado?: boolean }) {
  const [, mes, dia] = evento.data.split('-');
  return (
    <li>
      <Link
        href={`/painel-controle/eventos/${encodeURIComponent(evento.id)}`}
        className={`flex items-center gap-4 px-4 py-3.5 transition-colors hover:bg-navy-50/60 sm:px-5 ${passado ? 'opacity-70' : ''}`}
      >
        <span className="grid w-14 shrink-0 place-items-center rounded-md bg-navy-900 py-1.5 text-white">
          <span className="font-serif text-2xl font-semibold leading-none">{dia}</span>
          <span className="mt-0.5 font-caps text-[.65rem] uppercase tracking-widest text-gold-300">{MESES_ABREV[Number(mes) - 1]}</span>
        </span>
        <span className="min-w-0 flex-1">
          <span className="flex flex-wrap items-center gap-2">
            <span className="font-semibold text-navy-950">{evento.titulo}</span>
            {evento.destaque && <Etiqueta cor="ouro">destaque</Etiqueta>}
          </span>
          <span className="block truncate text-sm text-slate-600">
            {evento.categoria} · {evento.hora} · {evento.local}
          </span>
        </span>
        {evento.imagem && (
          <span className="relative hidden h-12 w-20 shrink-0 overflow-hidden rounded bg-slate-100 sm:block">
            <Image src={evento.imagem} alt="" fill sizes="80px" className="object-cover" />
          </span>
        )}
        <svg className="h-4 w-4 shrink-0 text-slate-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
          <path d="m9 18 6-6-6-6" />
        </svg>
      </Link>
    </li>
  );
}

export default async function Eventos({ searchParams }: { searchParams: Promise<{ aviso?: string }> }) {
  await exigirPermissao('eventos');
  const [{ aviso }, eventos] = await Promise.all([searchParams, painel.eventos.listar()]);
  const hoje = hojeIsoEmBrasilia(new Date());
  const proximos = eventos.filter((e) => e.data >= hoje).sort((a, b) => (a.data + a.hora).localeCompare(b.data + b.hora));
  const passados = eventos.filter((e) => e.data < hoje).sort((a, b) => b.data.localeCompare(a.data));

  return (
    <>
      <CabecalhoDaPagina
        titulo="Eventos"
        descricao="Missas especiais, novenas, festas e avisos com data. Cada evento sai do site sozinho 2 horas depois de começar."
        acao={<LinkBotao href="/painel-controle/eventos/novo">+ Novo evento</LinkBotao>}
      />
      <AvisoDeSucesso texto={aviso ? AVISOS[aviso] : null} />

      <h2 className="mb-3 font-serif text-2xl font-semibold text-navy-900">Próximos</h2>
      {proximos.length ? (
        <ul className="divide-y divide-slate-100 overflow-hidden rounded-lg bg-white shadow-sm ring-1 ring-black/5">
          {proximos.map((e) => (
            <Linha key={e.id} evento={e} />
          ))}
        </ul>
      ) : (
        <Vazio>Nenhum evento marcado. Que tal criar o próximo?</Vazio>
      )}

      {passados.length > 0 && (
        <details className="group mt-10">
          <summary className="flex cursor-pointer list-none items-center gap-2 font-serif text-2xl font-semibold text-navy-900 [&::-webkit-details-marker]:hidden">
            <svg className="h-4 w-4 transition-transform group-open:rotate-90" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24" aria-hidden="true">
              <path d="m9 18 6-6-6-6" />
            </svg>
            Já aconteceram <span className="font-sans text-base font-normal text-slate-600">({passados.length})</span>
          </summary>
          <ul className="mt-3 divide-y divide-slate-100 overflow-hidden rounded-lg bg-white shadow-sm ring-1 ring-black/5">
            {passados.map((e) => (
              <Linha key={e.id} evento={e} passado />
            ))}
          </ul>
        </details>
      )}
    </>
  );
}
