import { type Metadata } from 'next';
import { enviarFoto } from '@/app/painel-controle/acoes-de-acesso';
import { FormularioDeEvento } from '@/components/painel/FormularioDeEvento';
import { CabecalhoDaPagina, Cartao } from '@/components/painel/Pagina';
import { hojeIsoEmBrasilia } from '@/lib/datas';
import { exigirPermissao } from '@/modules/Acesso/Presentation/sessao';
import { criarEvento } from '../acoes';

export const metadata: Metadata = { title: 'Novo evento' };

export default async function NovoEvento() {
  await exigirPermissao('eventos');
  return (
    <>
      <CabecalhoDaPagina titulo="Novo evento" voltar={{ href: '/painel-controle/eventos', rotulo: 'Eventos' }} />
      <Cartao>
        <FormularioDeEvento acao={criarEvento} enviarFoto={enviarFoto.bind(null, 'eventos')} hoje={hojeIsoEmBrasilia(new Date())} />
      </Cartao>
    </>
  );
}
