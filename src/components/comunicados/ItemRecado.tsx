import type { Recado } from '@/modules/Comunicados/Domain/comunicado';

/** Recado paroquial (quadro de avisos). */
export function ItemRecado({ recado }: { recado: Recado }) {
  return (
    <li className="relative pl-6">
      <span className="absolute left-0 top-2 w-2 h-2 rotate-45 bg-gold-500" aria-hidden="true"></span>
      <p className="font-serif font-semibold text-xl text-navy-900 leading-snug">{recado.titulo}</p>
      <p className="mt-1 text-[1.0625rem] leading-relaxed text-slate-600">{recado.texto}</p>
    </li>
  );
}
