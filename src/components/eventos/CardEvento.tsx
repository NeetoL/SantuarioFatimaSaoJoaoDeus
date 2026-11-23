import Image from 'next/image';
import Link from 'next/link';
import { type EventoComFoto } from '@/modules/Eventos/Application/casos-de-uso';
import { AcoesDoEvento } from './AcoesDoEvento';
import { PlacaData } from './PlacaData';
import { SeloDeTempo } from './SeloDeTempo';

/**
 * Card de evento: foto, placa da data sobre a borda e detalhes. Usado no servidor e na agenda (navegador).
 * `ancora` dá ao card o id do evento (a agenda da página Eventos), para links como /eventos#id;
 * `linkDosDetalhes` faz do título um link para os detalhes (página inicial).
 */
export function CardEvento({
  evento,
  agoraInicial,
  comDescricao = false,
  ancora = false,
  linkDosDetalhes,
}: {
  evento: EventoComFoto;
  agoraInicial: number;
  comDescricao?: boolean;
  ancora?: boolean;
  linkDosDetalhes?: string;
}) {
  return (
    <article
      id={ancora ? evento.id : undefined}
      className="cartao-alvo scroll-mt-28 group flex flex-col overflow-hidden rounded-md bg-white ring-1 ring-ivory-200 shadow-[0_1px_2px_rgba(8,26,51,.05)] hover:shadow-2xl hover:shadow-navy-950/20 hover:-translate-y-1 transition duration-500"
    >
      <div className="relative aspect-[16/10] img-fallback">
        <div className="absolute inset-0 overflow-hidden">
          <Image
            src={evento.foto}
            alt=""
            fill
            sizes="(min-width: 1280px) 400px, (min-width: 768px) 50vw, 100vw"
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-navy-950/70 via-navy-950/5 to-navy-950/20"></div>
        <span className="absolute top-4 left-4 font-caps text-[.8rem] font-semibold tracking-[.2em] px-2.5 py-1 rounded-sm bg-navy-950/55 text-white ring-1 ring-white/25 backdrop-blur-sm">
          {evento.categoria}
        </span>
        <PlacaData
          data={evento.data}
          className="absolute left-5 -bottom-10 w-[4.9rem] h-[5.75rem] shadow-xl"
          tamanhos={['text-[.75rem] tracking-[.22em]', 'text-[2.6rem] mt-0.5', 'text-[.75rem] tracking-[.22em] mt-0.5']}
        />
      </div>
      <div className="flex flex-1 flex-col px-6 pb-5 pt-[3.25rem]">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
          <p className="font-caps text-[.8rem] font-semibold tracking-[.18em] text-gold-700">
            {evento.hora} · {evento.local}
          </p>
          <SeloDeTempo evento={evento} agoraInicial={agoraInicial} tema="escuro" />
        </div>
        <h3 className="mt-2 font-serif font-semibold text-[1.65rem] leading-tight text-navy-900">
          {linkDosDetalhes ? (
            <Link href={linkDosDetalhes} className="hover:text-gold-700 transition-colors">
              {evento.titulo}
            </Link>
          ) : (
            evento.titulo
          )}
        </h3>
        {comDescricao && <p className="mt-2.5 text-[1.0625rem] leading-relaxed text-slate-600">{evento.descricao}</p>}
        <div className="mt-auto pt-5">
          <AcoesDoEvento evento={evento} variante="card" />
        </div>
      </div>
    </article>
  );
}
