import { FOTOS_DA_GALERIA } from '@/mocks/galeria';
import { type FotoDaGaleria, type RepositorioDeFotos } from '../Domain/foto';

export class RepositorioDeFotosEmMemoria implements RepositorioDeFotos {
  constructor(private readonly fonte: readonly FotoDaGaleria[] = FOTOS_DA_GALERIA) {}

  async listar(): Promise<FotoDaGaleria[]> {
    return structuredClone([...this.fonte]);
  }
}
