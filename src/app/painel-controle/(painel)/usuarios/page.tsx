import { type Metadata } from 'next';
import Link from 'next/link';
import { CabecalhoDaPagina, dataHoraBR, Etiqueta, LinkBotao } from '@/components/painel/Pagina';
import { painel } from '@/config/container';
import { NOME_DO_PAPEL, PAPEIS } from '@/modules/Acesso/Domain/acesso';
import { exigirPermissao } from '@/modules/Acesso/Presentation/sessao';

export const metadata: Metadata = { title: 'Usuários' };

const COR_DO_PAPEL = { admin: 'ouro', padre: 'azul', pascom: 'neutra', secretaria: 'neutra' } as const;

export default async function Usuarios() {
  const eu = await exigirPermissao('usuarios');
  const usuarios = (await painel.acesso.listarUsuarios()).sort(
    (a, b) => Number(b.ativo) - Number(a.ativo) || PAPEIS.indexOf(a.papel) - PAPEIS.indexOf(b.papel) || a.nome.localeCompare(b.nome, 'pt-BR'),
  );

  return (
    <>
      <CabecalhoDaPagina
        titulo="Usuários"
        descricao="Quem pode entrar no painel e o que cada um pode fazer."
        acao={<LinkBotao href="/painel-controle/usuarios/novo">+ Novo usuário</LinkBotao>}
      />
      <div className="overflow-hidden rounded-lg bg-white shadow-sm ring-1 ring-black/5">
        <ul className="divide-y divide-slate-100">
          {usuarios.map((u) => (
            <li key={u.id}>
              <Link
                href={`/painel-controle/usuarios/${u.id}`}
                className="flex flex-col gap-2 px-5 py-4 transition-colors hover:bg-navy-50/60 sm:flex-row sm:items-center sm:gap-6"
              >
                <span className="min-w-0 flex-1">
                  <span className="flex flex-wrap items-center gap-2">
                    <span className={`font-semibold ${u.ativo ? 'text-navy-950' : 'text-slate-600 line-through'}`}>{u.nome}</span>
                    {u.id === eu.id && <Etiqueta cor="verde">você</Etiqueta>}
                    {!u.ativo && <Etiqueta cor="vermelha">desativado</Etiqueta>}
                    {u.ativo && u.trocarSenha && <Etiqueta>aguardando 1º acesso</Etiqueta>}
                  </span>
                  <span className="block truncate text-sm text-slate-600">{u.email}</span>
                </span>
                <span className="flex items-center gap-4 sm:w-[19rem] sm:justify-between">
                  <Etiqueta cor={COR_DO_PAPEL[u.papel]}>{NOME_DO_PAPEL[u.papel]}</Etiqueta>
                  <span className="text-sm text-slate-600">
                    {u.ultimoAcesso ? `Último acesso: ${dataHoraBR(u.ultimoAcesso)}` : 'Nunca entrou'}
                  </span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
