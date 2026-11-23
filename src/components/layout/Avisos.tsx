'use client';

import { createContext, useCallback, useContext, useRef, useState } from 'react';

type Avisar = (texto: string, duracaoMs?: number) => void;
const ContextoDeAvisos = createContext<Avisar>(() => {});

/** Aviso flutuante ("toast") — ex.: "Copiado. Deus lhe pague!", "Letra grande". */
export function Avisos({ children }: { children: React.ReactNode }) {
  const [texto, setTexto] = useState('');
  const [visivel, setVisivel] = useState(false);
  const temporizador = useRef<ReturnType<typeof setTimeout>>(undefined);

  const avisar = useCallback<Avisar>((novoTexto, duracaoMs = 2400) => {
    setTexto(novoTexto);
    setVisivel(true);
    clearTimeout(temporizador.current);
    temporizador.current = setTimeout(() => setVisivel(false), duracaoMs);
  }, []);

  return (
    <ContextoDeAvisos.Provider value={avisar}>
      {children}
      <div
        id="toast"
        className={`fixed bottom-[96px] lg:bottom-6 left-1/2 -translate-x-1/2 z-[70] px-5 py-3 rounded-full bg-navy-900 text-white text-base shadow-xl transition-opacity pointer-events-none ${visivel ? '' : 'opacity-0'}`}
        role="status"
        aria-live="polite"
      >
        {texto}
      </div>
    </ContextoDeAvisos.Provider>
  );
}

export const useAvisar = () => useContext(ContextoDeAvisos);
