'use server';

import { painel } from '@/config/container';
import { acaoDoPainel, type EstadoDoFormulario } from '@/modules/Acesso/Presentation/acao';
import { marcado, texto } from '@/modules/Acesso/Presentation/formulario';

export async function salvarDoacoes(_: EstadoDoFormulario, dados: FormData) {
  return acaoDoPainel('doacoes', async (ator) => {
    const t = (campo: string) => texto(dados, campo);
    const destinos = [0, 1, 2, 3, 4, 5]
      .filter((i) => dados.has(`destinos.${i}.titulo`))
      .map((i) => ({ percentual: t(`destinos.${i}.percentual`) || '0', titulo: t(`destinos.${i}.titulo`), descricao: t(`destinos.${i}.descricao`) }));
    await painel.doacoes.salvar(ator, {
      exemplo: marcado(dados, 'exemplo'),
      pix: { tipoDeChave: t('pix.tipoDeChave'), chave: t('pix.chave') },
      banco: { banco: t('banco.banco'), agencia: t('banco.agencia'), conta: t('banco.conta'), cnpj: t('banco.cnpj'), titular: t('banco.titular') },
      destinos,
    });
    return 'Dados de doação salvos. A página Doações já mostra os dados novos.';
  });
}
