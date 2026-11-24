'use client';

import { type ReactNode, useState } from 'react';
import { type AcaoDeFormulario } from '@/modules/Acesso/Presentation/estado';
import { type DadosInstitucionais, type Logo } from '@/modules/Institucional/Domain/institucional';
import { EnviarImagem } from './EnviarImagem';
import { AcoesDoFormulario, AreaDeTexto, BotaoSalvar, Campo, Formulario, Selecao, useEstadoDoFormulario } from './Formulario';

/** Bloco de campos com título, dentro de um formulário longo. */
export function Secao({ titulo, descricao, children }: { titulo: string; descricao?: string; children: ReactNode }) {
  return (
    <fieldset className="border-t border-slate-200 pt-6 first:border-t-0 first:pt-0">
      <legend className="float-left w-full font-serif text-2xl font-semibold text-navy-900">{titulo}</legend>
      {descricao && <p className="clear-both pt-1 text-base text-slate-600">{descricao}</p>}
      <div className="clear-both space-y-5 pt-5">{children}</div>
    </fieldset>
  );
}

const REDES = ['Instagram', 'YouTube', 'Facebook'] as const;

function RedesSociais({ iniciais }: { iniciais: DadosInstitucionais['redesSociais'] }) {
  const [redes, setRedes] = useState(iniciais.map((r, i) => ({ ...r, chave: i })));
  const { erros } = useEstadoDoFormulario();
  return (
    <div className="space-y-4">
      {redes.map((r, i) => (
        <div key={r.chave} className="rounded-md border border-slate-200 bg-slate-50/60 p-4">
          <div className="grid gap-4 sm:grid-cols-[10rem_1fr]">
            <Selecao
              nome={`redesSociais.${i}.rede`}
              rotulo="Rede"
              valor={r.rede}
              opcoes={REDES.map((rede) => ({ valor: rede, rotulo: rede }))}
            />
            <Campo nome={`redesSociais.${i}.url`} rotulo="Endereço (link)" tipo="url" valor={r.url} placeholder="https://" maxLength={300} />
          </div>
          <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-end">
            <Campo
              nome={`redesSociais.${i}.rotulo`}
              rotulo="Descrição (para leitores de tela)"
              valor={r.rotulo}
              maxLength={80}
              className="flex-1"
            />
            <button
              type="button"
              className="btn btn-sm text-red-700 hover:bg-red-50"
              onClick={() => setRedes((lista) => lista.filter((x) => x.chave !== r.chave))}
            >
              Remover
            </button>
          </div>
        </div>
      ))}
      {erros.redesSociais && <p className="text-sm font-medium text-red-700">{erros.redesSociais}</p>}
      {redes.length < 3 && (
        <button
          type="button"
          className="btn btn-linha btn-sm"
          onClick={() =>
            setRedes((lista) => [
              ...lista,
              { rede: REDES.find((x) => !lista.some((l) => l.rede === x)) ?? 'Instagram', url: '', rotulo: '', chave: Date.now() },
            ])
          }
        >
          + Adicionar rede social
        </button>
      )}
    </div>
  );
}

export function FormularioDoSite({ acao, dados }: { acao: AcaoDeFormulario; dados: DadosInstitucionais }) {
  return (
    <Formulario acao={acao} className="space-y-8" mensagemFlutuante>
      <Secao titulo="Nome">
        <Campo nome="nome" rotulo="Nome completo" valor={dados.nome} obrigatorio maxLength={160} />
        <Campo nome="nomeCurto" rotulo="Nome curto" valor={dados.nomeCurto} obrigatorio maxLength={80} ajuda="Usado em lugares com pouco espaço." />
      </Secao>

      <Secao titulo="Contato">
        <div className="grid gap-5 sm:grid-cols-2">
          <Campo nome="telefone.exibicao" rotulo="Telefone (como aparece no site)" valor={dados.telefone.exibicao} obrigatorio placeholder="(21) 0000-0000" />
          <Campo
            nome="telefone.internacional"
            rotulo="Telefone para ligar e WhatsApp"
            valor={dados.telefone.internacional}
            obrigatorio
            inputMode="tel"
            placeholder="+5521999999999"
            ajuda="Com +55 e DDD, só números."
          />
        </div>
        <Campo nome="email" rotulo="E-mail" tipo="email" valor={dados.email} obrigatorio maxLength={160} />
      </Secao>

      <Secao titulo="Endereço" descricao="Aparece no rodapé, na página de contato e no botão “Como chegar”.">
        <Campo nome="endereco.logradouro" rotulo="Rua e número" valor={dados.endereco.logradouro} obrigatorio maxLength={160} />
        <div className="grid gap-5 sm:grid-cols-[1fr_1fr_6rem]">
          <Campo nome="endereco.bairro" rotulo="Bairro" valor={dados.endereco.bairro} obrigatorio maxLength={80} />
          <Campo nome="endereco.cidade" rotulo="Cidade" valor={dados.endereco.cidade} obrigatorio maxLength={80} />
          <Campo nome="endereco.uf" rotulo="UF" valor={dados.endereco.uf} obrigatorio maxLength={2} />
        </div>
        <div className="grid gap-5 sm:grid-cols-2">
          <Campo nome="coordenadas.latitude" rotulo="Latitude (mapa)" valor={dados.coordenadas.latitude} inputMode="decimal" obrigatorio />
          <Campo nome="coordenadas.longitude" rotulo="Longitude (mapa)" valor={dados.coordenadas.longitude} inputMode="decimal" obrigatorio />
        </div>
        <p className="text-sm text-slate-600">
          Para achar os números: no Google Maps, clique com o botão direito em cima do santuário — os dois primeiros números do menu são a
          latitude e a longitude.
        </p>
      </Secao>

      <Secao titulo="Redes sociais" descricao="Até três. Aparecem no rodapé e na página de contato.">
        <RedesSociais iniciais={dados.redesSociais} />
      </Secao>

      <Secao titulo="Apresentação" descricao="O bloco “Conheça o Santuário” da página inicial.">
        <Campo nome="apresentacao.titulo" rotulo="Título" valor={dados.apresentacao.titulo} obrigatorio maxLength={120} />
        <AreaDeTexto nome="apresentacao.texto" rotulo="Texto" valor={dados.apresentacao.texto} linhas={5} obrigatorio maxLength={600} />
      </Secao>

      <AcoesDoFormulario principal={<BotaoSalvar>Salvar informações</BotaoSalvar>} />
    </Formulario>
  );
}

/** Logo do site: envia a imagem e salva (ou volta ao brasão padrão). */
export function FormularioDoLogo({
  acao,
  enviar,
  logo,
  padrao,
}: {
  acao: AcaoDeFormulario;
  enviar: AcaoDeFormulario;
  logo?: Logo;
  padrao: Logo;
}) {
  const [novo, setNovo] = useState<Logo | null>(logo ?? null);
  return (
    <Formulario acao={acao} className="space-y-5">
      <EnviarImagem
        nome="logo.url"
        rotulo="Imagem do logo"
        valor={logo?.url ?? padrao.url}
        enviar={enviar}
        ajuste="contain"
        permitirRemover={Boolean(novo)}
        aoEnviar={(r) => setNovo(r)}
        aoRemover={() => setNovo(null)}
        ajuda="PNG com fundo transparente fica melhor. Aparece no cabeçalho, no rodapé e na abertura do site."
      />
      <input type="hidden" name="logo.largura" value={novo?.largura ?? ''} />
      <input type="hidden" name="logo.altura" value={novo?.altura ?? ''} />
      {!novo && <p className="text-sm text-slate-600">Sem logo enviado, o site usa o brasão padrão.</p>}
      <AcoesDoFormulario principal={<BotaoSalvar>Salvar logo</BotaoSalvar>} />
    </Formulario>
  );
}
