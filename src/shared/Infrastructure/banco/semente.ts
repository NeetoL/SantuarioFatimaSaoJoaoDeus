import { appendFileSync, existsSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { eq, sql } from 'drizzle-orm';
import { DADOS_DE_DOACAO } from '@/mocks/doacoes';
import { EVENTOS } from '@/mocks/eventos';
import { ALBUNS } from '@/mocks/galeria';
import { NOTICIAS, RECADOS } from '@/mocks/comunicados';
import { QUADRO_DE_HORARIOS } from '@/mocks/horarios';
import { DADOS_INSTITUCIONAIS } from '@/mocks/institucional';
import { CONTA_PADRAO_LOCAL } from '@/mocks/painel';
import { NOME_DO_PAPEL, PAPEIS } from '@/modules/Acesso/Domain/acesso';
import { gerarResumoDeSenha, senhaTemporaria } from '../seguranca/senha';
import { type Banco, consultar } from './conexao';
import { albuns, configuracoes, eventos, fotosAlbum, noticias, recados, usuarios } from './esquema';

const contar = async (banco: Banco, tabela: string) =>
  Number((await consultar<{ n: number }>(banco, sql.raw(`select count(*)::int as n from ${tabela}`)))[0]?.n ?? 0);

/**
 * Banco vazio: copia o conteúdo que o site já tinha (src/mocks) — assim nada se perde ao ligar o banco.
 * No banco local, cria também uma conta de teste para cada perfil (senhas em .dados/acessos-locais.txt)
 * e o login padrão de src/mocks/painel.ts. No banco do site no ar (contasLocais = false), nenhuma conta é criada.
 */
export async function semear(banco: Banco, { contasLocais }: { contasLocais: boolean }) {
  if ((await contar(banco, 'configuracoes')) === 0) {
    await banco.transaction(async (tx) => {
      await tx.insert(configuracoes).values([
        { chave: 'institucional', valor: DADOS_INSTITUCIONAIS },
        { chave: 'horarios', valor: QUADRO_DE_HORARIOS },
        { chave: 'doacoes', valor: DADOS_DE_DOACAO },
      ]);
      if (EVENTOS.length)
        await tx.insert(eventos).values(
          EVENTOS.map((e) => ({ ...e, destaque: Boolean(e.destaque), imagem: e.imagem ?? null })),
        );
      if (NOTICIAS.length)
        await tx
          .insert(noticias)
          .values(NOTICIAS.map((n) => ({ ...n, imagem: n.imagem ?? null, link: n.link ?? null })));
      if (RECADOS.length)
        await tx
          .insert(recados)
          .values(RECADOS.map((r, ordem) => ({ ...r, importante: Boolean(r.importante), ordem })));
      for (const a of ALBUNS) {
        await tx
          .insert(albuns)
          .values({ id: a.id, titulo: a.titulo, data: a.data ?? null, descricao: a.descricao ?? null, capa: a.capa ?? 0 });
        if (a.fotos.length)
          await tx
            .insert(fotosAlbum)
            .values(a.fotos.map((f, ordem) => ({ albumId: a.id, arquivo: f.foto, legenda: f.legenda, ordem })));
      }
    });
  }

  if (!contasLocais) return;
  const arquivo = path.join(process.cwd(), '.dados', 'acessos-locais.txt');
  const linhas: string[] = [];

  if ((await contar(banco, 'usuarios')) === 0) {
    linhas.push(
      'CONTAS DE TESTE DO PAINEL — SÓ PARA O BANCO LOCAL (pasta .dados, fora do Git).',
      'Endereço: http://localhost:3000/painel-controle',
      'Para recomeçar do zero, apague a pasta .dados e abra o site de novo.',
      '',
    );
    for (const papel of PAPEIS) {
      const senha = senhaTemporaria();
      const email = `${papel}@teste.local`;
      await banco.insert(usuarios).values({
        nome: `${NOME_DO_PAPEL[papel]} (teste)`,
        email,
        papel,
        senhaHash: await gerarResumoDeSenha(senha),
      });
      linhas.push(`${NOME_DO_PAPEL[papel].padEnd(13)}  e-mail: ${email.padEnd(24)}  senha: ${senha}`);
    }
  }

  // Login padrão (mock): criado uma vez; se a senha for trocada no painel, não volta a ser a padrão.
  const padrao = CONTA_PADRAO_LOCAL;
  const [existe] = await banco.select({ id: usuarios.id }).from(usuarios).where(eq(usuarios.email, padrao.usuario)).limit(1);
  if (!existe) {
    await banco.insert(usuarios).values({
      nome: padrao.nome,
      email: padrao.usuario,
      papel: padrao.papel,
      senhaHash: await gerarResumoDeSenha(padrao.senha),
    });
    linhas.push(`${'Login padrão'.padEnd(13)}  usuário: ${padrao.usuario.padEnd(23)}  senha: ${padrao.senha}  (src/mocks/painel.ts)`);
  }

  if (!linhas.length) return;
  const texto = `${linhas.join('\n')}\n`;
  if (existsSync(arquivo)) appendFileSync(arquivo, texto, { encoding: 'utf-8' });
  else writeFileSync(arquivo, texto, { encoding: 'utf-8', mode: 0o600 });
}
