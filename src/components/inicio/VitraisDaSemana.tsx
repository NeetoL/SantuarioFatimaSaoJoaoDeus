'use client';

import { useAgora } from '@/components/hooks/useAgora';
import { dataCivilEmBrasilia, DIAS_DA_SEMANA } from '@/lib/datas';
import { type DiaDeMissa } from '@/modules/Horarios/Domain/horarios';

/**
 * Missas da semana em sete painéis, como vitrais: no computador, lado a lado; no celular, uma linha por dia.
 * O dia de hoje (em Brasília) acende em dourado.
 */
export function VitraisDaSemana({ dias, agoraInicial }: { dias: DiaDeMissa[]; agoraInicial: number }) {
  const hoje = dataCivilEmBrasilia(useAgora(agoraInicial)).diaDaSemana;
  return (
    <ol className="vitrais" aria-label="Missas de domingo a sábado">
      {dias.map((d, i) => {
        const ehHoje = i === hoje;
        return (
          <li
            key={d.dia}
            className={`vitral${d.fechado ? ' fechado' : ''}${ehHoje ? ' hoje' : ''}`}
            aria-current={ehHoje ? 'date' : undefined}
          >
            {ehHoje && <span className="vitral-selo">Hoje</span>}
            <div className="vitral-dia">
              <span className="font-caps text-[.7rem] font-semibold tracking-[.26em] text-gold-300">
                {(DIAS_DA_SEMANA[i] ?? '').slice(0, 3)}
              </span>
              <span className="mt-1 block font-serif text-[1.45rem] lg:text-[1.55rem] font-semibold leading-none text-white">
                {d.dia}
              </span>
            </div>
            <span className="vitral-fio" aria-hidden="true"></span>
            <div className="vitral-horas">
              {d.fechado ? (
                <span className="inline-flex items-center gap-2 font-serif italic text-xl text-white/70">
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <rect x="5" y="11" width="14" height="10" rx="1.5"></rect>
                    <path d="M8 11V8a4 4 0 0 1 8 0v3"></path>
                  </svg>
                  Igreja fechada
                </span>
              ) : (
                <>
                  {d.mensal && <span className="mensal">{d.mensal}</span>}
                  <ul className="vitral-lista">
                    {d.horas.map((hora) => (
                      <li key={hora}>{hora}</li>
                    ))}
                  </ul>
                </>
              )}
            </div>
            {!d.fechado && d.nota && <p className="vitral-nota">{d.nota}</p>}
          </li>
        );
      })}
    </ol>
  );
}
