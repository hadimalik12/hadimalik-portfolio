import type { Metadata } from "next";
import SignalPortfolio from "@/components/designs/SignalPortfolio";
import "@fontsource/roboto-mono/latin-300.css";
import "./signal.css";

export const metadata: Metadata = {
  title: "Hadi Malik · Index",
  description: "Hadi Malik's experience, projects, and education in a minimal interactive index.",
};

export default function SignalPage() {
  return <SignalPortfolio />;
}
