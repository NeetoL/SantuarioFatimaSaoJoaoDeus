'use client';

import Image from 'next/image';
import { useId, useRef, useState, useTransition } from 'react';
import { type EstadoDoFormulario, ESTADO_INICIAL } from '@/modules/Acesso/Presentation/estado';
import { useEstadoDoFormulario } from './Formulario';

/**
 * Escolha de uma foto dentro de um formulário (evento, notícia, logo):
 * a foto sobe na hora (é reduzida e limpa no servidor) e o endereço vai num campo escondido.
 */
export function EnviarImagem({
  nome,
  rotulo,
  valor,
  enviar,
  ajuda = 'JPG, PNG ou WebP, até 15 MB. A foto é ajustada automaticamente.',
  aoEnviar,
  aoRemover,
  permitirRemover = true,
  ajuste = 'cover',
}: {
  nome: string;
  rotulo: string;
  valor?: string;
  enviar: (estado: EstadoDoFormulario, dados: FormData) => Promise<EstadoDoFormulario>;
  ajuda?: string;
  aoEnviar?: (resultado: { url: string; largura: number; altura: number }) => void;
  aoRemover?: () => void;
  permitirRemover?: boolean;
  /** 'contain' para logos (mostra a imagem inteira). */
  ajuste?: 'cover' | 'contain';
}) {
  const id = useId();
  const entrada = useRef<HTMLInputElement>(null);
  const [url, setUrl] = useState(valor ?? '');
  const [erro, setErro] = useState('');
  const [enviando, iniciar] = useTransition();
  const { erros } = useEstadoDoFormulario();
  const erroDoCampo = erros[nome];

  function escolher(arquivo: File | undefined) {
    if (!arquivo) return;
    setErro('');
    const dados = new FormData();
    dados.set('foto', arquivo);
    iniciar(async () => {
      const r = await enviar(ESTADO_INICIAL, dados);
      if (r.ok && typeof r.extra?.url === 'string') {
        setUrl(r.extra.url);
        aoEnviar?.({ url: r.extra.url, largura: Number(r.extra.largura), altura: Number(r.extra.altura) });
      } else setErro(r.mensagem || 'Não foi possível enviar a foto.');
      if (entrada.current) entrada.current.value = '';
    });
  }

  return (
    <div>
      <p className="block text-[.95rem] font-semibold text-navy-900" id={`${id}-rotulo`}>
        {rotulo}
      </p>
      <input type="hidden" name={nome} value={url} />
      <div className="mt-2 flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="relative h-32 w-48 shrink-0 overflow-hidden rounded-md bg-slate-100 ring-1 ring-slate-200">
          {url ? (
            <Image src={url} alt="Foto escolhida" fill sizes="192px" className={ajuste === 'contain' ? 'object-contain p-2' : 'object-cover'} />
          ) : (
            <span className="absolute inset-0 grid place-items-center text-sm text-slate-600">Sem foto</span>
          )}
          {enviando && (
            <span className="absolute inset-0 grid place-items-center bg-white/80 text-sm font-semibold text-navy-900">
              Enviando…
            </span>
          )}
        </div>
        <div className="flex flex-wrap gap-2">
          <label htmlFor={id} className="btn btn-linha btn-sm cursor-pointer">
            {url ? 'Trocar foto' : 'Escolher foto'}
          </label>
          <input
            ref={entrada}
            id={id}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            className="sr-only"
            aria-labelledby={`${id}-rotulo`}
            onChange={(e) => escolher(e.target.files?.[0])}
            disabled={enviando}
          />
          {url && permitirRemover && (
            <button
              type="button"
              className="btn btn-sm text-red-700 hover:bg-red-50"
              onClick={() => {
                setUrl('');
                aoRemover?.();
              }}
            >
              Remover foto
            </button>
          )}
        </div>
      </div>
      <p className="mt-1.5 text-sm text-slate-600">{ajuda}</p>
      {(erro || erroDoCampo) && (
        <p role="alert" className="mt-1.5 text-sm font-medium text-red-700">
          {erro || erroDoCampo}
        </p>
      )}
    </div>
  );
}
