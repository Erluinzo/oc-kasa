import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Kasa",
  description: "Location d'appartements et de maisons entre particuliers.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  );
}
