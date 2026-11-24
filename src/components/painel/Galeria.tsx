'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useActionState, useEffect, useId, useRef, useState } from 'react';
import { useAvisar } from '@/components/layout/Avisos';
import { type AcaoDeFormulario, ESTADO_INICIAL } from '@/modules/Acesso/Presentation/estado';
import { type AlbumNoPainel, type FotoNoPainel } from '@/modules/Galeria/Domain/gestao';
import { BotaoDeAcao } from './BotaoDeAcao';
import { AcoesDoFormulario, AreaDeTexto, BotaoSalvar, Campo, Formulario } from './Formulario';

export function FormularioDeAlbum({
  acao,
  album,
}: {
  acao: AcaoDeFormulario;
  album?: Pick<AlbumNoPainel, 'titulo' | 'data' | 'descricao'>;
}) {
  return (
    <Formulario acao={acao} className="space-y-5">
      <div className="grid gap-5 sm:grid-cols-[1fr_12rem]">
        <Campo nome="titulo" rotulo="Nome do álbum" valor={album?.titulo} obrigatorio maxLength={120} placeholder="Ex.: Festa de Nossa Senhora de Fátima 2026" />
        <Campo nome="data" rotulo="Data do evento" tipo="date" valor={album?.data ?? ''} />
      </div>
      <AreaDeTexto nome="descricao" rotulo="Descrição (opcional)" valor={album?.descricao} linhas={2} maxLength={300} />
      <AcoesDoFormulario principal={<BotaoSalvar>{album ? 'Salvar álbum' : 'Criar álbum'}</BotaoSalvar>} />
    </Formulario>
  );
}

const LIMITE_MB = 15;

/** Envio de várias fotos de uma vez: uma por vez, com progresso; no fim, a página atualiza. */
export function EnvioDeFotos({ enviar }: { enviar: AcaoDeFormulario }) {
  const id = useId();
  const entrada = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const avisar = useAvisar();
  const [progresso, setProgresso] = useState<{ feitas: number; total: number } | null>(null);
  const [falhas, setFalhas] = useState<string[]>([]);
  const [arrastando, setArrastando] = useState(false);

  async function enviarTodas(lista: File[]) {
    const fotos = lista.filter((f) => /^image\/(jpeg|png|webp)$/.test(f.type));
    const ignoradas = lista.length - fotos.length;
    if (!fotos.length) {
      setFalhas(['Nenhuma foto JPG, PNG ou WebP foi escolhida.']);
      return;
    }
    setFalhas([]);
    const erros: string[] = ignoradas ? [`${ignoradas} arquivo(s) ignorado(s): só JPG, PNG ou WebP.`] : [];
    let enviadas = 0;
    for (const [i, arquivo] of fotos.entries()) {
      setProgresso({ feitas: i, total: fotos.length });
      if (arquivo.size > LIMITE_MB * 1024 * 1024) {
        erros.push(`${arquivo.name}: maior que ${LIMITE_MB} MB.`);
        continue;
      }
      const dados = new FormData();
      dados.set('foto', arquivo);
      dados.set('legenda', '');
      try {
        const r = await enviar(ESTADO_INICIAL, dados);
        if (r.ok) enviadas++;
        else erros.push(`${arquivo.name}: ${r.mensagem}`);
      } catch {
        erros.push(`${arquivo.name}: falha de conexão.`);
      }
    }
    setProgresso(null);
    setFalhas(erros);
    if (entrada.current) entrada.current.value = '';
    if (enviadas) {
      avisar(`${enviadas} foto${enviadas > 1 ? 's' : ''} adicionada${enviadas > 1 ? 's' : ''}.`, 3000);
      router.refresh();
    }
  }

  const ocupado = progresso !== null;
  return (
    <div>
      <label
        htmlFor={id}
        onDragOver={(e) => {
          e.preventDefault();
          setArrastando(true);
        }}
        onDragLeave={() => setArrastando(false)}
        onDrop={(e) => {
          e.preventDefault();
          setArrastando(false);
          if (!ocupado) void enviarTodas([...e.dataTransfer.files]);
        }}
        className={`flex cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed px-6 py-10 text-center transition-colors ${
          arrastando ? 'border-gold-500 bg-gold-50' : 'border-slate-300 bg-slate-50/60 hover:border-navy-800 hover:bg-navy-50/50'
        } ${ocupado ? 'pointer-events-none opacity-80' : ''}`}
      >
        <svg className="h-9 w-9 text-gold-700" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M12 16V4m0 0-4 4m4-4 4 4M4 15v3a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-3" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        {ocupado ? (
          <span className="text-base font-semibold text-navy-900" role="status">
            Enviando foto {Math.min(progresso.feitas + 1, progresso.total)} de {progresso.total}…
          </span>
        ) : (
          <>
            <span className="text-base font-semibold text-navy-900">Escolher fotos (pode marcar várias)</span>
            <span className="text-sm text-slate-600">ou arraste para cá · JPG, PNG ou WebP até {LIMITE_MB} MB cada</span>
          </>
        )}
        {ocupado && (
          <span className="mt-2 h-1.5 w-full max-w-xs overflow-hidden rounded-full bg-slate-200" aria-hidden="true">
            <span className="block h-full bg-gold-500 transition-all" style={{ width: `${(progresso.feitas / progresso.total) * 100}%` }} />
          </span>
        )}
      </label>
      <input
        ref={entrada}
        id={id}
        type="file"
        multiple
        accept="image/jpeg,image/png,image/webp"
        className="sr-only"
        disabled={ocupado}
        onChange={(e) => void enviarTodas([...(e.target.files ?? [])])}
      />
      <p className="mt-2 text-sm text-slate-600">As fotos são reduzidas e a localização (GPS) gravada pelo celular é apagada automaticamente.</p>
      {falhas.length > 0 && (
        <ul role="alert" className="mt-3 space-y-1 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-900">
          {falhas.map((f) => (
            <li key={f}>{f}</li>
          ))}
        </ul>
      )}
    </div>
  );
}

function Legenda({ acao, foto }: { acao: AcaoDeFormulario; foto: FotoNoPainel }) {
  const [estado, enviar, enviando] = useActionState(acao, ESTADO_INICIAL);
  const [valor, setValor] = useState(foto.legenda);
  const avisar = useAvisar();
  useEffect(() => {
    if (estado.vez && estado.mensagem) avisar(estado.mensagem, estado.ok ? 2000 : 4500);
  }, [estado, avisar]);
  const mudou = valor.trim() !== foto.legenda;
  return (
    <form action={enviar} className="flex gap-1.5">
      <input type="hidden" name="foto" value={foto.id} />
      <label className="sr-only" htmlFor={`legenda-${foto.id}`}>
        Legenda
      </label>
      <input
        id={`legenda-${foto.id}`}
        name="legenda"
        value={valor}
        onChange={(e) => setValor(e.target.value)}
        maxLength={200}
        placeholder="Legenda (opcional)"
        className="h-9 min-w-0 flex-1 rounded border border-slate-300 bg-white px-2.5 text-sm text-navy-950 placeholder:text-slate-400 focus:border-gold-500 focus:outline-none focus:ring-2 focus:ring-gold-400/30"
      />
      {mudou && (
        <button type="submit" disabled={enviando} className="h-9 shrink-0 rounded bg-navy-900 px-3 text-sm font-semibold text-white hover:bg-navy-950">
          {enviando ? '…' : 'Salvar'}
        </button>
      )}
    </form>
  );
}

const icone = 'h-4 w-4';
const botaoPequeno =
  'grid h-9 w-9 place-items-center rounded border border-slate-200 bg-white text-slate-700 transition-colors hover:border-navy-800 hover:text-navy-900 disabled:opacity-40';

export function GradeDeFotos({
  album,
  acoes,
}: {
  album: AlbumNoPainel;
  acoes: { legenda: AcaoDeFormulario; mover: AcaoDeFormulario; capa: AcaoDeFormulario; excluir: AcaoDeFormulario };
}) {
  const capa = album.capa ?? 0;
  return (
    <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {album.fotos.map((foto, i) => (
        <li key={foto.id} className="overflow-hidden rounded-lg bg-white shadow-sm ring-1 ring-black/5">
          <div className="relative aspect-[4/3] bg-slate-100">
            <Image src={foto.foto} alt={foto.legenda || `Foto ${i + 1}`} fill sizes="(min-width: 1280px) 22vw, (min-width: 640px) 45vw, 100vw" className="object-cover" />
            <span className="absolute left-2 top-2 rounded bg-navy-950/75 px-1.5 py-0.5 text-xs font-semibold text-white">{i + 1}</span>
            {i === capa && <span className="absolute right-2 top-2 rounded bg-gold-500 px-2 py-0.5 text-xs font-bold text-navy-950">Capa</span>}
          </div>
          <div className="space-y-2.5 p-3">
            <Legenda acao={acoes.legenda} foto={foto} />
            <div className="flex items-center gap-1.5">
              {i > 0 ? (
                <BotaoDeAcao acao={acoes.mover} campos={{ foto: foto.id, direcao: '-1' }} classe={botaoPequeno} rotulo="Mover para antes">
                  <svg className={icone} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="m15 18-6-6 6-6" />
                  </svg>
                </BotaoDeAcao>
              ) : (
                <span className="w-9" aria-hidden="true" />
              )}
              {i < album.fotos.length - 1 ? (
                <BotaoDeAcao acao={acoes.mover} campos={{ foto: foto.id, direcao: '1' }} classe={botaoPequeno} rotulo="Mover para depois">
                  <svg className={icone} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="m9 18 6-6-6-6" />
                  </svg>
                </BotaoDeAcao>
              ) : (
                <span className="w-9" aria-hidden="true" />
              )}
              {i !== capa && (
                <BotaoDeAcao acao={acoes.capa} campos={{ foto: foto.id }} classe={botaoPequeno} rotulo="Usar como capa do álbum">
                  <svg className={icone} fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="m12 3.5 2.6 5.3 5.9.9-4.3 4.1 1 5.8-5.2-2.7-5.2 2.7 1-5.8-4.3-4.1 5.9-.9L12 3.5Z" strokeLinejoin="round" />
                  </svg>
                </BotaoDeAcao>
              )}
              <span className="ml-auto">
                <BotaoDeAcao
                  acao={acoes.excluir}
                  campos={{ foto: foto.id }}
                  confirmar="Excluir esta foto do álbum? Não dá para desfazer."
                  classe={`${botaoPequeno} hover:border-red-300 hover:text-red-700`}
                  rotulo="Excluir foto"
                >
                  <svg className={icone} fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M5 7h14M10 11v6M14 11v6M6 7l1 12a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1l1-12M9 7V4h6v3" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </BotaoDeAcao>
              </span>
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
}
