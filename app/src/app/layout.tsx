import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "VectorSlope - Currency Strength Analyzer",
  description: "Analise a força das moedas e encontre a moeda da vez com base nos padrões do Bonoto",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className={inter.className}>
        {/* Fundo Gradiente Ocupando Tudo */}
        <div className="min-h-screen bg-gradient-to-br from-[#0b1c3d] via-[#050b1e] to-[#040914] flex flex-col items-center">

          {/* Container que limita a largura e centraliza */}
          <div className="w-full max-w-[1400px] flex flex-col">
            <Navbar />
            <main className="p-4 md:p-6 w-full">
              {children}
            </main>
          </div>

        </div>
      </body>
    </html>
  );
}
