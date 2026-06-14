import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "Amarsh | AI Engineer & Strategist",
  description: "Portfolio of Amarsh - Senior AI Engineer specializing in Agentic Systems, LLMs, and Enterprise AI. Based in Hyderabad.",
  keywords: ["AI Engineer", "LLM", "Agentic AI", "OpenText", "Portfolio", "Amarsh"],
  openGraph: {
    title: "Amarsh | AI Engineer",
    description: "Building intelligent systems that scale.",
    url: "https://amarsh.dev", // Placeholder
    siteName: "Amarsh Portfolio",
    locale: "en_US",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={cn(inter.variable, "font-sans antialiased bg-background text-foreground min-h-screen")}>
        {children}
      </body>
    </html>
  );
}
