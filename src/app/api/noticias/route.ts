import { controladores } from '@/config/container';
import { metodosSomenteLeitura, rotaPublica } from '@/shared/Presentation/rota-api';

/** GET /api/noticias?categoria=Comunidade&pagina=1&porPagina=10 — notícias, da mais recente para a mais antiga. */
export const GET = rotaPublica('noticias.listar', (requisicao) => controladores.comunicados.listarNoticias(requisicao));
export const { POST, PUT, PATCH, DELETE } = metodosSomenteLeitura;
