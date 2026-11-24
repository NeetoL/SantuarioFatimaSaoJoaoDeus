/**
 * Cria um Admin master pela linha de comando — para o PRIMEIRO acesso ao painel no site no ar
 * (no computador, o banco local já vem com contas de teste em .dados/acessos-locais.txt).
 *
 *   npm run painel:criar-admin -- "Nome da Pessoa" email@exemplo.com
 *
 * Usa o banco da variável DATABASE_URL (do ambiente ou do arquivo .env.local).
 * Mostra uma senha temporária UMA vez; no primeiro acesso o painel pede uma senha nova.
 * A criação fica no registro de atividades.
 */
import { existsSync } from 'node:fs';

if (existsSync('.env.local')) process.loadEnvFile('.env.local');

async function principal() {
  const [nome, email] = process.argv.slice(2);
  if (!nome || !email) {
    console.error('Uso: npm run painel:criar-admin -- "Nome da Pessoa" email@exemplo.com');
    process.exit(1);
  }

  const { modoDoBanco } = await import('@/config/ambiente');
  const { exigirBanco } = await import('@/shared/Infrastructure/banco/conexao');
  const { RepositorioDeUsuariosBanco } = await import('@/modules/Acesso/Infrastructure/repositorio-banco');
  const { RepositorioDeAtividadesBanco } = await import('@/modules/Atividades/Infrastructure/repositorio-banco');
  const { esquemaNovoUsuario } = await import('@/modules/Acesso/Domain/acesso');
  const { gerarResumoDeSenha, senhaTemporaria } = await import('@/shared/Infrastructure/seguranca/senha');

  const modo = modoDoBanco();
  if (modo === 'nenhum') {
    console.error('Sem banco de dados: defina DATABASE_URL (ou rode no computador, com o banco local).');
    process.exit(1);
  }
  const dados = esquemaNovoUsuario.safeParse({ nome, email, papel: 'admin' });
  if (!dados.success) {
    console.error(dados.error.issues.map((i) => i.message).join('\n'));
    process.exit(1);
  }

  const banco = () => exigirBanco();
  const usuarios = new RepositorioDeUsuariosBanco(banco);
  if (await usuarios.emailEmUso(dados.data.email)) {
    console.error('Já existe um usuário com este e-mail. Para gerar outra senha, use o painel (Usuários › Gerar senha temporária).');
    process.exit(1);
  }
  const senha = senhaTemporaria();
  await usuarios.criar({ ...dados.data, senhaHash: await gerarResumoDeSenha(senha), trocarSenha: true });
  await new RepositorioDeAtividadesBanco(banco).registrar({
    usuarioId: null,
    usuarioNome: 'Linha de comando',
    acao: 'criou',
    area: 'usuarios',
    alvo: dados.data.nome,
    detalhe: 'Admin master criado pelo script painel:criar-admin (senha temporária).',
    ip: null,
  });

  console.info(`\nAdmin master criado no banco ${modo === 'postgres' ? 'do site (DATABASE_URL)' : 'local (.dados)'}.`);
  console.info(`E-mail: ${dados.data.email}`);
  console.info(`Senha temporária: ${senha}`);
  console.info('Anote agora: ela não será mostrada de novo. No primeiro acesso, o painel pede uma senha nova.\n');
  process.exit(0);
}

principal().catch((erro: unknown) => {
  console.error('Não foi possível criar o usuário:', erro instanceof Error ? erro.message : erro);
  process.exit(1);
});
