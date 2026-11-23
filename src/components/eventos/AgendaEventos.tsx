'use client';

import { useState } from 'react';
import { Cruz } from '@/components/ui/icones';
import { MESES_EXTENSO } from '@/lib/datas';
import type { EventoComFoto } from '@/modules/Eventos/Application/casos-de-uso';
import { type CategoriaDeEvento, PLURAL_DA_CATEGORIA } from '@/modules/Eventos/Domain/evento';
import { CardEvento } from './CardEvento';

type Agenda = { eventos: EventoComFoto[]; categorias: CategoriaDeEvento[] } | null;
type Filtro = 'todos' | CategoriaDeEvento;

/**
 * Agenda completa: título da seção + filtros por categoria (só as que têm evento)
 * e os eventos agrupados por mês.
 */
export function AgendaEventos({
  agenda,
  agoraInicial,
  titulo,
}: {
  agenda: Agenda;
  agoraInicial: number;
  titulo: React.ReactNode;
}) {
  const [filtro, setFiltro] = useState<Filtro>('todos');

  const filtrados = agenda?.eventos.filter((ev) => filtro === 'todos' || ev.categoria === filtro) ?? [];
  const porMes = new Map<string, EventoComFoto[]>();
  filtrados.forEach((ev) => porMes.set(ev.data.slice(0, 7), [...(porMes.get(ev.data.slice(0, 7)) ?? []), ev]));

  return (
    <>
      <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
        {titulo}
        {agenda && (
          <div
            id="filtros-eventos"
            className="self-start lg:self-auto inline-flex flex-wrap gap-1 p-1 rounded-sm bg-white ring-1 ring-ivory-200 shadow-sm"
            role="group"
            aria-label="Filtrar eventos por categoria"
          >
            {(['todos', ...agenda.categorias] as Filtro[]).map((c) => {
              const ativo = filtro === c;
              return (
                <button
                  key={c}
                  type="button"
                  aria-pressed={ativo}
                  onClick={() => setFiltro(c)}
                  className={`filtro px-4 py-2 rounded-sm text-[.875rem] font-semibold uppercase tracking-[.16em] transition-colors ${ativo ? 'bg-navy-900 text-white' : 'text-navy-900 hover:bg-ivory-100'}`}
                >
                  {c === 'todos' ? 'Todos' : PLURAL_DA_CATEGORIA[c]}
                </button>
              );
            })}
          </div>
        )}
      </div>

      <div id="lista-eventos" className="mt-12 space-y-16 sm:space-y-20" aria-live="polite">
        {!agenda ? (
          <div className="text-center py-16">
            <div className="divisor" aria-hidden="true">
              <Cruz />
            </div>
            <p className="mt-6 font-serif text-3xl text-navy-900">Nenhum evento agendado no momento.</p>
            <p className="mt-3 text-slate-600">Acompanhe os horários de missa e volte em breve.</p>
          </div>
        ) : porMes.size === 0 ? (
          <p className="text-center text-slate-600 py-10">Nenhum evento nesta categoria no momento.</p>
        ) : (
          [...porMes].map(([chave, eventos]) => {
            const [ano, mes = 1] = chave.split('-').map(Number);
            return (
              <section key={chave} aria-labelledby={`mes-${chave}`}>
                <header className="flex items-end gap-4 sm:gap-6">
                  <h3
                    id={`mes-${chave}`}
                    className="font-serif italic font-medium text-5xl sm:text-6xl text-navy-900 leading-none capitalize"
                  >
                    {MESES_EXTENSO[mes - 1]}
                  </h3>
                  <span className="font-caps text-base font-semibold tracking-[.3em] text-gold-700 pb-1">{ano}</span>
                  <span className="flex-1 h-px mb-2.5 bg-gradient-to-r from-gold-500/70 to-transparent"></span>
                  <span className="hidden sm:block pb-1 text-[.875rem] font-semibold uppercase tracking-[.16em] text-slate-600">
                    {eventos.length} {eventos.length === 1 ? 'evento' : 'eventos'}
                  </span>
                </header>
                <div className="mt-9 grid gap-x-7 gap-y-9 md:grid-cols-2 xl:grid-cols-3">
                  {eventos.map((evento) => (
                    <CardEvento key={evento.id} evento={evento} agoraInicial={agoraInicial} comDescricao ancora />
                  ))}
                </div>
              </section>
            );
          })
        )}
      </div>
    </>
  );
}
