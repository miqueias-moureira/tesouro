"use client";

import { useState } from "react";

type Period = "7d" | "14d";

const DATA: Record<
  Period,
  { label: string; spend: number; revenue: number; roas: number; trend: "up" | "flat" | "down" }[]
> = {
  "7d": [
    { label: "Google Search", spend: 28400, revenue: 68160, roas: 2.4, trend: "down" },
    { label: "Meta Reels",    spend: 21450, revenue: 72930, roas: 3.4, trend: "up"   },
    { label: "Meta Feed",     spend: 14200, revenue: 29820, roas: 2.1, trend: "flat" },
    { label: "Google PMax",   spend:  9800, revenue: 40180, roas: 4.1, trend: "flat" },
    { label: "Meta Stories",  spend:  6800, revenue:  8160, roas: 1.2, trend: "down" },
  ],
  "14d": [
    { label: "Google Search", spend: 61200, revenue: 146880, roas: 2.4, trend: "down" },
    { label: "Meta Reels",    spend: 38900, revenue: 132260, roas: 3.4, trend: "up"   },
    { label: "Meta Feed",     spend: 27800, revenue:  58380, roas: 2.1, trend: "flat" },
    { label: "Google PMax",   spend: 18400, revenue:  75440, roas: 4.1, trend: "flat" },
    { label: "Meta Stories",  spend: 12100, revenue:  14520, roas: 1.2, trend: "down" },
  ],
};

const TREND = {
  up:   { symbol: "↑", cls: "text-emerald-600" },
  flat: { symbol: "→", cls: "text-muted"       },
  down: { symbol: "↓", cls: "text-accent"      },
};

function fmt(n: number) {
  return n >= 1000 ? `R$ ${(n / 1000).toFixed(1)}k` : `R$ ${n}`;
}

export function InvestmentChart() {
  const [period, setPeriod] = useState<Period>("7d");
  const channels = DATA[period];
  const maxVal = Math.max(...channels.flatMap((c) => [c.spend, c.revenue]));

  const totalSpend   = channels.reduce((s, c) => s + c.spend, 0);
  const totalRevenue = channels.reduce((s, c) => s + c.revenue, 0);
  const avgRoas      = (totalRevenue / totalSpend).toFixed(1);

  return (
    <div className="border border-border bg-surface p-5">
      {/* header */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted mb-2">
            Investimento × Receita
          </p>
          <div className="flex items-center gap-4">
            <Legend color="bg-accent"       label="Investimento" />
            <Legend color="bg-emerald-600"  label="Receita est." />
          </div>
        </div>
        <div className="flex border border-border">
          {(["7d", "14d"] as const).map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`px-3 py-1 font-mono text-[10px] uppercase tracking-wider transition-colors ${
                period === p
                  ? "bg-ink text-bg"
                  : "text-muted hover:text-ink"
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* bars */}
      <div className="space-y-4">
        {channels.map((c) => {
          const spendPct = (c.spend   / maxVal) * 100;
          const revPct   = (c.revenue / maxVal) * 100;
          const t = TREND[c.trend];
          return (
            <div key={c.label}>
              <div className="flex items-baseline justify-between mb-1.5">
                <div className="flex items-center gap-1.5">
                  <span className={`font-mono text-[11px] ${t.cls}`}>{t.symbol}</span>
                  <span className="text-sm text-ink">{c.label}</span>
                </div>
                <span className="font-mono text-[10px] text-muted">
                  ROAS {c.roas}x
                </span>
              </div>

              <div className="space-y-1">
                <Bar pct={spendPct} color="bg-accent"      value={fmt(c.spend)}   />
                <Bar pct={revPct}   color="bg-emerald-600" value={fmt(c.revenue)} />
              </div>
            </div>
          );
        })}
      </div>

      {/* totals */}
      <div className="mt-6 pt-4 border-t border-border grid grid-cols-3 gap-4">
        <Stat label="Total investido"    value={fmt(totalSpend)}   />
        <Stat label="Receita estimada"   value={fmt(totalRevenue)} valueClass="text-emerald-700" />
        <Stat label="ROAS médio"         value={`${avgRoas}x`}     />
      </div>
    </div>
  );
}

function Bar({ pct, color, value }: { pct: number; color: string; value: string }) {
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-1.5 bg-border/40">
        <div
          className={`h-full ${color} transition-all duration-500`}
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="font-mono text-[10px] text-muted w-16 text-right shrink-0">
        {value}
      </span>
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

function Stat({
  label,
  value,
  valueClass = "text-ink",
}: {
  label: string;
  value: string;
  valueClass?: string;
}) {
  return (
    <div>
      <p className="font-mono text-[10px] uppercase tracking-wider text-muted mb-0.5">
        {label}
      </p>
      <p className={`font-serif text-lg ${valueClass}`}>{value}</p>
    </div>
  );
}
