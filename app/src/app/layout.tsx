import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "VectorSlope - Currency Strength Analyzer",
  description: "Analise a força das moedas e encontre a moeda da vez com base nos padrões do Bonoto",
  keywords: ["forex", "currency strength", "trading", "MFC", "análise técnica"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className={inter.className}>
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900">
          <Navbar />
          <main className="p-6">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
