# Arquitetura do site do Santuário

Site institucional do **Santuário Arquidiocesano Nossa Senhora de Fátima e São João de Deus** (Realengo, RJ),
em **Next.js 16 (App Router) + React 19 + TypeScript (strict)**, com backend organizado em módulos,
dados de demonstração em memória e pronto para receber um banco PostgreSQL.

> O que o site fazia antes da migração (e onde cada coisa está agora): [`docs/INVENTARIO.md`](./INVENTARIO.md).
> O site estático antigo está guardado, só para consulta, em [`legado/`](../legado/LEIA-ME.md).

---

## 1. Visão geral

```
Navegador ──► src/proxy.ts (CSP com nonce)
           ──► src/app/<página>/page.tsx   (Server Component)
                    │  chama casos de uso
                    ▼
              src/config/container.ts      (raiz de composição: escolhe as implementações)
                    │
      ┌─────────────┼──────────────────────────────────────────────┐
      ▼             ▼                                              ▼
 modules/X/Application  ──usa──►  modules/X/Domain (regras puras, contratos)
                                          ▲
 modules/X/Infrastructure (repositórios em memória ← src/mocks)  implementa os contratos

API externa: src/app/api/**/route.ts ──► modules/X/Presentation (controladores) ──► Application
```

- **Páginas** são Server Components: buscam os dados chamando os casos de uso (sem passar por HTTP).
- **Partes interativas** (contagem regressiva, "Hoje", filtros, galeria, menu, formulário) são Client Components
  e recebem dados já prontos. As regras de data/hora são funções puras do Domain, usadas no servidor e no navegador.
- **A API** (`/api/...`) expõe os mesmos casos de uso para integrações futuras (aplicativo, painel administrativo).
- **Nenhuma página ou componente lê os mocks diretamente**: o ESLint bloqueia `@/mocks` fora da camada Infrastructure.

## 2. Estrutura de pastas

```
src/
  app/                      Rotas do Next.js
    layout.tsx              Layout comum (cabeçalho, rodapé, barra do celular, avisos, script do A+)
    page.tsx                Início            sobre/ eventos/ missas/ noticias/ contato/ doacoes/
    api/                    Route Handlers (finos: só chamam os controladores)
    not-found.tsx error.tsx sitemap.ts robots.ts fontes.ts globals.css
  modules/                  Backend por assunto (ver seção 3)
    <Modulo>/Domain         Entidades, regras de negócio, contratos dos repositórios
    <Modulo>/Application    Casos de uso (orquestram as regras e os repositórios)
    <Modulo>/Infrastructure Repositórios (hoje em memória) e adaptadores (ex.: gerador de QR Code)
    <Modulo>/Presentation   Controladores da API: validação de entrada (Zod) e resposta padronizada
  shared/                   Peças comuns a todos os módulos
    Domain/erros.ts                 Erros com mensagem pública e status HTTP
    Application/paginacao.ts        Esquema e cálculo de paginação
    Infrastructure/logger.ts        Log estruturado sem dados pessoais
    Infrastructure/limite-de-requisicoes.ts   Rate limiting
    Presentation/resposta-api.ts    Formato padrão + tratamento centralizado de erros
    Presentation/rota-api.ts        Envoltório dos Route Handlers (rate limit, erros, cache)
  components/               Interface (layout/, eventos/, horarios/, comunicados/, galeria/, contato/, doacoes/, inicio/, ui/, hooks/)
  config/                   ambiente.ts (variáveis validadas), container.ts (raiz de composição)
  lib/                      datas.ts (horário de Brasília), requisicao.ts
  mocks/                    Dados de demonstração (lidos só pelos repositórios)
  proxy.ts                  Content-Security-Policy com nonce
public/assets/              Fotos, vídeos e ícones do Santuário
tests/                      Testes dos endpoints
docs/                       Esta documentação e o inventário
legado/                     Site estático anterior (não publicado)
```

## 3. Módulos

| Módulo | O que faz | Casos de uso principais | API |
|---|---|---|---|
| **Eventos** | Agenda e avisos. Regra: o evento sai do site 2 h depois de começar; selo "Começa em…/Acontecendo agora/Amanhã/Em N dias"; fotos automáticas sem repetir; arquivo .ics | `resumoDaPaginaInicial`, `agendaCompleta`, `missasEspeciais`, `listarProximos`, `buscar`, `arquivoDeAgenda` | `GET /api/eventos`, `GET /api/eventos/:id`, `GET /api/eventos/:id/agenda` |
| **Horarios** | Missas da semana, missas mensais, confissões, terços, adoração, igreja aberta e secretaria; "Hoje no Santuário"; resumo da secretaria | `obterQuadro`, `resumoDaSecretaria` | `GET /api/horarios` |
| **Comunicados** | Notícias (mais recente primeiro, links só https) e recados paroquiais (os marcados `importante` vêm primeiro, com destaque) | `noticiasDaPagina`, `ultimasNoticias`, `listarNoticias`, `listarRecados` | `GET /api/noticias`, `GET /api/recados` |
| **Galeria** | Álbuns de fotos, um por evento (título, data opcional, capa e fotos com legenda); mais recentes primeiro, os sem data depois | `listarAlbuns`, `listarAlbunsPaginados`, `buscarAlbum` | `GET /api/galeria` |
| **Doacoes** | PIX, dados bancários, destino das ofertas (percentuais somam 100%), QR Code | `obter`, `qrCodeDoPix` | `GET /api/doacoes`, `GET /api/doacoes/qrcode-pix` |
| **Institucional** | Endereço, coordenadas, telefone, e-mail, redes sociais e a apresentação "Conheça o Santuário" (fonte única do rodapé, menus, contato e página inicial) | `obter`, `enderecoCompleto` | `GET /api/institucional` |
| **Contato** | Esquema da mensagem (Zod) e montagem do e-mail. **Não há envio pelo servidor**: o formulário abre o aplicativo de e-mail da pessoa (como no site antigo) | — (só Domain) | — |

Não existem módulos de autenticação, usuários, membros ou dízimo com cadastro: o site não tem essas funções hoje.
Criar esses módulos agora seria inventar funcionalidade ou simular segurança (ver seção 8).

## 4. Dados mockados

- Ficam em `src/mocks/*.ts`, um arquivo por assunto, **sem duplicação** (o horário da secretaria, por exemplo,
  é escrito uma vez em `mocks/horarios.ts` e gera o texto do rodapé, da página Contato e da página de horários).
- São lidos **somente** pelos repositórios `…EmMemoria` (camada Infrastructure), que devolvem cópias (`structuredClone`).
- São **somente leitura** e **determinísticos**: nada é gravado, nada depende de memória compartilhada entre
  requisições (na Vercel cada função pode rodar em instâncias diferentes). Não há `localStorage` usado como banco.
  Os únicos dados guardados no navegador são preferências do aparelho da pessoa: o tamanho da letra (A+)
  e se ela pausou o vídeo da página inicial.
- Conteúdo: horários, endereço, telefone e e-mail são **reais e públicos**. Eventos, notícias, recados, chave PIX,
  dados bancários e percentuais são **exemplos** (os mesmos do site antigo) — a API de doações avisa isso.

**Para mudar um conteúdo hoje:** edite o arquivo em `src/mocks/`, rode `npm run verificar` e publique.

### A página inicial

`src/app/page.tsx` busca tudo pelos casos de uso, nesta ordem: abertura com vídeo (com botão de pausa),
"Acontece no Santuário" (eventos; o título de cada evento leva a `/eventos#id`), horários de missa,
notícias e recados (o título da notícia leva a `/noticias#id`; recado com `importante: true` aparece primeiro),
galeria (os 3 álbuns mais recentes de `mocks/galeria.ts`; cada álbum abre um visualizador com setas, miniaturas,
teclado e deslizar do dedo; todos os álbuns ficam na página `/galeria`, com link direto `/galeria#id-do-album`), "Conheça o Santuário"
(`institucional.apresentacao`) e doações. Contato e endereço ficam no rodapé, em todas as páginas.

## 5. API

Formato padrão de todas as respostas:

```json
{ "success": true,  "message": "Operação realizada com sucesso.", "data": {}, "meta": null }
{ "success": false, "message": "Os dados enviados são inválidos.", "errors": [{ "campo": "categoria", "mensagem": "Categoria inválida." }] }
```

| Método e endereço | Parâmetros | Respostas |
|---|---|---|
| `GET /api/eventos` | `categoria` (Missa, Novena, Festa, Aviso), `pagina`, `porPagina` (máx. 50) | 200 (com `meta` de paginação), 400 |
| `GET /api/eventos/:id` | `id` = slug (`a-z`, `0-9`, `-`) | 200, 400, 404 |
| `GET /api/eventos/:id/agenda` | — | 200 `text/calendar` (anexo .ics), 400, 404 |
| `GET /api/horarios` | — | 200 (inclui `resumoDaSecretaria`) |
| `GET /api/noticias` | `categoria`, `pagina`, `porPagina` | 200, 400 |
| `GET /api/recados` | `limite` (1–50) | 200, 400 |
| `GET /api/galeria` | `pagina`, `porPagina` | 200 (álbuns com `fotoDeCapa` e `total`), 400 |
| `GET /api/doacoes` | — | 200 |
| `GET /api/doacoes/qrcode-pix` | — | 200 `image/svg+xml` |
| `GET /api/institucional` | — | 200 |
| Qualquer outro endereço em `/api` | — | 404 padronizado |
| `POST/PUT/PATCH/DELETE` | — | 405 padronizado (a API pública é somente leitura) |
| Excesso de requisições | — | 429 com `Retry-After` |

Erros inesperados viram 500 com mensagem genérica; o detalhe técnico vai **só** para o log do servidor (sem pilha, sem dados pessoais).

### Como criar um novo endpoint

1. No módulo, crie (ou use) o caso de uso em `Application/`.
2. No controlador (`Presentation/controlador.ts`), valide a entrada com Zod (`lerQuery` para a query string,
   `esquema.parse(await requisicao.json())` para o corpo) e responda com `respostaSucesso(...)`.
3. Exponha no container (`src/config/container.ts`), se for um módulo novo.
4. Crie `src/app/api/<caminho>/route.ts`:
   ```ts
   export const GET = rotaPublica('modulo.acao', (requisicao) => controladores.modulo.acao(requisicao));
   export const { POST, PUT, PATCH, DELETE } = metodosSomenteLeitura;
   ```
5. Escreva o teste em `tests/api.test.ts` (o Route Handler é chamado com um `Request`).

**Endpoints que gravam dados** só podem ser criados junto com autenticação e autorização reais (seção 8).

### Como criar um novo módulo

```
src/modules/NovoModulo/
  Domain/entidade.ts            tipos, regras puras e a interface RepositorioDeX
  Application/casos-de-uso.ts   criarCasosDeUsoDeX(repositorio) → { ... }
  Infrastructure/repositorio-em-memoria.ts   implements RepositorioDeX (lê src/mocks/novo.ts)
  Presentation/controlador.ts   criarControladorDeX(casos) → handlers com Zod
```
Depois: registre em `src/config/container.ts`, crie as rotas em `src/app/api/` e os testes (`*.test.ts` ao lado do código).

### Como implementar um novo repositório

Implemente a interface do Domain (por exemplo `RepositorioDeEventos`) numa classe nova na pasta `Infrastructure/`
e troque **uma linha** no container. Casos de uso, páginas, API e testes de regra continuam iguais.

## 6. Banco de dados no futuro (PostgreSQL)

Nada de banco foi instalado agora. O caminho previsto:

1. **Escolher o ORM**: Prisma (esquema declarativo e migrations prontas) ou Drizzle (SQL tipado, mais leve).
   Ambos usam consultas parametrizadas, o que previne SQL Injection.
2. **Variável de ambiente** `DATABASE_URL` (só no servidor; validar em `src/config/ambiente.ts`; nunca `NEXT_PUBLIC_`).
   Na Vercel, use um Postgres com *pooling* (ex.: Neon ou Supabase) por causa das funções serverless.
3. **Tabelas iniciais** (espelham os tipos do Domain): `eventos`, `noticias`, `recados`, `albuns` e `fotos_album`,
   `horarios` (ou tabelas por tipo: `missas_semana`, `confissoes`, `tercos`…), `dados_institucionais`, `dados_doacao`.
   Relacionamentos futuros: `eventos.categoria_id → categorias`, `noticias.autor_id → usuarios`.
4. **Migrations** versionadas no repositório (`prisma migrate` / `drizzle-kit`), aplicadas no deploy.
5. **Repositórios novos** em `Infrastructure/` (ex.: `RepositorioDeEventosPostgres implements RepositorioDeEventos`)
   e troca no container. Os mocks podem virar *seed* do banco de desenvolvimento.
6. **Transações** para operações com mais de uma tabela (ex.: publicar notícia + registrar auditoria).
7. **Auditoria**: tabela `auditoria (quem, quando, ação, entidade, id, antes, depois)` gravada pelos casos de uso de escrita.

## 7. Segurança (o que está implementado)

- **Content-Security-Policy com nonce por requisição** (`src/proxy.ts`): só scripts do próprio site rodam;
  mapas do Google em iframe; fotos, vídeos e fontes do próprio site. Por isso as páginas são dinâmicas (montadas a cada visita).
- **Cabeçalhos** (`next.config.ts`): `X-Content-Type-Options`, `X-Frame-Options: DENY`, `Referrer-Policy`,
  `Permissions-Policy`, `Strict-Transport-Security`, `Cross-Origin-Opener-Policy`; sem `X-Powered-By`.
- **Validação** de toda entrada da API com Zod (campos desconhecidos são descartados — sem atribuição indevida de propriedades);
  identificadores aceitos só no formato slug.
- **Erros** sem pilha nem detalhes internos; **logs** em JSON sem dados pessoais.
- **XSS**: o React escapa todo texto; links de notícias só `https`; links externos com `rel="noopener noreferrer"`;
  o SVG do QR Code é servido com CSP `sandbox`. Os únicos HTML inline são constantes do próprio código.
- **Rate limiting** nas rotas da API (120/min por cliente). É **por instância** (limitação conhecida da Vercel);
  para limite global, configure regras no Firewall da Vercel ou troque o `LimitadorEmMemoria` por um com Redis.
- **CORS**: a API não envia cabeçalhos CORS, então navegadores de outros sites não conseguem lê-la. Se um app
  externo precisar, libere só a origem dele.
- **LGPD**: o formulário de contato não envia nem guarda nada (abre o e-mail da própria pessoa); os mocks não têm
  dados pessoais; não há cookies de rastreamento; as fontes são servidas pelo próprio site (sem Google Fonts no navegador).
- **Segredos**: nenhum hoje. Quando houver, só em variáveis de ambiente do servidor.
- **Dependências**: `npm audit` sem vulnerabilidades conhecidas na data da migração.

## 8. Autenticação (futuro)

O site **não tem** área restrita hoje, então nenhuma autenticação foi criada (uma autenticação "de mentira" daria falsa
sensação de segurança). Quando houver painel para a secretaria/PASCOM publicar conteúdo:

- Use uma biblioteca madura (ex.: Auth.js) ou provedor gerenciado; sessão em **cookie HttpOnly, Secure, SameSite=Lax/Strict**.
- Senhas, se houver, com hash forte (Argon2id ou bcrypt); prefira login por e-mail (link mágico) para a equipe.
- Proteja as rotas de escrita **no servidor** (em cada Route Handler/Server Action), com papéis (ex.: `admin`, `editor`)
  verificados no caso de uso — o `proxy.ts` sozinho não basta.
- Proteção contra CSRF nas mutações (Server Actions do Next já verificam a origem; em Route Handlers, verifique `Origin`).
- Rate limiting mais rígido no login.

## 9. Testes e qualidade

| Comando | O que faz |
|---|---|
| `npm run typecheck` | TypeScript strict (`noUncheckedIndexedAccess` incluído) |
| `npm run lint` | ESLint (regras do Next.js, React, acessibilidade, TypeScript e a proibição de ler mocks fora da Infrastructure) |
| `npm run test` | Vitest: regras de negócio, casos de uso, repositórios, validações, respostas padronizadas, rate limit e todos os endpoints |
| `npm run build` | Compilação de produção |
| `npm run verificar` | Tudo acima, em ordem |
| `npm run format` | Prettier |

## 10. Executar localmente

Requisitos: Node.js 22.12+ (ou 24).

```bash
npm install
cp .env.example .env.local   # opcional
npm run dev                  # http://localhost:3000
```

Para testar como em produção (com a CSP completa): `npm run build && npm run start`.

## 11. Publicar na Vercel

- O `vercel.json` define o framework como **Next.js**, então o projeto existente passa a compilar o Next.js
  automaticamente (comando `next build`, saída padrão).
- Variáveis: `SITE_URL` (opcional; sem ela, usa o domínio de produção do projeto na Vercel).
- Fluxo recomendado: abrir um *pull request* do ramo → a Vercel gera uma **pré-visualização** → conferir → juntar ao `main`
  (que publica em produção).
- Os endereços antigos (`/sobre.html`, `/index.html`…) redirecionam para os novos (`/sobre`, `/`).
