import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { SubmitForm } from "@/components/submit-form";

export const metadata = {
  title: "Submit - PayOnce",
  description: "Submit a one-time purchase tool.",
};

export default function SubmitPage() {
  return (
    <>
      <Header />
      <main className="mx-auto max-w-md px-4 py-8">
        <h1 className="mb-1 text-xl font-bold">Submit a Tool</h1>
        <p className="mb-6 text-sm text-muted-foreground">
          We review every submission.
        </p>
        <SubmitForm />
      </main>
      <Footer />
    </>
  );
}
