import { describe, expect, it } from 'vitest';
import { type Album } from '../Domain/album';
import { RepositorioDeAlbunsEmMemoria } from '../Infrastructure/repositorio-em-memoria';
import { criarCasosDeUsoDaGaleria } from './casos-de-uso';

const foto = (n: number) => ({ foto: `/assets/img/${n}.jpg`, legenda: `Foto ${n}` });
const albuns: Album[] = [
  { id: 'sem-data', titulo: 'Sem data', fotos: [foto(1)] },
  { id: 'antigo', titulo: 'Antigo', data: '2025-01-10', fotos: [foto(2), foto(3)], capa: 1 },
  { id: 'vazio', titulo: 'Vazio', data: '2026-05-01', fotos: [] },
  { id: 'recente', titulo: 'Recente', data: '2026-11-28', fotos: [foto(4)] },
];
const casos = criarCasosDeUsoDaGaleria(new RepositorioDeAlbunsEmMemoria(albuns));

describe('galeria por álbuns', () => {
  it('mais recentes primeiro, sem data depois; álbum sem fotos não aparece', async () => {
    expect((await casos.listarAlbuns()).map((a) => a.id)).toEqual(['recente', 'antigo', 'sem-data']);
    expect(await casos.listarAlbuns(2)).toHaveLength(2);
  });

  it('usa a capa escolhida e conta as fotos', async () => {
    const antigo = await casos.buscarAlbum('antigo');
    expect(antigo.fotoDeCapa.foto).toBe('/assets/img/3.jpg');
    expect(antigo.total).toBe(2);
  });

  it('álbum inexistente gera erro "não encontrado"', async () => {
    await expect(casos.buscarAlbum('nao-existe')).rejects.toThrow('Álbum não encontrado.');
  });

  it('pagina os álbuns', async () => {
    const r = await casos.listarAlbunsPaginados({ pagina: 2, porPagina: 2 });
    expect(r.itens.map((a) => a.id)).toEqual(['sem-data']);
    expect(r.meta.total).toBe(3);
  });
});
