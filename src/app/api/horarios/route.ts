import { controladores } from '@/config/container';
import { metodosSomenteLeitura, rotaPublica } from '@/shared/Presentation/rota-api';

/** GET /api/horarios — missas, confissões, terços, adoração, igreja aberta e secretaria. */
export const GET = rotaPublica('horarios.obter', () => controladores.horarios.obter(), { cacheSegundos: 300 });
export const { POST, PUT, PATCH, DELETE } = metodosSomenteLeitura;
