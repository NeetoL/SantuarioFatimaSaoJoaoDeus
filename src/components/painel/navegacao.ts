import { type Permissao } from '@/modules/Acesso/Domain/acesso';

export type NomeDoIcone =
  | 'inicio'
  | 'site'
  | 'horarios'
  | 'eventos'
  | 'comunicados'
  | 'galeria'
  | 'doacoes'
  | 'dizimistas'
  | 'contribuicoes'
  | 'usuarios'
  | 'atividades'
  | 'conta';

export type ItemDoMenu = { href: string; rotulo: string; icone: NomeDoIcone; permissao: Permissao | null };
export type GrupoDoMenu = { titulo: string | null; itens: ItemDoMenu[] };

/** Menu do painel. `permissao: null` = todos os perfis. O servidor filtra pelo perfil antes de mostrar. */
export const MENU_DO_PAINEL: GrupoDoMenu[] = [
  { titulo: null, itens: [{ href: '/painel-controle', rotulo: 'Início', icone: 'inicio', permissao: null }] },
  {
    titulo: 'Conteúdo do site',
    itens: [
      { href: '/painel-controle/site', rotulo: 'Informações do site', icone: 'site', permissao: 'site' },
      { href: '/painel-controle/horarios', rotulo: 'Horários', icone: 'horarios', permissao: 'horarios' },
      { href: '/painel-controle/eventos', rotulo: 'Eventos', icone: 'eventos', permissao: 'eventos' },
      { href: '/painel-controle/galeria', rotulo: 'Galeria de fotos', icone: 'galeria', permissao: 'galeria' },
      { href: '/painel-controle/comunicados', rotulo: 'Notícias e recados', icone: 'comunicados', permissao: 'comunicados' },
      { href: '/painel-controle/doacoes', rotulo: 'Doações e PIX', icone: 'doacoes', permissao: 'doacoes' },
    ],
  },
  {
    titulo: 'Secretaria',
    itens: [
      { href: '/painel-controle/secretaria/dizimistas', rotulo: 'Dizimistas', icone: 'dizimistas', permissao: 'secretaria' },
      { href: '/painel-controle/secretaria/contribuicoes', rotulo: 'Contribuições', icone: 'contribuicoes', permissao: 'secretaria' },
    ],
  },
  {
    titulo: 'Administração',
    itens: [
      { href: '/painel-controle/usuarios', rotulo: 'Usuários', icone: 'usuarios', permissao: 'usuarios' },
      { href: '/painel-controle/atividades', rotulo: 'Registro de atividades', icone: 'atividades', permissao: 'atividades' },
    ],
  },
];

/** Traços dos ícones (estilo linha, 24×24). */
export const ICONES: Record<NomeDoIcone, string> = {
  inicio: 'M3 10.5 12 3l9 7.5M5 9.5V21h5v-6h4v6h5V9.5',
  site: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Zm0 0c2.5-2.4 3.8-5.4 3.8-9S14.5 5.4 12 3m0 18c-2.5-2.4-3.8-5.4-3.8-9S9.5 5.4 12 3M3.5 9h17M3.5 15h17',
  horarios: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Zm0-13v4.5l3 2',
  eventos: 'M4 6.5A1.5 1.5 0 0 1 5.5 5h13A1.5 1.5 0 0 1 20 6.5v12a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 4 18.5v-12ZM4 10h16M8.5 3v4M15.5 3v4',
  comunicados: 'M4 5h16v11H8l-4 4V5Zm4 4.5h8m-8 3h5',
  galeria: 'M3.5 6.5A1.5 1.5 0 0 1 5 5h14a1.5 1.5 0 0 1 1.5 1.5v11A1.5 1.5 0 0 1 19 19H5a1.5 1.5 0 0 1-1.5-1.5v-11Zm0 9 4.5-4.5 4 4 2.5-2.5 6 6M15.5 9.5h.01',
  doacoes: 'M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10Z',
  dizimistas: 'M16 19v-1.5a3.5 3.5 0 0 0-3.5-3.5h-5A3.5 3.5 0 0 0 4 17.5V19m16 0v-1.5a3.5 3.5 0 0 0-2.5-3.35M14.5 4.2a3.5 3.5 0 0 1 0 6.6M13.5 7.5a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z',
  contribuicoes: 'M4 7.5A1.5 1.5 0 0 1 5.5 6h13A1.5 1.5 0 0 1 20 7.5v9a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 4 16.5v-9ZM4 10h16M7.5 14.5h3',
  usuarios: 'M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm-7 8a7 7 0 0 1 14 0',
  atividades: 'M8 6h12M8 12h12M8 18h12M4 6h.01M4 12h.01M4 18h.01',
  conta: 'M12 15.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Zm7.4-2.1.1-1.4-.1-1.4 2-1.6-2-3.4-2.4.9a7 7 0 0 0-2.4-1.4L14.2 3h-4l-.4 2.6a7 7 0 0 0-2.4 1.4L5 6.1 3 9.5l2 1.6-.1 1.4.1 1.4-2 1.6 2 3.4 2.4-.9c.7.6 1.5 1.1 2.4 1.4l.4 2.6h4l.4-2.6c.9-.3 1.7-.8 2.4-1.4l2.4.9 2-3.4-2-1.6Z',
};
