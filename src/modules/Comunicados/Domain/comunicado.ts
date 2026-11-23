import { MESES_EXTENSO } from '@/lib/datas';

export type Noticia = {
  id: string;
  /** 'AAAA-MM-DD' */
  data: string;
  categoria: string;
  titulo: string;
  resumo: string;
  imagem?: string;
  /** "Saiba mais" — ex.: um post do Instagram. Só endereços https são aceitos. */
  link?: string;
};

export type Recado = { id: string; titulo: string; texto: string };

const MESES_CURTOS = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'] as const;

/** A mais recente primeiro. */
export function ordenarPorData(noticias: readonly Noticia[]): Noticia[] {
  return [...noticias].sort((a, b) => b.data.localeCompare(a.data));
}

/** Aceita só links https (bloqueia "javascript:" e outros esquemas perigosos). */
export function linkSeguro(link: string | undefined): string | undefined {
  if (!link) return undefined;
  try {
    const url = new URL(link);
    return url.protocol === 'https:' ? url.toString() : undefined;
  } catch {
    return undefined;
  }
}

/** "10 nov 2026" */
export function dataCurta(iso: string): string {
  const [a, m = 1, d] = iso.split('-').map(Number);
  return `${d} ${MESES_CURTOS[m - 1]} ${a}`;
}

/** "10 de novembro de 2026" */
export function dataLonga(iso: string): string {
  const [a, m = 1, d] = iso.split('-').map(Number);
  return `${d} de ${MESES_EXTENSO[m - 1]} de ${a}`;
}

export interface RepositorioDeNoticias {
  listar(): Promise<Noticia[]>;
}

export interface RepositorioDeRecados {
  listar(): Promise<Recado[]>;
}
