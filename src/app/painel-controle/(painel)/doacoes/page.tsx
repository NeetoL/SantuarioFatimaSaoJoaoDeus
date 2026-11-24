import { type Metadata } from 'next';
import { FormularioDeDoacoes } from '@/components/painel/FormularioDeDoacoes';
import { CabecalhoDaPagina, Cartao } from '@/components/painel/Pagina';
import { painel } from '@/config/container';
import { exigirPermissao } from '@/modules/Acesso/Presentation/sessao';
import { salvarDoacoes } from './acoes';

export const metadata: Metadata = { title: 'Doações e PIX' };

export default async function Doacoes() {
  await exigirPermissao('doacoes');
  const dados = await painel.doacoes.obter();
  return (
    <>
      <CabecalhoDaPagina
        titulo="Doações e PIX"
        descricao="O que aparece na página Doações do site. Para registrar quem doou, use Secretaria › Contribuições."
      />
      <Cartao>
        <FormularioDeDoacoes acao={salvarDoacoes} dados={dados} />
      </Cartao>
    </>
  );
}
