/** "Saiba mais" — só aparece quando a notícia tem link (já validado como https pelo módulo Comunicados). */
export function SaibaMais({ link, claro = false }: { link?: string; claro?: boolean }) {
  if (!link) return null;
  return (
    <a
      href={link}
      target="_blank"
      rel="noopener noreferrer"
      className={`group/link mt-5 inline-flex items-center gap-2 text-[.875rem] font-semibold uppercase tracking-[.16em] ${claro ? 'text-gold-300 hover:text-gold-200' : 'text-navy-800 hover:text-gold-700'}`}
    >
      Saiba mais
      <svg
        className="w-4 h-4 group-hover/link:translate-x-0.5 transition-transform"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <path d="M5 12h14M13 6l6 6-6 6"></path>
      </svg>
    </a>
  );
}
