import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";

export const metadata: Metadata = {
  title: "VectorSlope - Dashboard",
  description: "Análise de força de moedas",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body>
        <div className="site-container">
          <Navbar />
          {/* Aumentado o padding superior (pt-12) para descolar do menu */}
          <main className="pt-12 pb-12">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
