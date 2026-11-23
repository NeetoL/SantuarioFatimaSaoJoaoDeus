import { controladores } from '@/config/container';
import { metodosSomenteLeitura, rotaPublica } from '@/shared/Presentation/rota-api';

/** GET /api/doacoes/qrcode-pix — QR Code do PIX em SVG. */
export const GET = rotaPublica('doacoes.qrcode', () => controladores.doacoes.qrCodeDoPix(), { cacheSegundos: 3600 });
export const { POST, PUT, PATCH, DELETE } = metodosSomenteLeitura;
