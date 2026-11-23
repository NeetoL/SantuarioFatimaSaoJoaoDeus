'use client';

import { useAgora } from '@/components/hooks/useAgora';
import { dataCivilEmBrasilia } from '@/lib/datas';
import { diaPorExtensoMaiusculo, faixasDoHorario } from '@/modules/Horarios/Domain/horarios';

/** Horário dia a dia (igreja aberta ou secretaria), de domingo a sábado, com o dia de hoje marcado. */
export function TabelaDeHorarios({
  horarios,
  fechaNosFeriados = false,
  agoraInicial,
}: {
  horarios: (string | null)[];
  fechaNosFeriados?: boolean;
  agoraInicial: number;
}) {
  const hoje = dataCivilEmBrasilia(useAgora(agoraInicial)).diaDaSemana;
  return (
    <>
      {horarios.map((horario, dia) => {
        const ehHoje = dia === hoje;
        return (
          <li key={dia} className={[ehHoje && 'e-hoje', !horario && 'fechada'].filter(Boolean).join(' ') || undefined}>
            <span className="rotulo">
              {diaPorExtensoMaiusculo(dia)}
              {ehHoje && <span className="tag-hoje">Hoje</span>}
            </span>
            <span className="pontos" aria-hidden="true"></span>
            <span className="hora">
              {horario
                ? faixasDoHorario(horario).map((faixa) => (
                    <span key={faixa} className="block">
                      {faixa}
                    </span>
                  ))
                : 'Fechada'}
            </span>
          </li>
        );
      })}
      {fechaNosFeriados && (
        <li className="fechada">
          <span className="rotulo">Feriados</span>
          <span className="pontos" aria-hidden="true"></span>
          <span className="hora">Fechada</span>
        </li>
      )}
    </>
  );
}
