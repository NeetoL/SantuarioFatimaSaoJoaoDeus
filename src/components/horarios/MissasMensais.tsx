'use client';

import { useAgora } from '@/components/hooks/useAgora';
import {
  dataCivilEmBrasilia,
  DIAS_EXTENSO,
  diasEntre,
  hojeIsoEmBrasilia,
  MESES_ABREV,
  MESES_EXTENSO,
  pad2,
  partesDaData,
} from '@/lib/datas';
import { type MissaMensal, proximaPrimeira } from '@/modules/Horarios/Domain/horarios';

/**
 * Missas de uma vez por mês (1ª sexta, 1º sábado): cada uma num cartão escuro com moldura dupla dourada
 * e a próxima data em destaque, calculada a partir de hoje.
 */
export function MissasMensais({ mensais, agoraInicial }: { mensais: MissaMensal[]; agoraInicial: number }) {
  const agora = useAgora(agoraInicial);
  const hoje = dataCivilEmBrasilia(agora);
  return (
    <>
      {mensais.map((m) => {
        const data = proximaPrimeira(m.diaDaSemana, hoje);
        const { dia, mes, diaDaSemana } = partesDaData(data);
        const dias = diasEntre(hojeIsoEmBrasilia(agora), data);
        const rotulo = dias === 0 ? 'É hoje' : dias === 1 ? 'Amanhã' : `Em ${dias} dias`;
        return (
          <article
            key={m.titulo}
            className="grao moldura-dupla relative overflow-hidden rounded-md secao-escura text-white px-6 py-7 sm:px-9 sm:py-9 flex flex-col sm:flex-row sm:items-center gap-6 sm:gap-9"
          >
            <div
              className="pointer-events-none absolute -right-16 -top-20 h-64 w-64 rounded-full bg-gold-500/15 blur-3xl"
              aria-hidden="true"
            ></div>
            <div className="relative shrink-0 text-center sm:w-28" aria-hidden="true">
              <span className="block font-caps text-[.72rem] font-semibold tracking-[.26em] text-gold-300">
                {(DIAS_EXTENSO[diaDaSemana] ?? '').slice(0, 3)}
              </span>
              <span className="block font-serif font-semibold text-[5rem] leading-[.85] mt-1 texto-ouro">
                {pad2(dia)}
              </span>
              <span className="block font-caps text-[.75rem] font-semibold tracking-[.26em] text-white/80 mt-1">
                {MESES_ABREV[mes - 1]}
              </span>
            </div>
            <div className="relative min-w-0 sm:border-l sm:border-white/15 sm:pl-9">
              <p className="font-caps text-[.75rem] font-semibold tracking-[.2em] text-gold-300">
                {m.quando} · {m.hora}
              </p>
              <h3 className="mt-2 font-serif font-semibold text-[1.75rem] sm:text-[2rem] leading-tight">{m.titulo}</h3>
              <p className="mt-3 text-base text-white/80">
                Próxima:{' '}
                <strong className="font-semibold text-white">
                  {DIAS_EXTENSO[diaDaSemana]}, {dia} de {MESES_EXTENSO[mes - 1]}
                </strong>
              </p>
              <span className="mt-4 inline-block rounded-sm bg-gold-500 px-2.5 py-1 font-caps text-[.72rem] font-semibold tracking-[.16em] text-navy-950">
                {rotulo}
              </span>
            </div>
          </article>
        );
      })}
    </>
  );
}
