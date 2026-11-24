/** "Missa da Noite de Natal!" → "missa-da-noite-de-natal" (para endereços e identificadores). */
export function slug(texto: string, maximo = 60): string {
  return (
    texto
      .normalize('NFD')
      .replace(/[̀-ͯ]/g, '')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .slice(0, maximo)
      .replace(/-+$/g, '') || 'item'
  );
}

/** Procura um identificador livre: base, base-2, base-3… */
export async function identificadorLivre(base: string, existe: (id: string) => Promise<boolean>): Promise<string> {
  if (!(await existe(base))) return base;
  for (let n = 2; n < 1000; n++) {
    const candidato = `${base}-${n}`;
    if (!(await existe(candidato))) return candidato;
  }
  throw new Error('Não foi possível gerar um identificador.');
}
