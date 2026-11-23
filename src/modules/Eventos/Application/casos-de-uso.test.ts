import { describe, expect, it } from 'vitest';
import { ErroNaoEncontrado } from '@/shared/Domain/erros';
import { type Evento } from '../Domain/evento';
import { RepositorioDeEventosEmMemoria } from '../Infrastructure/repositorio-em-memoria';
import { criarCasosDeUsoDeEventos } from './casos-de-uso';

const base: Evento[] = [
  {
    id: 'passado',
    categoria: 'Missa',
    titulo: 'Passado',
    data: '2026-11-01',
    hora: '10h00',
    local: 'L',
    descricao: 'D',
  },
  { id: 'festa', categoria: 'Festa', titulo: 'Festa', data: '2026-11-28', hora: '18h00', local: 'L', descricao: 'D' },
  {
    id: 'missa-1',
    categoria: 'Missa',
    titulo: 'Missa 1',
    data: '2026-12-13',
    hora: '19h30',
    local: 'L',
    descricao: 'D',
  },
  {
    id: 'missa-2',
    categoria: 'Missa',
    titulo: 'Missa 2',
    data: '2026-12-24',
    hora: '22h00',
    local: 'L',
    descricao: 'D',
    destaque: true,
  },
  {
    id: 'novena',
    categoria: 'Novena',
    titulo: 'Novena',
    data: '2026-12-16',
    hora: '20h00',
    local: 'L',
    descricao: 'D',
  },
];
const agora = new Date('2026-11-23T12:00:00-03:00');
const casos = criarCasosDeUsoDeEventos({
  repositorio: new RepositorioDeEventosEmMemoria(base),
  enderecoCompleto: async () => 'Santuário — Rua Teste, 1',
});

describe('casos de uso de eventos', () => {
  it('lista só os próximos, em ordem, com filtro e paginação', async () => {
    const todos = await casos.listarProximos({ agora, paginacao: { pagina: 1, porPagina: 20 } });
    expect(todos.itens.map((e) => e.id)).toEqual(['festa', 'missa-1', 'novena', 'missa-2']);
    expect(todos.meta).toEqual({ pagina: 1, porPagina: 20, total: 4, totalDePaginas: 1 });

    const missas = await casos.listarProximos({ agora, categoria: 'Missa', paginacao: { pagina: 2, porPagina: 1 } });
    expect(missas.itens.map((e) => e.id)).toEqual(['missa-2']);
    expect(missas.meta.totalDePaginas).toBe(2);
  });

  it('página inicial: destaque marcado + 3 seguintes, sem repetir foto', async () => {
    const resumo = await casos.resumoDaPaginaInicial(agora);
    expect(resumo?.destaque.id).toBe('missa-2');
    expect(resumo?.seguintes.map((e) => e.id)).toEqual(['festa', 'missa-1', 'novena']);
    expect(resumo?.total).toBe(4);
    expect(resumo?.maisProximo.id).toBe('festa');
    const fotos = [resumo?.destaque.foto, ...(resumo?.seguintes.map((e) => e.foto) ?? [])].map((f) =>
      f?.replace('-p.jpg', '.jpg'),
    );
    expect(new Set(fotos).size).toBe(fotos.length);
  });

  it('sem eventos futuros, a página inicial não mostra o bloco', async () => {
    expect(await casos.resumoDaPaginaInicial(new Date('2027-06-01T00:00:00-03:00'))).toBeNull();
  });

  it('agenda completa traz as categorias existentes e as missas especiais', async () => {
    const agenda = await casos.agendaCompleta(agora);
    expect(agenda?.categorias).toEqual(['Festa', 'Missa', 'Novena']);
    expect((await casos.missasEspeciais(agora)).map((e) => e.id)).toEqual(['missa-1', 'missa-2']);
  });

  it('arquivo de agenda e evento inexistente', async () => {
    const arquivo = await casos.arquivoDeAgenda('festa', agora);
    expect(arquivo.nomeDoArquivo).toBe('festa.ics');
    expect(arquivo.conteudo).toContain('LOCATION:L — Santuário — Rua Teste\\, 1');
    await expect(casos.buscar('nao-existe')).rejects.toBeInstanceOf(ErroNaoEncontrado);
  });

  it('o repositório devolve cópias (os dados de origem não mudam)', async () => {
    const repo = new RepositorioDeEventosEmMemoria(base);
    const lista = await repo.listarTodos();
    lista[0]!.titulo = 'alterado';
    expect((await repo.listarTodos())[0]!.titulo).toBe('Passado');
  });
});
