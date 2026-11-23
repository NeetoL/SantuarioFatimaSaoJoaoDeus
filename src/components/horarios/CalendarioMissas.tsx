'use client';

import { useAgora } from '@/components/hooks/useAgora';
import { dataCivilEmBrasilia, DIAS_DA_SEMANA } from '@/lib/datas';
import type { DiaDeMissa } from '@/modules/Horarios/Domain/horarios';

/** Calendário de missas de domingo a sábado; o dia de hoje (em Brasília) aparece em destaque. */
export function CalendarioMissas({ dias, agoraInicial }: { dias: DiaDeMissa[]; agoraInicial: number }) {
  const hoje = dataCivilEmBrasilia(useAgora(agoraInicial)).diaDaSemana;
  return (
    <ol className="calendario grid gap-2.5 sm:gap-3 lg:grid-cols-7" aria-label="Missas de domingo a sábado">
      {dias.map((h, i) => {
        const ehHoje = i === hoje;
        return (
          <li
            key={h.dia}
            data-dia={i}
            className={`dia${h.fechado ? ' fechado' : ''}${ehHoje ? ' hoje' : ''}`}
            aria-current={ehHoje ? 'date' : undefined}
          >
            {ehHoje && <span className="selo-hoje">Hoje</span>}
            <div className="dia-topo">
              <p className="font-caps text-[.8rem] font-semibold tracking-[.26em] text-gold-400">
                {(DIAS_DA_SEMANA[i] ?? '').slice(0, 3)}
              </p>
              <p className="font-serif font-semibold text-xl lg:text-[1.6rem] leading-none mt-1.5">{h.dia}</p>
            </div>
            <div className="dia-corpo">
              {h.fechado ? (
                <>
                  <svg
                    className="w-6 h-6 text-white/60"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <rect x="5" y="11" width="14" height="10" rx="1.5"></rect>
                    <path d="M8 11V8a4 4 0 0 1 8 0v3"></path>
                  </svg>
                  <p className="font-serif italic text-xl text-white/75 mt-1">Igreja fechada</p>
                </>
              ) : (
                <>
                  {h.mensal && <span className="mensal">{h.mensal}</span>}
                  <ul className="horas">
                    {h.horas.map((hora) => (
                      <li key={hora}>{hora}</li>
                    ))}
                  </ul>
                  {h.nota && <p className="nota">{h.nota}</p>}
                </>
              )}
            </div>
          </li>
        );
      })}
    </ol>
  );
}
