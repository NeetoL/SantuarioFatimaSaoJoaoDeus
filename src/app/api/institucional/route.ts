import { controladores } from '@/config/container';
import { metodosSomenteLeitura, rotaPublica } from '@/shared/Presentation/rota-api';

/** GET /api/institucional — endereço, telefone, e-mail e redes sociais. */
export const GET = rotaPublica('institucional.obter', () => controladores.institucional.obter(), {
  cacheSegundos: 3600,
});
export const { POST, PUT, PATCH, DELETE } = metodosSomenteLeitura;
