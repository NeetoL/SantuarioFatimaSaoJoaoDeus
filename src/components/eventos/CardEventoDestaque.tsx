import Image from 'next/image';
import { Cruz, IconeLocal, IconeRelogio } from '@/components/ui/icones';
import { diaEData } from '@/lib/datas';
import { type EventoComFoto } from '@/modules/Eventos/Application/casos-de-uso';
import { AcoesDoEvento } from './AcoesDoEvento';
import { PlacaData } from './PlacaData';
import { SeloDeTempo } from './SeloDeTempo';

/** Card grande: banner com foto, placa da data e contagem. */
export function CardEventoDestaque({ evento, agoraInicial }: { evento: EventoComFoto; agoraInicial: number }) {
  return (
    <article className="group relative isolate overflow-hidden rounded-md ring-1 ring-gold-500/30 shadow-[0_40px_90px_-30px_rgba(0,0,0,.75)]">
      <Image
        src={evento.foto}
        alt=""
        fill
        sizes="(min-width: 1280px) 1216px, 100vw"
        className="absolute inset-0 -z-20 w-full h-full object-cover transition-transform duration-[2500ms] ease-out group-hover:scale-105"
      />
      <div className="absolute inset-0 -z-10 bg-gradient-to-t from-navy-950 via-navy-950/80 to-navy-950/5 lg:bg-gradient-to-r lg:from-navy-950 lg:via-navy-950/85 lg:to-navy-950/0"></div>
      <div className="flex flex-col lg:flex-row lg:items-center gap-7 lg:gap-12 px-6 pt-52 pb-8 sm:px-10 sm:pt-72 sm:pb-11 lg:px-14 lg:py-14 lg:min-h-[33rem]">
        <PlacaData
          data={evento.data}
          className="w-[7.5rem] h-[8.75rem] sm:w-36 sm:h-[10.5rem] shrink-0 shadow-2xl"
          tamanhos={[
            'text-[.8rem] tracking-[.26em]',
            'text-6xl sm:text-7xl mt-1.5',
            'text-[.8rem] tracking-[.26em] mt-1.5',
          ]}
          porExtenso
        />
        <div className="max-w-2xl text-white">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
            <span className="font-caps text-[.8rem] font-semibold tracking-[.22em] px-2.5 py-1 border border-gold-400/60 text-gold-300 rounded-sm">
              {evento.categoria}
            </span>
            <SeloDeTempo evento={evento} agoraInicial={agoraInicial} tema="claro" />
          </div>
          <h3 className="mt-4 font-serif font-semibold text-[2.15rem] sm:text-5xl lg:text-[3.6rem] leading-[1.05]">
            {evento.titulo}
          </h3>
          <div className="divisor esquerda mt-6" aria-hidden="true">
            <Cruz />
          </div>
          <ul className="mt-5 flex flex-wrap gap-x-7 gap-y-2 text-[1.0625rem] text-white/85">
            <li className="flex items-center gap-2">
              <IconeRelogio className="text-gold-400" />
              {diaEData(evento.data)} · {evento.hora}
            </li>
            <li className="flex items-center gap-2">
              <IconeLocal className="text-gold-400" />
              {evento.local}
            </li>
          </ul>
          <p className="mt-5 font-texto italic text-lg sm:text-xl leading-relaxed text-white/80">{evento.descricao}</p>
          <AcoesDoEvento evento={evento} variante="destaque" />
        </div>
      </div>
    </article>
  );
}
