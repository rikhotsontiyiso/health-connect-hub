import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { FlaskConical, Download } from "lucide-react";
import { listMyLabResults } from "@/lib/clinical.functions";

export const Route = createFileRoute("/_authenticated/portal/lab-results")({
  component: LabResults,
});

type Lab = { id: string; title: string; result_summary: string | null; file_url: string | null; performed_at: string };

function LabResults() {
  const fn = useServerFn(listMyLabResults);
  const { data = [] } = useQuery({ queryKey: ["labs", "mine"], queryFn: fn as never }) as { data?: Lab[] };
  return (
    <div className="space-y-4">
      <h1 className="font-display text-2xl font-bold">Lab results</h1>
      {data.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border p-10 text-center text-sm text-muted-foreground">
          <FlaskConical className="mx-auto h-8 w-8 opacity-50" />
          <p className="mt-2">No lab results yet.</p>
        </div>
      ) : (
        <ul className="space-y-3">
          {data.map((l) => (
            <li key={l.id} className="rounded-xl border border-border bg-surface p-5">
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <p className="font-display font-bold">{l.title}</p>
                <p className="text-xs text-muted-foreground">{new Date(l.performed_at).toLocaleDateString()}</p>
              </div>
              {l.result_summary && <p className="mt-2 text-sm">{l.result_summary}</p>}
              {l.file_url && (
                <a href={l.file_url} target="_blank" rel="noreferrer" className="mt-3 inline-flex items-center gap-1.5 text-sm text-primary hover:underline">
                  <Download className="h-4 w-4" /> Download report
                </a>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
