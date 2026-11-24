import { type Metadata } from 'next';
import { EditorDeHorarios } from '@/components/painel/EditorDeHorarios';
import { CabecalhoDaPagina } from '@/components/painel/Pagina';
import { painel } from '@/config/container';
import { exigirPermissao } from '@/modules/Acesso/Presentation/sessao';
import { salvarHorarios } from './acoes';

export const metadata: Metadata = { title: 'Horários' };

export default async function Horarios() {
  await exigirPermissao('horarios');
  const quadro = await painel.horarios.obter();
  return (
    <>
      <CabecalhoDaPagina
        titulo="Horários"
        descricao="Missas, confissões, terços, adoração, igreja aberta e secretaria. Aparecem na página inicial, na página Missas e no rodapé."
      />
      <EditorDeHorarios acao={salvarHorarios} quadro={quadro} />
    </>
  );
}
