import { z } from 'zod';
import { textoOpcional } from '@/shared/Domain/imagem';
import { type QuadroDeHorarios } from './horarios';

/** "7h", "17h15" */
const HORA = /^\d{1,2}h(\d{2})?$/;
/** "18h", "9h às 12h", "9h às 12h e 14h às 19h" */
const FAIXAS = /^\d{1,2}h(\d{2})?( às \d{1,2}h(\d{2})?)?( e \d{1,2}h(\d{2})?( às \d{1,2}h(\d{2})?)?)*$/;

export const esquemaHora = z.string().trim().regex(HORA, { error: 'Hora no formato 7h ou 17h15.' });
export const esquemaFaixas = z
  .string()
  .trim()
  .regex(FAIXAS, { error: 'Horário no formato 9h às 12h (várias faixas separadas por " e ").' });

const dia = z.number().int().min(0).max(6);
const dias = z.array(dia).min(1, { error: 'Marque pelo menos um dia.' }).max(7);

/** Validação do quadro de horários inteiro (painel e leitura do banco). */
export const esquemaQuadroDeHorarios = z.object({
  missasDaSemana: z
    .array(
      z.object({
        dia: z.string().trim().min(1).max(20),
        horas: z.array(esquemaHora).max(8),
        nota: textoOpcional(160),
        missa: textoOpcional(80),
        fechado: z.boolean().optional(),
        mensal: textoOpcional(40),
      }),
    )
    .length(7),
  missasMensais: z
    .array(
      z.object({
        titulo: z.string().trim().min(1).max(120),
        quando: z.string().trim().min(1).max(80),
        diaDaSemana: dia,
        hora: z.string().trim().min(1).max(40),
      }),
    )
    .max(10),
  confissoes: z.array(z.object({ dias, horario: esquemaFaixas })).max(10),
  tercos: z.array(z.object({ titulo: z.string().trim().min(1).max(80), dias, horario: esquemaFaixas })).max(10),
  adoracao: z.array(z.object({ dias, horario: esquemaFaixas, obs: textoOpcional(120) })).max(10),
  igrejaAberta: z.array(esquemaFaixas.nullable()).length(7),
  secretaria: z.array(esquemaFaixas.nullable()).length(7),
  secretariaFechaNosFeriados: z.boolean(),
}) satisfies z.ZodType<QuadroDeHorarios, unknown>;
