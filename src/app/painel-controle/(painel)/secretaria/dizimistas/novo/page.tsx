import { type Metadata } from 'next';
import { CabecalhoDaPagina, Cartao } from '@/components/painel/Pagina';
import { FormularioDeDizimista } from '@/components/painel/Secretaria';
import { exigirPermissao } from '@/modules/Acesso/Presentation/sessao';
import { criarDizimista } from '../../acoes';

export const metadata: Metadata = { title: 'Cadastrar dizimista' };

export default async function NovoDizimista() {
  await exigirPermissao('secretaria');
  return (
    <>
      <CabecalhoDaPagina titulo="Cadastrar dizimista" voltar={{ href: '/painel-controle/secretaria/dizimistas', rotulo: 'Dizimistas' }} />
      <Cartao>
        <FormularioDeDizimista acao={criarDizimista} />
      </Cartao>
    </>
  );
}
