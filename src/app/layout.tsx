import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Context } from "@/lib/context";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "LibraryWare",
  description: "Bibliotheque moderne",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body className={inter.className}>
        <Context>{children}</Context>
      </body>
    </html>
  );
}
