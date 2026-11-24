'use client';

import { useState } from 'react';
import { entrar } from '@/app/painel-controle/acoes-de-acesso';
import { BotaoSalvar, Campo, Formulario, useEstadoDoFormulario } from './Formulario';

function CampoDeSenha() {
  const [visivel, setVisivel] = useState(false);
  const { erros } = useEstadoDoFormulario();
  return (
    <div>
      <div className="flex items-baseline justify-between">
        <label htmlFor="senha" className="block text-[.95rem] font-semibold text-navy-900">
          Senha
        </label>
        <button
          type="button"
          onClick={() => setVisivel((v) => !v)}
          className="text-sm font-semibold text-navy-800 hover:text-gold-700"
          aria-controls="senha"
          aria-pressed={visivel}
        >
          {visivel ? 'Esconder' : 'Mostrar'}
        </button>
      </div>
      <input
        id="senha"
        name="senha"
        type={visivel ? 'text' : 'password'}
        autoComplete="current-password"
        required
        maxLength={200}
        aria-invalid={Boolean(erros.senha)}
        aria-describedby={erros.senha ? 'senha-erro' : undefined}
        className="mt-1.5 h-12 w-full rounded-md border border-slate-300 bg-white px-3.5 text-base text-navy-950 focus:border-gold-500 focus:outline-none focus:ring-2 focus:ring-gold-400/30 aria-[invalid=true]:border-red-400"
      />
      {erros.senha && (
        <p id="senha-erro" className="mt-1.5 text-sm font-medium text-red-700">
          {erros.senha}
        </p>
      )}
    </div>
  );
}

export function FormularioDeEntrada() {
  return (
    <Formulario acao={entrar} className="space-y-5">
      <Campo nome="email" rotulo="E-mail ou usuário" autoComplete="username" inputMode="email" maxLength={200} obrigatorio />
      <CampoDeSenha />
      <div className="pt-2 [&>button]:w-full">
        <BotaoSalvar enviandoTexto="Entrando…">Entrar no painel</BotaoSalvar>
      </div>
    </Formulario>
  );
}
