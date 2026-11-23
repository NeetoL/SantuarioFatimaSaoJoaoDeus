'use client';

import Link from 'next/link';
import { useAgora } from '@/components/hooks/useAgora';
import { IconeSeta } from '@/components/ui/icones';
import { dataCivilEmBrasilia, DIAS_DA_SEMANA, MESES_ABREV, MESES_EXTENSO, pad2 } from '@/lib/datas';
import {
  diaPorExtensoMaiusculo,
  programacaoDoDia,
  type QuadroDeHorarios,
  situacao,
} from '@/modules/Horarios/Domain/horarios';

/** Tudo o que acontece hoje no Santuário (missas, confissões, terços, adoração), com "Agora" e "Encerrado". */
export function HojeNoSantuario({
  quadro,
  agoraInicial,
  variante,
}: {
  quadro: QuadroDeHorarios;
  agoraInicial: number;
  variante: 'compacto' | 'completo';
}) {
  const hoje = dataCivilEmBrasilia(useAgora(agoraInicial));
  const itens = programacaoDoDia(quadro, hoje);
  const aberta = quadro.igrejaAberta[hoje.diaDaSemana] ?? null;
  const secretaria = quadro.secretaria[hoje.diaDaSemana] ?? null;
  const titulo = `${diaPorExtensoMaiusculo(hoje.diaDaSemana)}, ${hoje.dia} de ${MESES_EXTENSO[hoje.mes - 1]}`;

  // Versão curta (página inicial)
  if (variante === 'compacto') {
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

  // Versão completa (página Missas e Horários)
  return (
    <div className="grid md:grid-cols-[18rem_1fr]">
      <div className="secao-escura text-white p-7 sm:p-8 flex md:flex-col gap-6 md:gap-7">
        <div className="placa-data w-[5.25rem] h-[6.25rem] shrink-0" aria-hidden="true">
          <span className="font-caps font-semibold text-gold-300 text-[.75rem] tracking-[.22em]">
            {(DIAS_DA_SEMANA[hoje.diaDaSemana] ?? '').slice(0, 3)}
          </span>
          <span className="font-serif font-semibold leading-none text-[2.8rem] mt-0.5">{pad2(hoje.dia)}</span>
          <span className="font-caps font-semibold text-[.75rem] tracking-[.22em] mt-0.5">
            {MESES_ABREV[hoje.mes - 1]}
          </span>
        </div>
        <div className="min-w-0">
          <p className="eyebrow claro">Hoje no Santuário</p>
          <h2 className="font-serif font-semibold text-[1.7rem] leading-tight mt-2">{titulo}</h2>
          <dl className="mt-4 space-y-2.5 text-base">
            <div>
              <dt className="font-caps text-[.78rem] tracking-[.2em] text-gold-300">Igreja</dt>
              <dd className="text-white/85">{aberta ? `Aberta: ${aberta}` : 'Fechada hoje'}</dd>
            </div>
            <div>
              <dt className="font-caps text-[.78rem] tracking-[.2em] text-gold-300">Secretaria</dt>
              <dd className="text-white/85">{secretaria ?? 'Fechada hoje'}</dd>
            </div>
          </dl>
        </div>
      </div>
      <ol className="programacao px-6 sm:px-8 py-3" aria-label="Programação de hoje">
        {itens.length ? (
          itens.map((it) => {
            const s = situacao(it, hoje.minutosDoDia);
            return (
              <li key={`${it.inicio}-${it.nome}`} className={`item-dia${s ? ` ${s}` : ''}`}>
                <p className="hora">
                  {it.inicio}
                  {it.fim && <small>até {it.fim}</small>}
                </p>
                <div className="min-w-0">
                  <p className="font-caps text-[.8rem] font-semibold tracking-[.2em] text-gold-700">{it.tipo}</p>
                  <p className="font-serif font-semibold text-xl sm:text-[1.45rem] leading-tight text-navy-900 mt-0.5">
                    {it.nome}
                  </p>
                </div>
                {s === 'agora' ? (
                  <span className="agora-tag">Agora</span>
                ) : s === 'encerrado' ? (
                  <span className="font-caps text-[.75rem] tracking-[.18em] text-slate-600">Encerrado</span>
                ) : (
                  <span></span>
                )}
              </li>
            );
          })
        ) : (
          <li className="py-6">
            <p className="font-serif italic text-2xl text-navy-900">
              {aberta ? 'Hoje não há celebrações fixas.' : 'Hoje a igreja não abre.'}
            </p>
            <p className="mt-2 text-slate-600">
              {aberta
                ? `A igreja está aberta para oração pessoal: ${aberta}.`
                : 'Confira abaixo a programação dos outros dias da semana.'}
            </p>
            <Link
              href="/eventos"
              className="group mt-4 inline-flex items-center gap-2 text-[.875rem] font-semibold uppercase tracking-[.16em] text-navy-800 hover:text-gold-700"
            >
              Ver eventos <IconeSeta />
            </Link>
          </li>
        )}
      </ol>
    </div>
  );
}
