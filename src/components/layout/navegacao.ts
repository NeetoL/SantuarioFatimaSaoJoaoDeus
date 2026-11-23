/** Páginas do menu (cabeçalho, menu do celular). */
export const PAGINAS = [
  { href: '/', rotulo: 'Início', noMenuDoCelular: 'Início', descricao: 'Página principal', numero: 'I' },
  { href: '/sobre', rotulo: 'Sobre', noMenuDoCelular: 'Sobre', descricao: 'Nossa história', numero: 'II' },
  { href: '/eventos', rotulo: 'Eventos', noMenuDoCelular: 'Eventos', descricao: 'Agenda e avisos', numero: 'III' },
  {
    href: '/missas',
    rotulo: 'Missas',
    noMenuDoCelular: 'Missas e Horários',
    descricao: 'Confissões, terços e secretaria',
    numero: 'IV',
  },
  {
    href: '/noticias',
    rotulo: 'Notícias',
    noMenuDoCelular: 'Notícias',
    descricao: 'Comunicados e recados',
    numero: 'V',
  },
  { href: '/contato', rotulo: 'Contato', noMenuDoCelular: 'Contato', descricao: 'Fale com a secretaria', numero: 'VI' },
] as const;

/** Na página inicial, "Início" rola até o topo (#inicio); nas outras, leva à página inicial. */
export const hrefDaPagina = (href: string, caminhoAtual: string) =>
  href === '/' && caminhoAtual === '/' ? '#inicio' : href;
