"use client";

import type { WeeklyReview } from "@/domain/review/types";

const VERDICT_LABEL = {
  winner: "vencedor",
  loser: "ofensor",
  watch: "atenção",
} as const;

const HISTORY_FALLBACK = [
  {
    what: "Redistribuição de R$ 8k/dia de Google Search para Meta Reels (semana 18)",
    result: "CVR subiu de 6,1% para 8,4% em 5 dias. ROAS Reels: 3,8x vs. 2,6x Search.",
    verdict: "worked" as const,
  },
  {
    what: "Teste de headline 'Aprovado em 2 minutos' no Search Brand (semana 17)",
    result: "CTR caiu 11% — copy prometeu prazo que não era entregue no form. Revertido.",
    verdict: "failed" as const,
  },
  {
    what: "Hook emocional casal jovem nos primeiros 2s do Reels (semana 16)",
    result: "Retenção 3s subiu para 78%. Melhor criativo do mês em CVR e custo por lead.",
    verdict: "worked" as const,
  },
];

const TOP_CREATIVES_FALLBACK = [
  {
    format: "Reels 9:16 · 15s",
    channel: "Meta",
    metric: "8,7% CVR · R$ 18 CPA",
    description: "Casal jovem, hook emocional nos 2s iniciais, aprovação como desfecho.",
  },
  {
    format: "Search RSA · 3 headlines",
    channel: "Google",
    metric: "4,2% CTR · 6,1% CVR",
    description: "Keyword exata + benefício quantificado + urgência (sem prazo falso).",
  },
  {
    format: "Feed 1:1 · estático",
    channel: "Meta",
    metric: "5,8% CVR · R$ 24 CPA",
    description: "Prova social com número real de aprovados. Funciona para retargeting.",
  },
];

export function ReviewDocument({
  review,
  partnerName,
}: {
  review: WeeklyReview;
  partnerName: string;
}) {
  const history = review.history ?? HISTORY_FALLBACK;
  const topCreatives = review.top_creatives ?? TOP_CREATIVES_FALLBACK;

  return (
    <article className="bg-surface border border-border p-8 sm:p-12 max-w-prose mx-auto">
      {/* cabeçalho de documento */}
      <header className="border-b border-border pb-6 mb-8">
        <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-muted mb-2">
          Media Review · {partnerName}
        </p>
        <h1 className="font-serif text-3xl text-ink mb-2">
          {review.week_label}
        </h1>
        <p className="text-xs text-muted">
          Gerado autonomamente em{" "}
          {new Date(review.generated_at).toLocaleString("pt-BR")}
        </p>
      </header>

      {/* sumário executivo */}
      <Section title="Sumário executivo">
        <p className="font-serif text-lg text-ink leading-relaxed">
          {review.executive_summary}
        </p>
      </Section>

      {/* tabela de canais */}
      <Section title="Desempenho por canal">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b border-border">
              <tr className="text-left">
                <Th>Canal</Th>
                <Th>Spend</Th>
                <Th>Δ vs. ant.</Th>
                <Th>CVR</Th>
                <Th>ROAS</Th>
                <Th>Veredito</Th>
              </tr>
            </thead>
            <tbody>
              {review.channel_table.map((row, i) => (
                <tr key={i} className="border-b border-border/50">
                  <Td>{row.channel}</Td>
                  <Td>{row.spend}</Td>
                  <Td>{row.delta_vs_prev}</Td>
                  <Td>{row.cvr}</Td>
                  <Td>{row.roas}</Td>
                  <Td>
                    <span
                      className={
                        row.verdict === "winner"
                          ? "text-emerald-700"
                          : row.verdict === "loser"
                            ? "text-accent"
                            : "text-muted"
                      }
                    >
                      {VERDICT_LABEL[row.verdict]}
                    </span>
                  </Td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* gráfico de ROAS por canal */}
        <ChannelChart rows={review.channel_table} />
      </Section>

      {/* vencedor / ofensor */}
      <div className="grid sm:grid-cols-2 gap-4 mb-10">
        <div className="border border-border p-4">
          <p className="font-mono text-[10px] uppercase tracking-wider text-emerald-700 mb-2">
            Vencedor da semana
          </p>
          <p className="font-serif text-lg text-ink mb-1">
            {review.winner.headline}
          </p>
          <p className="text-sm text-muted">{review.winner.detail}</p>
        </div>
        <div className="border border-border p-4">
          <p className="font-mono text-[10px] uppercase tracking-wider text-accent mb-2">
            Ofensor da semana
          </p>
          <p className="font-serif text-lg text-ink mb-1">
            {review.loser.headline}
          </p>
          <p className="text-sm text-muted">{review.loser.detail}</p>
        </div>
      </div>

      {/* contexto externo */}
      <Section title="Contexto externo">
        <p className="text-ink leading-relaxed">{review.context}</p>
      </Section>

      {/* o que funcionou / não funcionou */}
      <Section title="O que funcionou · O que não funcionou">
        <ul className="space-y-3">
          {history.map((item, i) => (
            <li
              key={i}
              className="border border-border px-4 py-3 flex items-start gap-4"
            >
              <span
                className={`mt-0.5 w-2 h-2 rounded-full shrink-0 ${
                  item.verdict === "worked" ? "bg-emerald-600" : "bg-accent"
                }`}
              />
              <div className="flex-1">
                <p className="text-sm text-ink font-medium mb-0.5">
                  {item.what}
                </p>
                <p className="text-xs text-muted">{item.result}</p>
              </div>
              <span
                className={`font-mono text-[10px] uppercase tracking-wider shrink-0 mt-0.5 ${
                  item.verdict === "worked" ? "text-emerald-700" : "text-accent"
                }`}
              >
                {item.verdict === "worked" ? "funcionou" : "não funcionou"}
              </span>
            </li>
          ))}
        </ul>
      </Section>

      {/* o que mais vende por tipo de mídia */}
      <Section title="O que mais vende · por canal">
        <ul className="space-y-3">
          {topCreatives.map((c, i) => (
            <li
              key={i}
              className="border border-border px-4 py-3"
            >
              <div className="flex items-baseline gap-3 mb-1">
                <span className="font-serif text-2xl text-accent leading-none">
                  {i + 1}
                </span>
                <div>
                  <p className="font-mono text-[10px] uppercase tracking-wider text-muted">
                    {c.channel} · {c.format}
                  </p>
                  <p className="text-sm font-medium text-ink">{c.metric}</p>
                </div>
              </div>
              <p className="text-xs text-muted ml-8">{c.description}</p>
            </li>
          ))}
        </ul>
      </Section>

      {/* recomendações */}
      <Section title="Recomendações para próxima semana">
        <ol className="space-y-5">
          {review.recommendations.map((r, i) => (
            <li key={i}>
              <p className="font-serif text-lg text-ink mb-1">
                <span className="text-accent mr-2">{i + 1}.</span>
                {r.title}
              </p>
              <p className="text-sm text-muted mb-2">{r.detail}</p>
              {r.evidence.length > 0 && (
                <ul className="text-xs text-muted/90 space-y-0.5 pl-4 border-l border-border ml-2">
                  {r.evidence.map((e, j) => (
                    <li key={j}>
                      <span className="font-mono uppercase tracking-wider mr-1.5">
                        {e.kind}
                      </span>
                      <span className="font-medium text-ink">{e.label}</span>
                      <span className="text-muted"> · {e.detail}</span>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ol>
      </Section>

      {/* testes propostos */}
      <Section title="Testes propostos pelo Studio">
        <ul className="space-y-2">
          {review.proposed_tests.map((t, i) => (
            <li
              key={i}
              className="border border-border px-4 py-3 flex items-start gap-4"
            >
              <span className="font-serif text-2xl text-accent leading-none">
                {i + 1}
              </span>
              <div>
                <p className="text-ink text-sm font-medium">{t.hypothesis}</p>
                <p className="text-xs text-muted mt-0.5">
                  {t.channel} · lift esperado {t.expected_lift}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </Section>

      <footer className="border-t border-border pt-6 mt-10">
        <div className="flex items-center justify-between mb-4">
          <p className="text-xs text-muted">
            Tesouro · Plataforma multi-parceria · R2 Ventures
          </p>
          <button
            onClick={() => alert("X marca o local. · Review publicado no Notion da parceria")}
            className="px-3 py-1.5 text-sm border border-border text-ink hover:border-ink transition-colors"
          >
            Publicar no Notion
          </button>
        </div>
        <p className="text-[11px] text-muted/60 italic text-center">
          Para Indiana, Lara e quem mais decifra mapas.
        </p>
      </footer>
    </article>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mb-10">
      <h2 className="font-mono text-[10px] uppercase tracking-[0.25em] text-muted mb-3">
        {title}
      </h2>
      {children}
    </section>
  );
}

function Th({ children }: { children: React.ReactNode }) {
  return (
    <th className="py-2 pr-3 font-mono text-[10px] uppercase tracking-wider text-muted font-normal">
      {children}
    </th>
  );
}

function Td({ children }: { children: React.ReactNode }) {
  return <td className="py-2 pr-3 text-ink">{children}</td>;
}

function ChannelChart({ rows }: { rows: import("@/domain/review/types").ChannelLine[] }) {
  if (!rows.length) return null;

  // extrai número do ROAS ("3,4x" → 3.4)
  function parseRoas(s: string) {
    return parseFloat(s.replace(",", ".").replace("x", "")) || 0;
  }
  // extrai número do spend ("R$ 21,4k" → 21400 aprox)
  function parseSpend(s: string) {
    const n = parseFloat(s.replace(/[^0-9,]/g, "").replace(",", ".")) || 0;
    return s.toLowerCase().includes("k") ? n * 1000 : n;
  }

  const maxRoas  = Math.max(...rows.map((r) => parseRoas(r.roas)), 0.1);
  const maxSpend = Math.max(...rows.map((r) => parseSpend(r.spend)), 1);

  const VERDICT_COLOR = {
    winner: "bg-emerald-600",
    loser:  "bg-accent",
    watch:  "bg-muted/60",
  } as const;

  return (
    <div className="mt-6 pt-5 border-t border-border/60">
      <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted mb-4">
        Visualização · ROAS × Investimento por canal
      </p>

      {/* legenda */}
      <div className="flex items-center gap-5 mb-4">
        <Legend color="bg-accent"      label="Investimento" />
        <Legend color="bg-emerald-600" label="ROAS relativo" />
      </div>

      <div className="space-y-4">
        {rows.map((row) => {
          const roasPct  = (parseRoas(row.roas)   / maxRoas)  * 100;
          const spendPct = (parseSpend(row.spend) / maxSpend) * 100;
          const barColor = VERDICT_COLOR[row.verdict];

          return (
            <div key={row.channel}>
              <div className="flex items-baseline justify-between mb-1.5">
                <span className="text-sm text-ink">{row.channel}</span>
                <div className="flex items-center gap-3">
                  <span className="font-mono text-[10px] text-muted">{row.spend}</span>
                  <span className={`font-mono text-[10px] font-medium ${
                    row.verdict === "winner" ? "text-emerald-700" :
                    row.verdict === "loser"  ? "text-accent" : "text-muted"
                  }`}>
                    ROAS {row.roas}
                  </span>
                </div>
              </div>
              <div className="space-y-1">
                {/* barra spend */}
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-1.5 bg-border/40">
                    <div className="h-full bg-accent/70" style={{ width: `${spendPct}%` }} />
                  </div>
                </div>
                {/* barra ROAS */}
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-2 bg-border/40">
                    <div className={`h-full ${barColor} transition-all duration-700`} style={{ width: `${roasPct}%` }} />
                  </div>
                </div>
              </div>
              {row.note && (
                <p className="text-[11px] text-muted mt-1">{row.note}</p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function Legend({ color, label }: { color: string; label: string }) {
  return (
    <div className="flex items-center gap-1.5">
      <span className={`w-2 h-2 ${color} shrink-0`} />
      <span className="text-xs text-muted">{label}</span>
    </div>
  );
}
