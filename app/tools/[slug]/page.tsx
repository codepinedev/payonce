import Link from "next/link";
import { notFound } from "next/navigation";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { PriceCard } from "@/components/price-card";
import { PricingDisclaimer } from "@/components/pricing-disclaimer";
import { getToolBySlug, getAllTools } from "@/lib/tools";

interface ToolPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const tools = await getAllTools();
  return tools.map((tool) => ({ slug: tool.slug }));
}

export async function generateMetadata({ params }: ToolPageProps) {
  const { slug } = await params;
  const tool = await getToolBySlug(slug);
  if (!tool) return { title: "Not Found - PayOnce" };
  return {
    title: `${tool.name} - PayOnce`,
    description: tool.description,
  };
}

export default async function ToolPage({ params }: ToolPageProps) {
  const { slug } = await params;
  const tool = await getToolBySlug(slug);

  if (!tool) {
    notFound();
  }

  return (
    <>
      <Header />
      <main className="mx-auto max-w-2xl px-4 py-8">
        <Link
          href="/tools"
          className="mb-6 inline-block text-sm text-muted-foreground hover:text-foreground"
        >
          ← Back
        </Link>

        <h1 className="text-xl font-bold">{tool.name}</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {tool.category} · {tool.platform}
        </p>

        <div className="my-6">
          <PriceCard price={tool.price} url={tool.url} />
        </div>

        <p className="text-sm text-muted-foreground">
          {tool.fullDescription || tool.description}
        </p>

        <div className="mt-6">
          <PricingDisclaimer />
        </div>
      </main>
      <Footer />
    </>
  );
}
