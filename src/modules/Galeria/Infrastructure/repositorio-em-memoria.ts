import { ALBUNS } from '@/mocks/galeria';
import { type Album, type RepositorioDeAlbuns } from '../Domain/album';

export class RepositorioDeAlbunsEmMemoria implements RepositorioDeAlbuns {
  constructor(private readonly fonte: readonly Album[] = ALBUNS) {}

  async listar(): Promise<Album[]> {
    return structuredClone([...this.fonte]);
  }
}
