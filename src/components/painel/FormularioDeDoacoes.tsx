'use client';

import { useState } from 'react';
import { type AcaoDeFormulario } from '@/modules/Acesso/Presentation/estado';
import { type DadosDeDoacao, TIPOS_DE_CHAVE_PIX } from '@/modules/Doacoes/Domain/doacao';
import { AcoesDoFormulario, BotaoSalvar, Campo, Formulario, Marcar, Selecao, useEstadoDoFormulario } from './Formulario';
import { Secao } from './FormularioDoSite';

function Destinos({ iniciais }: { iniciais: DadosDeDoacao['destinos'] }) {
  const [destinos, setDestinos] = useState(iniciais.map((d, i) => ({ ...d, chave: i })));
  const { erros } = useEstadoDoFormulario();
  const soma = destinos.reduce((t, d) => t + (Number(d.percentual) || 0), 0);
  const erroGeral = erros.destinos;

  return (
    <div className="space-y-3">
      {destinos.map((d, i) => (
        <div key={d.chave} className="grid gap-3 rounded-md border border-slate-200 bg-slate-50/60 p-4 sm:grid-cols-[6.5rem_1fr_auto] sm:items-end">
          <div>
            <label htmlFor={`destino-${d.chave}-pct`} className="mb-1.5 block text-[.95rem] font-semibold text-navy-900">
              Percentual
            </label>
            <div className="relative">
              <input
                id={`destino-${d.chave}-pct`}
                name={`destinos.${i}.percentual`}
                type="number"
                min={0}
                max={100}
                value={d.percentual}
                onChange={(e) =>
                  setDestinos((l) => l.map((x) => (x.chave === d.chave ? { ...x, percentual: Number(e.target.value) } : x)))
                }
                className="h-12 w-full rounded-md border border-slate-300 bg-white pl-3.5 pr-8 text-base text-navy-950 focus:border-gold-500 focus:outline-none focus:ring-2 focus:ring-gold-400/30"
              />
              <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-600">%</span>
            </div>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <Campo nome={`destinos.${i}.titulo`} rotulo="Destino" valor={d.titulo} maxLength={80} />
            <Campo nome={`destinos.${i}.descricao`} rotulo="Descrição" valor={d.descricao} maxLength={200} />
          </div>
          <button
            type="button"
            disabled={destinos.length <= 1}
            onClick={() => setDestinos((l) => l.filter((x) => x.chave !== d.chave))}
            className="btn btn-sm text-red-700 hover:bg-red-50 disabled:opacity-40"
          >
            Remover
          </button>
        </div>
      ))}
      <div className="flex flex-wrap items-center justify-between gap-3">
        {destinos.length < 6 ? (
          <button
            type="button"
            className="btn btn-linha btn-sm"
            onClick={() => setDestinos((l) => [...l, { percentual: 0, titulo: '', descricao: '', chave: Date.now() }])}
          >
            + Adicionar destino
          </button>
        ) : (
          <span />
        )}
        <p className={`text-base font-semibold ${soma === 100 ? 'text-emerald-700' : 'text-red-700'}`} aria-live="polite">
          Soma: {soma}% {soma === 100 ? '✓' : '(precisa dar 100%)'}
        </p>
      </div>
      {erroGeral && <p className="text-sm font-medium text-red-700">{erroGeral}</p>}
    </div>
  );
}

export function FormularioDeDoacoes({ acao, dados }: { acao: AcaoDeFormulario; dados: DadosDeDoacao }) {
  return (
    <Formulario acao={acao} className="space-y-8" mensagemFlutuante>
      <Secao titulo="PIX" descricao="A chave aparece na página Doações, com o QR Code gerado automaticamente.">
        <div className="grid gap-5 sm:grid-cols-[12rem_1fr]">
          <Selecao
            nome="pix.tipoDeChave"
            rotulo="Tipo da chave"
            valor={dados.pix.tipoDeChave}
            opcoes={TIPOS_DE_CHAVE_PIX.map((t) => ({ valor: t, rotulo: t }))}
          />
          <Campo nome="pix.chave" rotulo="Chave PIX" valor={dados.pix.chave} obrigatorio maxLength={140} />
        </div>
      </Secao>

      <Secao titulo="Conta para transferência">
        <div className="grid gap-5 sm:grid-cols-3">
          <Campo nome="banco.banco" rotulo="Banco" valor={dados.banco.banco} obrigatorio maxLength={80} />
          <Campo nome="banco.agencia" rotulo="Agência" valor={dados.banco.agencia} obrigatorio maxLength={20} />
          <Campo nome="banco.conta" rotulo="Conta" valor={dados.banco.conta} obrigatorio maxLength={30} />
        </div>
        <div className="grid gap-5 sm:grid-cols-[1fr_14rem]">
          <Campo nome="banco.titular" rotulo="Titular" valor={dados.banco.titular} obrigatorio maxLength={120} />
          <Campo nome="banco.cnpj" rotulo="CNPJ" valor={dados.banco.cnpj} obrigatorio maxLength={30} />
        </div>
      </Secao>

      <Secao titulo="Para onde vão as ofertas" descricao="Os percentuais aparecem na página Doações e precisam somar 100%.">
        <Destinos iniciais={dados.destinos} />
      </Secao>

      <Secao titulo="Situação">
        <Marcar
          nome="exemplo"
          rotulo="Estes dados ainda são de exemplo"
          ajuda="Enquanto marcado, o site avisa que a chave e a conta não são as oficiais. Desmarque quando os dados reais estiverem preenchidos."
          marcado={dados.exemplo}
        />
      </Secao>

      <AcoesDoFormulario principal={<BotaoSalvar>Salvar dados de doação</BotaoSalvar>} />
    </Formulario>
  );
}
