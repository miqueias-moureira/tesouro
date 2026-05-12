"use client";

import Link from "next/link";
import { useState } from "react";

type ActivePillar = "allocator" | "studio" | "review" | null;

const REVIEW_CHANNELS = [
  { channel: "Meta Reels",    spend: "R$ 21,4k", cvr: "8,7%", roas: "3,4x", delta: "+12%", verdict: "winner" as const },
  { channel: "Google Search", spend: "R$ 28,4k", cvr: "6,2%", roas: "2,4x", delta: "−18%", verdict: "loser"  as const },
  { channel: "Google PMax",   spend: "R$  9,8k", cvr: "8,9%", roas: "4,1x", delta:  "+3%", verdict: "watch"  as const },
  { channel: "Meta Feed",     spend: "R$ 14,2k", cvr: "4,1%", roas: "2,1x", delta:  "−7%", verdict: "watch"  as const },
];

const VERDICT = {
  winner: { dot: "bg-emerald-600", label: "vencedor", text: "text-emerald-700" },
  loser:  { dot: "bg-accent",      label: "ofensor",  text: "text-accent"      },
  watch:  { dot: "bg-muted",       label: "atenção",  text: "text-muted"       },
};

export default function LandingPage() {
  const [active, setActive] = useState<ActivePillar>(null);

  function toggle(p: ActivePillar) {
    setActive((prev) => (prev === p ? null : p));
  }

  return (
    <main className="min-h-screen">
      <header className="border-b border-border">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-accent" />
            <span className="font-serif text-lg text-ink">Tesouro</span>
            <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted ml-2 hidden sm:inline">
              R2 Ventures
            </span>
          </div>
          <Link href="/login" className="text-sm text-muted hover:text-ink transition-colors">
            Entrar
          </Link>
        </div>
      </header>

      <section className="max-w-3xl mx-auto px-6 py-12 sm:py-16 text-center">
        <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-muted mb-8">
          Plataforma multi-parceria · Cérebro de mídia
        </p>
        <h1 className="font-serif text-5xl sm:text-6xl text-ink leading-tight mb-6">
          Onde está o<br />
          <span className="italic text-accent">próximo dólar.</span>
        </h1>
        <p className="text-lg text-muted max-w-xl mx-auto leading-relaxed">
          Cada parceria pluga suas fontes uma vez. O Tesouro opera com três ferramentas: Allocator, Studio e Review, que cruzam dados de criativos, jornadas, deploys e mercado sem precisar de intervenção manual.
        </p>

        <div className="mt-12 flex items-center justify-center gap-3">
          <Link
            href="/jeitto"
            className="px-6 py-3 bg-ink text-bg hover:bg-accent transition-colors text-sm"
          >
            Ver demo · Jeitto
          </Link>
        </div>
      </section>

      {/* pilares clicáveis */}
      <section className="max-w-4xl mx-auto px-6 pb-6 grid sm:grid-cols-3 gap-4">
        <Pillar
          tag="Allocator"
          title="Onde investir o próximo R$?"
          body="Pergunta on-demand. Master orquestra os especialistas em paralelo e devolve a recomendação cruzada com evidência citada."
          active={active === "allocator"}
          onClick={() => toggle("allocator")}
        />
        <Pillar
          tag="Studio"
          title="Crie o próximo criativo."
          body="Brief baseado em padrões históricos que vencem. Spec, headline, instruções e métrica esperada."
          active={active === "studio"}
          onClick={() => toggle("studio")}
        />
        <Pillar
          tag="Review"
          title="Doc semanal pra parceiro."
          body="Toda sexta às 10h, Media Review completo gerado e publicado no Notion da parceria. Não é chat — é artefato."
          active={active === "review"}
          onClick={() => toggle("review")}
        />
      </section>

      {/* preview expandido */}
      {active === "review" && (
        <section className="max-w-4xl mx-auto px-6 pb-12">
          <div className="border border-border bg-surface p-6">
            {/* cabeçalho do preview */}
            <div className="flex items-center justify-between mb-5">
              <div>
                <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-muted mb-1">
                  Media Review · Jeitto · Semana 19
                </p>
                <p className="font-serif text-xl text-ink">
                  Compilando os achados da semana…
                </p>
              </div>
              <span className="font-mono text-[10px] text-accent uppercase tracking-wider">
                Amostra
              </span>
            </div>

            {/* tabela de canais */}
            <div className="overflow-x-auto mb-6">
              <table className="w-full text-sm">
                <thead className="border-b border-border">
                  <tr className="text-left">
                    {["Canal", "Spend", "Δ vs. ant.", "CVR", "ROAS", ""].map((h) => (
                      <th
                        key={h}
                        className="py-2 pr-4 font-mono text-[10px] uppercase tracking-wider text-muted font-normal"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {REVIEW_CHANNELS.map((row) => {
                    const v = VERDICT[row.verdict];
                    return (
                      <tr key={row.channel} className="border-b border-border/40">
                        <td className="py-2.5 pr-4 text-ink">{row.channel}</td>
                        <td className="py-2.5 pr-4 text-ink font-mono text-xs">{row.spend}</td>
                        <td className={`py-2.5 pr-4 font-mono text-xs ${row.delta.startsWith("−") ? "text-accent" : "text-emerald-700"}`}>
                          {row.delta}
                        </td>
                        <td className="py-2.5 pr-4 text-ink font-mono text-xs">{row.cvr}</td>
                        <td className="py-2.5 pr-4 text-ink font-mono text-xs">{row.roas}</td>
                        <td className="py-2.5">
                          <span className={`flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-wider ${v.text}`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${v.dot}`} />
                            {v.label}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* barras de ROAS */}
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted mb-3">
              ROAS por canal
            </p>
            <div className="space-y-2 mb-6">
              {REVIEW_CHANNELS.map((c) => {
                const roas = parseFloat(c.roas);
                const pct = (roas / 4.1) * 100;
                const v = VERDICT[c.verdict];
                return (
                  <div key={c.channel} className="flex items-center gap-3">
                    <span className="text-xs text-muted w-28 shrink-0">{c.channel}</span>
                    <div className="flex-1 h-1.5 bg-border/40">
                      <div
                        className={`h-full transition-all duration-700 ${
                          c.verdict === "winner" ? "bg-emerald-600" : c.verdict === "loser" ? "bg-accent" : "bg-muted"
                        }`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <span className={`font-mono text-xs ${v.text} w-10 text-right shrink-0`}>
                      {c.roas}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* recomendações */}
            <div className="border-t border-border pt-5">
              <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted mb-3">
                3 recomendações geradas
              </p>
              <ol className="space-y-2">
                {[
                  "Redistribuir R$ 12k/dia de Google Search Genérico para Meta Reels — ROAS estimado: 2,4x → 3,4x.",
                  "Reverter copy do form mobile ao estado pré-v3.2 ou criar variante A/B enquanto investiga queda.",
                  "Manter Google PMax Brand estável — branded subindo com mídia espontânea (Valor Econômico, 11/05).",
                ].map((rec, i) => (
                  <li key={i} className="flex gap-3 text-sm text-ink">
                    <span className="font-serif text-lg text-accent leading-none mt-0.5 shrink-0">{i + 1}.</span>
                    {rec}
                  </li>
                ))}
              </ol>
            </div>

            <div className="mt-5 pt-4 border-t border-border flex items-center justify-between">
              <p className="text-xs text-muted italic">
                Gerado autonomamente · toda sexta 10h
              </p>
              <Link
                href="/jeitto/reviews"
                className="px-3 py-1.5 text-sm bg-ink text-bg hover:bg-accent transition-colors"
              >
                Gerar Review completo →
              </Link>
            </div>
          </div>
        </section>
      )}

      <footer className="border-t border-border">
        <div className="max-w-5xl mx-auto px-6 py-6 text-xs text-muted flex items-center justify-between">
          <span>R2 Ventures · Hackathon HACK-26</span>
          <span className="italic">Para Indiana, Lara e quem mais decifra mapas.</span>
        </div>
      </footer>
    </main>
  );
}

function Pillar({
  tag,
  title,
  body,
  active,
  onClick,
}: {
  tag: string;
  title: string;
  body: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`text-left w-full border p-5 transition-colors ${
        active ? "border-ink bg-surface" : "border-border bg-surface hover:border-ink"
      }`}
    >
      <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-accent mb-3">
        {tag}
        {active && <span className="ml-2 text-muted">▲</span>}
        {!active && <span className="ml-2 text-muted/40">▼</span>}
      </p>
      <h3 className="font-serif text-xl text-ink mb-2 leading-snug">{title}</h3>
      <p className="text-sm text-muted leading-relaxed">{body}</p>
    </button>
  );
}
