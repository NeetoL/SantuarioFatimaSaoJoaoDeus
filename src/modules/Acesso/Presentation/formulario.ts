/** Leitura dos campos de um formulário enviado ao servidor (o que não for texto vira vazio). */
export const texto = (dados: FormData, campo: string): string => {
  const v = dados.get(campo);
  return typeof v === 'string' ? v : '';
};

/** Caixa de marcar: presente = marcada. */
export const marcado = (dados: FormData, campo: string): boolean => dados.get(campo) !== null;

/** Lista de textos com o mesmo nome (ex.: vários campos "destino"). */
export const textos = (dados: FormData, campo: string): string[] =>
  dados.getAll(campo).filter((v): v is string => typeof v === 'string');
