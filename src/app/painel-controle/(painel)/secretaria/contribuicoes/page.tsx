import { type Metadata } from 'next';
import Link from 'next/link';
import { BotaoDeAcao } from '@/components/painel/BotaoDeAcao';
import { CabecalhoDaPagina, Cartao, dataBR, Vazio } from '@/components/painel/Pagina';
import { FormularioDeContribuicao } from '@/components/painel/Secretaria';
import { painel } from '@/config/container';
import { hojeIsoEmBrasilia, MESES_EXTENSO } from '@/lib/datas';
import { exigirPermissao } from '@/modules/Acesso/Presentation/sessao';
import {
  emReais,
  FORMAS_DE_PAGAMENTO,
  TIPOS_DE_CONTRIBUICAO,
  type TipoDeContribuicao,
} from '@/modules/Secretaria/Domain/secretaria';
import { excluirContribuicao, registrarContribuicao } from '../acoes';

export const metadata: Metadata = { title: 'Contribuições' };

function mesVizinho(mes: string, passo: number) {
  const [a, m] = mes.split('-').map(Number) as [number, number];
  const d = new Date(Date.UTC(a, m - 1 + passo, 1));
  return `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, '0')}`;
}
const nomeDoMes = (mes: string) => {
  const [a, m] = mes.split('-').map(Number) as [number, number];
  const nome = MESES_EXTENSO[m - 1] ?? '';
  return `${nome.charAt(0).toUpperCase()}${nome.slice(1)} de ${a}`;
};

export default async function Contribuicoes({
  searchParams,
}: {
  searchParams: Promise<{ mes?: string; tipo?: string; dizimista?: string }>;
}) {
  await exigirPermissao('secretaria');
  const params = await searchParams;
  const hoje = hojeIsoEmBrasilia(new Date());
  const mes = /^\d{4}-(0[1-9]|1[0-2])$/.test(params.mes ?? '') ? params.mes! : hoje.slice(0, 7);
  const tipo = params.tipo && params.tipo in TIPOS_DE_CONTRIBUICAO ? (params.tipo as TipoDeContribuicao) : undefined;
  const ano = Number(mes.slice(0, 4));

  const [lista, porMes, dizimistas] = await Promise.all([
    painel.secretaria.listarContribuicoes({ mes, tipo }),
    painel.secretaria.totaisPorMes(ano),
    painel.secretaria.listarDizimistas({ situacao: 'ativos' }),
  ]);
  const total = lista.reduce((t, c) => t + c.valorCentavos, 0);
  const porTipo = (Object.keys(TIPOS_DE_CONTRIBUICAO) as TipoDeContribuicao[]).map((t) => ({
    tipo: t,
    total: lista.filter((c) => c.tipo === t).reduce((s, c) => s + c.valorCentavos, 0),
  }));
  const maiorMes = Math.max(1, ...porMes.map((m) => m.totalCentavos));
  const dizimistaInicial = params.dizimista && dizimistas.some((d) => d.id === params.dizimista) ? params.dizimista : undefined;
  const filtro = (extra: Record<string, string>) => `?${new URLSearchParams({ mes, ...(tipo ? { tipo } : {}), ...extra })}`;

  return (
    <div className="space-y-6">
      <CabecalhoDaPagina titulo="Contribuições" descricao="Dízimos, ofertas, doações e campanhas recebidos pela secretaria." />

      <Cartao titulo="Registrar contribuição">
        <FormularioDeContribuicao
          acao={registrarContribuicao}
          dizimistas={dizimistas.map((d) => ({ id: d.id, nome: d.nome }))}
          hoje={hoje}
          dizimistaInicial={dizimistaInicial}
        />
      </Cartao>

      <section className="rounded-lg bg-white shadow-sm ring-1 ring-black/5">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 px-5 py-4 sm:px-7">
          <div className="flex items-center gap-1">
            <Link href={`?${new URLSearchParams({ mes: mesVizinho(mes, -1) })}`} className="grid h-10 w-10 place-items-center rounded-md hover:bg-slate-100" aria-label="Mês anterior">
              <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
                <path d="m15 18-6-6 6-6" />
              </svg>
            </Link>
            <h2 className="min-w-[12rem] text-center font-serif text-2xl font-semibold text-navy-900">{nomeDoMes(mes)}</h2>
            <Link href={`?${new URLSearchParams({ mes: mesVizinho(mes, 1) })}`} className="grid h-10 w-10 place-items-center rounded-md hover:bg-slate-100" aria-label="Próximo mês">
              <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
                <path d="m9 18 6-6-6-6" />
              </svg>
            </Link>
          </div>
          <p className="text-right">
            <span className="block text-sm text-slate-600">{tipo ? `Total de ${TIPOS_DE_CONTRIBUICAO[tipo].toLowerCase()}` : 'Total do mês'}</span>
            <span className="font-serif text-3xl font-semibold text-navy-900">{emReais(total)}</span>
          </p>
        </div>

        <div className="grid grid-cols-2 gap-px border-b border-slate-100 bg-slate-100 sm:grid-cols-4">
          {porTipo.map((t) => (
            <Link
              key={t.tipo}
              href={filtro({ tipo: tipo === t.tipo ? '' : t.tipo })}
              aria-current={tipo === t.tipo ? 'true' : undefined}
              className={`bg-white px-5 py-3 transition-colors hover:bg-navy-50/60 ${tipo === t.tipo ? 'shadow-[inset_0_-3px_0_#c9a227]' : ''}`}
            >
              <span className="block text-xs font-semibold uppercase tracking-wider text-slate-600">{TIPOS_DE_CONTRIBUICAO[t.tipo]}</span>
              <span className="block font-semibold tabular-nums text-navy-950">{tipo && tipo !== t.tipo ? '—' : emReais(t.total)}</span>
            </Link>
          ))}
        </div>

        <div className="px-5 py-4 sm:px-7">
          {lista.length ? (
            <ul className="divide-y divide-slate-100">
              {lista.map((c) => (
                <li key={c.id} className="flex flex-wrap items-center gap-x-5 gap-y-1 py-3">
                  <span className="w-24 text-sm tabular-nums text-slate-600">{dataBR(c.data)}</span>
                  <span className="min-w-0 flex-1">
                    <span className="block font-semibold text-navy-950">
                      {c.dizimistaId ? (
                        <Link href={`/painel-controle/secretaria/dizimistas/${c.dizimistaId}`} className="hover:text-gold-700">
                          {c.dizimistaNome}
                        </Link>
                      ) : (
                        (c.doadorNome ?? <span className="font-normal italic text-slate-600">Anônimo</span>)
                      )}
                    </span>
                    <span className="block text-sm text-slate-600">
                      {TIPOS_DE_CONTRIBUICAO[c.tipo]} · {FORMAS_DE_PAGAMENTO[c.forma]}
                      {c.observacao && <> · {c.observacao}</>}
                    </span>
                  </span>
                  <span className="font-semibold tabular-nums text-navy-900">{emReais(c.valorCentavos)}</span>
                  <BotaoDeAcao
                    acao={excluirContribuicao}
                    campos={{ id: c.id }}
                    confirmar={`Excluir a contribuição de ${emReais(c.valorCentavos)} de ${dataBR(c.data)}?`}
                    classe="grid h-9 w-9 place-items-center rounded text-slate-400 hover:bg-red-50 hover:text-red-700"
                    rotulo="Excluir contribuição"
                  >
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M5 7h14M10 11v6M14 11v6M6 7l1 12a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1l1-12M9 7V4h6v3" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </BotaoDeAcao>
                </li>
              ))}
            </ul>
          ) : (
            <Vazio>Nenhuma contribuição {tipo ? 'deste tipo ' : ''}registrada neste mês.</Vazio>
          )}
        </div>
      </section>

      <Cartao titulo={`Resumo de ${ano}`} descricao="Total recebido em cada mês.">
        <ul className="space-y-2">
          {Array.from({ length: 12 }, (_, i) => {
            const chave = `${ano}-${String(i + 1).padStart(2, '0')}`;
            const m = porMes.find((x) => x.mes === chave);
            const valor = m?.totalCentavos ?? 0;
            return (
              <li key={chave}>
                <Link href={`?${new URLSearchParams({ mes: chave })}`} className="grid grid-cols-[5.5rem_1fr_7.5rem] items-center gap-3 rounded px-1 py-1 hover:bg-slate-50">
                  <span className={`text-sm ${chave === mes ? 'font-bold text-navy-950' : 'text-slate-600'}`}>
                    {(MESES_EXTENSO[i] ?? '').slice(0, 3)}
                  </span>
                  <span className="h-2.5 overflow-hidden rounded-full bg-slate-100">
                    <span className="block h-full rounded-full bg-gold-500" style={{ width: `${(valor / maiorMes) * 100}%` }} />
                  </span>
                  <span className="text-right text-sm tabular-nums text-navy-950">{valor ? emReais(valor) : '—'}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </Cartao>
    </div>
  );
}
