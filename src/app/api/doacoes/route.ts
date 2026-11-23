import { controladores } from '@/config/container';
import { metodosSomenteLeitura, rotaPublica } from '@/shared/Presentation/rota-api';

/** GET /api/doacoes — PIX, dados bancários e destino das ofertas. */
export const GET = rotaPublica('doacoes.obter', () => controladores.doacoes.obter(), { cacheSegundos: 300 });
export const { POST, PUT, PATCH, DELETE } = metodosSomenteLeitura;
