import 'server-only';

import { criarCasosDeUsoDeComunicados } from '@/modules/Comunicados/Application/casos-de-uso';
import {
  RepositorioDeNoticiasEmMemoria,
  RepositorioDeRecadosEmMemoria,
} from '@/modules/Comunicados/Infrastructure/repositorios-em-memoria';
import { criarControladorDeComunicados } from '@/modules/Comunicados/Presentation/controlador';
import { criarCasosDeUsoDeDoacoes } from '@/modules/Doacoes/Application/casos-de-uso';
import { gerarQrCodeSvg } from '@/modules/Doacoes/Infrastructure/gerador-qrcode';
import { RepositorioDeDoacoesEmMemoria } from '@/modules/Doacoes/Infrastructure/repositorio-em-memoria';
import { criarControladorDeDoacoes } from '@/modules/Doacoes/Presentation/controlador';
import { criarCasosDeUsoDeEventos } from '@/modules/Eventos/Application/casos-de-uso';
import { RepositorioDeEventosEmMemoria } from '@/modules/Eventos/Infrastructure/repositorio-em-memoria';
import { criarControladorDeEventos } from '@/modules/Eventos/Presentation/controlador';
import { criarCasosDeUsoDaGaleria } from '@/modules/Galeria/Application/casos-de-uso';
import { RepositorioDeFotosEmMemoria } from '@/modules/Galeria/Infrastructure/repositorio-em-memoria';
import { criarControladorDaGaleria } from '@/modules/Galeria/Presentation/controlador';
import { criarCasosDeUsoDeHorarios } from '@/modules/Horarios/Application/casos-de-uso';
import { RepositorioDeHorariosEmMemoria } from '@/modules/Horarios/Infrastructure/repositorio-em-memoria';
import { criarControladorDeHorarios } from '@/modules/Horarios/Presentation/controlador';
import { criarCasosDeUsoInstitucionais } from '@/modules/Institucional/Application/casos-de-uso';
import { RepositorioInstitucionalEmMemoria } from '@/modules/Institucional/Infrastructure/repositorio-em-memoria';
import { criarControladorInstitucional } from '@/modules/Institucional/Presentation/controlador';

/**
 * RAIZ DE COMPOSIÇÃO — o único lugar que escolhe as implementações (hoje: repositórios em memória).
 * Para usar o PostgreSQL no futuro, troque aqui `RepositorioXEmMemoria` por `RepositorioXPostgres`:
 * casos de uso, páginas e API continuam iguais.
 */
const institucional = criarCasosDeUsoInstitucionais(new RepositorioInstitucionalEmMemoria());

export const casosDeUso = {
  institucional,
  eventos: criarCasosDeUsoDeEventos({
    repositorio: new RepositorioDeEventosEmMemoria(),
    enderecoCompleto: institucional.enderecoCompleto,
  }),
  horarios: criarCasosDeUsoDeHorarios(new RepositorioDeHorariosEmMemoria()),
  comunicados: criarCasosDeUsoDeComunicados(new RepositorioDeNoticiasEmMemoria(), new RepositorioDeRecadosEmMemoria()),
  galeria: criarCasosDeUsoDaGaleria(new RepositorioDeFotosEmMemoria()),
  doacoes: criarCasosDeUsoDeDoacoes({ repositorio: new RepositorioDeDoacoesEmMemoria(), gerarQrCodeSvg }),
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
