import { z } from 'zod';
import { esquemaImagem } from '@/shared/Domain/imagem';

export type Logo = { url: string; largura: number; altura: number };

/** Brasão usado enquanto nenhum logo for enviado pelo painel. */
export const LOGO_PADRAO: Logo = { url: '/assets/img/logo-santuario-sm.png', largura: 131, altura: 240 };

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
  /** Logo do cabeçalho e do rodapé (sem ele, o brasão padrão). */
  logo?: Logo;
};

export const logoDoSite = (d: Pick<DadosInstitucionais, 'logo'>): Logo => d.logo ?? LOGO_PADRAO;

const texto = (max: number, rotulo: string) =>
  z.string().trim().min(1, { error: `Preencha: ${rotulo}.` }).max(max, { error: `${rotulo}: texto longo demais.` });

/** Validação das informações do site (painel e leitura do banco). */
export const esquemaDadosInstitucionais = z.object({
  nome: texto(160, 'nome completo'),
  nomeCurto: texto(80, 'nome curto'),
  endereco: z.object({
    logradouro: texto(160, 'endereço'),
    bairro: texto(80, 'bairro'),
    cidade: texto(80, 'cidade'),
    uf: z.string().trim().length(2, { error: 'UF com 2 letras.' }).toUpperCase(),
  }),
  coordenadas: z.object({
    latitude: z.coerce.number().min(-90).max(90),
    longitude: z.coerce.number().min(-180).max(180),
  }),
  telefone: z.object({
    exibicao: texto(30, 'telefone'),
    internacional: z
      .string()
      .trim()
      .regex(/^\+\d{10,15}$/, { error: 'Telefone para ligação no formato +5521999999999.' }),
  }),
  email: z.email({ error: 'E-mail inválido.' }).max(160),
  redesSociais: z
    .array(
      z.object({
        rede: z.enum(['Instagram', 'YouTube', 'Facebook']),
        url: z.url({ protocol: /^https$/, error: 'Endereço da rede social precisa começar com https://' }).max(300),
        rotulo: texto(80, 'descrição da rede'),
      }),
    )
    .max(3),
  apresentacao: z.object({ titulo: texto(120, 'título da apresentação'), texto: texto(600, 'texto da apresentação') }),
  logo: z
    .object({ url: esquemaImagem, largura: z.number().int().positive(), altura: z.number().int().positive() })
    .optional(),
});

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

export interface GestaoInstitucional extends RepositorioInstitucional {
  salvar(dados: DadosInstitucionais): Promise<void>;
}
