/**
 * INFRASTRUCTURE — PartnerRepository (JSON)
 *
 * No MVP, partners ficam em /partners/*.json (commitado).
 * Em produção: Postgres + onboarding self-service.
 */

import type { Partner } from "@/domain/partners/types";
import jeitto from "@/partners/jeitto.json";

const PARTNERS: Record<string, Partner> = {
  jeitto: jeitto as Partner,
};

export class JsonPartnerRepository {
  async findBySlug(slug: string): Promise<Partner | null> {
    return PARTNERS[slug.toLowerCase()] ?? null;
  }

  async list(): Promise<Partner[]> {
    return Object.values(PARTNERS);
  }
}
