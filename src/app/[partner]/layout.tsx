import { notFound } from "next/navigation";
import { JsonPartnerRepository } from "@/infrastructure/partners/repository";
import { PartnerHeader } from "@/presentation/components/partner/header";

export default async function PartnerLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { partner: string };
}) {
  const repo = new JsonPartnerRepository();
  const partner = await repo.findBySlug(params.partner);
  if (!partner) notFound();

  return (
    <div className="min-h-screen flex flex-col">
      <PartnerHeader partner={partner} />
      <main className="flex-1">{children}</main>
    </div>
  );
}
