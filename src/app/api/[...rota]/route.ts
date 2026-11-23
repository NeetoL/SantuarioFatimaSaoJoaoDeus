import { ErroNaoEncontrado } from '@/shared/Domain/erros';
import { tratarErro } from '@/shared/Presentation/resposta-api';

/** Qualquer endereço da API que não existe: 404 no formato padrão. */
const naoEncontrado = () => tratarErro(new ErroNaoEncontrado('Endereço da API'), 'api.desconhecida');
export {
  naoEncontrado as GET,
  naoEncontrado as POST,
  naoEncontrado as PUT,
  naoEncontrado as PATCH,
  naoEncontrado as DELETE,
};
