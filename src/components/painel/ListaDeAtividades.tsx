import { ACOES, AREAS, type Atividade } from '@/modules/Atividades/Domain/atividade';
import { dataHoraBR } from './Pagina';

const COR_DA_ACAO: Partial<Record<Atividade['acao'], string>> = {
  criou: 'bg-emerald-500',
  editou: 'bg-navy-700',
  excluiu: 'bg-red-500',
  'enviou-foto': 'bg-gold-500',
  'falhou-ao-entrar': 'bg-amber-500',
  bloqueado: 'bg-red-600',
};

/** Linhas do registro de atividades (quem, o quê, onde, quando). */
export function ListaDeAtividades({ itens, mostrarIp = false }: { itens: Atividade[]; mostrarIp?: boolean }) {
  return (
    <ol className="divide-y divide-slate-100">
      {itens.map((a) => (
        <li key={a.id} className="flex gap-3.5 py-3.5 first:pt-0 last:pb-0">
          <span className={`mt-2 h-2 w-2 shrink-0 rounded-full ${COR_DA_ACAO[a.acao] ?? 'bg-slate-400'}`} aria-hidden="true" />
          <div className="min-w-0 flex-1">
            <p className="text-[.97rem] text-navy-950">
              <span className="font-semibold">{a.usuarioNome ?? 'Alguém não identificado'}</span>{' '}
              <span className="text-slate-700">{ACOES[a.acao].toLowerCase()}</span>
              {a.alvo && <span className="text-slate-700"> — {a.alvo}</span>}
            </p>
            {a.detalhe && <p className="mt-0.5 break-words text-sm text-slate-600">{a.detalhe}</p>}
            <p className="mt-1 text-xs text-slate-600">
              {AREAS[a.area]} · <time dateTime={a.criadoEm.toISOString()}>{dataHoraBR(a.criadoEm)}</time>
              {mostrarIp && a.ip && <> · IP {a.ip}</>}
            </p>
          </div>
        </li>
      ))}
    </ol>
  );
}
