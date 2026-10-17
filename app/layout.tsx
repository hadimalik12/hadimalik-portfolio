import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/ui/theme-provider";
import { Analytics } from "@vercel/analytics/react";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL("https://hadimalik12.github.io/hadimalik-portfolio/"),
  alternates: {
    canonical: "https://hadimalik12.github.io/hadimalik-portfolio/",
  },
  title: "Hadi Malik",
  description:
    "Hadi Malik is a software engineer and Georgia Tech computer science student working across cloud infrastructure, machine learning, and security.",
  keywords:
    "",
  openGraph: {
    locale: "en_US",
    siteName: "Hadi Malik",
    type: "website",
    title: "Hadi Malik",
    description:
      "Hadi Malik is a software engineer and Georgia Tech computer science student working across cloud infrastructure, machine learning, and security.",
    url: "https://hadimalik12.github.io/hadimalik-portfolio/",
    images: [
      {
        url: "https://hadimalik12.github.io/hadimalik-portfolio/avatar.png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Hadi Malik",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
      </head>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Analytics />
        </ThemeProvider>
      </body>
    </html>
  );
}