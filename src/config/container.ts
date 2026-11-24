import 'server-only';

import { criarCasosDeUsoDeAcesso } from '@/modules/Acesso/Application/casos-de-uso';
import { RepositorioDeSessoesBanco, RepositorioDeUsuariosBanco } from '@/modules/Acesso/Infrastructure/repositorio-banco';
import { criarCasosDeUsoDeAtividades } from '@/modules/Atividades/Application/casos-de-uso';
import { type NovaAtividade } from '@/modules/Atividades/Domain/atividade';
import { RepositorioDeAtividadesBanco } from '@/modules/Atividades/Infrastructure/repositorio-banco';
import { criarCasosDeUsoDeComunicados } from '@/modules/Comunicados/Application/casos-de-uso';
import { criarGestaoDeComunicados } from '@/modules/Comunicados/Application/gestao';
import { RepositorioDeNoticiasBanco, RepositorioDeRecadosBanco } from '@/modules/Comunicados/Infrastructure/repositorios-banco';
import {
  RepositorioDeNoticiasEmMemoria,
  RepositorioDeRecadosEmMemoria,
} from '@/modules/Comunicados/Infrastructure/repositorios-em-memoria';
import { criarControladorDeComunicados } from '@/modules/Comunicados/Presentation/controlador';
import { criarCasosDeUsoDeDoacoes } from '@/modules/Doacoes/Application/casos-de-uso';
import { criarGestaoDeDoacoes } from '@/modules/Doacoes/Application/gestao';
import { gerarQrCodeSvg } from '@/modules/Doacoes/Infrastructure/gerador-qrcode';
import { RepositorioDeDoacoesBanco } from '@/modules/Doacoes/Infrastructure/repositorio-banco';
import { RepositorioDeDoacoesEmMemoria } from '@/modules/Doacoes/Infrastructure/repositorio-em-memoria';
import { criarControladorDeDoacoes } from '@/modules/Doacoes/Presentation/controlador';
import { criarCasosDeUsoDeEventos } from '@/modules/Eventos/Application/casos-de-uso';
import { criarGestaoDeEventos } from '@/modules/Eventos/Application/gestao';
import { RepositorioDeEventosBanco } from '@/modules/Eventos/Infrastructure/repositorio-banco';
import { RepositorioDeEventosEmMemoria } from '@/modules/Eventos/Infrastructure/repositorio-em-memoria';
import { criarControladorDeEventos } from '@/modules/Eventos/Presentation/controlador';
import { criarCasosDeUsoDaGaleria } from '@/modules/Galeria/Application/casos-de-uso';
import { criarGestaoDaGaleria } from '@/modules/Galeria/Application/gestao';
import { RepositorioDeAlbunsBanco } from '@/modules/Galeria/Infrastructure/repositorio-banco';
import { RepositorioDeAlbunsEmMemoria } from '@/modules/Galeria/Infrastructure/repositorio-em-memoria';
import { criarControladorDaGaleria } from '@/modules/Galeria/Presentation/controlador';
import { criarCasosDeUsoDeHorarios } from '@/modules/Horarios/Application/casos-de-uso';
import { criarGestaoDeHorarios } from '@/modules/Horarios/Application/gestao';
import { RepositorioDeHorariosBanco } from '@/modules/Horarios/Infrastructure/repositorio-banco';
import { RepositorioDeHorariosEmMemoria } from '@/modules/Horarios/Infrastructure/repositorio-em-memoria';
import { criarControladorDeHorarios } from '@/modules/Horarios/Presentation/controlador';
import { criarCasosDeUsoInstitucionais } from '@/modules/Institucional/Application/casos-de-uso';
import { criarGestaoInstitucional } from '@/modules/Institucional/Application/gestao';
import { RepositorioInstitucionalBanco } from '@/modules/Institucional/Infrastructure/repositorio-banco';
import { RepositorioInstitucionalEmMemoria } from '@/modules/Institucional/Infrastructure/repositorio-em-memoria';
import { criarControladorInstitucional } from '@/modules/Institucional/Presentation/controlador';
import { criarGestaoDaSecretaria } from '@/modules/Secretaria/Application/gestao';
import {
  RepositorioDeContribuicoesBanco,
  RepositorioDeDizimistasBanco,
} from '@/modules/Secretaria/Infrastructure/repositorios-banco';
import { exigirBanco } from '@/shared/Infrastructure/banco/conexao';
import * as cripto from '@/shared/Infrastructure/seguranca/senha';
import { modoDoBanco } from './ambiente';

/**
 * RAIZ DE COMPOSIÇÃO — o único lugar que escolhe as implementações.
 * Com banco (Postgres no ar, ou o banco local em desenvolvimento): tudo lê e grava no banco, e o painel funciona.
 * Sem banco (testes, ou site no ar ainda sem DATABASE_URL): o site lê os dados de src/mocks e o painel fica desligado.
 */
const comBanco = modoDoBanco() !== 'nenhum';
const banco = () => exigirBanco();

// Repositórios que gravam (painel) — sempre no banco
const repos = {
  institucional: new RepositorioInstitucionalBanco(banco),
  horarios: new RepositorioDeHorariosBanco(banco),
  doacoes: new RepositorioDeDoacoesBanco(banco),
  eventos: new RepositorioDeEventosBanco(banco),
  noticias: new RepositorioDeNoticiasBanco(banco),
  recados: new RepositorioDeRecadosBanco(banco),
  albuns: new RepositorioDeAlbunsBanco(banco),
  atividades: new RepositorioDeAtividadesBanco(banco),
};

const institucional = criarCasosDeUsoInstitucionais(
  comBanco ? repos.institucional : new RepositorioInstitucionalEmMemoria(),
);

/** Casos de uso do site público. */
export const casosDeUso = {
  institucional,
  eventos: criarCasosDeUsoDeEventos({
    repositorio: comBanco ? repos.eventos : new RepositorioDeEventosEmMemoria(),
    enderecoCompleto: institucional.enderecoCompleto,
  }),
  horarios: criarCasosDeUsoDeHorarios(comBanco ? repos.horarios : new RepositorioDeHorariosEmMemoria()),
  comunicados: criarCasosDeUsoDeComunicados(
    comBanco ? repos.noticias : new RepositorioDeNoticiasEmMemoria(),
    comBanco ? repos.recados : new RepositorioDeRecadosEmMemoria(),
  ),
  galeria: criarCasosDeUsoDaGaleria(comBanco ? repos.albuns : new RepositorioDeAlbunsEmMemoria()),
  doacoes: criarCasosDeUsoDeDoacoes({
    repositorio: comBanco ? repos.doacoes : new RepositorioDeDoacoesEmMemoria(),
    gerarQrCodeSvg,
  }),
};

/** Controladores da API (camada Presentation), usados pelos Route Handlers em `src/app/api`. */
export const controladores = {
  institucional: criarControladorInstitucional(casosDeUso.institucional),
  eventos: criarControladorDeEventos(casosDeUso.eventos),
  horarios: criarControladorDeHorarios(casosDeUso.horarios),
  comunicados: criarControladorDeComunicados(casosDeUso.comunicados),
  galeria: criarControladorDaGaleria(casosDeUso.galeria),
  doacoes: criarControladorDeDoacoes(casosDeUso.doacoes),
};

/** O painel só funciona com banco de dados. */
export const painelDisponivel = () => comBanco;

const registrar = (atividade: NovaAtividade) => repos.atividades.registrar(atividade);

/** Casos de uso do painel de controle (cada um registra as próprias ações no registro de atividades). */
export const painel = {
  acesso: criarCasosDeUsoDeAcesso({
    usuarios: new RepositorioDeUsuariosBanco(banco),
    sessoes: new RepositorioDeSessoesBanco(banco),
    registrar,
    cripto,
  }),
  atividades: criarCasosDeUsoDeAtividades(repos.atividades),
  site: criarGestaoInstitucional({ repositorio: repos.institucional, registrar }),
  horarios: criarGestaoDeHorarios({ repositorio: repos.horarios, registrar }),
  doacoes: criarGestaoDeDoacoes({ repositorio: repos.doacoes, registrar }),
  eventos: criarGestaoDeEventos({ repositorio: repos.eventos, registrar }),
  comunicados: criarGestaoDeComunicados({ noticias: repos.noticias, recados: repos.recados, registrar }),
  galeria: criarGestaoDaGaleria({ repositorio: repos.albuns, registrar }),
  secretaria: criarGestaoDaSecretaria({
    dizimistas: new RepositorioDeDizimistasBanco(banco),
    contribuicoes: new RepositorioDeContribuicoesBanco(banco),
    registrar,
  }),
};
