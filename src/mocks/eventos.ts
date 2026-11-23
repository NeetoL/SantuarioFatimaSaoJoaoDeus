import { type Evento } from '@/modules/Eventos/Domain/evento';

/**
 * EVENTOS — dados de demonstração (os mesmos do site estático).
 * Lidos apenas por `RepositorioDeEventosEmMemoria`. Quando houver banco de dados,
 * esta lista é substituída pela tabela `eventos` (ver docs/ARQUITETURA.md).
 *
 * Campos: categoria 'Missa' | 'Novena' | 'Festa' | 'Aviso'; data 'AAAA-MM-DD'; hora '19h30';
 * destaque (opcional) coloca o evento no card grande; imagem (opcional) usa uma foto própria.
 * O evento sai do site sozinho 2 horas depois de começar.
 */
export const EVENTOS: readonly Evento[] = [
  // Evento fictício de exemplo (15/11/2026)
  {
    id: '2026-11-15-missa-com-bencao-dos-enfermos',
    categoria: 'Missa',
    titulo: 'Missa com Bênção dos Enfermos',
    data: '2026-11-15',
    hora: '18h00',
    local: 'Igreja do Santuário',
    destaque: true,
    imagem: '/assets/img/hero-poster.jpg',
    descricao:
      'Ao final da missa dominical, bênção especial para os doentes, os idosos e quem cuida deles. Traga quem precisa de oração e conforto.',
  },
  {
    id: '2026-12-13-missa-mensal-de-fatima',
    categoria: 'Missa',
    titulo: 'Missa Mensal de Fátima',
    data: '2026-12-13',
    hora: '19h30',
    local: 'Igreja Matriz',
    descricao: 'Missa solene em memória das aparições, seguida de procissão luminosa.',
  },
  {
    id: '2026-12-16-novena-de-natal-em-familia',
    categoria: 'Novena',
    titulo: 'Novena de Natal em Família',
    data: '2026-12-16',
    hora: '20h00',
    local: 'Casas da comunidade',
    descricao: 'Nove encontros de oração nas casas, preparando o coração para o Natal.',
  },
  {
    id: '2026-12-24-missa-da-noite-de-natal',
    categoria: 'Missa',
    titulo: 'Missa da Noite de Natal',
    data: '2026-12-24',
    hora: '22h00',
    local: 'Igreja Matriz',
    descricao: 'Celebração do nascimento do Senhor com o coral do Santuário.',
  },
  {
    id: '2027-01-01-solenidade-de-santa-maria-mae-de-deus',
    categoria: 'Missa',
    titulo: 'Solenidade de Santa Maria, Mãe de Deus',
    data: '2027-01-01',
    hora: '09h00',
    local: 'Igreja Matriz',
    descricao: 'Iniciamos o ano sob a proteção de Maria. Missa pela paz mundial.',
  },
  {
    id: '2026-11-19-terco-dos-homens',
    categoria: 'Novena',
    titulo: 'Terço dos Homens',
    data: '2026-11-19',
    hora: '20h00',
    local: 'Capela do Santíssimo',
    descricao: 'Toda quinta-feira os homens se reúnem para rezar o Santo Terço.',
  },
  {
    id: '2026-11-28-quermesse-beneficente',
    categoria: 'Festa',
    titulo: 'Quermesse Beneficente',
    data: '2026-11-28',
    hora: '18h00',
    local: 'Pátio do Santuário',
    descricao: 'Barracas, música e comidas típicas. Renda revertida às obras sociais.',
  },
];
