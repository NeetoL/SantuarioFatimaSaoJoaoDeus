'use client';

import { type ReactNode, useId, useState } from 'react';
import { type AcaoDeFormulario } from '@/modules/Acesso/Presentation/estado';
import { type QuadroDeHorarios } from '@/modules/Horarios/Domain/horarios';
import { AcoesDoFormulario, BotaoSalvar, Formulario, useEstadoDoFormulario } from './Formulario';

const DIAS = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'] as const;
const LETRAS = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'] as const;

const estilo =
  'w-full rounded-md border border-slate-300 bg-white px-3 text-base text-navy-950 placeholder:text-slate-400 focus:border-gold-500 focus:outline-none focus:ring-2 focus:ring-gold-400/30 aria-[invalid=true]:border-red-400';

/** Erro do servidor para um caminho (ex.: "confissoes.1") — o primeiro que começar com ele. */
function useErro(prefixo: string) {
  const { erros } = useEstadoDoFormulario();
  const chave = Object.keys(erros).find((c) => c === prefixo || c.startsWith(`${prefixo}.`));
  return chave ? erros[chave] : undefined;
}

function Erro({ caminho }: { caminho: string }) {
  const erro = useErro(caminho);
  return erro ? <p className="mt-1 text-sm font-medium text-red-700">{erro}</p> : null;
}

function Texto({
  rotulo,
  valor,
  aoMudar,
  caminho,
  placeholder,
  ocultarRotulo,
  className = '',
}: {
  rotulo: string;
  valor: string;
  aoMudar: (v: string) => void;
  caminho: string;
  placeholder?: string;
  ocultarRotulo?: boolean;
  className?: string;
}) {
  const id = useId();
  const erro = useErro(caminho);
  return (
    <div className={className}>
      <label htmlFor={id} className={ocultarRotulo ? 'sr-only' : 'mb-1 block text-sm font-semibold text-navy-900'}>
        {rotulo}
      </label>
      <input
        id={id}
        value={valor}
        onChange={(e) => aoMudar(e.target.value)}
        placeholder={placeholder}
        aria-invalid={Boolean(erro)}
        className={`${estilo} h-11`}
      />
    </div>
  );
}

/** Dias da semana em botões (D S T Q Q S S). */
function Dias({ valor, aoMudar, rotulo }: { valor: number[]; aoMudar: (d: number[]) => void; rotulo: string }) {
  return (
    <fieldset>
      <legend className="mb-1 block text-sm font-semibold text-navy-900">{rotulo}</legend>
      <div className="flex gap-1">
        {LETRAS.map((letra, d) => {
          const ativo = valor.includes(d);
          return (
            <button
              key={d}
              type="button"
              aria-pressed={ativo}
              aria-label={DIAS[d]}
              title={DIAS[d]}
              onClick={() => aoMudar(ativo ? valor.filter((x) => x !== d) : [...valor, d].sort())}
              className={`h-11 w-10 rounded-md border text-sm font-semibold transition-colors ${
                ativo ? 'border-navy-900 bg-navy-900 text-white' : 'border-slate-300 bg-white text-slate-600 hover:border-navy-800'
              }`}
            >
              {letra}
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}

function Bloco({ titulo, descricao, caminho, children }: { titulo: string; descricao?: ReactNode; caminho: string; children: ReactNode }) {
  return (
    <section className="rounded-lg bg-white p-5 shadow-sm ring-1 ring-black/5 sm:p-7">
      <h2 className="font-serif text-2xl font-semibold text-navy-900">{titulo}</h2>
      {descricao && <p className="mt-1 text-base text-slate-600">{descricao}</p>}
      <Erro caminho={caminho} />
      <div className="mt-5">{children}</div>
    </section>
  );
}

function BotaoRemover({ aoClicar, rotulo }: { aoClicar: () => void; rotulo: string }) {
  return (
    <button
      type="button"
      onClick={aoClicar}
      aria-label={rotulo}
      title={rotulo}
      className="grid h-11 w-11 shrink-0 place-items-center rounded-md text-slate-600 hover:bg-red-50 hover:text-red-700"
    >
      <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M5 7h14M10 11v6M14 11v6M6 7l1 12a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1l1-12M9 7V4h6v3" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </button>
  );
}

function BotaoAdicionar({ aoClicar, children }: { aoClicar: () => void; children: ReactNode }) {
  return (
    <button type="button" onClick={aoClicar} className="btn btn-linha btn-sm mt-4">
      + {children}
    </button>
  );
}

const AJUDA_FAIXA = 'Ex.: 18h · 9h às 12h · 9h às 12h e 14h às 19h';

/** Horários da semana em texto ("7h, 10h, 18h") ↔ lista. */
const horasEmTexto = (horas: string[]) => horas.join(', ');
const textoEmHoras = (texto: string) =>
  texto
    .split(/[,;]|\s+e\s+/)
    .map((h) => h.trim().replace(/\s+/g, ''))
    .filter(Boolean);

type Linha<T> = T & { chave: number };
const comChave = <T,>(lista: T[]) => lista.map((item, i) => ({ ...item, chave: i }));
const semChave = <T,>(lista: Linha<T>[]): T[] =>
  lista.map((item) => {
    const copia = { ...item } as Partial<Linha<T>>;
    delete copia.chave;
    return copia as T;
  });
let proxima = 1000;
const novaChave = () => ++proxima;

/** Texto vazio vira "sem valor" (o site não mostra). */
const opcional = (v: string) => (v.trim() ? v.trim() : undefined);

export function EditorDeHorarios({ acao, quadro }: { acao: AcaoDeFormulario; quadro: QuadroDeHorarios }) {
  const [semana, setSemana] = useState(quadro.missasDaSemana.map((d) => ({ ...d, horasTexto: horasEmTexto(d.horas) })));
  const [mensais, setMensais] = useState(comChave(quadro.missasMensais));
  const [confissoes, setConfissoes] = useState(comChave(quadro.confissoes));
  const [tercos, setTercos] = useState(comChave(quadro.tercos));
  const [adoracao, setAdoracao] = useState(comChave(quadro.adoracao));
  const [igreja, setIgreja] = useState(quadro.igrejaAberta.map((v) => v ?? ''));
  const [secretaria, setSecretaria] = useState(quadro.secretaria.map((v) => v ?? ''));
  const [feriados, setFeriados] = useState(quadro.secretariaFechaNosFeriados);

  const atualizar = <T,>(set: React.Dispatch<React.SetStateAction<T[]>>, i: number, parte: Partial<T>) =>
    set((lista) => lista.map((item, j) => (j === i ? { ...item, ...parte } : item)));

  const json: QuadroDeHorarios = {
    missasDaSemana: semana.map(({ horasTexto, ...d }) => ({
      dia: d.dia,
      horas: d.fechado ? [] : textoEmHoras(horasTexto),
      nota: opcional(d.nota ?? ''),
      missa: opcional(d.missa ?? ''),
      fechado: d.fechado || undefined,
      mensal: opcional(d.mensal ?? ''),
    })),
    missasMensais: semChave(mensais),
    confissoes: semChave(confissoes),
    tercos: semChave(tercos),
    adoracao: semChave(adoracao).map((a) => ({ ...a, obs: opcional(a.obs ?? '') })),
    igrejaAberta: igreja.map((v) => opcional(v) ?? null),
    secretaria: secretaria.map((v) => opcional(v) ?? null),
    secretariaFechaNosFeriados: feriados,
  };

  return (
    <Formulario acao={acao} className="space-y-6" mensagemFlutuante>
      <input type="hidden" name="quadro" value={JSON.stringify(json)} />

      <Bloco
        titulo="Missas da semana"
        descricao="Horários separados por vírgula (ex.: 7h, 10h, 18h). A observação aparece embaixo dos horários na página Missas."
        caminho="missasDaSemana"
      >
        <div className="divide-y divide-slate-100">
          {semana.map((d, i) => (
            <div key={d.dia} className="grid gap-3 py-4 first:pt-0 last:pb-0 md:grid-cols-[7.5rem_1fr]">
              <div className="flex items-center justify-between md:block">
                <p className="font-semibold text-navy-950 md:pt-2.5">{d.dia}</p>
                <label className="flex items-center gap-2 text-sm text-slate-700 md:mt-2">
                  <input
                    type="checkbox"
                    checked={Boolean(d.fechado)}
                    onChange={(e) => atualizar(setSemana, i, { fechado: e.target.checked })}
                    className="h-4 w-4 accent-[#0f2a4f]"
                  />
                  Sem missa
                </label>
              </div>
              {d.fechado ? (
                <p className="self-center text-sm text-slate-600">Neste dia não há missa (a igreja aparece como fechada para missas).</p>
              ) : (
                <div className="space-y-3">
                  <div className="grid gap-3 sm:grid-cols-[1fr_1.6fr]">
                    <Texto
                      rotulo={`Horários de ${d.dia}`}
                      valor={d.horasTexto}
                      aoMudar={(v) => atualizar(setSemana, i, { horasTexto: v })}
                      caminho={`missasDaSemana.${i}.horas`}
                      placeholder="7h, 10h, 18h"
                    />
                    <Texto
                      rotulo="Observação"
                      valor={d.nota ?? ''}
                      aoMudar={(v) => atualizar(setSemana, i, { nota: v })}
                      caminho={`missasDaSemana.${i}.nota`}
                      placeholder="Ex.: Missa dominical"
                    />
                  </div>
                  <details className="group" open={Boolean(d.missa || d.mensal)}>
                    <summary className="inline-flex cursor-pointer list-none items-center gap-1 text-sm font-semibold text-navy-800 hover:text-gold-700 [&::-webkit-details-marker]:hidden">
                      <svg className="h-3.5 w-3.5 transition-transform group-open:rotate-90" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24" aria-hidden="true">
                        <path d="m9 18 6-6-6-6" />
                      </svg>
                      Mais opções
                    </summary>
                    <div className="mt-3 grid gap-3 sm:grid-cols-[1fr_1.6fr]">
                      <Texto
                        rotulo="Nome curto (quadro “Hoje”)"
                        valor={d.missa ?? ''}
                        aoMudar={(v) => atualizar(setSemana, i, { missa: v })}
                        caminho={`missasDaSemana.${i}.missa`}
                        placeholder="Ex.: Missa da Luz"
                      />
                      <Texto
                        rotulo="Só uma vez por mês?"
                        valor={d.mensal ?? ''}
                        aoMudar={(v) => atualizar(setSemana, i, { mensal: v })}
                        caminho={`missasDaSemana.${i}.mensal`}
                        placeholder="Ex.: 1ª sexta do mês (vazio = toda semana)"
                      />
                    </div>
                  </details>
                </div>
              )}
              <div className="md:col-start-2">
                <Erro caminho={`missasDaSemana.${i}`} />
              </div>
            </div>
          ))}
        </div>
      </Bloco>

      <Bloco titulo="Missas votivas (uma vez por mês)" descricao="A página Missas calcula e mostra a próxima data de cada uma." caminho="missasMensais">
        <div className="space-y-3">
          {mensais.map((m, i) => (
            <div key={m.chave} className="rounded-md border border-slate-200 bg-slate-50/60 p-4">
              <div className="grid gap-3 sm:grid-cols-2">
                <Texto rotulo="Nome" valor={m.titulo} aoMudar={(v) => atualizar(setMensais, i, { titulo: v })} caminho={`missasMensais.${i}.titulo`} />
                <Texto
                  rotulo="Quando (texto)"
                  valor={m.quando}
                  aoMudar={(v) => atualizar(setMensais, i, { quando: v })}
                  caminho={`missasMensais.${i}.quando`}
                  placeholder="Primeira sexta-feira do mês"
                />
              </div>
              <div className="mt-3 flex flex-wrap items-end gap-3">
                <div>
                  <label className="mb-1 block text-sm font-semibold text-navy-900" htmlFor={`mensal-dia-${m.chave}`}>
                    Dia da semana
                  </label>
                  <select
                    id={`mensal-dia-${m.chave}`}
                    value={m.diaDaSemana}
                    onChange={(e) => atualizar(setMensais, i, { diaDaSemana: Number(e.target.value) })}
                    className={`${estilo} h-11 w-40`}
                  >
                    {DIAS.map((dia, d) => (
                      <option key={dia} value={d}>
                        {dia}
                      </option>
                    ))}
                  </select>
                </div>
                <Texto
                  rotulo="Hora"
                  valor={m.hora}
                  aoMudar={(v) => atualizar(setMensais, i, { hora: v })}
                  caminho={`missasMensais.${i}.hora`}
                  placeholder="8h e 19h"
                  className="w-40"
                />
                <BotaoRemover rotulo="Remover esta missa" aoClicar={() => setMensais((l) => l.filter((x) => x.chave !== m.chave))} />
              </div>
            </div>
          ))}
        </div>
        <BotaoAdicionar
          aoClicar={() => setMensais((l) => [...l, { titulo: '', quando: 'Primeira sexta-feira do mês', diaDaSemana: 5, hora: '', chave: novaChave() }])}
        >
          Adicionar missa votiva
        </BotaoAdicionar>
      </Bloco>

      <div className="grid gap-6 xl:grid-cols-2">
        <Bloco titulo="Confissões" descricao={AJUDA_FAIXA} caminho="confissoes">
          <div className="space-y-4">
            {confissoes.map((c, i) => (
              <div key={c.chave} className="flex flex-wrap items-end gap-3">
                <Dias rotulo="Dias" valor={c.dias} aoMudar={(dias) => atualizar(setConfissoes, i, { dias })} />
                <Texto
                  rotulo="Horário"
                  valor={c.horario}
                  aoMudar={(v) => atualizar(setConfissoes, i, { horario: v })}
                  caminho={`confissoes.${i}`}
                  className="min-w-[10rem] flex-1"
                />
                <BotaoRemover rotulo="Remover este horário" aoClicar={() => setConfissoes((l) => l.filter((x) => x.chave !== c.chave))} />
              </div>
            ))}
          </div>
          <BotaoAdicionar aoClicar={() => setConfissoes((l) => [...l, { dias: [], horario: '', chave: novaChave() }])}>
            Adicionar horário
          </BotaoAdicionar>
        </Bloco>

        <Bloco titulo="Adoração ao Santíssimo" descricao={AJUDA_FAIXA} caminho="adoracao">
          <div className="space-y-4">
            {adoracao.map((a, i) => (
              <div key={a.chave} className="space-y-3 rounded-md border border-slate-200 bg-slate-50/60 p-4">
                <div className="flex flex-wrap items-end gap-3">
                  <Dias rotulo="Dias" valor={a.dias} aoMudar={(dias) => atualizar(setAdoracao, i, { dias })} />
                  <Texto
                    rotulo="Horário"
                    valor={a.horario}
                    aoMudar={(v) => atualizar(setAdoracao, i, { horario: v })}
                    caminho={`adoracao.${i}`}
                    className="min-w-[8rem] flex-1"
                  />
                  <BotaoRemover rotulo="Remover este horário" aoClicar={() => setAdoracao((l) => l.filter((x) => x.chave !== a.chave))} />
                </div>
                <Texto
                  rotulo="Observação (opcional)"
                  valor={a.obs ?? ''}
                  aoMudar={(v) => atualizar(setAdoracao, i, { obs: v })}
                  caminho={`adoracao.${i}.obs`}
                  placeholder="Ex.: Logo após a Santa Missa"
                />
              </div>
            ))}
          </div>
          <BotaoAdicionar aoClicar={() => setAdoracao((l) => [...l, { dias: [], horario: '', obs: '', chave: novaChave() }])}>
            Adicionar horário
          </BotaoAdicionar>
        </Bloco>
      </div>

      <Bloco titulo="Terços" descricao={AJUDA_FAIXA} caminho="tercos">
        <div className="space-y-4">
          {tercos.map((t, i) => (
            <div key={t.chave} className="flex flex-wrap items-end gap-3">
              <Texto
                rotulo="Nome"
                valor={t.titulo}
                aoMudar={(v) => atualizar(setTercos, i, { titulo: v })}
                caminho={`tercos.${i}.titulo`}
                placeholder="Terço Mariano"
                className="min-w-[12rem] flex-1"
              />
              <Dias rotulo="Dias" valor={t.dias} aoMudar={(dias) => atualizar(setTercos, i, { dias })} />
              <Texto
                rotulo="Horário"
                valor={t.horario}
                aoMudar={(v) => atualizar(setTercos, i, { horario: v })}
                caminho={`tercos.${i}.horario`}
                className="w-36"
              />
              <BotaoRemover rotulo="Remover este terço" aoClicar={() => setTercos((l) => l.filter((x) => x.chave !== t.chave))} />
              <div className="basis-full">
                <Erro caminho={`tercos.${i}.dias`} />
              </div>
            </div>
          ))}
        </div>
        <BotaoAdicionar aoClicar={() => setTercos((l) => [...l, { titulo: '', dias: [], horario: '', chave: novaChave() }])}>
          Adicionar terço
        </BotaoAdicionar>
      </Bloco>

      <div className="grid gap-6 xl:grid-cols-2">
        <Bloco titulo="Igreja aberta" descricao="Para visitas e oração pessoal. Deixe em branco nos dias em que fica fechada." caminho="igrejaAberta">
          <div className="space-y-2">
            {DIAS.map((dia, d) => (
              <div key={dia} className="grid grid-cols-[6.5rem_1fr] items-center gap-3">
                <span className="font-semibold text-navy-950">{dia}</span>
                <Texto
                  rotulo={`Igreja aberta — ${dia}`}
                  ocultarRotulo
                  valor={igreja[d] ?? ''}
                  aoMudar={(v) => setIgreja((l) => l.map((x, j) => (j === d ? v : x)))}
                  caminho={`igrejaAberta.${d}`}
                  placeholder="Fechada"
                />
              </div>
            ))}
          </div>
        </Bloco>

        <Bloco titulo="Secretaria" descricao="Atendimento da secretaria. Em branco = fechada." caminho="secretaria">
          <div className="space-y-2">
            {DIAS.map((dia, d) => (
              <div key={dia} className="grid grid-cols-[6.5rem_1fr] items-center gap-3">
                <span className="font-semibold text-navy-950">{dia}</span>
                <Texto
                  rotulo={`Secretaria — ${dia}`}
                  ocultarRotulo
                  valor={secretaria[d] ?? ''}
                  aoMudar={(v) => setSecretaria((l) => l.map((x, j) => (j === d ? v : x)))}
                  caminho={`secretaria.${d}`}
                  placeholder="Fechada"
                />
              </div>
            ))}
          </div>
          <label className="mt-4 flex items-center gap-3 text-base text-navy-950">
            <input type="checkbox" checked={feriados} onChange={(e) => setFeriados(e.target.checked)} className="h-5 w-5 accent-[#0f2a4f]" />
            Fecha nos feriados
          </label>
        </Bloco>
      </div>

      <div className="sticky bottom-0 z-10 -mx-4 bg-[#f4f2ed]/95 px-4 py-4 backdrop-blur sm:-mx-6 sm:px-6 lg:-mx-10 lg:px-10">
        <AcoesDoFormulario principal={<BotaoSalvar>Salvar horários</BotaoSalvar>}>
          <p className="text-sm text-slate-600">Nada muda no site até você salvar.</p>
        </AcoesDoFormulario>
      </div>
    </Formulario>
  );
}
