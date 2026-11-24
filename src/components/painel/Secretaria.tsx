'use client';

import { useState } from 'react';
import { type AcaoDeFormulario } from '@/modules/Acesso/Presentation/estado';
import { type Dizimista, FORMAS_DE_PAGAMENTO, TIPOS_DE_CONTRIBUICAO } from '@/modules/Secretaria/Domain/secretaria';
import { AcoesDoFormulario, AreaDeTexto, BotaoSalvar, Campo, Formulario, Marcar, Selecao, useEstadoDoFormulario } from './Formulario';

export function FormularioDeDizimista({ acao, dizimista }: { acao: AcaoDeFormulario; dizimista?: Dizimista }) {
  return (
    <Formulario acao={acao}>
      <Campo nome="nome" rotulo="Nome completo" valor={dizimista?.nome} obrigatorio maxLength={120} autoComplete="off" />
      <div className="grid gap-6 sm:grid-cols-2">
        <Campo nome="telefone" rotulo="Telefone / WhatsApp" valor={dizimista?.telefone} inputMode="tel" maxLength={30} autoComplete="off" />
        <Campo nome="email" rotulo="E-mail" tipo="email" valor={dizimista?.email} maxLength={160} autoComplete="off" />
      </div>
      <Campo nome="endereco" rotulo="Endereço" valor={dizimista?.endereco} maxLength={200} autoComplete="off" />
      <AreaDeTexto
        nome="observacoes"
        rotulo="Observações"
        valor={dizimista?.observacoes}
        linhas={3}
        maxLength={500}
        ajuda="Só o necessário para a secretaria (ex.: prefere contato por WhatsApp). Não anote dados sensíveis."
      />
      <Marcar
        nome="ativo"
        rotulo="Dizimista ativo"
        ajuda="Desmarque quando a pessoa deixar de contribuir; o histórico continua guardado."
        marcado={dizimista?.ativo ?? true}
      />
      <AcoesDoFormulario principal={<BotaoSalvar>{dizimista ? 'Salvar cadastro' : 'Cadastrar dizimista'}</BotaoSalvar>} />
    </Formulario>
  );
}

const opcoes = (o: Record<string, string>) => Object.entries(o).map(([valor, rotulo]) => ({ valor, rotulo }));

function QuemContribuiu({ dizimistas, dizimistaInicial }: { dizimistas: Pick<Dizimista, 'id' | 'nome'>[]; dizimistaInicial?: string }) {
  const [quem, setQuem] = useState<'dizimista' | 'doador' | 'anonimo'>('dizimista');
  const { erros } = useEstadoDoFormulario();
  const escolhas = [
    { valor: 'dizimista', rotulo: 'Dizimista cadastrado' },
    { valor: 'doador', rotulo: 'Outra pessoa' },
    { valor: 'anonimo', rotulo: 'Anônimo' },
  ] as const;
  return (
    <fieldset>
      <legend className="block text-[.95rem] font-semibold text-navy-900">Quem contribuiu</legend>
      <div className="mt-2 inline-flex flex-wrap rounded-md border border-slate-300 bg-white p-1">
        {escolhas.map((e) => (
          <label
            key={e.valor}
            className={`cursor-pointer rounded px-3.5 py-2 text-sm font-semibold transition-colors has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-gold-400 ${
              quem === e.valor ? 'bg-navy-900 text-white' : 'text-slate-700 hover:bg-slate-100'
            }`}
          >
            <input type="radio" name="quem" value={e.valor} checked={quem === e.valor} onChange={() => setQuem(e.valor)} className="sr-only" />
            {e.rotulo}
          </label>
        ))}
      </div>
      <div className="mt-4">
        {quem === 'dizimista' &&
          (dizimistas.length ? (
            <Selecao
              nome="dizimistaId"
              rotulo="Dizimista"
              valor={dizimistaInicial ?? ''}
              opcoes={[{ valor: '', rotulo: 'Escolha…' }, ...dizimistas.map((d) => ({ valor: d.id, rotulo: d.nome }))]}
            />
          ) : (
            <p className="text-sm text-slate-600">Nenhum dizimista ativo cadastrado.</p>
          ))}
        {quem === 'doador' && <Campo nome="doadorNome" rotulo="Nome de quem doou" maxLength={120} autoComplete="off" />}
        {quem === 'anonimo' && <p className="text-sm text-slate-600">A contribuição fica registrada sem nome.</p>}
        {erros.dizimistaId && quem === 'dizimista' && <p className="mt-1.5 text-sm font-medium text-red-700">{erros.dizimistaId}</p>}
      </div>
    </fieldset>
  );
}

export function FormularioDeContribuicao({
  acao,
  dizimistas,
  hoje,
  dizimistaInicial,
}: {
  acao: AcaoDeFormulario;
  dizimistas: Pick<Dizimista, 'id' | 'nome'>[];
  hoje: string;
  dizimistaInicial?: string;
}) {
  return (
    <Formulario acao={acao} limparAoSalvar className="space-y-5">
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <Selecao nome="tipo" rotulo="Tipo" valor="dizimo" opcoes={opcoes(TIPOS_DE_CONTRIBUICAO)} />
        <Campo nome="valor" rotulo="Valor (R$)" inputMode="decimal" obrigatorio placeholder="50,00" maxLength={14} autoComplete="off" />
        <Campo nome="data" rotulo="Data" tipo="date" valor={hoje} obrigatorio />
        <Selecao nome="forma" rotulo="Forma" valor="pix" opcoes={opcoes(FORMAS_DE_PAGAMENTO)} />
      </div>
      <QuemContribuiu dizimistas={dizimistas} dizimistaInicial={dizimistaInicial} />
      <Campo nome="observacao" rotulo="Observação (opcional)" maxLength={300} autoComplete="off" />
      <AcoesDoFormulario principal={<BotaoSalvar>Registrar contribuição</BotaoSalvar>} />
    </Formulario>
  );
}
