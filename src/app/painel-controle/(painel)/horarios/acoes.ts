'use server';

import { painel } from '@/config/container';
import { acaoDoPainel, type EstadoDoFormulario } from '@/modules/Acesso/Presentation/acao';
import { texto } from '@/modules/Acesso/Presentation/formulario';
import { ErroDeValidacao } from '@/shared/Domain/erros';

export async function salvarHorarios(_: EstadoDoFormulario, dados: FormData) {
  return acaoDoPainel('horarios', async (ator) => {
    let quadro: unknown;
    try {
      quadro = JSON.parse(texto(dados, 'quadro'));
    } catch {
      throw new ErroDeValidacao([], 'Não foi possível ler os horários enviados. Recarregue a página e tente de novo.');
    }
    await painel.horarios.salvar(ator, quadro);
    return 'Horários salvos. O site já mostra os horários novos.';
  });
}
