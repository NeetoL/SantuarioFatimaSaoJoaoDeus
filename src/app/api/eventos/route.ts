import { controladores } from '@/config/container';
import { metodosSomenteLeitura, rotaPublica } from '@/shared/Presentation/rota-api';

/** GET /api/eventos?categoria=Missa&pagina=1&porPagina=20 — próximos eventos (os que ainda estão no site). */
export const GET = rotaPublica('eventos.listar', (requisicao) => controladores.eventos.listar(requisicao));
export const { POST, PUT, PATCH, DELETE } = metodosSomenteLeitura;
