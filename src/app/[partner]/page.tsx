import Link from "next/link";
import { notFound } from "next/navigation";
import { JsonPartnerRepository } from "@/infrastructure/partners/repository";
import { InvestmentChart } from "@/presentation/components/partner/investment-chart";
import type {
  Alert,
  AlertSeverity,
  Partner,
  SourceKey,
} from "@/domain/partners/types";

const SOURCE_LABELS: Record<SourceKey, string> = {
  meta: "Meta Ads",
  google: "Google Ads",
  tiktok: "TikTok Ads",
  microsoft: "Microsoft Ads",
  affiliates: "Afiliados",
  organic: "Orgânico/SEO",
  tracr: "Tracr",
  newrelic: "New Relic",
  engage: "Engage (CRM)",
  market: "Mercado",
  earned_media: "Mídia espontânea",
  competitor: "Competidor",
  deploys: "Deploys",
  design: "Design",
};

const INSIGHT_CARDS = [
  {
    tag: "Allocator",
    href: "/allocator",
    label: "oportunidade",
    dot: "bg-emerald-600",
    title: "Reels supera Search em CVR",
    detail:
      "Redistribuir R$ 12k/dia de Search Brand para Meta Reels pode elevar CVR de 6,1% para ~8,7%.",
  },
  {
    tag: "Studio",
    href: "/studio",
    label: "novo brief",
    dot: "bg-accent",
    title: "Casal jovem 9:16 · padrão vencedor",
    detail:
      "Hook emocional nos primeiros 2s, aprovação instantânea como gancho. Lift esperado +32% CVR vs. Feed estático.",
  },
  {
    tag: "Review",
    href: "/reviews",
    label: "semana 19",
    dot: "bg-muted",
    title: "Vencedor: Reels +47% · Ofensor: Search −18%",
    detail:
      "Deploy v3.2 alterou copy do form mobile e derrubou CTR. Mídia espontânea (Valor Econômico) sustentou brand.",
  },
];

export default async function PartnerHome({
  params,
}: {
  params: { partner: string };
}) {
  const repo = new JsonPartnerRepository();
  const partner = await repo.findBySlug(params.partner);
  if (!partner) notFound();

  const activeSources = (Object.keys(partner.sources) as SourceKey[]).filter(
    (k) => partner.sources[k]
  );

  return (
    <div className="max-w-5xl mx-auto px-6 py-10 sm:py-14">
      {/* hero */}
      <div className="flex items-start justify-between mb-10">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-muted mb-3">
            {partner.vertical}
          </p>
          <h1 className="font-serif text-4xl text-ink mb-3">{partner.name}</h1>
          <p className="text-muted flex items-center gap-2 text-sm">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
            Sistema rodando · {activeSources.length} fontes plugadas
          </p>
        </div>
        <div className="hidden sm:flex gap-2">
          <Link
            href={`/${partner.slug}/allocator`}
            className="px-3 py-1.5 text-sm bg-ink text-bg hover:bg-accent transition-colors"
          >
            Perguntar
          </Link>
          <Link
            href={`/${partner.slug}/studio`}
            className="px-3 py-1.5 text-sm border border-border text-ink hover:border-ink transition-colors"
          >
            Studio
          </Link>
        </div>
      </div>

      {/* insight cards — Allocator / Studio / Review */}
      <div className="grid sm:grid-cols-3 gap-4 mb-10">
        {INSIGHT_CARDS.map((card) => (
          <Link
            key={card.tag}
            href={`/${partner.slug}${card.href}`}
            className="border border-border bg-surface p-4 hover:border-ink transition-colors group block"
          >
            <div className="flex items-center gap-2 mb-2">
              <span className={`w-1.5 h-1.5 rounded-full ${card.dot}`} />
              <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted">
                {card.tag}
              </span>
              <span className="font-mono text-[10px] text-muted/60 ml-auto">
                {card.label}
              </span>
            </div>
            <p className="font-serif text-base text-ink mb-1 leading-snug">
              {card.title}
            </p>
            <p className="text-xs text-muted leading-relaxed">{card.detail}</p>
            <p className="text-xs text-muted/60 mt-3 group-hover:text-accent transition-colors">
              Ver detalhes →
            </p>
          </Link>
        ))}
      </div>

      {/* gráfico investimento × receita */}
      <div className="mb-10">
        <SectionHeading tag="Investimento × Receita · por canal" />
        <InvestmentChart />
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* alertas — coluna principal */}
        <section className="lg:col-span-2">
          <SectionHeading
            tag="Alertas recentes"
            note={`${partner.alerts.length} eventos`}
          />
          <ul className="space-y-3">
            {partner.alerts.map((a) => (
              <AlertRow key={a.id} alert={a} partnerSlug={partner.slug} />
            ))}
          </ul>
        </section>

        {/* lateral */}
        <aside className="space-y-8">
          <section>
            <SectionHeading tag="Próximo Review" />
            <div className="border border-border bg-surface p-4">
              <p className="font-mono text-[10px] uppercase tracking-wider text-accent mb-1">
                {partner.delivery.review_schedule}
              </p>
              <p className="font-serif text-lg text-ink mb-2">
                Media Review · Semana 19
              </p>
              <p className="text-xs text-muted mb-3">
                Será publicado em {partner.delivery.notion_database}.
              </p>
              <Link
                href={`/${partner.slug}/reviews`}
                className="text-xs text-ink underline hover:text-accent"
              >
                Ver últimos Reviews →
              </Link>
            </div>
          </section>

          <section>
            <SectionHeading tag="Fontes plugadas" />
            <ul className="space-y-1.5">
              {activeSources.map((s) => (
                <li
                  key={s}
                  className="flex items-center gap-2 text-sm text-ink"
                >
                  <span className="inline-block w-1 h-1 rounded-full bg-emerald-600" />
                  {SOURCE_LABELS[s]}
                </li>
              ))}
            </ul>
            <p className="text-[11px] text-muted mt-3">
              Outras fontes (TikTok, Microsoft, Engage…) disponíveis no
              onboarding.
            </p>
          </section>

          <section>
            <SectionHeading tag="Entrega" />
            <ul className="space-y-1 text-xs text-muted">
              <li>Slack · {partner.delivery.slack_channel}</li>
              <li>Notion · {partner.delivery.notion_database}</li>
            </ul>
          </section>
        </aside>
      </div>
    </div>
  );
}

function SectionHeading({ tag, note }: { tag: string; note?: string }) {
  return (
    <div className="flex items-baseline justify-between mb-3">
      <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted">
        {tag}
      </p>
      {note && (
        <p className="font-mono text-[10px] uppercase tracking-wider text-muted">
          {note}
        </p>
      )}
    </div>
  );
}

const SEVERITY_STYLES: Record<
  AlertSeverity,
  { dot: string; label: string }
> = {
  info: { dot: "bg-muted", label: "info" },
  opportunity: { dot: "bg-emerald-600", label: "oportunidade" },
  risk: { dot: "bg-accent", label: "risco" },
};

function AlertRow({
  alert,
  partnerSlug,
}: {
  alert: Alert;
  partnerSlug: string;
}) {
  const sev = SEVERITY_STYLES[alert.severity];
  return (
    <li className="border border-border bg-surface px-4 py-3 flex items-start gap-3 hover:border-ink transition-colors">
      <span className={`mt-1.5 w-1.5 h-1.5 rounded-full ${sev.dot}`} />
      <div className="flex-1 min-w-0">
        <div className="flex items-baseline gap-2 mb-0.5">
          <span className="font-mono text-[10px] uppercase tracking-wider text-muted">
            {sev.label}
          </span>
          <span className="font-mono text-[10px] text-muted/70">
            {formatDate(alert.at)}
          </span>
        </div>
        <p className="text-ink leading-snug">{alert.title}</p>
      </div>
      <Link
        href={`/${partnerSlug}/allocator?q=${encodeURIComponent(alert.title)}`}
        className="text-xs text-muted hover:text-accent shrink-0 mt-1"
      >
        Investigar →
      </Link>
    </li>
  );
}

function formatDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}
