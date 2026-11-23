import { controladores } from '@/config/container';
import { metodosSomenteLeitura, rotaPublica } from '@/shared/Presentation/rota-api';

/** GET /api/eventos/:id — um evento. */
export const GET = rotaPublica<{ id: string }>('eventos.detalhar', async (_requisicao, { params }) =>
  controladores.eventos.detalhar((await params).id),
);
export const { POST, PUT, PATCH, DELETE } = metodosSomenteLeitura;
