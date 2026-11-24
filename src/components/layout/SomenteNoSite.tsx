'use client';

import { usePathname } from 'next/navigation';
import { type ReactNode } from 'react';

/** Mostra o conteúdo só nas páginas do site (no painel de controle, o cabeçalho e o rodapé do site somem). */
export function SomenteNoSite({ children }: { children: ReactNode }) {
  const caminho = usePathname();
  return caminho.startsWith('/painel-controle') ? null : <>{children}</>;
}
