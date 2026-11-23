'use client';

import { useState } from 'react';
import { useAvisar } from '@/components/layout/Avisos';

/** Botão "Copiar" (chave PIX, conta): copia o texto e agradece. */
export function BotaoCopiar({ texto, className }: { texto: string; className: string }) {
  const [copiado, setCopiado] = useState(false);
  const avisar = useAvisar();

  async function copiar() {
    try {
      await navigator.clipboard.writeText(texto);
    } catch {
      // Navegadores antigos: copia por uma caixa de texto temporária
      const caixa = Object.assign(document.createElement('textarea'), { value: texto });
      document.body.appendChild(caixa);
      caixa.select();
      document.execCommand('copy');
      caixa.remove();
    }
    setCopiado(true);
    avisar('Copiado. Deus lhe pague!');
    setTimeout(() => setCopiado(false), 1800);
  }

  return (
    <button type="button" className={className} onClick={copiar}>
      {copiado ? 'Copiado!' : 'Copiar'}
    </button>
  );
}
