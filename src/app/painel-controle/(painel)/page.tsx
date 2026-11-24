import Link from 'next/link';
import { Icone } from '@/components/painel/Casca';
import { ListaDeAtividades } from '@/components/painel/ListaDeAtividades';
import { type NomeDoIcone } from '@/components/painel/navegacao';
import { Cartao, Vazio } from '@/components/painel/Pagina';
import { painel } from '@/config/container';
import { hojeIsoEmBrasilia } from '@/lib/datas';
import { DESCRICAO_DO_PAPEL, NOME_DO_PAPEL, type Permissao, pode } from '@/modules/Acesso/Domain/acesso';
import { exigirUsuario } from '@/modules/Acesso/Presentation/sessao';
import { emReais } from '@/modules/Secretaria/Domain/secretaria';

function saudacao() {
  const hora = Number(
    new Intl.DateTimeFormat('pt-BR', { hour: 'numeric', hourCycle: 'h23', timeZone: 'America/Sao_Paulo' }).format(new Date()),
  );
  return hora < 12 ? 'Bom dia' : hora < 18 ? 'Boa tarde' : 'Boa noite';
}

type Numero = { rotulo: string; valor: string; detalhe?: string; href: string; icone: NomeDoIcone };
type Atalho = { rotulo: string; href: string; icone: NomeDoIcone; permissao: Permissao };

const ATALHOS: Atalho[] = [
  { rotulo: 'Novo evento', href: '/painel-controle/eventos/novo', icone: 'eventos', permissao: 'eventos' },
  { rotulo: 'Novo álbum de fotos', href: '/painel-controle/galeria', icone: 'galeria', permissao: 'galeria' },
  { rotulo: 'Publicar notícia', href: '/painel-controle/comunicados/noticias/nova', icone: 'comunicados', permissao: 'comunicados' },
  { rotulo: 'Mudar horários', href: '/painel-controle/horarios', icone: 'horarios', permissao: 'horarios' },
  { rotulo: 'Endereço, telefone e logo', href: '/painel-controle/site', icone: 'site', permissao: 'site' },
  { rotulo: 'Registrar contribuição', href: '/painel-controle/secretaria/contribuicoes', icone: 'contribuicoes', permissao: 'secretaria' },
  { rotulo: 'Cadastrar dizimista', href: '/painel-controle/secretaria/dizimistas/novo', icone: 'dizimistas', permissao: 'secretaria' },
  { rotulo: 'Criar usuário', href: '/painel-controle/usuarios/novo', icone: 'usuarios', permissao: 'usuarios' },
];

const Seta = () => (
  <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
    <path d="m9 18 6-6-6-6" />
  </svg>
);

export default async function InicioDoPainel({
  searchParams,
}: {
  searchParams: Promise<{ 'sem-permissao'?: string; 'bem-vindo'?: string }>;
}) {
  const usuario = await exigirUsuario();
  const params = await searchParams;
  const p = (permissao: Permissao) => pode(usuario.papel, permissao);
  const hoje = hojeIsoEmBrasilia(new Date());
  const mes = hoje.slice(0, 7);

  const [eventos, albuns, noticias, dizimistas, contribuicoes, atividades] = await Promise.all([
    p('eventos') ? painel.eventos.listar() : null,
    p('galeria') ? painel.galeria.listar() : null,
    p('comunicados') ? painel.comunicados.listarNoticias() : null,
    p('secretaria') ? painel.secretaria.contarDizimistasAtivos() : null,
    p('secretaria') ? painel.secretaria.listarContribuicoes({ mes }) : null,
    painel.atividades.listar(p('atividades') ? {} : { usuarioId: usuario.id }, 1, 8),
  ]);

  const numeros: Numero[] = [];
  if (eventos) {
    const proximos = eventos.filter((e) => e.data >= hoje).length;
    numeros.push({
      rotulo: 'Próximos eventos',
      valor: String(proximos),
      detalhe: `${eventos.length} no total`,
      href: '/painel-controle/eventos',
      icone: 'eventos',
    });
  }
  if (albuns) {
    const fotos = albuns.reduce((t, a) => t + a.fotos.length, 0);
    numeros.push({ rotulo: 'Álbuns de fotos', valor: String(albuns.length), detalhe: `${fotos} fotos`, href: '/painel-controle/galeria', icone: 'galeria' });
  }
  if (noticias) numeros.push({ rotulo: 'Notícias publicadas', valor: String(noticias.length), href: '/painel-controle/comunicados', icone: 'comunicados' });
  if (dizimistas !== null)
    numeros.push({ rotulo: 'Dizimistas ativos', valor: String(dizimistas), href: '/painel-controle/secretaria/dizimistas', icone: 'dizimistas' });
  if (contribuicoes) {
    const total = contribuicoes.reduce((t, c) => t + c.valorCentavos, 0);
    numeros.push({
      rotulo: 'Recebido neste mês',
      valor: emReais(total),
      detalhe: `${contribuicoes.length} lançamento${contribuicoes.length === 1 ? '' : 's'}`,
      href: '/painel-controle/secretaria/contribuicoes',
      icone: 'contribuicoes',
    });
  }
  const atalhos = ATALHOS.filter((a) => p(a.permissao));
  const registroCompleto = p('atividades');

  return (
    <div className="space-y-8">
      <header>
        <p className="eyebrow">{NOME_DO_PAPEL[usuario.papel]}</p>
        <h1 className="mt-3 font-serif text-4xl font-semibold leading-tight text-navy-900 sm:text-[2.8rem]">
          {saudacao()}, {usuario.nome.split(' ')[0]}
        </h1>
        <p className="mt-2 text-base text-slate-600">{DESCRICAO_DO_PAPEL[usuario.papel]}</p>
      </header>

      {params['sem-permissao'] && (
        <p role="alert" className="rounded-md border border-amber-200 bg-amber-50 px-4 py-3 text-base text-amber-900">
          Seu perfil não tem acesso àquela área. Se precisar, fale com o Admin master.
        </p>
      )}
      {params['bem-vindo'] && (
        <p role="status" className="rounded-md border border-emerald-200 bg-emerald-50 px-4 py-3 text-base text-emerald-900">
          Senha definida. Seja bem-vindo(a) ao painel!
        </p>
      )}

      {numeros.length > 0 && (
        <div className="grid grid-cols-2 gap-3 xl:grid-cols-3">
          {numeros.map((n) => (
            <Link
              key={n.rotulo}
              href={n.href}
              className="group flex items-start justify-between gap-4 rounded-lg bg-white p-4 shadow-sm ring-1 ring-black/5 transition hover:-translate-y-0.5 hover:shadow-md sm:p-5"
            >
              <span>
                <span className="block text-sm font-medium text-slate-600">{n.rotulo}</span>
                <span className="mt-1.5 block font-serif text-[1.6rem] font-semibold leading-none text-navy-900 sm:text-[2.1rem]">{n.valor}</span>
                {n.detalhe && <span className="mt-2 block text-sm text-slate-600">{n.detalhe}</span>}
              </span>
              <span className="hidden h-10 w-10 shrink-0 place-items-center rounded-md bg-gold-50 sm:grid text-gold-700 ring-1 ring-gold-500/20 transition group-hover:bg-gold-500 group-hover:text-navy-950">
                <Icone nome={n.icone} />
              </span>
            </Link>
          ))}
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-[1fr_1.35fr]">
        <Cartao titulo="Atalhos">
          <ul className="grid gap-2">
            {atalhos.map((a) => (
              <li key={a.rotulo}>
                <Link
                  href={a.href}
                  className="flex items-center gap-3 rounded-md border border-slate-200 px-4 py-3 text-[.97rem] font-semibold text-navy-900 transition-colors hover:border-navy-900 hover:bg-navy-50"
                >
                  <Icone nome={a.icone} className="h-5 w-5 text-gold-700" />
                  {a.rotulo}
                  <span className="ml-auto text-slate-400">
                    <Seta />
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </Cartao>

        <Cartao
          titulo={registroCompleto ? 'Últimas atividades no painel' : 'Suas últimas atividades'}
          descricao={registroCompleto ? 'Tudo o que é feito no painel fica registrado.' : 'O que você fez no painel recentemente.'}
        >
          {atividades.itens.length ? <ListaDeAtividades itens={atividades.itens} /> : <Vazio>Nenhuma atividade ainda.</Vazio>}
          {registroCompleto && (
            <Link
              href="/painel-controle/atividades"
              className="mt-5 inline-flex items-center gap-1.5 text-[.95rem] font-semibold text-navy-800 hover:text-gold-700"
            >
              Ver registro completo
              <Seta />
            </Link>
          )}
        </Cartao>
      </div>
    </div>
  );
}
