import { ArgumentForm } from "@/components/argument-form";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col bg-background">
      <Header />
      <div className="flex-1 container mx-auto px-4 py-6 md:py-10 max-w-3xl">
        <ArgumentForm />
      </div>
      <Footer />
    </main>
  );
}