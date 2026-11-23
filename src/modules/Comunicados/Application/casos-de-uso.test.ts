import { describe, expect, it } from 'vitest';
import { dataCurta, dataLonga, linkSeguro, type Noticia } from '../Domain/comunicado';
import {
  RepositorioDeNoticiasEmMemoria,
  RepositorioDeRecadosEmMemoria,
} from '../Infrastructure/repositorios-em-memoria';
import { criarCasosDeUsoDeComunicados } from './casos-de-uso';

const noticias: Noticia[] = [
  { id: 'a', data: '2026-11-05', categoria: 'Formação', titulo: 'A', resumo: 'r' },
  { id: 'b', data: '2026-11-10', categoria: 'Comunidade', titulo: 'B', resumo: 'r', link: 'javascript:alert(1)' },
  { id: 'c', data: '2026-10-01', categoria: 'Comunidade', titulo: 'C', resumo: 'r', link: 'https://instagram.com/p/x' },
];
const casos = criarCasosDeUsoDeComunicados(
  new RepositorioDeNoticiasEmMemoria(noticias),
  new RepositorioDeRecadosEmMemoria([
    { id: '1', titulo: 'R1', texto: 't' },
    { id: '2', titulo: 'R2', texto: 't' },
  ]),
);

describe('comunicados', () => {
  it('mais recente primeiro, com destaque e demais', async () => {
    const pagina = await casos.noticiasDaPagina();
    expect(pagina.destaque?.id).toBe('b');
    expect(pagina.demais.map((n) => n.id)).toEqual(['a', 'c']);
    expect((await casos.ultimasNoticias(2)).map((n) => n.id)).toEqual(['b', 'a']);
  });

  it('descarta links que não são https (proteção contra XSS)', async () => {
    const [b, , c] = (await casos.listarNoticias({ paginacao: { pagina: 1, porPagina: 10 } })).itens;
    expect(b?.link).toBeUndefined();
    expect(c?.link).toBe('https://instagram.com/p/x');
    expect(linkSeguro('http://exemplo.com')).toBeUndefined();
  });

  it('filtra por categoria sem diferenciar maiúsculas e limita recados', async () => {
    const r = await casos.listarNoticias({ categoria: 'comunidade', paginacao: { pagina: 1, porPagina: 10 } });
    expect(r.itens.map((n) => n.id)).toEqual(['b', 'c']);
    expect(await casos.listarRecados(1)).toHaveLength(1);
  });

  it('formata as datas', () => {
    expect(dataCurta('2026-11-10')).toBe('10 nov 2026');
    expect(dataLonga('2026-11-05')).toBe('5 de novembro de 2026');
  });
});
