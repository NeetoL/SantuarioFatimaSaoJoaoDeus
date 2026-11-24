import { type Metadata } from 'next';

/** Painel de controle: fora dos buscadores (também há X-Robots-Tag e Cache-Control: no-store no next.config). */
export const metadata: Metadata = {
  title: { default: 'Painel de controle', template: '%s · Painel de controle' },
  robots: { index: false, follow: false, nocache: true },
};

export default function LayoutDoPainelDeControle({ children }: { children: React.ReactNode }) {
  return children;
}
