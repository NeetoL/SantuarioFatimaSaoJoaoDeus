import Image from 'next/image';
import { type Logo } from '@/modules/Institucional/Domain/institucional';

/**
 * Tela de carregamento com o brasão, visível só enquanto <html> tem a classe "carregando"
 * (o script do <head> liga essa classe apenas na página inicial; o vídeo a desliga ao começar a tocar).
 */
export function TelaDeCarregamento({ logo }: { logo: Logo }) {
  return (
    <div id="preloader" role="status">
      <Image
        src={logo.url}
        alt=""
        width={logo.largura}
        height={logo.altura}
        className="preloader-logo"
        preload
      />
      <div className="preloader-bar" aria-hidden="true">
        <span></span>
      </div>
      <span className="sr-only">Carregando o site…</span>
    </div>
  );
}
