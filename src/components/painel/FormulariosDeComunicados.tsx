'use client';

import { type Noticia, type Recado } from '@/modules/Comunicados/Domain/comunicado';
import { type AcaoDeFormulario } from '@/modules/Acesso/Presentation/estado';
import { EnviarImagem } from './EnviarImagem';
import { AcoesDoFormulario, AreaDeTexto, BotaoSalvar, Campo, Formulario, Marcar } from './Formulario';

export function FormularioDeNoticia({
  acao,
  enviarFoto,
  noticia,
  hoje,
  categorias,
}: {
  acao: AcaoDeFormulario;
  enviarFoto: AcaoDeFormulario;
  noticia?: Noticia;
  hoje: string;
  categorias: string[];
}) {
  return (
    <Formulario acao={acao}>
      <Campo nome="titulo" rotulo="Título" valor={noticia?.titulo} obrigatorio maxLength={140} />
      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <Campo
            nome="categoria"
            rotulo="Categoria"
            valor={noticia?.categoria ?? 'Comunidade'}
            obrigatorio
            maxLength={40}
            ajuda={categorias.length ? `Já usadas: ${categorias.join(', ')}.` : undefined}
          />
        </div>
        <Campo nome="data" rotulo="Data" tipo="date" valor={noticia?.data ?? hoje} obrigatorio />
      </div>
      <AreaDeTexto nome="resumo" rotulo="Texto" valor={noticia?.resumo} obrigatorio linhas={6} maxLength={600} ajuda="Até 600 caracteres." />
      <EnviarImagem nome="imagem" rotulo="Foto (opcional)" valor={noticia?.imagem} enviar={enviarFoto} />
      <Campo
        nome="link"
        rotulo="Link “Saiba mais” (opcional)"
        tipo="url"
        valor={noticia?.link}
        placeholder="https://www.instagram.com/p/…"
        maxLength={400}
        ajuda="Ex.: o post completo no Instagram. Precisa começar com https://"
      />
      <AcoesDoFormulario principal={<BotaoSalvar>{noticia ? 'Salvar alterações' : 'Publicar notícia'}</BotaoSalvar>} />
    </Formulario>
  );
}

export function FormularioDeRecado({ acao, recado }: { acao: AcaoDeFormulario; recado?: Recado }) {
  return (
    <Formulario acao={acao}>
      <Campo nome="titulo" rotulo="Título" valor={recado?.titulo} obrigatorio maxLength={100} placeholder="Ex.: Mudança no horário da secretaria" />
      <AreaDeTexto nome="texto" rotulo="Recado" valor={recado?.texto} obrigatorio linhas={4} maxLength={400} ajuda="Curto e direto: até 400 caracteres." />
      <Marcar
        nome="importante"
        rotulo="Importante"
        ajuda="Aparece antes dos outros, com destaque (use para mudanças de horário, cancelamentos…)."
        marcado={recado?.importante}
      />
      <AcoesDoFormulario principal={<BotaoSalvar>{recado ? 'Salvar alterações' : 'Publicar recado'}</BotaoSalvar>} />
    </Formulario>
  );
}
