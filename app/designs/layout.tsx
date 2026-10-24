import type { Metadata } from "next";
import "./designs.css";

export const metadata: Metadata = {
  title: "Layout explorations · Hadi Malik",
  robots: { index: false, follow: false },
};

export default function DesignsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
