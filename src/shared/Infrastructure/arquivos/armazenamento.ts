import 'server-only';
import { mkdir, readFile, unlink, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { ambiente } from '@/config/ambiente';
import { ErroDeValidacao } from '@/shared/Domain/erros';
import { PASTA_DE_DADOS } from '../banco/conexao';
import { codigoAleatorio } from '../seguranca/senha';

/**
 * FOTOS ENVIADAS PELO PAINEL.
 * - Conferidas pelo conteúdo (não pela extensão): só JPEG, PNG e WebP.
 * - Reduzidas, giradas na posição certa e convertidas em WebP — os metadados (inclusive a localização GPS
 *   que o celular grava) são descartados.
 * - Guardadas no Vercel Blob (site no ar, com BLOB_READ_WRITE_TOKEN) ou na pasta .dados/arquivos (computador).
 */
export type ImagemSalva = { url: string; largura: number; altura: number };
export type PastaDeImagens = 'eventos' | 'galeria' | 'noticias' | 'site';

const LIMITE_EM_BYTES = 15 * 1024 * 1024;
export const PASTA_DE_ARQUIVOS = path.join(PASTA_DE_DADOS, 'arquivos');

function tipoReal(dados: Buffer): 'jpeg' | 'png' | 'webp' | null {
  if (dados.length < 12) return null;
  if (dados[0] === 0xff && dados[1] === 0xd8 && dados[2] === 0xff) return 'jpeg';
  if (dados.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]))) return 'png';
  if (dados.subarray(0, 4).toString('ascii') === 'RIFF' && dados.subarray(8, 12).toString('ascii') === 'WEBP') return 'webp';
  return null;
}

export async function salvarImagem(
  arquivo: File,
  { pasta, larguraMaxima = 2400 }: { pasta: PastaDeImagens; larguraMaxima?: number },
): Promise<ImagemSalva> {
  if (!arquivo.size) throw new ErroDeValidacao([{ campo: 'foto', mensagem: 'Escolha uma foto.' }], 'Escolha uma foto.');
  if (arquivo.size > LIMITE_EM_BYTES) {
    throw new ErroDeValidacao([{ campo: 'foto', mensagem: 'Foto grande demais (máximo 15 MB).' }], 'Foto grande demais (máximo 15 MB).');
  }
  const original = Buffer.from(await arquivo.arrayBuffer());
  if (!tipoReal(original)) {
    throw new ErroDeValidacao(
      [{ campo: 'foto', mensagem: 'Envie uma foto JPG, PNG ou WebP.' }],
      'Envie uma foto JPG, PNG ou WebP.',
    );
  }

  const { default: sharp } = await import('sharp');
  let processada: { data: Buffer; info: { width: number; height: number } };
  try {
    processada = await sharp(original, { limitInputPixels: 80_000_000, failOn: 'error' })
      .rotate()
      .resize({ width: larguraMaxima, height: larguraMaxima, fit: 'inside', withoutEnlargement: true })
      .webp({ quality: 82 })
      .toBuffer({ resolveWithObject: true });
  } catch {
    throw new ErroDeValidacao([{ campo: 'foto', mensagem: 'Não foi possível ler esta foto.' }], 'Não foi possível ler esta foto.');
  }

  const agora = new Date();
  const nome = `${pasta}/${agora.getFullYear()}/${codigoAleatorio(12).toLowerCase().replace(/[^a-z0-9]/g, 'x')}.webp`;
  const dimensoes = { largura: processada.info.width, altura: processada.info.height };

  if (ambiente.BLOB_READ_WRITE_TOKEN) {
    const { put } = await import('@vercel/blob');
    const { url } = await put(nome, processada.data, {
      access: 'public',
      contentType: 'image/webp',
      addRandomSuffix: false,
      token: ambiente.BLOB_READ_WRITE_TOKEN,
    });
    return { url, ...dimensoes };
  }

  const destino = path.join(PASTA_DE_ARQUIVOS, ...nome.split('/'));
  await mkdir(path.dirname(destino), { recursive: true });
  await writeFile(destino, processada.data);
  return { url: `/arquivos/${nome}`, ...dimensoes };
}

/** Apaga uma foto enviada pelo painel (as fotos originais do site, em /assets, nunca são apagadas). */
export async function apagarImagem(url: string): Promise<void> {
  try {
    if (url.startsWith('/arquivos/')) {
      const caminho = caminhoLocal(url.slice('/arquivos/'.length).split('/'));
      if (caminho) await unlink(caminho);
    } else if (ambiente.BLOB_READ_WRITE_TOKEN && /\.public\.blob\.vercel-storage\.com\//.test(url)) {
      const { del } = await import('@vercel/blob');
      await del(url, { token: ambiente.BLOB_READ_WRITE_TOKEN });
    }
  } catch {
    // arquivo já não existe: nada a fazer
  }
}

/** Caminho no disco de um arquivo local, só se o nome for seguro (sem "..", só letras, números e traços). */
export function caminhoLocal(partes: string[]): string | null {
  if (partes.length < 2 || partes.length > 4) return null;
  if (!partes.every((p) => /^[a-z0-9-]+(\.webp)?$/.test(p))) return null;
  const caminho = path.join(PASTA_DE_ARQUIVOS, ...partes);
  return caminho.startsWith(PASTA_DE_ARQUIVOS + path.sep) ? caminho : null;
}

export async function lerArquivoLocal(partes: string[]): Promise<Buffer | null> {
  const caminho = caminhoLocal(partes);
  if (!caminho) return null;
  try {
    // só fotos enviadas pelo painel em .dados/arquivos (no ar elas ficam no Vercel Blob): não incluir o projeto no pacote
    return await readFile(/*turbopackIgnore: true*/ caminho);
  } catch {
    return null;
  }
}
