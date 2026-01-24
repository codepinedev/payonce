import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { ToolsDirectory } from "@/components/tools-directory";
import { getAllTools } from "@/lib/tools";

export const metadata = {
  title: "Browse Tools - PayOnce",
  description: "One-time purchase software tools. No subscriptions.",
};

export default async function ToolsPage() {
  const tools = await getAllTools();

  return (
    <>
      <Header />
      <main className="mx-auto max-w-4xl px-4 py-8">
        <h1 className="mb-6 text-xl font-bold">All Tools</h1>
        <ToolsDirectory initialTools={tools} />
      </main>
      <Footer />
    </>
  );
}
