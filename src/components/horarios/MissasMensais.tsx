'use client';

import { useAgora } from '@/components/hooks/useAgora';
import { PlacaData } from '@/components/eventos/PlacaData';
import {
  dataCivilEmBrasilia,
  DIAS_EXTENSO,
  diasEntre,
  hojeIsoEmBrasilia,
  MESES_EXTENSO,
  partesDaData,
} from '@/lib/datas';
import { type MissaMensal, proximaPrimeira } from '@/modules/Horarios/Domain/horarios';

/** Próxima data de cada missa mensal (1ª sexta, 1º sábado), calculada a partir de hoje. */
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
            className="group flex items-center gap-6 rounded-md bg-white ring-1 ring-ivory-200 p-5 sm:p-6 hover:shadow-xl hover:shadow-navy-950/10 transition-shadow"
          >
            <PlacaData
              data={data}
              className="w-[5.25rem] h-[6.25rem] shrink-0"
              tamanhos={[
                'text-[.75rem] tracking-[.22em]',
                'text-[2.8rem] mt-0.5',
                'text-[.75rem] tracking-[.22em] mt-0.5',
              ]}
            />
            <div className="min-w-0">
              <p className="font-caps text-[.8rem] font-semibold tracking-[.2em] text-gold-700">
                {m.quando} · {m.hora}
              </p>
              <h3 className="mt-1.5 font-serif font-semibold text-2xl sm:text-[1.7rem] leading-tight text-navy-900">
                {m.titulo}
              </h3>
              <p className="mt-2 text-base text-slate-600">
                Próxima:{' '}
                <strong className="font-semibold text-navy-800">
                  {DIAS_EXTENSO[diaDaSemana]}, {dia} de {MESES_EXTENSO[mes - 1]}
                </strong>{' '}
                <span className="ml-1 font-caps text-[.8rem] font-semibold tracking-[.16em] text-wine-700">
                  {rotulo}
                </span>
              </p>
            </div>
          </article>
        );
      })}
    </>
  );
}
