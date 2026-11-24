import Link from 'next/link';
import { type ReactNode } from 'react';

/** Título da página do painel, com descrição e ação principal (ex.: "Novo evento"). */
export function CabecalhoDaPagina({
  titulo,
  descricao,
  acao,
  voltar,
}: {
  titulo: string;
  descricao?: ReactNode;
  acao?: ReactNode;
  voltar?: { href: string; rotulo: string };
}) {
  return (
    <header className="mb-8">
      {voltar && (
        <Link href={voltar.href} className="mb-3 inline-flex items-center gap-1.5 text-[.95rem] font-semibold text-navy-800 hover:text-gold-700">
          <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M15 18l-6-6 6-6"></path>
          </svg>
          {voltar.rotulo}
        </Link>
      )}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="font-serif text-4xl font-semibold leading-tight text-navy-900 sm:text-[2.6rem]">{titulo}</h1>
          {descricao && <p className="mt-2 max-w-2xl text-base text-slate-600">{descricao}</p>}
        </div>
        {acao && <div className="shrink-0">{acao}</div>}
      </div>
    </header>
  );
}

/** Bloco branco com título (seções das páginas do painel). */
export function Cartao({
  titulo,
  descricao,
  children,
  className = '',
}: {
  titulo?: string;
  descricao?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section className={`rounded-lg bg-white p-5 shadow-sm ring-1 ring-black/5 sm:p-7 ${className}`}>
      {titulo && <h2 className="font-serif text-2xl font-semibold text-navy-900">{titulo}</h2>}
      {descricao && <p className="mt-1 text-base text-slate-600">{descricao}</p>}
      <div className={titulo || descricao ? 'mt-5' : ''}>{children}</div>
    </section>
  );
}

export function Vazio({ children }: { children: ReactNode }) {
  return (
    <p className="rounded-lg border border-dashed border-slate-300 bg-white/60 px-6 py-10 text-center text-base text-slate-600">
      {children}
    </p>
  );
}

const CORES = {
  neutra: 'bg-slate-100 text-slate-700',
  ouro: 'bg-gold-50 text-[#7a5c12] ring-1 ring-inset ring-gold-500/30',
  azul: 'bg-navy-50 text-navy-800',
  verde: 'bg-emerald-50 text-emerald-800',
  vermelha: 'bg-red-50 text-red-800',
} as const;

export function Etiqueta({ children, cor = 'neutra' }: { children: ReactNode; cor?: keyof typeof CORES }) {
  return <span className={`inline-flex items-center rounded px-2 py-0.5 text-xs font-semibold ${CORES[cor]}`}>{children}</span>;
}

/** Link com aparência de botão (ex.: "Novo evento"). */
export function LinkBotao({ href, children, classe = 'btn-escuro' }: { href: string; children: ReactNode; classe?: string }) {
  return (
    <Link href={href} className={`btn btn-sm ${classe}`}>
      {children}
    </Link>
  );
}

/** "23/11/2026" */
export const dataBR = (iso: string) => iso.split('-').reverse().join('/');

/** "23/11/2026 às 14:05" (horário de Brasília) */
export const dataHoraBR = (d: Date) =>
  d.toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo', dateStyle: 'short', timeStyle: 'short' }).replace(', ', ' às ');

/** Aviso verde de "deu certo" (ex.: depois de criar ou excluir e voltar para a lista). */
export function AvisoDeSucesso({ texto }: { texto?: string | null }) {
  if (!texto) return null;
  return (
    <p role="status" className="mb-6 rounded-md border border-emerald-200 bg-emerald-50 px-4 py-3 text-base text-emerald-900">
      {texto}
    </p>
  );
}
