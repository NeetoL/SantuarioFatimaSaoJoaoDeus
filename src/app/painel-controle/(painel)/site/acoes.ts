'use server';

import { painel } from '@/config/container';
import { acaoDoPainel, type EstadoDoFormulario } from '@/modules/Acesso/Presentation/acao';
import { texto } from '@/modules/Acesso/Presentation/formulario';
import { apagarImagem } from '@/shared/Infrastructure/arquivos/armazenamento';

const numero = (v: string) => v.trim().replace(',', '.');

export async function salvarSite(_: EstadoDoFormulario, dados: FormData) {
  return acaoDoPainel('site', async (ator) => {
    const t = (campo: string) => texto(dados, campo);
    const redesSociais = [0, 1, 2]
      .filter((i) => dados.has(`redesSociais.${i}.rede`))
      .map((i) => ({ rede: t(`redesSociais.${i}.rede`), url: t(`redesSociais.${i}.url`).trim(), rotulo: t(`redesSociais.${i}.rotulo`) }));
    const atual = await painel.site.obter();
    await painel.site.salvar(ator, {
      nome: t('nome'),
      nomeCurto: t('nomeCurto'),
      endereco: { logradouro: t('endereco.logradouro'), bairro: t('endereco.bairro'), cidade: t('endereco.cidade'), uf: t('endereco.uf') },
      coordenadas: { latitude: numero(t('coordenadas.latitude')), longitude: numero(t('coordenadas.longitude')) },
      telefone: { exibicao: t('telefone.exibicao'), internacional: t('telefone.internacional').replace(/[\s()-]/g, '') },
      email: t('email').trim().toLowerCase(),
      redesSociais,
      apresentacao: { titulo: t('apresentacao.titulo'), texto: t('apresentacao.texto') },
      logo: atual.logo, // o logo é trocado no formulário próprio
    });
    return 'Informações do site salvas. O site já mostra os dados novos.';
  });
}

export async function salvarLogo(_: EstadoDoFormulario, dados: FormData) {
  return acaoDoPainel('site', async (ator) => {
    const largura = Number(texto(dados, 'logo.largura'));
    const altura = Number(texto(dados, 'logo.altura'));
    const url = texto(dados, 'logo.url');
    const logo = url && largura > 0 && altura > 0 ? { url, largura, altura } : null;
    const anterior = (await painel.site.obter()).logo?.url;
    await painel.site.trocarLogo(ator, logo);
    if (anterior && anterior !== logo?.url) await apagarImagem(anterior);
    return logo ? 'Logo atualizado.' : 'O site voltou a usar o brasão padrão.';
  });
}
