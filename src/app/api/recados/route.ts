import { controladores } from '@/config/container';
import { metodosSomenteLeitura, rotaPublica } from '@/shared/Presentation/rota-api';

/** GET /api/recados?limite=3 — recados paroquiais. */
export const GET = rotaPublica('recados.listar', (requisicao) => controladores.comunicados.listarRecados(requisicao));
export const { POST, PUT, PATCH, DELETE } = metodosSomenteLeitura;
