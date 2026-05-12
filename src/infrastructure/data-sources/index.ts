/**
 * INFRASTRUCTURE — Data sources (mock)
 *
 * Aqui é onde, no v2, vão entrar os fetches reais para Meta Marketing
 * API, Google Ads API, etc. No MVP, são leituras síncronas de JSON.
 *
 * Como você é Go: pense nessas funções como métodos de um repositório
 * concreto que satisfaz uma interface (a "tool").
 */

import metaAds from "@/data/meta-ads.json";
import googleAds from "@/data/google-ads.json";
import tracrEvents from "@/data/tracr-events.json";
import deploys from "@/data/deploys.json";
import market from "@/data/market.json";

type ToolName =
  | "read_meta_ads"
  | "read_google_ads"
  | "read_journey"
  | "read_deploys"
  | "read_market";

const DATA: Record<ToolName, unknown> = {
  read_meta_ads: metaAds,
  read_google_ads: googleAds,
  read_journey: tracrEvents,
  read_deploys: deploys,
  read_market: market,
};

export function runTool(name: string): string {
  const data = DATA[name as ToolName];
  if (!data) {
    return JSON.stringify({ error: `tool desconhecida: ${name}` });
  }
  return JSON.stringify(data);
}
