import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Hero } from "@/components/hero";
import { FeaturedSection } from "@/components/featured-section";
import { getFeaturedTools, getToolCount } from "@/lib/tools";

export default async function HomePage() {
  const [featuredTools, toolCount] = await Promise.all([
    getFeaturedTools(),
    getToolCount(),
  ]);

  return (
    <>
      <Header />
      <main className="mx-auto max-w-4xl px-4">
        <Hero toolCount={toolCount} />
        <FeaturedSection tools={featuredTools} />
      </main>
      <Footer />
    </>
  );
}
