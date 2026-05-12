# Tesouro

### *Onde está o Next Best Dollar.*

**Cérebro de mídia interno da R2 Ventures.** Cruza criativos, jornadas, deploys e mercado em tempo real pra responder a pergunta que paga as contas: *onde investir o próximo dólar?*

[�� Demo · Jeitto](https://tesouro-amber.vercel.app/) · [�� GitHub](https://github.com/miqueias-moureira/tesouro) · [�� Pitch Notion](https://www.notion.so/35e4cfccbdf281dcb096f6a0b2f08673)

`TypeScript · Next.js 14 · Claude Sonnet 4.6 · Tool Use · Multi-Agent · Vercel`

---

*Cada análise de mídia na R2 é uma escavação de horas em mais de 6 fontes de informação. A gente automatizou a caça ao tesouro.*

## TL;DR

|  |  |
| :---- | :---- |
| **O que é** | Plataforma multi-tenant interna onde cada parceria pluga suas fontes uma vez (Meta, Google, TikTok, Engage, Tracr, deploys, mercado, mídia espontânea) e Tesouro passa a operar sozinho — cruza evidências em paralelo via Claude tool use, recomenda realocação de budget, briefa criativos novos e gera Media Review semanal automático. |
| **Pra quem** | Time de growth da R2 Ventures operando múltiplas parcerias (Jeitto, BMG, Nio, Cogna, eletromídia, …). |
| **Dor que resolve** | Hoje uma análise leva 2-4h cruzando \>6 fontes na mão. Com Tesouro, 90s com evidência citada. Realocação de budget deixa de esperar Media Review semanal. |
| **Diferencial** | Multi-agente com **especialista por fonte** (não "agente de mídia" genérico) · loop autônomo (cron diário \+ semanal) · artefato físico vendável (Media Review no Notion) · aprendizado em 2 camadas (cross-partner \+ por parceria) · framing de aventura sem cafonice. |
| **Como verificar em 90s** | Abre o [demo Jeitto](https://tesouro-amber.vercel.app/jeitto) → vê "Sistema rodando · 6 fontes plugadas" → clica num dos alertas recentes → recebe Mapa do Tesouro com 3 pistas cruzadas e ações. |
| **Time** | Caçadores de Tesouro · Miquéias Moureira · Isadora Luize · Kleber Zanella · R2 Ventures · HACK-26 (12/05/2026). |

---

## O problema, em três fatos

1. **R2 opera 8+ parcerias em paralelo** (Jeitto, BMG, eletromídia, Nio, Cogna, …) — cada uma com seu funil, suas campanhas, seu time de produto. Escala horizontal não cabe em planilha.  
2. **Cada análise hoje é manual.** Quando a conversão de uma parceria cai, alguém abre Meta Ads, Google Ads, TikTok Ads, Tracr, New Relic, Databricks, GitHub releases, Engage (CRM), dashboard de mercado e mídia espontânea — e tenta amarrar a história no Excel. **Mais de 6 fontes de informação cruzadas na mão.** Tempo médio: 2-4h.  
3. **Decisões dependem do ciclo de Media Review** (semanal). Quando o Review acontece, a oportunidade já passou. *Você acha o tesouro depois que o navio afundou.*

---

## A solução em uma frase

Cada parceria pluga suas fontes uma vez. **Tesouro passa a operar sozinho** — todo dia às 08h olha tudo e dispara alertas no Slack quando algo varia ≥15%. No horário definido pela parceria, gera o Media Review da semana no Notion. A qualquer momento, qualquer pessoa pergunta em PT-BR e recebe diagnóstico cruzado com ação executável.

*Não é chatbot. É um sistema vivo que decifra o mapa enquanto você dorme.*

---

## Os três entregáveis

### 1\. Allocator — *Next Best Dollar*

Pergunta on-demand em português. Master Agent dispara especialistas em paralelo via Claude tool use, cruza evidências e devolve recomendação com **3 pistas citadas** \+ ações executáveis.

**Exemplo real do demo:**

🗺️ **MAPA DO TESOURO**

Redistribua R$ 12k/dia: Google Search Genérico → Meta Reels Casal Jovem. **ROAS projetado:** 2.3x → 3.1x.

**Por quê:** • Meta Reels "casal jovem 9:16" \+47% CVR nos últimos 7d • Google Search Genérico caiu 18% em CTR após deploy v3.2 (09/05 mudou copy) • Mídia espontânea no Valor Econômico (11/05) subiu orgânico — pago perde eficiência

**Pista quente:** padrão histórico sugere formato 9:16, foto outdoor, headline "Aprovado em…" → \+32% CVR

\[ Aplicar redistribuição \] \[ Rascunho de brief \] \[ Salvar análise \]

### 2\. Studio — *Brief do próximo criativo*

Spec do próximo asset a partir de padrões históricos próprios da parceria, padrões de **outras parcerias** R2 (cross-partner learning) e contexto de mercado. Output cobre formato, headline, brief para o time criativo, anti-padrões e métrica esperada.

### 3\. Review — *Doc semanal pra parceiro*

**Roda automaticamente** no horário definido pela parceria (default: sexta 10h). Gera Media Review completo no Notion da parceria. Estrutura reutilizável: TL;DR, tabela de performance por canal, vencedor/ofensor da semana, contexto que impactou (deploys, mídia espontânea), 3 recomendações concretas, testes propostos pelo Studio, **bloco "funcionou / não funcionou" da semana anterior**, e **biblioteca "o que mais vende por canal" pro time de design**.

Exemplo completo gerado pelo sistema: [`data/sample-review.md`](http://data/sample-review.md).

### Scheduler — o que faz isso virar SISTEMA, não consulta

```
Cron diário 08h: análise rápida em todas as parcerias ativas
  → se variação ≥ 15% em qualquer métrica
  → alerta no Slack #tesouro-[parceria]
  → cita evidência + hipótese de causa

Cron semanal (sex 10h default): análise completa por parceria
  → gera Review completo
  → publica no Notion DB da parceria
  → notifica o time de mídia
```

Em produção: Vercel Cron / GitHub Actions schedule / cron tradicional. Stub arquitetural em [`lib/scheduler/cron.ts`](http://lib/scheduler/cron.ts).

---

## Arquitetura

```
                  TESOURO · cérebro de mídia interno R2
   ┌────────────────────────────────────────────────────────────┐
   │                                                            │
   │           ┌────── ADMIN R2 ─────────────────┐              │
   │           │ habilita parcerias · gerencia   │              │
   │           └────────────────┬────────────────┘              │
   │                            │                               │
   │   Jeitto       BMG        Nio        Cogna     eletromídia │
   │      └──────────┴──────────┴──────────┴────────────┘       │
   │                            │                               │
   │           ┌────── HOME parceria ───────────┐               │
   │           │ histórico inv × vendas         │               │
   │           │ insights · chat (também Slack) │               │
   │           │ budget alocado por canal/etapa │               │
   │           └────────────────┬───────────────┘               │
   │                            │                               │
   │           ┌────────────────┼────────────────┐              │
   │           ▼                ▼                ▼              │
   │       ALLOCATOR         STUDIO            REVIEW           │
   │       (NBD)             (briefing)        (sex 10h)        │
   │           └────────────────┴────────────────┘              │
   │                            │                               │
   │              ┌─────────────▼─────────────┐                 │
   │              │  MASTER ORCHESTRATOR      │                 │
   │              │  (Claude Sonnet 4.6 +     │                 │
   │              │   tool use, paralelo)     │                 │
   │              └─────────────┬─────────────┘                 │
   │                            │                               │
   │      ┌─────────────────────┼──────────────────────┐        │
   │      ▼                     ▼                      ▼        │
   │  ESPECIALISTAS         ESPECIALISTAS        ESPECIALISTAS  │
   │   DE MÍDIA              DE JORNADA           DE CONTEXTO   │
   │  • Meta                • Tracr               • Mercado     │
   │  • Google              • New Relic           • M. espontâ. │
   │  • TikTok              • Engage (CRM)        • Competidor  │
   │  • Microsoft           • Orgânico/SEO        • Deploys     │
   │  • Afiliados                                  • Design     │
   │                                                            │
   │   Cada um lê 2 camadas de aprendizado:                     │
   │   • learnings/generic/[canal].md    (cross-partner)        │
   │   • learnings/by-partner/[p]/[canal].md (específico)       │
   │                                                            │
   │  ┌──────────────── SCHEDULER ─────────────────────────┐    │
   │  │ • Diário 08h: alertas → Slack da parceria          │    │
   │  │ • Semanal sex 10h: Review → Notion da parceria     │    │
   │  │ • Cada execução acumula learnings                  │    │
   │  └────────────────────────────────────────────────────┘    │
   └────────────────────────────────────────────────────────────┘
```

### Hierarquia de especialistas — por que isso muda o jogo

A pirâmide é o diferencial técnico vs "Claude com tools genéricas". Cada especialista tem **prompt focado no canal**, **dados estruturados próprios**, e em v3 acumula aprendizado próprio:

#### Especialistas de mídia

| Especialista | Conhece | Aprendizado típico |
| :---- | :---- | :---- |
| **Meta** | Reels vs Feed vs Stories, padrões de criativo, audiências, leilão, frequência | *"Headlines com 'Aprovado em…' → \+32% CVR em fintech"* |
| **Google** | Search vs PMax, qualidade de keyword, match types, intenção, bid landscape | *"Search Genérico desce com mídia espontânea — Brand sobe"* |
| **TikTok** | Spark Ads vs in-feed, hooks que retêm, copy nativa, lookalike | *"Hook nos primeiros 3s é tudo — se cair 30%, refaz"* |
| **Microsoft** | Search Bing/MSN, audiences LinkedIn, complemento desktop B2C | *"Funciona pra ticket maior, desktop-heavy"* |
| **Afiliados** | CPA por afiliado, qualidade vs volume, sobreposição com pago, fraude | *"Afiliado X tem boa origem mas 40% sobrepõe com Meta"* |
| **Orgânico / SEO** | Tráfego não-pago como sinal de aquecimento de marca | *"Spike orgânico \= reduza Search Brand pago"* |

#### Especialistas de jornada

| Especialista | Conhece |
| :---- | :---- |
| **Tracr** | Funil consolidado, eventos, LCR/LSR, conversão por etapa |
| **New Relic** | Real-time logs, performance de APIs, falhas que matam conversão silenciosamente |
| **Engage (CRM)** | WhatsApp/SMS, hand-off de mídia pra CRM, recuperação de carrinho |

#### Especialistas de contexto

| Especialista | Conhece |
| :---- | :---- |
| **Mercado** | Selic, taxa, posicionamento competitivo, sazonalidade |
| **Mídia espontânea** | Reportagens, podcasts, menções que mudam o leilão sem você pagar |
| **Competidor** | Movimentos observáveis (spend, criativos, audiências) |
| **Deploys** | Versões do site/app correlacionadas com queda/subida |
| **Design** | Variantes de UI testadas, performance de hero/CTA |

**O insight nasce do cruzamento.** Nenhum especialista isolado percebe que CVR de Meta Reels subindo \+ mídia espontânea no Valor \+ deploy v3.2 mudando copy \= *redistribuir agora.* O Master sintetiza.

---

## Cenário-âncora completo do demo

**Input:** *"Onde investir os próximos R$ 50k em Jeitto hoje?"*

**Pipeline interno (real, com Claude tool use):**

```
1. Master Agent recebe a pergunta
2. Tool use: dispara especialistas em paralelo
   ├─ Meta-specialist     → "Reels Casal Jovem +47% CVR (R$ 86k spend, ROAS 3.1x)"
   ├─ Google-specialist   → "Search Genérico -18% CTR pós-09/05; Brand estável"
   ├─ Tracr-specialist    → "Form completion -12% no mobile, drop em 09/05"
   ├─ Deploy-specialist   → "v3.2 deployado 09/05 17h42 — mudou copy do CTA"
   └─ Market-specialist   → "Valor Econômico mencionou Jeitto 11/05 — branded +34%"

3. Master cruza:
   • Meta vencendo + Google Genérico caindo → realocar
   • Google Genérico caindo COINCIDE com deploy de copy → causa identificada
   • Mídia espontânea + branded subindo → reduzir Search Brand pago também

4. Devolve resposta no formato "Mapa do Tesouro" com 3 pistas + ações
```

---

## Como rodar

### Pré-requisitos

- Node.js ≥ 18  
- pnpm (recomendado) ou npm  
- Chave da [Anthropic API](https://console.anthropic.com/)

### Setup

```shell
git clone https://github.com/miqueias-moureira/tesouro.git
cd tesouro
pnpm install
cp .env.example .env.local
# editar .env.local e colocar ANTHROPIC_API_KEY
pnpm dev
```

Abre em [http://localhost:3000](http://localhost:3000) — redireciona pra `/jeitto`. A home mostra ...