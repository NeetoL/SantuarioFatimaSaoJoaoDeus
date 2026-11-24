import { anotador, type Ator, type Registrar } from '@/modules/Atividades/Domain/atividade';
import { validar } from '@/shared/Application/validacao';
import { type QuadroDeHorarios } from '../Domain/horarios';
import { type GestaoDeHorarios } from '../Domain/repositorio';
import { esquemaQuadroDeHorarios } from '../Domain/validacao';

const PARTES: Record<keyof QuadroDeHorarios, string> = {
  missasDaSemana: 'missas da semana',
  missasMensais: 'missas votivas',
  confissoes: 'confissões',
  tercos: 'terços',
  adoracao: 'adoração',
  igrejaAberta: 'igreja aberta',
  secretaria: 'secretaria',
  secretariaFechaNosFeriados: 'secretaria nos feriados',
};

/** Painel: o quadro de horários inteiro (missas, devoções, igreja e secretaria). */
export function criarGestaoDeHorarios({ repositorio, registrar }: { repositorio: GestaoDeHorarios; registrar: Registrar }) {
  return {
    obter: () => repositorio.obterQuadro(),

    async salvar(ator: Ator, dados: unknown) {
      const novo = validar(esquemaQuadroDeHorarios, dados);
      const antes = await repositorio.obterQuadro();
      await repositorio.salvar(novo);
      const mudou = (Object.keys(PARTES) as (keyof QuadroDeHorarios)[])
        .filter((parte) => JSON.stringify(antes[parte]) !== JSON.stringify(novo[parte]))
        .map((parte) => PARTES[parte]);
      await anotador(registrar, ator, 'horarios')(
        'editou',
        'Quadro de horários',
        mudou.length ? `Alterado: ${mudou.join(', ')}.` : 'Nenhuma mudança.',
      );
    },
  };
}

export type GestaoDeHorariosDoPainel = ReturnType<typeof criarGestaoDeHorarios>;
