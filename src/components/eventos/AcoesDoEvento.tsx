'use client';

import { useAvisar } from '@/components/layout/Avisos';
import { IconeAgenda, IconePartilha } from '@/components/ui/icones';
import { diaEData } from '@/lib/datas';
import { type Evento } from '@/modules/Eventos/Domain/evento';

type Props = { evento: Pick<Evento, 'id' | 'titulo' | 'data' | 'hora' | 'local'>; variante: 'destaque' | 'card' };

/** "Salvar na agenda" (arquivo .ics gerado pela API) e "Compartilhar" (celular: lista de apps; computador: WhatsApp). */
export function AcoesDoEvento({ evento, variante }: Props) {
  const avisar = useAvisar();
  const arquivo = `/api/eventos/${encodeURIComponent(evento.id)}/agenda`;
  const aoSalvar = () => avisar('Abra o arquivo baixado para adicionar à sua agenda', 2600);

  async function compartilhar() {
    const texto = `${evento.titulo}\n${diaEData(evento.data)}, às ${evento.hora}\n${evento.local} — Santuário N. Sra. de Fátima e S. João de Deus`;
    const url = new URL('/eventos', window.location.href).href;
    if (navigator.share) {
      try {
        await navigator.share({ title: evento.titulo, text: texto, url });
      } catch {
        /* a pessoa desistiu de compartilhar */
      }
      return;
    }
    window.open(`https://wa.me/?text=${encodeURIComponent(`${texto}\n${url}`)}`, '_blank', 'noopener');
  }

  if (variante === 'destaque') {
    return (
      <div className="mt-8 flex flex-wrap gap-3">
        <a href={arquivo} download className="btn btn-ouro" onClick={aoSalvar}>
          <IconeAgenda />
          Salvar na agenda
        </a>
        <button type="button" className="btn btn-vidro" onClick={compartilhar}>
          <IconePartilha />
          Compartilhar
        </button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-6 border-t border-ivory-200 pt-4 text-[.875rem] font-semibold uppercase tracking-[.14em] text-navy-800">
      <a
        href={arquivo}
        download
        className="inline-flex items-center gap-1.5 hover:text-gold-700 transition-colors"
        onClick={aoSalvar}
      >
        <IconeAgenda className="w-4 h-4" />
        Agenda
      </a>
      <button
        type="button"
        className="inline-flex items-center gap-1.5 hover:text-gold-700 transition-colors uppercase tracking-[.14em]"
        onClick={compartilhar}
      >
        <IconePartilha className="w-4 h-4" />
        Compartilhar
      </button>
    </div>
  );
}
