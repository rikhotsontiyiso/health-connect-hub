import type { ReactNode } from "react";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { ChatWidget } from "./ChatWidget";

export function SiteShell({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
      <ChatWidget />
    </div>
  );
}

export function PageHero({
  eyebrow,
  title,
  description,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
}) {
  return (
    <section className="border-b border-border bg-gradient-to-br from-primary/10 via-background to-accent/10">
      <div className="mx-auto max-w-7xl px-4 py-16 md:py-20">
        {eyebrow && (
          <p className="text-xs font-semibold uppercase tracking-widest text-primary">{eyebrow}</p>
        )}
        <h1 className="mt-2 font-display text-4xl font-bold text-foreground md:text-5xl">{title}</h1>
        {description && (
          <p className="mt-4 max-w-2xl text-base text-muted-foreground md:text-lg">{description}</p>
        )}
      </div>
    </section>
  );
}
