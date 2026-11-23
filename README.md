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

## Onde mudar o conteúdo

| Conteúdo | Arquivo |
|---|---|
| Eventos e avisos | `src/mocks/eventos.ts` |
| Horários (missas, confissões, terços, adoração, igreja, secretaria) | `src/mocks/horarios.ts` |
| Notícias e recados (`importante: true` destaca um recado) | `src/mocks/comunicados.ts` |
| Galeria: álbuns de fotos, um por evento (página /galeria; os 3 mais recentes também aparecem na página inicial) | `src/mocks/galeria.ts` |
| PIX, banco e destino das doações (**hoje são exemplos**) | `src/mocks/doacoes.ts` |
| Endereço, telefone, e-mail, redes sociais e o texto "Conheça o Santuário" | `src/mocks/institucional.ts` |
| Fotos e vídeos | `public/assets/` |

## Documentação

- [Arquitetura, API, segurança e banco de dados futuro](docs/ARQUITETURA.md)
- [Inventário do site antes da migração](docs/INVENTARIO.md)
