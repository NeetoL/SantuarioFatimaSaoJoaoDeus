import { NOTICIAS, RECADOS } from '@/mocks/comunicados';
import { type Noticia, type Recado, type RepositorioDeNoticias, type RepositorioDeRecados } from '../Domain/comunicado';

export class RepositorioDeNoticiasEmMemoria implements RepositorioDeNoticias {
  constructor(private readonly fonte: readonly Noticia[] = NOTICIAS) {}

  async listar(): Promise<Noticia[]> {
    return structuredClone([...this.fonte]);
  }
}

export class RepositorioDeRecadosEmMemoria implements RepositorioDeRecados {
  constructor(private readonly fonte: readonly Recado[] = RECADOS) {}

  async listar(): Promise<Recado[]> {
    return structuredClone([...this.fonte]);
  }
}
