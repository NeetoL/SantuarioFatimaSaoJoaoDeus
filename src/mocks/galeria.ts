import { type FotoDaGaleria } from '@/modules/Galeria/Domain/foto';

/**
 * GALERIA DA COMUNIDADE — fotos reais do Santuário (página Notícias).
 * grande: true deixa a foto com o dobro do tamanho na grade. A miniatura é o mesmo nome com "-p.jpg".
 */
export const FOTOS_DA_GALERIA: readonly FotoDaGaleria[] = [
  {
    id: 'comunidade',
    foto: '/assets/img/sobre/comunidade.jpg',
    legenda: 'Clero e comunidade reunidos no Santuário',
    grande: true,
  },
  { id: 'encenacao-paixao', foto: '/assets/img/sobre/encenacao-paixao.jpg', legenda: 'Encenação da Paixão de Cristo' },
  { id: 'fogos-torre', foto: '/assets/img/sobre/fogos-torre.jpg', legenda: 'Noite de festa na torre do Santuário' },
  { id: 'celebracao-altar', foto: '/assets/img/sobre/celebracao-altar.jpg', legenda: 'Celebração solene ao altar' },
  { id: 'dedicacao-uncao', foto: '/assets/img/sobre/dedicacao-uncao.jpg', legenda: 'Dedicação da Igreja e do Altar' },
  { id: 'vista-rua', foto: '/assets/img/sobre/vista-rua.jpg', legenda: 'O Santuário visto da rua' },
  { id: 'entrada', foto: '/assets/img/sobre/entrada.jpg', legenda: 'Entrada principal do Santuário' },
  { id: 'fachada', foto: '/assets/img/sobre/fachada.jpg', legenda: 'Fachada e torre do Santuário', grande: true },
  { id: 'dedicacao-bencao', foto: '/assets/img/sobre/dedicacao-bencao.jpg', legenda: 'Dedicação da Igreja e do Altar' },
  { id: 'placa', foto: '/assets/img/sobre/placa.jpg', legenda: 'Placa em bronze na parede do Santuário' },
];
