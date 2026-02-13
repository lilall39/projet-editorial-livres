import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Pilotage projet éditorial",
  description: "Planning et suivi du projet éditorial",
  viewport: "width=device-width, initial-scale=1",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body className="min-h-screen antialiased">
        {children}
      </body>
    </html>
  );
}
