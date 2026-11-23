export type DadosInstitucionais = {
  nome: string;
  nomeCurto: string;
  endereco: { logradouro: string; bairro: string; cidade: string; uf: string };
  coordenadas: { latitude: number; longitude: number };
  telefone: { exibicao: string; internacional: string };
  email: string;
  redesSociais: { rede: 'Instagram' | 'YouTube' | 'Facebook'; url: string; rotulo: string }[];
  /** Bloco "Conheça o Santuário" da página inicial (textos da página Sobre). */
  apresentacao: { titulo: string; texto: string };
};

/** "Estrada Manuel Nogueira de Sá, 1421, Realengo, Rio de Janeiro - RJ" */
export function enderecoCompleto(d: DadosInstitucionais): string {
  const { logradouro, bairro, cidade, uf } = d.endereco;
  return `${d.nomeCurto} — ${logradouro}, ${bairro}, ${cidade} - ${uf}`;
}

/** Link "Como chegar" (Google Maps) a partir das coordenadas. */
export function linkDoMapa(d: DadosInstitucionais): string {
  const { latitude, longitude } = d.coordenadas;
  return `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`;
}

/** Endereço do mapa incorporado (iframe). */
export function linkDoMapaIncorporado(d: DadosInstitucionais): string {
  const { latitude, longitude } = d.coordenadas;
  return `https://maps.google.com/maps?q=${latitude},${longitude}&hl=pt-BR&z=17&output=embed`;
}

export interface RepositorioInstitucional {
  obter(): Promise<DadosInstitucionais>;
}
