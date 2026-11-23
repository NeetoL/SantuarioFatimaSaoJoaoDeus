'use client';

import Image from 'next/image';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { MESES_EXTENSO, pad2, partesDaData } from '@/lib/datas';
import { type AlbumParaExibir } from '@/modules/Galeria/Domain/album';

/** "23 de setembro de 2025" */
function dataDoAlbum(iso: string) {
  const { dia, mes } = partesDaData(iso);
  return `${dia} de ${MESES_EXTENSO[mes - 1]} de ${iso.slice(0, 4)}`;
}

const totalDeFotos = (n: number) => (n === 1 ? '1 foto' : `${n} fotos`);
const totalDeAlbuns = (n: number) => (n === 1 ? '1 álbum encontrado' : `${n} álbuns encontrados`);

/** Sem acentos e em minúsculas: "Dedicação" e "dedicacao" encontram o mesmo álbum. */
const normalizar = (t: string) =>
  t
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();

/** Tudo o que a busca procura num álbum: nome, descrição, legendas e a data em vários formatos. */
function textoDeBusca(a: AlbumParaExibir) {
  const partes = [a.titulo, a.descricao ?? '', ...a.fotos.map((f) => f.legenda)];
  if (a.data) {
    const { dia, mes } = partesDaData(a.data);
    const ano = a.data.slice(0, 4);
    partes.push(dataDoAlbum(a.data), `${pad2(dia)}/${pad2(mes)}/${ano}`, `${dia}/${mes}/${ano}`, `${pad2(mes)}/${ano}`);
  }
  return normalizar(partes.join(' '));
}

type Aberto = { album: number; foto: number };

/**
 * Galeria por álbuns (um por evento). Cada álbum aparece como uma pequena pilha de fotos;
 * ao abrir, um visualizador em tela cheia mostra a foto grande, a legenda, as setas e as miniaturas.
 * Teclado: setas trocam de foto, Esc fecha; no celular, deslizar o dedo troca de foto.
 *
 * `destacarPrimeiro`: o álbum mais recente aparece grande, com algumas fotos à mostra (página Galeria).
 * `linkDireto`: o endereço acompanha o álbum aberto (/galeria#id-do-album), para compartilhar;
 * quem abre esse endereço já vê o álbum.
 * `busca`: campo para procurar por nome ou data e botões de ano (página Galeria); no celular, duas colunas.
 */
export function GaleriaDeAlbuns({
  albuns,
  tema = 'escuro',
  destacarPrimeiro = false,
  linkDireto = false,
  busca = false,
}: {
  albuns: AlbumParaExibir[];
  tema?: 'escuro' | 'claro';
  destacarPrimeiro?: boolean;
  linkDireto?: boolean;
  busca?: boolean;
}) {
  const [aberto, setAberto] = useState<Aberto | null>(null);
  const dialogo = useRef<HTMLDivElement>(null);
  const botaoFechar = useRef<HTMLButtonElement>(null);
  const quemAbriu = useRef<HTMLElement | null>(null);
  const inicioDoToque = useRef<{ x: number; y: number } | null>(null);
  const escuro = tema === 'escuro';

  // Busca por nome ou data e filtro por ano
  const [termo, setTermo] = useState('');
  const [ano, setAno] = useState<string | null>(null);
  const textos = useMemo(() => albuns.map(textoDeBusca), [albuns]);
  const anos = useMemo(
    () => [...new Set(albuns.flatMap((a) => (a.data ? [a.data.slice(0, 4)] : [])))].sort().reverse(),
    [albuns],
  );
  const palavras = normalizar(termo).split(/\s+/).filter(Boolean);
  const filtrando = busca && (palavras.length > 0 || ano !== null);
  const encontrados = albuns.filter(
    (a, i) => (!ano || a.data?.startsWith(ano)) && palavras.every((p) => textos[i]?.includes(p)),
  );
  const limpar = () => {
    setTermo('');
    setAno(null);
  };

  const album = aberto ? albuns[aberto.album] : undefined;
  const total = album?.fotos.length ?? 0;

  const abrir = (indice: number, foto = 0) => {
    quemAbriu.current = document.activeElement as HTMLElement | null;
    setAberto({ album: indice, foto });
    const id = albuns[indice]?.id;
    if (linkDireto && id) window.history.replaceState(null, '', `#${id}`);
  };
  const fechar = useCallback(() => {
    setAberto(null);
    quemAbriu.current?.focus();
    if (linkDireto) window.history.replaceState(null, '', window.location.pathname + window.location.search);
  }, [linkDireto]);

  // Link direto: /galeria#id-do-album já abre o álbum
  useEffect(() => {
    if (!linkDireto) return;
    const indice = albuns.findIndex((a) => `#${a.id}` === window.location.hash);
    if (indice >= 0) setAberto({ album: indice, foto: 0 }); // eslint-disable-line react-hooks/set-state-in-effect -- o endereço só existe no navegador
  }, [linkDireto, albuns]);
  const mover = useCallback(
    (passo: number) => setAberto((a) => (a && total ? { ...a, foto: (a.foto + passo + total) % total } : a)),
    [total],
  );

  // Visualizador aberto: trava a rolagem, foca o "Fechar", teclado e foco preso no visualizador
  const estaAberto = aberto !== null;
  useEffect(() => {
    if (!estaAberto) return;
    document.body.style.overflow = 'hidden';
    botaoFechar.current?.focus();
    const aoTeclar = (e: KeyboardEvent) => {
      if (e.key === 'Escape') fechar();
      else if (e.key === 'ArrowLeft') mover(-1);
      else if (e.key === 'ArrowRight') mover(1);
      else if (e.key === 'Tab' && dialogo.current) {
        const focaveis = [...dialogo.current.querySelectorAll<HTMLElement>('button')];
        const primeiro = focaveis[0];
        const ultimo = focaveis[focaveis.length - 1];
        if (e.shiftKey && document.activeElement === primeiro) {
          e.preventDefault();
          ultimo?.focus();
        } else if (!e.shiftKey && document.activeElement === ultimo) {
          e.preventDefault();
          primeiro?.focus();
        }
      }
    };
    document.addEventListener('keydown', aoTeclar);
    return () => {
      document.body.style.overflow = '';
      document.removeEventListener('keydown', aoTeclar);
    };
  }, [estaAberto, fechar, mover]);

  // A miniatura da foto atual fica sempre visível na faixa de baixo
  useEffect(() => {
    if (!aberto) return;
    dialogo.current
      ?.querySelector(`[data-miniatura="${aberto.foto}"]`)
      ?.scrollIntoView({ block: 'nearest', inline: 'center' });
  }, [aberto]);

  const foto = album && aberto ? album.fotos[aberto.foto] : undefined;
  const [destaque] = albuns;
  const comDestaque = destacarPrimeiro && !filtrando && destaque !== undefined;
  const inicioDaGrade = comDestaque ? 1 : 0;
  const naGrade = filtrando ? encontrados : albuns.slice(inicioDaGrade);
  const compacto = busca; // duas colunas no celular
  const botaoDeFiltro = (ativo: boolean) =>
    `shrink-0 min-h-[2.75rem] rounded-md border px-4 text-[.95rem] font-semibold transition-colors ${
      ativo ? 'border-navy-900 bg-navy-900 text-white' : 'border-ivory-300 bg-white text-navy-900 hover:border-gold-500'
    }`;

  return (
    <>
      {/* ---------- Busca (página Galeria): fica presa no alto ao rolar ---------- */}
      {busca && (
        <div className="sticky top-20 z-20 -mx-5 mb-12 border-y border-ivory-200 bg-ivory-100/90 px-5 py-4 backdrop-blur-md sm:mx-0 sm:rounded-lg sm:border sm:p-5 sm:shadow-[0_14px_34px_-26px_rgba(8,26,51,.55)]">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:gap-5">
            <label className="relative block lg:flex-1">
              <span className="sr-only">Buscar álbuns por nome ou data</span>
              <svg
                className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#7a5c12]"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <circle cx="11" cy="11" r="7"></circle>
                <path d="M20 20l-3.5-3.5"></path>
              </svg>
              <input
                type="search"
                value={termo}
                onChange={(e) => setTermo(e.target.value)}
                placeholder="Buscar por nome ou data"
                className="h-12 w-full rounded-md border border-ivory-300 bg-white pl-12 pr-4 text-base text-navy-900 placeholder:text-slate-500 focus:border-gold-500 focus:outline-none focus:ring-2 focus:ring-gold-400/40"
              />
            </label>
            {anos.length > 0 && (
              <div
                role="group"
                aria-label="Filtrar por ano"
                className="sem-barra -mx-5 flex gap-2 overflow-x-auto px-5 lg:mx-0 lg:px-0"
              >
                <button
                  type="button"
                  aria-pressed={ano === null}
                  onClick={() => setAno(null)}
                  className={botaoDeFiltro(ano === null)}
                >
                  Todos os anos
                </button>
                {anos.map((a) => (
                  <button
                    key={a}
                    type="button"
                    aria-pressed={ano === a}
                    onClick={() => setAno(ano === a ? null : a)}
                    className={botaoDeFiltro(ano === a)}
                  >
                    {a}
                  </button>
                ))}
              </div>
            )}
          </div>
          <div
            className={filtrando ? 'flex items-center justify-between gap-4 pt-3 text-sm text-slate-600' : 'sr-only'}
          >
            <p aria-live="polite">{filtrando ? totalDeAlbuns(encontrados.length) : ''}</p>
            {filtrando && (
              <button
                type="button"
                onClick={limpar}
                className="font-semibold text-navy-800 underline underline-offset-4 hover:text-gold-700"
              >
                Limpar busca
              </button>
            )}
          </div>
        </div>
      )}

      {filtrando && encontrados.length === 0 && (
        <div className="rounded-lg border border-dashed border-ivory-300 bg-white/60 px-6 py-14 text-center">
          <p className="font-serif text-2xl text-navy-900">Nenhum álbum encontrado.</p>
          <p className="mt-2 text-slate-600">Tente outro nome, um mês (ex.: setembro) ou um ano.</p>
          <button type="button" onClick={limpar} className="btn btn-linha btn-sm mt-6">
            Ver todos os álbuns
          </button>
        </div>
      )}

      {comDestaque && (
        <article
          id={linkDireto ? destaque.id : undefined}
          className="album group relative scroll-mt-28 grid gap-10 lg:grid-cols-12 lg:gap-14 lg:items-center"
        >
          <div className="album-pilha lg:col-span-7">
            <button
              type="button"
              onClick={() => abrir(0)}
              className="relative block aspect-[16/10] w-full overflow-hidden rounded-[4px] img-fallback ring-1 ring-black/10 focus:outline-none focus-visible:ring-4 focus-visible:ring-gold-400"
              aria-label={`Abrir o álbum ${destaque.titulo}, ${totalDeFotos(destaque.total)}`}
            >
              <Image
                src={destaque.fotoDeCapa.foto}
                alt=""
                fill
                sizes="(min-width: 1280px) 700px, (min-width: 1024px) 56vw, 92vw"
                className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-navy-950/50 via-transparent to-transparent"></div>
            </button>
          </div>
          <div className="lg:col-span-5">
            <p
              className={`font-caps text-[.75rem] font-semibold tracking-[.22em] ${escuro ? 'text-gold-300' : 'text-[#7a5c12]'}`}
            >
              Álbum mais recente{destaque.data ? ` · ${dataDoAlbum(destaque.data)}` : ''}
            </p>
            <h2
              className={`mt-3 font-serif font-semibold text-4xl sm:text-5xl leading-[1.05] ${escuro ? 'text-white' : 'text-navy-900'}`}
            >
              {destaque.titulo}
            </h2>
            {destaque.descricao && (
              <p className={`mt-4 text-lg leading-relaxed ${escuro ? 'text-white/75' : 'text-slate-600'}`}>
                {destaque.descricao}
              </p>
            )}
            <p className={`mt-4 text-base ${escuro ? 'text-white/75' : 'text-slate-600'}`}>
              {totalDeFotos(destaque.total)}
            </p>
            {destaque.fotos.length > 1 && (
              <ul className="mt-6 grid grid-cols-4 gap-2.5">
                {destaque.fotos.slice(0, 4).map((f, i) => (
                  <li key={`${f.foto}-${i}`}>
                    <button
                      type="button"
                      onClick={() => abrir(0, i)}
                      className="relative block aspect-square w-full overflow-hidden rounded-[4px] img-fallback ring-1 ring-black/10 hover:opacity-90 focus:outline-none focus-visible:ring-4 focus-visible:ring-gold-400"
                      aria-label={`Abrir a foto ${i + 1}: ${f.legenda}`}
                    >
                      <Image
                        src={f.foto}
                        alt=""
                        fill
                        sizes="(min-width: 1024px) 120px, 22vw"
                        className="object-cover"
                      />
                    </button>
                  </li>
                ))}
              </ul>
            )}
            <button type="button" onClick={() => abrir(0)} className={`btn mt-8 ${escuro ? 'btn-ouro' : 'btn-escuro'}`}>
              Ver todas as fotos
            </button>
          </div>
        </article>
      )}

      {comDestaque && albuns.length > 1 && (
        <h2
          className={`mt-24 sm:mt-28 font-serif font-semibold text-3xl sm:text-4xl ${escuro ? 'text-white' : 'text-navy-900'}`}
        >
          Outros álbuns
        </h2>
      )}
      {naGrade.length > 0 && (
        <ul
          className={`grid lg:grid-cols-3 ${compacto ? 'grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-8 sm:gap-y-14' : 'gap-x-8 gap-y-14 sm:grid-cols-2'}${comDestaque ? ' mt-10' : ''}`}
        >
          {naGrade.map((a) => {
            const i = albuns.indexOf(a);
            return (
              <li key={a.id} id={linkDireto ? a.id : undefined} className="scroll-mt-28">
                <article className="album group relative">
                  <div className="album-pilha">
                    <div className="relative aspect-[4/3] overflow-hidden rounded-[4px] img-fallback ring-1 ring-black/10">
                      <Image
                        src={a.fotoDeCapa.foto}
                        alt=""
                        fill
                        sizes="(min-width: 1280px) 380px, (min-width: 1024px) 30vw, (min-width: 640px) 45vw, 90vw"
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-navy-950/60 via-transparent to-transparent"></div>
                      <span
                        className={`absolute inline-flex items-center gap-1.5 rounded-[4px] bg-navy-950/70 font-semibold text-white backdrop-blur-sm ${compacto ? 'bottom-2 right-2 px-2 py-0.5 text-xs sm:bottom-3 sm:right-3 sm:px-2.5 sm:py-1 sm:text-sm' : 'bottom-3 right-3 px-2.5 py-1 text-sm'}`}
                      >
                        <svg
                          className="h-4 w-4 text-gold-300"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.8"
                          viewBox="0 0 24 24"
                          aria-hidden="true"
                        >
                          <rect x="3" y="5" width="18" height="14" rx="1.5"></rect>
                          <circle cx="8.5" cy="10" r="1.6"></circle>
                          <path d="M21 16l-5-5-8 8"></path>
                        </svg>
                        {totalDeFotos(a.total)}
                      </span>
                    </div>
                  </div>
                  <div className={compacto ? 'mt-4 sm:mt-6' : 'mt-6'}>
                    <p
                      className={`font-caps font-semibold ${compacto ? 'text-[.66rem] tracking-[.14em] sm:text-[.75rem] sm:tracking-[.22em]' : 'text-[.75rem] tracking-[.22em]'} ${escuro ? 'text-gold-300' : 'text-[#7a5c12]'}`}
                    >
                      {a.data ? dataDoAlbum(a.data) : 'Álbum'}
                    </p>
                    <h3
                      className={`mt-1.5 sm:mt-2 font-serif font-semibold leading-tight ${compacto ? 'text-[1.2rem] sm:text-[1.75rem]' : 'text-[1.75rem]'} ${escuro ? 'text-white' : 'text-navy-900'}`}
                    >
                      {/* O botão cobre o cartão inteiro (::after) */}
                      <button
                        type="button"
                        onClick={() => abrir(i)}
                        className={`text-left after:absolute after:inset-0 after:content-[''] focus:outline-none ${escuro ? 'group-hover:text-gold-200' : 'group-hover:text-gold-700'} transition-colors`}
                        aria-label={`Abrir o álbum ${a.titulo}, ${totalDeFotos(a.total)}`}
                      >
                        {a.titulo}
                      </button>
                    </h3>
                    {a.descricao && (
                      <p className={`mt-2 text-base leading-relaxed ${escuro ? 'text-white/75' : 'text-slate-600'}`}>
                        {a.descricao}
                      </p>
                    )}
                    <span
                      className={`mt-3 items-center gap-2 text-[.95rem] font-semibold ${compacto ? 'hidden sm:inline-flex' : 'inline-flex'} ${escuro ? 'text-gold-300' : 'text-navy-800'}`}
                      aria-hidden="true"
                    >
                      Ver álbum
                      <svg
                        className="h-4 w-4 transition-transform group-hover:translate-x-1"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                      >
                        <path d="M5 12h14M13 6l6 6-6 6"></path>
                      </svg>
                    </span>
                  </div>
                  {/* contorno de foco do cartão inteiro */}
                  <span className="pointer-events-none absolute -inset-3 rounded-md ring-gold-400 group-has-[:focus-visible]:ring-4"></span>
                </article>
              </li>
            );
          })}
        </ul>
      )}

      {/* ---------- Visualizador do álbum (no fim do <body>, acima de tudo) ---------- */}
      {album &&
        aberto &&
        foto &&
        createPortal(
          <div
            ref={dialogo}
            role="dialog"
            aria-modal="true"
            aria-labelledby="album-titulo"
            className="fixed inset-0 z-[70] flex flex-col bg-navy-950/[.97] text-white backdrop-blur-sm"
          >
            <header className="flex items-center justify-between gap-4 border-b border-white/10 px-4 py-3 sm:px-8 sm:py-4">
              <div className="min-w-0">
                <p className="font-caps text-[.72rem] font-semibold tracking-[.22em] text-gold-300">
                  {album.data ? dataDoAlbum(album.data) : 'Álbum'}
                </p>
                <h2 id="album-titulo" className="truncate font-serif text-2xl font-semibold sm:text-3xl">
                  {album.titulo}
                </h2>
              </div>
              <div className="flex shrink-0 items-center gap-3 sm:gap-5">
                <span className="text-base tabular-nums text-white/75" aria-live="polite">
                  {aberto.foto + 1} de {total}
                </span>
                <button
                  ref={botaoFechar}
                  type="button"
                  onClick={fechar}
                  className="grid h-12 w-12 place-items-center rounded-md bg-white/10 hover:bg-white/20"
                  aria-label="Fechar o álbum"
                >
                  <svg
                    className="h-6 w-6"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path d="M6 6l12 12M18 6L6 18"></path>
                  </svg>
                </button>
              </div>
            </header>

            <figure
              className="relative m-0 flex min-h-0 flex-1 flex-col"
              onTouchStart={(e) => {
                const t = e.touches[0];
                inicioDoToque.current = t ? { x: t.clientX, y: t.clientY } : null;
              }}
              onTouchEnd={(e) => {
                const inicio = inicioDoToque.current;
                const t = e.changedTouches[0];
                inicioDoToque.current = null;
                if (!inicio || !t) return;
                const dx = t.clientX - inicio.x;
                if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(t.clientY - inicio.y) * 1.5) mover(dx < 0 ? 1 : -1);
              }}
            >
              <div className="relative min-h-0 flex-1">
                <Image
                  key={foto.foto}
                  src={foto.foto}
                  alt={foto.legenda}
                  fill
                  sizes="100vw"
                  className="object-contain px-2 py-3 sm:px-20 sm:py-6"
                />
                {total > 1 && (
                  <>
                    <button
                      type="button"
                      onClick={() => mover(-1)}
                      className="absolute left-2 top-1/2 grid h-12 w-12 -translate-y-1/2 place-items-center rounded-md bg-navy-950/60 ring-1 ring-white/20 hover:bg-white hover:text-navy-950 sm:left-6"
                      aria-label="Foto anterior"
                    >
                      <svg
                        className="h-6 w-6"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                      >
                        <path d="M15 18l-6-6 6-6"></path>
                      </svg>
                    </button>
                    <button
                      type="button"
                      onClick={() => mover(1)}
                      className="absolute right-2 top-1/2 grid h-12 w-12 -translate-y-1/2 place-items-center rounded-md bg-navy-950/60 ring-1 ring-white/20 hover:bg-white hover:text-navy-950 sm:right-6"
                      aria-label="Próxima foto"
                    >
                      <svg
                        className="h-6 w-6"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                      >
                        <path d="M9 18l6-6-6-6"></path>
                      </svg>
                    </button>
                  </>
                )}
              </div>
              <figcaption className="px-6 pb-3 text-center font-serif text-lg italic text-white/85 sm:text-xl">
                {foto.legenda}
              </figcaption>
            </figure>

            {total > 1 && (
              <div className="miniaturas flex gap-2 overflow-x-auto border-t border-white/10 px-4 py-3 sm:justify-center sm:px-8">
                {album.fotos.map((f, i) => (
                  <button
                    key={`${f.foto}-${i}`}
                    type="button"
                    data-miniatura={i}
                    onClick={() => setAberto({ album: aberto.album, foto: i })}
                    aria-label={`Foto ${i + 1}: ${f.legenda}`}
                    aria-current={i === aberto.foto ? 'true' : undefined}
                    className={`relative h-16 w-24 shrink-0 overflow-hidden rounded-[4px] transition ${i === aberto.foto ? 'ring-2 ring-gold-400 opacity-100' : 'opacity-55 hover:opacity-90'}`}
                  >
                    <Image src={f.foto} alt="" fill sizes="96px" className="object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>,
          document.body,
        )}
    </>
  );
}
