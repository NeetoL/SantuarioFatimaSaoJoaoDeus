import { type Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { FormularioDeEntrada } from '@/components/painel/FormularioDeEntrada';
import { casosDeUso, painelDisponivel } from '@/config/container';
import { usuarioAtual } from '@/modules/Acesso/Presentation/sessao';
import { logoDoSite } from '@/modules/Institucional/Domain/institucional';

export const metadata: Metadata = { title: 'Entrar' };

export default async function PaginaDeEntrada({ searchParams }: { searchParams: Promise<{ saiu?: string }> }) {
  if (await usuarioAtual()) redirect('/painel-controle');
  const [{ saiu }, institucional] = await Promise.all([searchParams, casosDeUso.institucional.obter()]);
  const logo = logoDoSite(institucional);

  return (
    <div className="painel-admin grid min-h-screen lg:grid-cols-[1.1fr_1fr]">
      {/* Foto do santuário (computador) */}
      <div className="relative hidden overflow-hidden bg-navy-950 lg:block">
        <Image src="/assets/img/hero-poster.jpg" alt="" fill priority sizes="55vw" className="object-cover opacity-55" />
        <div className="absolute inset-0 bg-gradient-to-t from-navy-950 via-navy-950/55 to-navy-950/30" aria-hidden="true" />
        <div className="relative flex h-full flex-col justify-between p-12 xl:p-16">
          <Image src={logo.url} alt="" width={logo.largura} height={logo.altura} className="h-20 w-auto self-start" />
          <div className="max-w-md">
            <p className="eyebrow claro">Painel de controle</p>
            <p className="mt-4 font-serif text-[2.6rem] font-semibold leading-[1.1] text-white">
              Santuário Nossa Senhora de Fátima e São João de Deus
            </p>
            <div className="mt-6 h-px w-20 bg-gold-500" aria-hidden="true" />
            <p className="mt-6 text-lg leading-relaxed text-white/75">
              Horários, eventos, fotos, avisos e secretaria — tudo o que aparece no site, num só lugar.
            </p>
          </div>
        </div>
      </div>

      {/* Formulário */}
      <div className="flex flex-col bg-[#f4f2ed]">
        <div className="flex items-center gap-3 bg-navy-950 px-5 py-4 lg:hidden">
          <Image src={logo.url} alt="" width={logo.largura} height={logo.altura} className="h-11 w-auto" />
          <span className="font-serif text-lg font-semibold text-white">Painel de controle</span>
        </div>
        <div className="flex flex-1 items-center justify-center px-5 py-12 sm:px-10">
          <div className="w-full max-w-[25rem]">
            <h1 className="font-serif text-[2.6rem] font-semibold leading-tight text-navy-900">Entrar</h1>
            <p className="mt-2 text-base text-slate-600">Use o e-mail (ou usuário) e a senha que o administrador do site cadastrou para você.</p>
            {saiu && (
              <p role="status" className="mt-6 rounded-md border border-emerald-200 bg-emerald-50 px-4 py-3 text-base text-emerald-900">
                Você saiu do painel com segurança.
              </p>
            )}
            {!painelDisponivel() && (
              <p role="alert" className="mt-6 rounded-md border border-amber-200 bg-amber-50 px-4 py-3 text-base text-amber-900">
                O painel ainda não está disponível neste servidor: falta configurar o banco de dados.
              </p>
            )}
            <div className="mt-8">
              <FormularioDeEntrada />
            </div>
            <p className="mt-10 text-sm text-slate-600">
              Esqueceu a senha? Peça ao Admin master para gerar uma senha temporária.
            </p>
            <Link href="/" className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-navy-800 hover:text-gold-700">
              <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M15 18l-6-6 6-6" />
              </svg>
              Voltar ao site
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
