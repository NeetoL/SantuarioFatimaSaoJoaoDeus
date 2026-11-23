# Inventário do site (antes da modernização)

Levantamento feito na Etapa 1, a partir do site estático publicado na Vercel
(HTML + Tailwind via CDN + JavaScript puro). Serve de lista de conferência:
**tudo o que está aqui precisa continuar funcionando na versão Next.js.**

## 1. Páginas e endereços

| Página | Arquivo antigo | Endereço novo | Seções (âncoras) |
|---|---|---|---|
| Início | `index.html` | `/` | `#inicio` (vídeo), `#avisos`, `#horarios`, `#noticias`, `#doacoes` |
| Sobre (Nossa História) | `sobre.html` | `/sobre` | `#topo`, `#origens`, `#caminhada`, `#sacerdotes`, `#dedicacao`, `#santuario`, `#fotos`, `#visite` |
| Eventos | `eventos.html` | `/eventos` | `#topo`, `#bloco-destaque`, `#agenda` |
| Missas e Horários | `missas.html` | `/missas` | `#topo`, `#hoje`, `#calendario`, `#mensais`, `#confissoes`, `#secretaria`, `#bloco-missas-especiais`, `#como-chegar` |
| Notícias | `noticias.html` | `/noticias` | `#topo`, `#publicacoes`, `#recados`, `#galeria` |
| Contato | `contato.html` | `/contato` | `#topo`, `#canais`, `#mensagem` |
| Doações | `doacoes.html` | `/doacoes` | `#topo`, `#destino`, `#como-doar`, `#dizimo` |

Os endereços antigos (`/sobre.html`, `/index.html` etc.) e os sem extensão (`/sobre`) continuam válidos:
os antigos redirecionam para os novos.

## 2. Funcionalidades

### Em todas as páginas
- Cabeçalho fixo: transparente sobre a abertura, sólido ao rolar; brasão + nome; menu com página atual destacada; botão Doações.
- Botão **A+** (tamanho da letra: normal, grande, maior), guardado no aparelho e aplicado antes de desenhar a página.
- Celular: menu em tela cheia (links grandes numerados, Ligar, Como chegar, Doação, tamanho da letra), trava a rolagem, fecha com Esc.
- Celular: barra de atalhos fixa (Horários, Eventos, Ligar, Doar, Letra).
- Rodapé: brasão, frase de Fátima, redes sociais, endereço + mapa, horário da secretaria, contato, links.
- Botão "voltar ao topo"; aviso flutuante (toast); animação de entrada dos blocos (respeita "menos movimento").
- Recarrega a página quando o navegador mostra uma cópia antiga (botão voltar).
- Se uma foto falhar, o fundo degradê aparece no lugar.

### Início
- Tela de carregamento com o brasão até o vídeo começar (máx. 10 s).
- Vídeo de fundo próprio: versão deitada e em pé; tenta de novo no primeiro toque se o aparelho bloquear; pausa fora da tela.
- Aviso dourado sobre o vídeo com o evento mais próximo (até 7 dias), com contagem.
- "Acontece no Santuário": evento em destaque + 3 próximos, total de eventos; some se não houver eventos.
- Calendário de missas (domingo a sábado) com o dia de hoje destacado; resumo "Hoje no Santuário".
- Últimas 2 notícias + 3 recados; chamada para doações.

### Eventos
- Evento em destaque (o marcado como destaque ou o mais próximo).
- Agenda completa agrupada por mês, com filtros por categoria (só as categorias existentes).
- Selo de tempo atualizado a cada 30 s: "Começa em…", "Acontecendo agora", "Amanhã às…", "Em N dias".
- O evento sai sozinho 2 horas depois de começar.
- "Salvar na agenda" (arquivo .ics, horário de Brasília) e "Compartilhar" (compartilhamento do celular ou WhatsApp).
- Fotos automáticas por categoria quando o evento não tem foto, sem repetir na mesma página.

### Missas e Horários
- "Hoje no Santuário": programação do dia em ordem (missas, confissões, terços, adoração), com "Agora" e "Encerrado"; igreja e secretaria do dia.
- Calendário semanal de missas; 1ª sexta e 1º sábado do mês marcados.
- Próxima data das missas votivas mensais (calculada).
- Confissões, terços e adoração com "Hoje"; igreja aberta e secretaria dia a dia; intenções de missa.
- Celebrações especiais (eventos da categoria Missa); como chegar (mapa).

### Notícias
- Notícia mais recente em destaque; demais em cards; "Saiba mais" quando há link.
- Recados paroquiais; galeria da comunidade com fotos que ampliam (setas, teclado, foco preso no modal).

### Sobre
- História em capítulos com sumário; linha do tempo; sacerdotes; dedicação; galeria "Memória em fotos" com ampliação.

### Contato
- Canais (endereço, telefone, e-mail, secretaria).
- Formulário que abre o aplicativo de e-mail com a mensagem pronta (não envia por servidor).

### Doações
- Destino das ofertas (percentuais de exemplo).
- PIX com QR Code (ampliável) e "Copiar"; dados bancários com "Copiar" (dados de exemplo); dízimo.

## 3. Dados (hoje dentro dos arquivos JavaScript)

| Dados | Arquivo antigo | Observação |
|---|---|---|
| Eventos | `assets/js/eventos.js` | Exemplos + um evento fictício (15/11/2026) |
| Horários (missas, confissões, terços, adoração, igreja, secretaria, missas mensais) | `assets/js/missas.js` | **Reais** (site antigo do Santuário) |
| Notícias, recados, galeria | `assets/js/noticias.js` | Notícias e recados de exemplo; fotos reais |
| PIX | `assets/js/doacoes.js` + `doacoes.html` | **Exemplo** (chave e banco fictícios) |
| Endereço, telefone, e-mail, horário da secretaria | Repetidos em todas as páginas | Reais |

## 4. Dependências externas
- Tailwind CSS via CDN (`cdn.tailwindcss.com`) — substituído por Tailwind compilado.
- Google Fonts (Cinzel, Cormorant Garamond, EB Garamond, Inter) — passam a ser servidas pelo próprio site (`next/font`).
- qrcodejs via CDN (QR do PIX) — substituído por geração no servidor (pacote `qrcode`).
- Google Maps (iframe e links), WhatsApp (link de compartilhamento).

## 5. Não existe hoje
- Autenticação, área administrativa, cadastro de usuários ou membros, banco de dados, envio de e-mail pelo servidor.
  Por isso a modernização **não cria** esses módulos (seria inventar funcionalidade ou simular segurança);
  a arquitetura fica pronta para recebê-los (ver `docs/ARQUITETURA.md`).
