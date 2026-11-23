'use client';

import { useAgora } from '@/components/hooks/useAgora';
import { dataCivilEmBrasilia, MESES_EXTENSO } from '@/lib/datas';
import {
  diaPorExtensoMaiusculo,
  programacaoDoDia,
  type QuadroDeHorarios,
  situacao,
} from '@/modules/Horarios/Domain/horarios';

/**
 * Hoje no Santuário (página inicial): o que acontece hoje — missas, confissões, terços e adoração —
 * em fichas com a hora, marcando "Agora" e "Encerrado".
 */
export function HojeNoSantuario({ quadro, agoraInicial }: { quadro: QuadroDeHorarios; agoraInicial: number }) {
  const hoje = dataCivilEmBrasilia(useAgora(agoraInicial));
  const itens = programacaoDoDia(quadro, hoje);
  const aberta = quadro.igrejaAberta[hoje.diaDaSemana] ?? null;
  const titulo = `${diaPorExtensoMaiusculo(hoje.diaDaSemana)}, ${hoje.dia} de ${MESES_EXTENSO[hoje.mes - 1]}`;

  return (
    <div className="rounded-md bg-white ring-1 ring-ivory-200 px-5 sm:px-7 py-5 flex flex-col lg:flex-row lg:items-center gap-4 lg:gap-8">
      <div className="shrink-0">
        <p className="eyebrow">Hoje no Santuário</p>
        <p className="font-serif font-semibold text-2xl text-navy-900 mt-1">{titulo}</p>
        <p className="text-base text-slate-600 mt-0.5">{aberta ? `Igreja aberta: ${aberta}` : 'Igreja fechada'}</p>
      </div>
      <ul className="flex flex-wrap gap-2 lg:border-l lg:border-ivory-200 lg:pl-8">
        {itens.length ? (
          itens.map((it) => {
            const s = situacao(it, hoje.minutosDoDia);
            return (
              <li key={`${it.inicio}-${it.nome}`} className={`chip-dia${s ? ` ${s}` : ''}`}>
                <strong>{it.inicio}</strong>
                {it.tipo === 'Confissões' ? 'Confissões' : it.nome}
                {s === 'agora' && <span className="agora-tag">Agora</span>}
              </li>
            );
          })
        ) : (
          <li className="text-slate-600 italic font-texto text-lg">
            {aberta ? 'Sem celebrações fixas hoje.' : 'Sem celebrações hoje.'}
          </li>
        )}
      </ul>
    </div>
  );
}
