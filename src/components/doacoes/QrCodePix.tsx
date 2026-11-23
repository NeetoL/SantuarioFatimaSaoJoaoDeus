'use client';

import { useEffect, useRef, useState } from 'react';

/** QR Code gerado pela API (SVG) — servido pelo próprio site. */
const ENDERECO_DO_QR = '/api/doacoes/qrcode-pix';

/** QR Code do PIX ("toque para ampliar") e a versão grande em tela cheia. */
export function QrCodePix() {
  const [aberto, setAberto] = useState(false);
  const botao = useRef<HTMLButtonElement>(null);
  const fechar = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!aberto) return;
    const abridor = botao.current;
    document.body.style.overflow = 'hidden';
    fechar.current?.focus();
    const aoTeclar = (e: KeyboardEvent) => e.key === 'Escape' && setAberto(false);
    document.addEventListener('keydown', aoTeclar);
    return () => {
      document.body.style.overflow = '';
      document.removeEventListener('keydown', aoTeclar);
      abridor?.focus();
    };
  }, [aberto]);

  return (
    <>
      <button
        ref={botao}
        id="qr-abrir"
        type="button"
        onClick={() => setAberto(true)}
        className="group shrink-0 rounded-md border-2 border-dashed border-gold-400 p-3 hover:border-gold-600 focus:outline-none focus-visible:ring-4 focus-visible:ring-gold-200 transition-colors"
        aria-label="Ampliar QR Code do PIX"
      >
        <span id="qr-pequeno" className="w-[148px] h-[148px] grid place-items-center" aria-hidden="true">
          {/* eslint-disable-next-line @next/next/no-img-element -- SVG gerado pela API; não há o que otimizar */}
          <img src={ENDERECO_DO_QR} alt="" width={148} height={148} className="w-[148px] h-[148px]" />
        </span>
        <span className="block mt-2 text-sm text-slate-600 group-hover:text-gold-700">Toque para ampliar</span>
      </button>

      {aberto && (
        <div
          id="modal-qr"
          className="modal fixed inset-0 z-[60] bg-navy-950/90 backdrop-blur-sm p-4 flex items-center justify-center"
          role="dialog"
          aria-modal="true"
          aria-label="QR Code do PIX"
          onClick={(e) => e.target === e.currentTarget && setAberto(false)}
        >
          <button
            ref={fechar}
            type="button"
            onClick={() => setAberto(false)}
            className="absolute top-4 right-4 grid place-items-center w-12 h-12 rounded-full bg-white/10 text-white hover:bg-white/20"
            aria-label="Fechar"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path d="M6 6l12 12M18 6L6 18"></path>
            </svg>
          </button>
          <div className="bg-white rounded-md p-6 sm:p-8 text-center shadow-2xl">
            <div id="qr-grande" className="grid place-items-center">
              {/* eslint-disable-next-line @next/next/no-img-element -- SVG gerado pela API */}
              <img
                src={ENDERECO_DO_QR}
                alt="QR Code do PIX"
                width={280}
                height={280}
                className="w-[min(280px,calc(100vw-120px))] h-auto"
              />
            </div>
            <p className="mt-4 text-base text-slate-600">Aponte a câmera do app do seu banco</p>
            <p className="mt-1 text-sm text-slate-600">(QR Code ilustrativo)</p>
          </div>
        </div>
      )}
    </>
  );
}
