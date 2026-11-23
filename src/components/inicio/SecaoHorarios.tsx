import Link from 'next/link';
import { HojeNoSantuario } from '@/components/horarios/HojeNoSantuario';
import { IconeSeta } from '@/components/ui/icones';
import { type QuadroDeHorarios } from '@/modules/Horarios/Domain/horarios';
import { VitraisDaSemana } from './VitraisDaSemana';

/** Horários de Missa: a semana em painéis (vitrais) e o que acontece hoje (src/mocks/horarios.ts). */
export function SecaoHorarios({ quadro, agora }: { quadro: QuadroDeHorarios; agora: number }) {
  return (
    <section id="horarios" className={`relative scroll-mt-24 bg-ivory-100 pt-20 sm:pt-28 pb-20 sm:pb-28`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <header className="text-center reveal">
          <p className="eyebrow">Calendário semanal</p>
          <h2 className="mt-5 font-serif font-semibold text-[2.7rem] sm:text-6xl lg:text-7xl leading-[1] tracking-[-0.015em] text-navy-900">
            Horários de Missa
          </h2>
          <p className="mt-5 text-lg text-slate-600">Celebrações fixas do Santuário, todas as semanas.</p>
        </header>
        <div className="mt-14 sm:mt-20 reveal">
          <VitraisDaSemana dias={quadro.missasDaSemana} agoraInicial={agora} />
        </div>
        {/* Hoje no Santuário: missas, confissões e terços do dia */}
        <div className="mt-6 reveal" data-hoje-santuario="compacto">
          <HojeNoSantuario quadro={quadro} agoraInicial={agora} />
        </div>
        <div className="mt-12 text-center">
          <Link href="/missas" className="btn btn-escuro group">
            Todos os horários
            <IconeSeta className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>
      </div>
    </section>
  );
}
