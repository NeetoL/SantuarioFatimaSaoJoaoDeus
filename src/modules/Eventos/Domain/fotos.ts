import { type CategoriaDeEvento, type Evento } from './evento';

/**
 * Fotos do próprio Santuário usadas quando o evento não tem imagem
 * (variam entre eventos da mesma categoria). Arquivos "-p.jpg" são as versões menores.
 */
export const FOTOS_POR_CATEGORIA: Record<CategoriaDeEvento, readonly string[]> = {
  Missa: [
    '/assets/img/sobre/celebracao-altar-p.jpg',
    '/assets/img/sobre/dedicacao-bencao-p.jpg',
    '/assets/img/sobre/comunidade-p.jpg',
    '/assets/img/sobre/dedicacao-oracao-p.jpg',
    '/assets/img/sobre/dedicacao-uncao-p.jpg',
  ],
  Novena: ['/assets/img/hero-poster.jpg', '/assets/img/sobre/placa-p.jpg', '/assets/img/sobre/dedicacao-altar-p.jpg'],
  Festa: [
    '/assets/img/sobre/fogos-torre-p.jpg',
    '/assets/img/sobre/fachada-p.jpg',
    '/assets/img/sobre/vista-rua-p.jpg',
  ],
  Aviso: ['/assets/img/sobre/entrada-p.jpg', '/assets/img/sobre/vista-rua-p.jpg'],
};

/** Versão grande de uma foto ("-p.jpg" → ".jpg"). */
export const fotoGrande = (foto: string) => foto.replace('-p.jpg', '.jpg');

/**
 * Escolhe a foto do evento. Sem imagem própria, usa uma foto da categoria escolhida pelo título
 * (sempre a mesma para o mesmo evento) e evita repetir fotos já usadas na página (`usadas`).
 */
export function escolherFoto(evento: Pick<Evento, 'titulo' | 'categoria' | 'imagem'>, usadas: Set<string>): string {
  if (evento.imagem) {
    usadas.add(fotoGrande(evento.imagem));
    return evento.imagem;
  }
  const opcoes = FOTOS_POR_CATEGORIA[evento.categoria];
  const n = [...evento.titulo].reduce((a, c) => (a * 31 + c.charCodeAt(0)) >>> 0, 7) % opcoes.length;
  const emOrdem = [...opcoes.slice(n), ...opcoes.slice(0, n)];
  const foto =
    emOrdem.find((f) => !usadas.has(fotoGrande(f))) ?? opcoes[n] ?? opcoes[0] ?? '/assets/img/hero-poster.jpg';
  usadas.add(fotoGrande(foto));
  return foto;
}
