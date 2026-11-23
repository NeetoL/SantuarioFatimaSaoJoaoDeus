import { type Album } from '@/modules/Galeria/Domain/album';

/**
 * GALERIA — ÁLBUNS DE FOTOS, um por evento ou celebração.
 * Para publicar as fotos de um evento: crie um álbum com título, data ('AAAA-MM-DD', se souber),
 * uma frase opcional e as fotos (arquivo em public/assets/img e legenda). `capa` escolhe a foto de capa.
 * Os álbuns com data aparecem do mais recente ao mais antigo; os sem data, depois, nesta ordem.
 * Abaixo, as fotos reais que o site já tinha, agrupadas pelas suas legendas.
 */
export const ALBUNS: readonly Album[] = [
  {
    id: 'dedicacao-da-igreja-e-do-altar',
    titulo: 'Dedicação da Igreja e do Altar',
    data: '2025-09-23',
    fotos: [
      { foto: '/assets/img/sobre/dedicacao-uncao.jpg', legenda: 'Dedicação da Igreja e do Altar — unção do altar' },
      { foto: '/assets/img/sobre/dedicacao-altar.jpg', legenda: 'Dedicação da Igreja e do Altar' },
      { foto: '/assets/img/sobre/dedicacao-reliquias.jpg', legenda: 'Relíquias depositadas no altar' },
      { foto: '/assets/img/sobre/dedicacao-bencao.jpg', legenda: 'Dedicação da Igreja e do Altar' },
      { foto: '/assets/img/sobre/dedicacao-oracao.jpg', legenda: 'Dedicação da Igreja e do Altar' },
    ],
  },
  {
    id: 'celebracoes-no-santuario',
    titulo: 'Celebrações no Santuário',
    fotos: [
      { foto: '/assets/img/sobre/comunidade.jpg', legenda: 'Clero e comunidade reunidos no Santuário' },
      { foto: '/assets/img/sobre/celebracao-altar.jpg', legenda: 'Celebração solene ao altar' },
      { foto: '/assets/img/sobre/celebracao-mitra.jpg', legenda: 'Detalhe da celebração' },
    ],
  },
  {
    id: 'o-santuario',
    titulo: 'O Santuário',
    fotos: [
      { foto: '/assets/img/sobre/fachada.jpg', legenda: 'Fachada e torre do Santuário' },
      { foto: '/assets/img/sobre/entrada.jpg', legenda: 'Entrada principal do Santuário' },
      { foto: '/assets/img/sobre/vista-rua.jpg', legenda: 'O Santuário visto da rua' },
      { foto: '/assets/img/sobre/placa.jpg', legenda: 'Placa em bronze na parede do Santuário' },
    ],
  },
  {
    id: 'encenacao-da-paixao-de-cristo',
    titulo: 'Encenação da Paixão de Cristo',
    fotos: [{ foto: '/assets/img/sobre/encenacao-paixao.jpg', legenda: 'Encenação da Paixão de Cristo' }],
  },
  {
    id: 'noite-de-festa',
    titulo: 'Noite de festa',
    fotos: [{ foto: '/assets/img/sobre/fogos-torre.jpg', legenda: 'Noite de festa na torre do Santuário' }],
  },
];
