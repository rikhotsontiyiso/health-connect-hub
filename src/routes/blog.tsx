import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Search } from "lucide-react";
import { PageHero } from "@/components/site/SiteShell";
import { blogPosts } from "@/lib/clinic";

export const Route = createFileRoute("/blog")({
  head: () => ({
    meta: [
      { title: "Health Blog — Ubuntu Family Healthcare Clinic" },
      { name: "description", content: "Health tips, preventive care, nutrition and medical news from our doctors." },
      { property: "og:title", content: "Health Blog" },
      { property: "og:description", content: "Practical health advice from doctors at Ubuntu Family Healthcare Clinic." },
    ],
  }),
  component: Blog,
});

const categories = ["All", "Preventive Care", "Children's Health", "Women's Health", "Nutrition", "Mental Health", "Vaccination News"];

function Blog() {
  const [cat, setCat] = useState("All");
  const [q, setQ] = useState("");

  const filtered = blogPosts.filter((p) =>
    (cat === "All" || p.category === cat) &&
    (p.title.toLowerCase().includes(q.toLowerCase()) || p.excerpt.toLowerCase().includes(q.toLowerCase()))
  );

  return (
    <>
      <PageHero eyebrow="Health blog" title="Trusted advice from our doctors" description="Fresh perspectives on family wellness, preventive care and healthy living." />

      <section className="mx-auto max-w-7xl px-4 py-12">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap gap-2">
            {categories.map((c) => (
              <button
                key={c}
                onClick={() => setCat(c)}
                className={`rounded-full px-4 py-1.5 text-xs font-semibold transition ${cat === c ? "bg-primary text-primary-foreground" : "border border-border bg-surface text-foreground hover:border-primary hover:text-primary"}`}
              >
                {c}
              </button>
            ))}
          </div>
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search articles" className="w-full rounded-lg border border-input bg-surface pl-9 pr-3 py-2 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20" />
          </div>
        </div>

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((p) => (
            <article key={p.slug} className="rounded-2xl border border-border bg-surface overflow-hidden hover:shadow-md transition group">
              <div className="aspect-[16/9] bg-gradient-to-br from-primary/20 via-primary/5 to-accent/20" />
              <div className="p-6">
                <span className="inline-flex rounded-full bg-accent/15 px-3 py-1 text-xs font-semibold text-accent">{p.category}</span>
                <h2 className="mt-3 font-display text-lg font-semibold leading-snug group-hover:text-primary transition">{p.title}</h2>
                <p className="mt-2 text-sm text-muted-foreground">{p.excerpt}</p>
                <p className="mt-4 text-xs text-muted-foreground">{p.date} · {p.author}</p>
              </div>
            </article>
          ))}
          {filtered.length === 0 && <p className="text-muted-foreground col-span-full text-center py-12">No articles match your search.</p>}
        </div>
      </section>
    </>
  );
}
