import { type Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { BotaoDeAcao } from '@/components/painel/BotaoDeAcao';
import { AvisoDeSucesso, CabecalhoDaPagina, Cartao, dataBR, Vazio } from '@/components/painel/Pagina';
import { FormularioDeDizimista } from '@/components/painel/Secretaria';
import { painel } from '@/config/container';
import { exigirPermissao } from '@/modules/Acesso/Presentation/sessao';
import { emReais, FORMAS_DE_PAGAMENTO, TIPOS_DE_CONTRIBUICAO } from '@/modules/Secretaria/Domain/secretaria';
import { editarDizimista, excluirDizimista } from '../../acoes';

export const metadata: Metadata = { title: 'Dizimista' };

export default async function Dizimista({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<{ aviso?: string }> }) {
  await exigirPermissao('secretaria');
  const { id } = await params;
  if (!/^[0-9a-f-]{36}$/i.test(id)) notFound();
  const [dizimista, historico, { aviso }] = await Promise.all([
    painel.secretaria.buscarDizimista(id).catch(() => null),
    painel.secretaria.historicoDoDizimista(id),
    searchParams,
  ]);
  if (!dizimista) notFound();
  const total = historico.reduce((t, c) => t + c.valorCentavos, 0);

  return (
    <div className="space-y-6">
      <CabecalhoDaPagina
        titulo={dizimista.nome}
        descricao={`Cadastro nº ${id.slice(0, 8)} · ${dizimista.ativo ? 'ativo' : 'inativo'}`}
        voltar={{ href: '/painel-controle/secretaria/dizimistas', rotulo: 'Dizimistas' }}
        acao={
          <BotaoDeAcao
            acao={excluirDizimista.bind(null, id)}
            confirmar={`Excluir o cadastro de ${dizimista.nome}? As contribuições continuam registradas, mas sem o nome. Prefira desmarcar “ativo”.`}
            classe="btn btn-sm border-red-200 text-red-700 hover:bg-red-50"
          >
            Excluir cadastro
          </BotaoDeAcao>
        }
      />
      <AvisoDeSucesso texto={aviso === 'criado' ? 'Dizimista cadastrado.' : null} />

      <div className="grid items-start gap-6 xl:grid-cols-[1fr_24rem]">
        <Cartao titulo="Cadastro">
          <FormularioDeDizimista acao={editarDizimista.bind(null, id)} dizimista={dizimista} />
        </Cartao>
        <Cartao titulo="Contribuições" descricao={historico.length ? `Últimas ${historico.length} · ${emReais(total)}` : undefined}>
          {historico.length ? (
            <ul className="divide-y divide-slate-100">
              {historico.map((c) => (
                <li key={c.id} className="flex items-baseline justify-between gap-3 py-2.5 first:pt-0">
                  <span>
                    <span className="block text-sm font-semibold text-navy-950">{TIPOS_DE_CONTRIBUICAO[c.tipo]}</span>
                    <span className="block text-xs text-slate-600">
                      {dataBR(c.data)} · {FORMAS_DE_PAGAMENTO[c.forma]}
                    </span>
                  </span>
                  <span className="font-semibold tabular-nums text-navy-900">{emReais(c.valorCentavos)}</span>
                </li>
              ))}
            </ul>
          ) : (
            <Vazio>Nenhuma contribuição registrada.</Vazio>
          )}
          <Link
            href={`/painel-controle/secretaria/contribuicoes?dizimista=${id}`}
            className="mt-5 inline-flex items-center gap-1.5 text-[.95rem] font-semibold text-navy-800 hover:text-gold-700"
          >
            + Registrar contribuição
          </Link>
        </Cartao>
      </div>
    </div>
  );
}
