import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { Receipt, Landmark, AlertTriangle } from "lucide-react";
import { listMyInvoices } from "@/lib/invoices.functions";
import { clinic } from "@/lib/clinic";

export const Route = createFileRoute("/_authenticated/portal/invoices")({
  component: Invoices,
});

type Inv = {
  id: string;
  amount: number;
  payment_method: string | null;
  payment_status: "unpaid" | "paid" | "refunded";
  issued_at: string;
  paid_at: string | null;
  appointments: { reference: string | null; service: string; appointment_date: string } | null;
};

const statusStyle: Record<string, string> = {
  unpaid: "bg-amber-100 text-amber-900",
  paid: "bg-emerald-100 text-emerald-900",
  refunded: "bg-slate-100 text-slate-900",
};

function Invoices() {
  const fn = useServerFn(listMyInvoices);
  const { data = [] } = useQuery({ queryKey: ["inv", "mine"], queryFn: fn as never }) as { data?: Inv[] };
  return (
    <div className="space-y-4">
      <h1 className="font-display text-2xl font-bold">Invoices</h1>
      {data.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border p-10 text-center text-sm text-muted-foreground">
          <Receipt className="mx-auto h-8 w-8 opacity-50" />
          <p className="mt-2">No invoices yet.</p>
        </div>
      ) : (
        <ul className="space-y-3">
          {data.map((i) => (
            <li key={i.id} className="rounded-xl border border-border bg-surface p-5">
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <div>
                  <p className="font-display font-bold">{i.appointments?.service ?? "Consultation"}</p>
                  <p className="text-xs text-muted-foreground">{i.appointments?.reference ?? "—"} · {i.appointments?.appointment_date ?? "—"}</p>
                </div>
                <div className="text-right">
                  <p className="font-display text-xl font-bold">R {Number(i.amount).toFixed(2)}</p>
                  <span className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold ${statusStyle[i.payment_status]}`}>
                    {i.payment_status}
                  </span>
                </div>
              </div>
              <p className="mt-1 text-xs text-muted-foreground">Payment method: {i.payment_method ?? "—"}</p>

              {i.payment_status === "unpaid" && i.payment_method === "eft" && (
                <div className="mt-3 rounded-lg border border-primary/30 bg-primary/5 p-3 text-sm">
                  <p className="flex items-center gap-2 font-semibold text-primary"><Landmark className="h-4 w-4" /> Bank transfer details</p>
                  <p className="text-xs text-muted-foreground">Use <strong>{i.appointments?.reference ?? i.id.slice(0,8)}</strong> as reference.</p>
                  <ul className="mt-2 text-xs">
                    <li><strong>Bank:</strong> {clinic.bank.name}</li>
                    <li><strong>Account holder:</strong> {clinic.bank.accountHolder}</li>
                    <li><strong>Account number:</strong> {clinic.bank.accountNumber}</li>
                  </ul>
                  <p className="mt-2 flex items-start gap-1.5 text-xs text-amber-800"><AlertTriangle className="h-3.5 w-3.5 shrink-0 mt-0.5" /> Demo account for a school project. Do not use in production.</p>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
