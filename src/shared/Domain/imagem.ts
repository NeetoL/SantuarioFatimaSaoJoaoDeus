import { z } from 'zod';

/**
 * Endereço de imagem aceito no site: fotos do próprio site (/assets, /arquivos)
 * ou do armazenamento de fotos da Vercel (Blob). Qualquer outro endereço é recusado.
 */
export const ehImagemDoSite = (url: string) =>
  /^\/(assets|arquivos)\/[\w\-./]+\.(jpe?g|png|webp|avif)$/i.test(url) && !url.includes('..')
    ? true
    : /^https:\/\/[a-z0-9-]+\.public\.blob\.vercel-storage\.com\/[\w\-./]+$/i.test(url);

export const esquemaImagem = z.string().trim().max(500).refine(ehImagemDoSite, { error: 'Imagem inválida.' });

/** Texto opcional: vazio vira `undefined`. */
export const textoOpcional = (max: number) =>
  z
    .string()
    .trim()
    .max(max)
    .optional()
    .transform((v) => (v ? v : undefined));
