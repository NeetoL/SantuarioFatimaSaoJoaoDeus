import { controladores } from '@/config/container';
import { metodosSomenteLeitura, rotaPublica } from '@/shared/Presentation/rota-api';

/** GET /api/galeria — fotos da galeria da comunidade. */
export const GET = rotaPublica('galeria.listar', () => controladores.galeria.listar(), { cacheSegundos: 300 });
export const { POST, PUT, PATCH, DELETE } = metodosSomenteLeitura;
