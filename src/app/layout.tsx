import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Tesouro · R2 Ventures",
  description: "Onde está o próximo dólar — cérebro de mídia da R2.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
