import Link from 'next/link';

export default function NaoEncontradoNoPainel() {
  return (
    <div className="rounded-lg bg-white p-8 text-center shadow-sm ring-1 ring-black/5 sm:p-12">
      <h1 className="font-serif text-4xl font-semibold text-navy-900">Não encontrado</h1>
      <p className="mx-auto mt-3 max-w-md text-base text-slate-600">
        Este item não existe mais (pode ter sido excluído) ou o endereço está errado.
      </p>
      <Link href="/painel-controle" className="btn btn-escuro btn-sm mt-8">
        Voltar ao início do painel
      </Link>
    </div>
  );
}
