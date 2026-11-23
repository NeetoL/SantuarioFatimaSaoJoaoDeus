import { controladores } from '@/config/container';
import { metodosSomenteLeitura, rotaPublica } from '@/shared/Presentation/rota-api';

/** GET /api/eventos/:id/agenda — arquivo .ics para "Salvar na agenda". */
export const GET = rotaPublica<{ id: string }>(
  'eventos.agenda',
  async (_requisicao, { params }) => controladores.eventos.arquivoDeAgenda((await params).id),
  { cacheSegundos: 300 },
);
export const { POST, PUT, PATCH, DELETE } = metodosSomenteLeitura;
