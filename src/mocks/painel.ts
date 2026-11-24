import { type Papel } from '@/modules/Acesso/Domain/acesso';

/**
 * LOGIN PADRÃO DO PAINEL — SÓ NO BANCO LOCAL (npm run dev, pasta .dados).
 * Criado pela semente quando ainda não existe. NUNCA é criado no banco do site no ar (DATABASE_URL):
 * lá o primeiro Admin master vem de `npm run painel:criar-admin`, com senha própria.
 * Para mudar a senha desta conta, use "Minha conta" no painel.
 */
export const CONTA_PADRAO_LOCAL: { usuario: string; senha: string; nome: string; papel: Papel } = {
  usuario: 'admin-teste',
  senha: 'Mudar@123',
  nome: 'Admin de teste',
  papel: 'admin',
};
