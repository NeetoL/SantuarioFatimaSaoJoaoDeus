'use client';

import { type AcaoDeFormulario } from '@/modules/Acesso/Presentation/estado';
import { CATEGORIAS_DE_EVENTO, type Evento } from '@/modules/Eventos/Domain/evento';
import { EnviarImagem } from './EnviarImagem';
import { AcoesDoFormulario, AreaDeTexto, BotaoSalvar, Campo, Formulario, Marcar, Selecao } from './Formulario';

export function FormularioDeEvento({
  acao,
  enviarFoto,
  evento,
  hoje,
  outrasAcoes,
}: {
  acao: AcaoDeFormulario;
  enviarFoto: AcaoDeFormulario;
  evento?: Evento;
  hoje: string;
  outrasAcoes?: React.ReactNode;
}) {
  return (
    <Formulario acao={acao}>
      <Campo nome="titulo" rotulo="Título" valor={evento?.titulo} obrigatorio maxLength={120} placeholder="Ex.: Festa de Nossa Senhora de Fátima" />
      <div className="grid gap-6 sm:grid-cols-3">
        <Selecao
          nome="categoria"
          rotulo="Categoria"
          valor={evento?.categoria ?? 'Missa'}
          opcoes={CATEGORIAS_DE_EVENTO.map((c) => ({ valor: c, rotulo: c }))}
        />
        <Campo nome="data" rotulo="Data" tipo="date" valor={evento?.data ?? hoje} obrigatorio />
        <Campo nome="hora" rotulo="Hora" valor={evento?.hora ?? ''} obrigatorio placeholder="19h30" ajuda="Ex.: 19h ou 19h30" maxLength={6} />
      </div>
      <Campo nome="local" rotulo="Local" valor={evento?.local ?? 'Igreja do Santuário'} obrigatorio maxLength={120} />
      <AreaDeTexto
        nome="descricao"
        rotulo="Descrição"
        valor={evento?.descricao}
        obrigatorio
        linhas={4}
        maxLength={600}
        ajuda="Poucas linhas: o que é, para quem, se precisa levar algo."
      />
      <EnviarImagem nome="imagem" rotulo="Foto (opcional)" valor={evento?.imagem} enviar={enviarFoto} />
      <Marcar
        nome="destaque"
        rotulo="Destacar na página inicial"
        ajuda="Os eventos em destaque aparecem primeiro, com mais espaço."
        marcado={evento?.destaque}
      />
      <AcoesDoFormulario principal={<BotaoSalvar>{evento ? 'Salvar alterações' : 'Criar evento'}</BotaoSalvar>}>{outrasAcoes}</AcoesDoFormulario>
    </Formulario>
  );
}
