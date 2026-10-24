import { notFound } from "next/navigation";
import PortfolioDesign, { variants, type Variant } from "@/components/designs/PortfolioDesign";

export function generateStaticParams() {
  return variants.map(({ id }) => ({ layout: id }));
}

export default function DesignPage({ params }: { params: { layout: string } }) {
  if (!variants.some(({ id }) => id === params.layout)) notFound();
  return <PortfolioDesign variant={params.layout as Variant} />;
}
