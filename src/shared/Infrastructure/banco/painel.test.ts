import { beforeEach, describe, expect, it } from 'vitest';
import { criarCasosDeUsoDeAtividades } from '@/modules/Atividades/Application/casos-de-uso';
import { type Ator } from '@/modules/Atividades/Domain/atividade';
import { RepositorioDeAtividadesBanco } from '@/modules/Atividades/Infrastructure/repositorio-banco';
import { criarGestaoDeEventos } from '@/modules/Eventos/Application/gestao';
import { RepositorioDeEventosBanco } from '@/modules/Eventos/Infrastructure/repositorio-banco';
import { criarGestaoDaGaleria } from '@/modules/Galeria/Application/gestao';
import { RepositorioDeAlbunsBanco } from '@/modules/Galeria/Infrastructure/repositorio-banco';
import { criarGestaoDeHorarios } from '@/modules/Horarios/Application/gestao';
import { RepositorioDeHorariosBanco } from '@/modules/Horarios/Infrastructure/repositorio-banco';
import { criarGestaoInstitucional } from '@/modules/Institucional/Application/gestao';
import { RepositorioInstitucionalBanco } from '@/modules/Institucional/Infrastructure/repositorio-banco';
import { criarGestaoDaSecretaria } from '@/modules/Secretaria/Application/gestao';
import {
  RepositorioDeContribuicoesBanco,
  RepositorioDeDizimistasBanco,
} from '@/modules/Secretaria/Infrastructure/repositorios-banco';
import { ErroDeAplicacao } from '@/shared/Domain/erros';
import { type Banco, bancoDeTeste } from './conexao';
import { semear } from './semente';

/**
 * Casos de uso do painel contra um banco de verdade (PGlite em memória):
 * cada mudança grava no banco E deixa uma linha no registro de atividades.
 */
const ator: Ator = { id: '00000000-0000-4000-8000-000000000001', nome: 'Pessoa de Teste', ip: '127.0.0.1' };

let banco: Banco;
const b = async () => banco;
let atividades: ReturnType<typeof criarCasosDeUsoDeAtividades>;
let registrar: (a: Parameters<ReturnType<typeof criarCasosDeUsoDeAtividades>['registrar']>[0]) => Promise<void>;

beforeEach(async () => {
  banco = await bancoDeTeste();
  await semear(banco, { contasLocais: false });
  atividades = criarCasosDeUsoDeAtividades(new RepositorioDeAtividadesBanco(b));
  registrar = atividades.registrar;
});

const ultimas = async () => (await atividades.listar({}, 1, 50)).itens;

describe('Secretaria (dados pessoais)', () => {
  const gestao = () =>
    criarGestaoDaSecretaria({
      dizimistas: new RepositorioDeDizimistasBanco(b),
      contribuicoes: new RepositorioDeContribuicoesBanco(b),
      registrar,
    });

  it('cadastra, registra contribuição e soma o mês — sem dados pessoais no registro de atividades', async () => {
    const s = gestao();
    const id = await s.criarDizimista(ator, {
      nome: 'Fulana de Teste',
      telefone: '(21) 90000-0000',
      email: 'fulana@exemplo.com',
      endereco: '',
      observacoes: '',
      ativo: true,
    });
    await s.registrarContribuicao(ator, {
      tipo: 'dizimo',
      valor: '1.234,50',
      data: '2026-11-10',
      forma: 'pix',
      dizimistaId: id,
      doadorNome: '',
      observacao: '',
    });
    const [c] = await s.listarContribuicoes({ mes: '2026-11' });
    expect(c?.valorCentavos).toBe(123450);
    expect(c?.dizimistaNome).toBe('Fulana de Teste');
    expect(await s.totaisPorMes(2026)).toEqual([{ mes: '2026-11', totalCentavos: 123450, quantidade: 1 }]);

    const texto = JSON.stringify(await ultimas());
    expect(texto).not.toContain('Fulana');
    expect(texto).not.toContain('90000');
    expect(texto).not.toContain('fulana@');
    expect(texto).toContain(`nº ${id.slice(0, 8)}`);
    // na criação, só os campos preenchidos aparecem
    expect(texto).toContain('nome; telefone; e-mail');
    expect(texto).not.toContain('endereço');
  });

  it('não aceita dizimista e nome de doador ao mesmo tempo, nem valor zero', async () => {
    const s = gestao();
    const base = { tipo: 'oferta', data: '2026-11-10', forma: 'dinheiro', dizimistaId: '', observacao: '' };
    await expect(s.registrarContribuicao(ator, { ...base, valor: '0', doadorNome: '' })).rejects.toBeInstanceOf(ErroDeAplicacao);
    await expect(
      s.registrarContribuicao(ator, { ...base, valor: '10', dizimistaId: ator.id, doadorNome: 'Alguém' }),
    ).rejects.toBeInstanceOf(ErroDeAplicacao);
  });

  it('excluir o cadastro mantém as contribuições (sem o vínculo)', async () => {
    const s = gestao();
    const id = await s.criarDizimista(ator, { nome: 'Beltrano', telefone: '', email: '', endereco: '', observacoes: '', ativo: true });
    await s.registrarContribuicao(ator, {
      tipo: 'dizimo',
      valor: '50',
      data: '2026-11-01',
      forma: 'pix',
      dizimistaId: id,
      doadorNome: '',
      observacao: '',
    });
    await s.excluirDizimista(ator, id);
    const [c] = await s.listarContribuicoes({ mes: '2026-11' });
    expect(c?.valorCentavos).toBe(5000);
    expect(c?.dizimistaId).toBeUndefined();
  });
});

describe('Galeria', () => {
  it('a capa acompanha a foto ao mover e ao excluir; não move para fora do álbum', async () => {
    const g = criarGestaoDaGaleria({ repositorio: new RepositorioDeAlbunsBanco(b), registrar });
    const id = await g.criarAlbum(ator, { titulo: 'Álbum de teste', data: '', descricao: '' });
    for (const n of [1, 2, 3]) await g.adicionarFoto(ator, id, { arquivo: `/arquivos/galeria/2026/foto-${n}.webp`, legenda: '' });
    let album = await g.buscar(id);
    const [f1, , f3] = album.fotos;
    expect(album.capa ?? 0).toBe(0);

    await g.moverFoto(ator, id, f1!.id, 1); // a capa (foto 1) vai para a posição 2
    album = await g.buscar(id);
    expect(album.fotos.map((f) => f.foto.slice(-6))).toEqual(['2.webp', '1.webp', '3.webp']);
    expect(album.capa).toBe(1);

    await expect(g.moverFoto(ator, id, f3!.id, 1)).rejects.toBeInstanceOf(ErroDeAplicacao);

    await g.excluirFoto(ator, id, album.fotos[0]!.id); // exclui uma foto antes da capa
    album = await g.buscar(id);
    expect(album.fotos).toHaveLength(2);
    expect(album.fotos[album.capa ?? 0]?.foto).toContain('foto-1');

    const acoes = (await ultimas()).filter((a) => a.area === 'galeria').map((a) => a.acao);
    expect(acoes).toEqual(['excluiu', 'editou', 'enviou-foto', 'enviou-foto', 'enviou-foto', 'criou']);
  });
});

describe('Eventos, horários e informações do site', () => {
  it('evento: cria com hora normalizada, registra o que mudou ao editar', async () => {
    const e = criarGestaoDeEventos({ repositorio: new RepositorioDeEventosBanco(b), registrar });
    const dados = {
      titulo: 'Festa de Teste',
      categoria: 'Festa',
      data: '2026-12-20',
      hora: '19h',
      local: 'Igreja',
      descricao: 'Descrição do teste.',
      destaque: false,
      imagem: '',
    };
    const id = await e.criar(ator, dados);
    expect(id).toBe('2026-12-20-festa-de-teste');
    expect((await e.buscar(id)).hora).toBe('19h00');
    await e.editar(ator, id, { ...dados, local: 'Salão paroquial' });
    const [ultima] = await ultimas();
    expect(ultima?.acao).toBe('editou');
    expect(ultima?.detalhe).toContain('Igreja → Salão paroquial');
  });

  it('horários: recusa hora inválida e registra a seção alterada', async () => {
    const h = criarGestaoDeHorarios({ repositorio: new RepositorioDeHorariosBanco(b), registrar });
    const quadro = await h.obter();
    const ruim = structuredClone(quadro);
    ruim.missasDaSemana[0]!.horas = ['25'];
    await expect(h.salvar(ator, ruim)).rejects.toBeInstanceOf(ErroDeAplicacao);

    const bom = structuredClone(quadro);
    bom.secretariaFechaNosFeriados = !quadro.secretariaFechaNosFeriados;
    await h.salvar(ator, bom);
    expect((await ultimas())[0]?.detalhe).toBe('Alterado: secretaria nos feriados.');
  });

  it('logo: só aceita imagem do próprio site', async () => {
    const s = criarGestaoInstitucional({ repositorio: new RepositorioInstitucionalBanco(b), registrar });
    await expect(s.trocarLogo(ator, { url: 'https://exemplo.com/logo.png', largura: 10, altura: 10 })).rejects.toBeInstanceOf(
      ErroDeAplicacao,
    );
    await s.trocarLogo(ator, { url: '/arquivos/site/2026/logo.webp', largura: 200, altura: 300 });
    expect((await s.obter()).logo?.url).toBe('/arquivos/site/2026/logo.webp');
  });
});
