import { controladores } from '@/config/container';
import { metodosSomenteLeitura, rotaPublica } from '@/shared/Presentation/rota-api';

/** GET /api/galeria?pagina=1&porPagina=10 — álbuns de fotos, do mais recente ao mais antigo. */
export const GET = rotaPublica('galeria.listar', (requisicao) => controladores.galeria.listar(requisicao), {
  cacheSegundos: 300,
});
export const { POST, PUT, PATCH, DELETE } = metodosSomenteLeitura;
