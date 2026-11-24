import { type Metadata } from 'next';
import { enviarFoto } from '@/app/painel-controle/acoes-de-acesso';
import { FormularioDoLogo, FormularioDoSite } from '@/components/painel/FormularioDoSite';
import { CabecalhoDaPagina, Cartao } from '@/components/painel/Pagina';
import { painel } from '@/config/container';
import { exigirPermissao } from '@/modules/Acesso/Presentation/sessao';
import { LOGO_PADRAO } from '@/modules/Institucional/Domain/institucional';
import { salvarLogo, salvarSite } from './acoes';

export const metadata: Metadata = { title: 'Informações do site' };

export default async function InformacoesDoSite() {
  await exigirPermissao('site');
  const dados = await painel.site.obter();
  return (
    <div className="space-y-6">
      <CabecalhoDaPagina
        titulo="Informações do site"
        descricao="Nome, contato, endereço, redes sociais, apresentação e logo. O que for salvo aqui aparece no site na hora."
      />
      <Cartao>
        <FormularioDoSite acao={salvarSite} dados={dados} />
      </Cartao>
      <Cartao titulo="Logo">
        <FormularioDoLogo acao={salvarLogo} enviar={enviarFoto.bind(null, 'site')} logo={dados.logo} padrao={LOGO_PADRAO} />
      </Cartao>
    </div>
  );
}
