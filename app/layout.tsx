import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/ui/theme-provider";
import { Analytics } from "@vercel/analytics/react";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL("https://hadimalik.com/"),
  alternates: {
    canonical: "https://hadimalik.com/",
  },
  title: "Hadi Malik · Index",
  description:
    "Studying computer science at Georgia Tech with a concentration in intelligence and cybersecurity. Interested in software engineering, machine learning engineering, and security engineering.",
  keywords:
    "",
  openGraph: {
    locale: "en_US",
    siteName: "Hadi Malik",
    type: "website",
    title: "Hadi Malik · Index",
    description:
      "Studying computer science at Georgia Tech with a concentration in intelligence and cybersecurity. Interested in software engineering, machine learning engineering, and security engineering.",
    url: "https://hadimalik.com/",
  },
  twitter: {
    card: "summary_large_image",
    title: "Hadi Malik · Index",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth" suppressHydrationWarning>
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
