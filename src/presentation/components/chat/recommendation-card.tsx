"use client";

import type { Recommendation, Evidence } from "@/domain/conversation/types";

interface Props {
  recommendation: Recommendation;
}

// Dados do cenário Jeitto — atual vs sugerido pelo Master
const BUDGET_ROWS = [
  { channel: "Meta Reels",    atual: 21450, sugerido: 33450, trend: "up"   as const },
  { channel: "Google Search", atual: 28400, sugerido: 16400, trend: "down" as const },
  { channel: "Meta Feed",     atual: 14200, sugerido: 14200, trend: "flat" as const },
  { channel: "Google PMax",   atual:  9800, sugerido:  9800, trend: "flat" as const },
  { channel: "Meta Stories",  atual:  6800, sugerido:  6800, trend: "flat" as const },
];

const MAX_VAL = Math.max(...BUDGET_ROWS.flatMap((r) => [r.atual, r.sugerido]));

function fmt(n: number) {
  return `R$ ${(n / 1000).toFixed(1)}k`;
}

export function RecommendationCard({ recommendation }: Props) {
  return (
    <article className="bg-surface border border-border">
      {/* faixa superior */}
      <div className="px-6 py-2.5 border-b border-border flex items-center justify-between">
        <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted">
          Mapa atualizado
        </span>
        <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-accent">
          Tesouro encontrado
        </span>
      </div>

      {/* headline */}
      <div className="px-6 pt-6 pb-4">
        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted mb-3">
          Recomendação
        </p>
        <h2 className="font-serif text-2xl text-ink leading-snug">
          {recommendation.headline}
        </h2>
      </div>

      {/* rationale */}
      <div className="px-6 pb-5 text-ink/85 leading-relaxed">
        {recommendation.rationale}
      </div>

      {/* gráfico budget atual vs sugerido */}
      <div className="px-6 py-5 border-t border-border">
        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted mb-4">
          Budget · atual vs. sugerido
        </p>

        {/* legenda */}
        <div className="flex items-center gap-5 mb-4">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 bg-stone-400 inline-block" />
            <span className="text-xs text-muted">Atual</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 bg-emerald-600 inline-block" />
            <span className="text-xs text-muted">Sugerido · aumentar</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 bg-accent inline-block" />
            <span className="text-xs text-muted">Sugerido · diminuir</span>
          </div>
        </div>

        <div className="space-y-4">
          {[...BUDGET_ROWS].sort((a, b) => Math.abs(b.sugerido - b.atual) - Math.abs(a.sugerido - a.atual)).map((row) => {
            const atualPct    = (row.atual    / MAX_VAL) * 100;
            const sugeridoPct = (row.sugerido / MAX_VAL) * 100;
            const delta       = row.sugerido - row.atual;
            const deltaLabel  = delta === 0
              ? "="
              : delta > 0
                ? `+${fmt(delta)}`
                : `−${fmt(Math.abs(delta))}`;
            const deltaColor  = delta > 0
              ? "text-emerald-600"
              : delta < 0
                ? "text-accent"
                : "text-muted";

            return (
              <div key={row.channel}>
                <div className="flex items-baseline justify-between mb-1.5">
                  <span className="text-sm text-ink">{row.channel}</span>
                  <span className={`font-mono text-[10px] font-medium ${deltaColor}`}>
                    {deltaLabel}
                  </span>
                </div>
                <div className="space-y-1">
                  {/* barra atual */}
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-1.5 bg-stone-100">
                      <div
                        className="h-full bg-stone-400 transition-all duration-500"
                        style={{ width: `${atualPct}%` }}
                      />
                    </div>
                    <span className="font-mono text-[10px] text-muted w-16 text-right shrink-0">
                      {fmt(row.atual)}
                    </span>
                  </div>
                  {/* barra sugerida */}
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-2 bg-stone-100">
                      <div
                        className={`h-full transition-all duration-700 ${
                          delta > 0 ? "bg-emerald-600" :
                          delta < 0 ? "bg-accent"      :
                          "bg-stone-400"
                        }`}
                        style={{ width: `${sugeridoPct}%` }}
                      />
                    </div>
                    <span className="font-mono text-[10px] text-muted w-16 text-right shrink-0">
                      {fmt(row.sugerido)}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 3 pistas cruzadas */}
      <div className="px-6 py-5 border-t border-border bg-bg/40">
        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted mb-4">
          3 pistas cruzadas
        </p>
        <ol className="space-y-3">
          {recommendation.evidence.map((e, i) => (
            <EvidenceItem key={i} index={i + 1} evidence={e} />
          ))}
        </ol>
      </div>

      {/* ações */}
      <div className="px-6 py-4 border-t border-border flex flex-wrap gap-2">
        {recommendation.actions.map((a) => (
          <button
            key={a.id}
            onClick={() => alert(`X marca o local. · ${a.label} executado.`)}
            className="px-3 py-1.5 text-sm border border-border text-ink hover:border-ink transition-colors"
          >
            {a.label}
          </button>
        ))}
      </div>
    </article>
  );
}

function EvidenceItem({ index, evidence }: { index: number; evidence: Evidence }) {
  return (
    <li className="flex gap-4">
      <span className="font-serif text-2xl text-accent leading-none mt-0.5 select-none">
        {index}
      </span>
      <div className="flex-1 pt-1">
        <p className="text-sm text-ink">
          <span className="font-mono text-[10px] uppercase tracking-wider text-muted mr-2">
            {evidence.kind}
          </span>
          <span className="font-medium">{evidence.label}</span>
        </p>
        <p className="text-sm text-muted mt-0.5">{evidence.detail}</p>
      </div>
    </li>
  );
}
