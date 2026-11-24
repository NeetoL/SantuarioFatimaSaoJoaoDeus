import { lerArquivoLocal } from '@/shared/Infrastructure/arquivos/armazenamento';

/**
 * GET /arquivos/... — fotos enviadas pelo painel quando o site roda sem o Vercel Blob (banco local).
 * Só entrega arquivos .webp da pasta .dados/arquivos, com nomes seguros.
 */
export async function GET(_requisicao: Request, { params }: { params: Promise<{ caminho: string[] }> }) {
  const { caminho } = await params;
  const dados = await lerArquivoLocal(caminho);
  if (!dados) return new Response('Arquivo não encontrado.', { status: 404 });
  return new Response(new Uint8Array(dados), {
    headers: {
      'Content-Type': 'image/webp',
      'Cache-Control': 'public, max-age=31536000, immutable',
      'X-Content-Type-Options': 'nosniff',
      'Content-Security-Policy': "default-src 'none'; sandbox",
    },
  });
}
