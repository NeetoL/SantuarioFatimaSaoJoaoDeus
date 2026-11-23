import { type Noticia, type Recado } from '@/modules/Comunicados/Domain/comunicado';

/**
 * NOTÍCIAS E RECADOS — dados de demonstração (os mesmos do site estático).
 * Lidos apenas pelos repositórios em memória do módulo Comunicados.
 * Notícia: data 'AAAA-MM-DD', categoria, título, resumo, imagem (opcional), link (opcional, só https).
 */
export const NOTICIAS: readonly Noticia[] = [
  {
    id: '2026-11-10-campanha-solidaria',
    data: '2026-11-10',
    categoria: 'Comunidade',
    imagem: '/assets/img/noticia-campanha.jpg',
    titulo: 'Campanha solidária arrecada mais de 2 toneladas de alimentos',
    resumo: 'A generosidade dos fiéis garantiu cestas básicas para famílias atendidas pela pastoral social.',
  },
  {
    id: '2026-11-05-inscricoes-catequese-2027',
    data: '2026-11-05',
    categoria: 'Formação',
    imagem: '/assets/img/noticia-catequese.jpg',
    titulo: 'Abertas as inscrições para a Catequese 2027',
    resumo: 'Crianças, jovens e adultos podem se inscrever na secretaria até o dia 15 de dezembro.',
  },
];

export const RECADOS: readonly Recado[] = [
  {
    id: 'inscricoes-batismo',
    titulo: 'Inscrições para o Batismo',
    texto: 'Preparação para pais e padrinhos no 2º sábado do mês, às 15h. Inscreva-se na secretaria.',
  },
  {
    id: 'campanha-agasalho-alimentos',
    titulo: 'Campanha do Agasalho e Alimentos',
    texto: 'Doações recebidas na entrada lateral do Santuário até o fim do mês.',
  },
  {
    id: 'voluntarios-pascom',
    titulo: 'Novos voluntários na PASCOM',
    texto: 'Gosta de fotografia, redes sociais ou vídeo? Venha servir conosco!',
  },
  {
    id: 'secretaria-horario-especial',
    titulo: 'Secretaria em horário especial',
    texto: 'Nos feriados, atendimento das 8h às 12h.',
  },
];
