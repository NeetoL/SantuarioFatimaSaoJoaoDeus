'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { NIVEIS_DA_LETRA, useTamanhoDaLetra } from '@/components/hooks/useTamanhoDaLetra';
import { useAvisar } from './Avisos';

const ICONE = {
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: '1.8',
  viewBox: '0 0 24 24',
  'aria-hidden': true,
} as const;

/** Barra fixa no rodapé do celular: Horários, Eventos, Ligar, Doar e tamanho da letra (some no computador). */
export function BarraDeAtalhos({ telefone }: { telefone: string }) {
  const caminho = usePathname();
  const { nivel, definir, proximo } = useTamanhoDaLetra();
  const avisar = useAvisar();
  const atual = (href: string) => (caminho.startsWith(href) ? 'page' : undefined);

  return (
    <nav className="barra-celular" aria-label="Atalhos">
      <Link href="/missas" aria-current={atual('/missas')}>
        <svg {...ICONE}>
          <circle cx="12" cy="12" r="9"></circle>
          <path d="M12 7v5l3 2"></path>
        </svg>
        <span>Horários</span>
      </Link>
      <Link href="/eventos" aria-current={atual('/eventos')}>
        <svg {...ICONE}>
          <rect x="3.5" y="5" width="17" height="15" rx="1.5"></rect>
          <path d="M3.5 10h17M8 3v4M16 3v4"></path>
        </svg>
        <span>Eventos</span>
      </Link>
      <a href={`tel:${telefone}`}>
        <svg {...ICONE}>
          <path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2"></path>
        </svg>
        <span>Ligar</span>
      </a>
      <Link href="/doacoes" aria-current={atual('/doacoes')}>
        <svg {...ICONE}>
          <path d="M12 21s-7-4.4-9.5-9A5.5 5.5 0 0 1 12 6a5.5 5.5 0 0 1 9.5 6c-2.5 4.6-9.5 9-9.5 9z"></path>
        </svg>
        <span>Doar</span>
      </Link>
      <button
        type="button"
        aria-label={`Tamanho da letra: ${NIVEIS_DA_LETRA[nivel]}. Toque para mudar.`}
        onClick={() => {
          const novo = proximo();
          definir(novo);
          avisar(NIVEIS_DA_LETRA[novo] ?? '', 1800);
        }}
      >
        <span className="letra-icone" aria-hidden="true">
          A<small>+</small>
        </span>
        <span>Letra</span>
      </button>
    </nav>
  );
}
