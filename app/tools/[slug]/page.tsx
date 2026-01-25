import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  AppleIcon,
  WindowsNewIcon,
  GlobalIcon,
  CommandLineIcon,
  SmartPhone01Icon,
  ComputerIcon,
  Award01Icon,
  CheckmarkBadge01Icon,
  ArrowLeft01Icon,
  Calendar03Icon,
  LinkSquare01Icon,
} from "@hugeicons/core-free-icons";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { PricingDisclaimer } from "@/components/pricing-disclaimer";
import { ToolFeedback } from "@/components/tool-feedback";
import { OutboundLink } from "@/components/outbound-link";
import { getToolBySlug, getAllTools } from "@/lib/tools";

const platformIcons: Record<string, typeof AppleIcon> = {
  macOS: AppleIcon,
  Windows: WindowsNewIcon,
  Web: GlobalIcon,
  Linux: CommandLineIcon,
  iOS: SmartPhone01Icon,
  Android: SmartPhone01Icon,
  "Cross-platform": ComputerIcon,
};

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

  const PlatformIcon = platformIcons[tool.platform] || GlobalIcon;
  const formattedDate = new Date(tool.verifiedAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  return (
    <>
      <Header />
      <main className="mx-auto max-w-4xl px-4 py-8">
        <Link
          href="/tools"
          className="mb-8 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <HugeiconsIcon icon={ArrowLeft01Icon} size={16} />
          Back to tools
        </Link>

        <div className="grid gap-8 md:grid-cols-[1fr,300px]">
          {/* Main content */}
          <div>
            {/* Header section */}
            <div className="flex gap-4">
              <div className="relative shrink-0">
                <div className="flex h-16 w-16 items-center justify-center rounded-lg bg-muted p-3 text-xl font-semibold text-muted-foreground border">
                  {tool.url ? (
                    <Image
                      src={`https://www.google.com/s2/favicons?sz=128&domain=${tool.url}`}
                      className="w-full h-full"
                      alt={tool.name}
                      width={64}
                      height={64}
                    />
                  ) : (
                    <span>{tool.name.charAt(0)}</span>
                  )}
                </div>
                {tool.editorsPick && (
                  <span
                    className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-amber-500 text-white shadow-sm"
                    title="Editor's Pick"
                  >
                    <HugeiconsIcon icon={Award01Icon} size={12} />
                  </span>
                )}
                {tool.verifiedOneTime && (
                  <span
                    className="absolute -left-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-blue-500 text-white shadow-sm"
                    title="Verified One-Time Payment"
                  >
                    <HugeiconsIcon icon={CheckmarkBadge01Icon} size={12} />
                  </span>
                )}
              </div>

              <div className="min-w-0 flex-1">
                <h1 className="text-2xl font-bold">{tool.name}</h1>
                <p className="mt-1 text-muted-foreground">{tool.description}</p>

                {/* Badges */}
                <div className="mt-3 flex flex-wrap items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-muted px-3 py-1 text-xs font-medium">
                    <HugeiconsIcon icon={PlatformIcon} size={12} />
                    {tool.platform}
                  </span>
                  <span className="rounded-full bg-muted px-3 py-1 text-xs font-medium">
                    {tool.category}
                  </span>
                  {tool.editorsPick && (
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/10 px-3 py-1 text-xs font-medium text-amber-600 dark:text-amber-400">
                      <HugeiconsIcon icon={Award01Icon} size={12} />
                      Editor&apos;s Pick
                    </span>
                  )}
                  {tool.verifiedOneTime && (
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-500/10 px-3 py-1 text-xs font-medium text-blue-600 dark:text-blue-400">
                      <HugeiconsIcon icon={CheckmarkBadge01Icon} size={12} />
                      Verified One-Time
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="mt-8">
              <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                About
              </h2>
              <p className="mt-3 leading-relaxed text-foreground/90">
                {tool.fullDescription || tool.description}
              </p>
            </div>

            {/* Meta info */}
            <div className="mt-8 flex flex-wrap gap-6 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <HugeiconsIcon icon={Calendar03Icon} size={16} />
                <span>Verified {formattedDate}</span>
              </div>
              <a
                href={tool.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 hover:text-foreground transition-colors"
              >
                <HugeiconsIcon icon={LinkSquare01Icon} size={16} />
                <span>{new URL(tool.url).hostname}</span>
              </a>
            </div>
          </div>

          {/* Sidebar - Price card */}
          <div className="md:sticky md:top-8 h-fit">
            <div className="rounded-lg border border-border bg-card p-6">
              <div className="text-center">
                <p className="text-3xl font-bold">
                  {tool.price === 0 ? "Free" : `$${tool.price}`}
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
                  {tool.price === 0 ? "Free forever" : "One-time payment"}
                </p>
              </div>

              <OutboundLink href={tool.url} toolName={tool.name} />

              <p className="mt-4 text-center text-xs text-muted-foreground">
                No subscription required
              </p>
            </div>

            <div className="mt-4">
              <PricingDisclaimer />
            </div>

            <div className="mt-4">
              <ToolFeedback toolId={tool.id} />
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
