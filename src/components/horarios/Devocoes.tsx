'use client';

import { useAgora } from '@/components/hooks/useAgora';
import { dataCivilEmBrasilia } from '@/lib/datas';
import { faixasDoHorario, nomeDosDias, type QuadroDeHorarios } from '@/modules/Horarios/Domain/horarios';

const ICONES = {
  confissao: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M4 5h16v10H9l-5 4z"></path>
      <path d="M12 7.5v5M9.5 10h5"></path>
    </svg>
  ),
  terco: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="12" cy="9" r="6"></circle>
      <circle cx="12" cy="3" r=".8" fill="currentColor"></circle>
      <circle cx="6" cy="9" r=".8" fill="currentColor"></circle>
      <circle cx="18" cy="9" r=".8" fill="currentColor"></circle>
      <path d="M12 15v6M10 18h4"></path>
    </svg>
  ),
  adoracao: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="12" cy="9" r="3.2"></circle>
      <path d="M12 2v2M12 14v2M5 9H3M21 9h-2M7 4l1.4 1.4M17 4l-1.4 1.4M7 14l1.4-1.4M17 14l-1.4-1.4M12 16v6M9 22h6"></path>
    </svg>
  ),
};

type Linha = { rotulo: string; sub?: string; horario: string; dias: number[] };

function Cartao({
  icone,
  eyebrow,
  titulo,
  linhas,
  rodape,
  hoje,
}: {
  icone: keyof typeof ICONES;
  eyebrow: string;
  titulo: string;
  linhas: Linha[];
  rodape: string;
  hoje: number;
}) {
  return (
    <article className="cartao-horario flex flex-col">
      <div className="flex items-center gap-4">
        <span className="grid shrink-0 place-items-center w-12 h-12 rounded-md bg-navy-900 text-gold-300">
          {ICONES[icone]}
        </span>
        <div className="min-w-0">
          <p className="font-caps text-[.75rem] font-semibold tracking-[.2em] text-[#7a5c12]">{eyebrow}</p>
          <h3 className="mt-0.5 font-serif font-semibold text-[1.75rem] text-navy-900 leading-tight">{titulo}</h3>
        </div>
      </div>
      <ul className="lista-horarios mt-5">
        {linhas.map((l) => {
          const ehHoje = l.dias.includes(hoje);
          return (
            <li key={`${l.rotulo}-${l.horario}`} className={ehHoje ? 'e-hoje' : undefined}>
              <span className="rotulo">
                {l.rotulo}
                {ehHoje && <span className="tag-hoje">Hoje</span>}
                {l.sub && <small>{l.sub}</small>}
              </span>
              <span className="pontos" aria-hidden="true"></span>
              <span className="hora">
                {faixasDoHorario(l.horario).map((faixa) => (
                  <span key={faixa} className="block">
                    {faixa}
                  </span>
                ))}
              </span>
            </li>
          );
        })}
      </ul>
      <p className="mt-auto pt-5 text-base text-slate-600 leading-relaxed">{rodape}</p>
    </article>
  );
}

/** Confissões, terços e adoração ao Santíssimo, com o dia de hoje marcado. */
export function Devocoes({ quadro, agoraInicial }: { quadro: QuadroDeHorarios; agoraInicial: number }) {
  const hoje = dataCivilEmBrasilia(useAgora(agoraInicial)).diaDaSemana;
  return (
    <>
      <Cartao
        icone="confissao"
        eyebrow="Sacramento da Reconciliação"
        titulo="Confissões"
        hoje={hoje}
        linhas={quadro.confissoes.map((c) => ({ rotulo: nomeDosDias(c.dias), horario: c.horario, dias: c.dias }))}
        rodape="Chegue com antecedência: o atendimento termina no horário indicado."
      />
      <Cartao
        icone="terco"
        eyebrow="Oração do Rosário"
        titulo="Terços"
        hoje={hoje}
        linhas={quadro.tercos.map((t) => ({
          rotulo: t.titulo,
          sub: nomeDosDias(t.dias),
          horario: t.horario,
          dias: t.dias,
        }))}
        rodape="Todos são bem-vindos para rezar juntos."
      />
      <Cartao
        icone="adoracao"
        eyebrow="Diante de Jesus Eucarístico"
        titulo="Adoração ao Santíssimo"
        hoje={hoje}
        linhas={quadro.adoracao.map((a) => ({
          rotulo: nomeDosDias(a.dias),
          sub: a.obs,
          horario: a.horario,
          dias: a.dias,
        }))}
        rodape="Um tempo de silêncio e oração diante do Santíssimo Sacramento."
      />
    </>
  );
}
