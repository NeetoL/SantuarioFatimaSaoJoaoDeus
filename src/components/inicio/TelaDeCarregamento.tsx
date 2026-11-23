import Image from 'next/image';

/**
 * Tela de carregamento com o brasão, visível só enquanto <html> tem a classe "carregando"
 * (o script do <head> liga essa classe apenas na página inicial; o vídeo a desliga ao começar a tocar).
 */
export function TelaDeCarregamento() {
  return (
    <div id="preloader" role="status">
      <Image
        src="/assets/img/logo-santuario-sm.png"
        alt=""
        width={131}
        height={240}
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
