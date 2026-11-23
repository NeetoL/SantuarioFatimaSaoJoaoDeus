'use client';

import { useAgora } from '@/components/hooks/useAgora';
import { type Evento, seloDeTempo } from '@/modules/Eventos/Domain/evento';

/** "Começa em 40 min", "Acontecendo agora", "Amanhã às 18h00", "Em 3 dias" — atualiza sozinho. */
export function SeloDeTempo({
  evento,
  agoraInicial,
  tema,
}: {
  evento: Pick<Evento, 'data' | 'hora'>;
  agoraInicial: number;
  tema: 'claro' | 'escuro';
}) {
  const selo = seloDeTempo(evento, useAgora(agoraInicial));
  if (!selo.texto) return null;
  const corDoPonto = tema === 'claro' ? 'bg-gold-400' : 'bg-wine-700';
  return (
    <span
      className={`inline-flex items-center gap-2 font-caps text-[.8rem] font-semibold tracking-[.2em] ${tema === 'claro' ? 'text-gold-300' : 'text-wine-700'}`}
    >
      {selo.vivo && (
        <span className="relative flex w-2 h-2">
          <span className={`absolute inset-0 rounded-full ${corDoPonto} opacity-75 animate-ping`}></span>
          <span className={`relative w-2 h-2 rounded-full ${corDoPonto}`}></span>
        </span>
      )}
      {selo.texto}
    </span>
  );
}
