# Santuário Nossa Senhora de Fátima e São João de Deus

Site institucional do Santuário Arquidiocesano Nossa Senhora de Fátima e São João de Deus — Realengo, Rio de Janeiro.

Next.js 16 · React 19 · TypeScript (strict) · Tailwind CSS · Zod · Vitest · Vercel

## Começar

```bash
npm install
npm run dev        # http://localhost:3000
```

## Comandos

| Comando | Para quê |
|---|---|
| `npm run dev` | Site em desenvolvimento |
| `npm run build` / `npm run start` | Compilar e rodar como em produção |
| `npm run test` | Testes (regras, casos de uso, API) |
| `npm run lint` / `npm run typecheck` | Qualidade e tipos |
| `npm run verificar` | Tudo antes de publicar |
| `npm run painel:criar-admin -- "Nome" email` | Cria um Admin master (primeiro acesso ao painel no site no ar) |

## Painel de controle

Em **`/painel-controle`** a equipe atualiza o site sem mexer no código: informações do site (endereço, telefone,
redes, logo), horários, eventos, galeria de fotos, notícias e recados, dados de doação e a secretaria
(dizimistas e contribuições). Perfis: **Admin master**, **Padre**, **PASCOM** e **Secretaria**.
Tudo o que é feito fica no **registro de atividades**.

- **No computador:** `npm run dev` cria um banco local na pasta `.dados/` com o conteúdo atual do site, um
  **login padrão de Admin master** (definido em `src/mocks/painel.ts`) e quatro contas de teste, uma por perfil.
  Tudo listado em **`.dados/acessos-locais.txt`**. O login padrão só existe no banco local — nunca no site no ar.
- **No site no ar:** veja [docs/ARQUITETURA.md, seção 6](docs/ARQUITETURA.md#6-banco-de-dados-e-painel-de-controle).

Fotos e vídeos fixos do site continuam em `public/assets/`.

## Documentação

- [Arquitetura, API, banco de dados, painel e segurança](docs/ARQUITETURA.md)
- [Inventário do site antes da migração](docs/INVENTARIO.md)
