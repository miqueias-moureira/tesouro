/**
 * DOMAIN — Partner
 *
 * Uma parceria (tenant) da R2 que tem Tesouro plugado.
 * Multi-tenant é o conceito central da plataforma.
 */

export type SourceKey =
  | "meta"
  | "google"
  | "tiktok"
  | "microsoft"
  | "affiliates"
  | "organic"
  | "tracr"
  | "newrelic"
  | "engage"
  | "market"
  | "earned_media"
  | "competitor"
  | "deploys"
  | "design";

export type AlertSeverity = "info" | "opportunity" | "risk";
export type AlertKind =
  | "creative"
  | "deploy"
  | "earned_media"
  | "market"
  | "journey";

export interface Alert {
  id: string;
  kind: AlertKind;
  severity: AlertSeverity;
  title: string;
  at: string; // ISO
}

export interface PartnerDelivery {
  slack_channel: string;
  notion_database: string;
  review_schedule: string;
}

export interface Partner {
  slug: string;
  name: string;
  vertical: string;
  sources: Record<SourceKey, boolean>;
  delivery: PartnerDelivery;
  next_review_at: string;
  alerts: Alert[];
}
