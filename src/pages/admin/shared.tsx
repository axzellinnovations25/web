import type { ReactNode } from "react";
import { Filter, Search } from "lucide-react";
import type { AppointmentStatus } from "../../types";
import { getStatusTone } from "../../utils";
import { Button } from "../../components/ui/Button";
import { Card } from "../../components/ui/Card";
import { Input } from "../../components/ui/Input";

export function AdminPageShell({
  eyebrow,
  title,
  description,
  actions,
  children,
}: {
  eyebrow: string;
  title: string;
  description?: string;
  actions?: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className="space-y-5">
      <section className="flex flex-col gap-3 rounded-2xl border border-slate-200/80 bg-white px-5 py-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <div className="text-[10px] font-bold uppercase tracking-[0.28em] text-accent">{eyebrow}</div>
          <h1 className="mt-1 text-xl font-bold tracking-tight text-slate-950">{title}</h1>
          {description ? <p className="mt-0.5 line-clamp-1 text-sm text-slate-500">{description}</p> : null}
        </div>
        {actions ? <div className="flex shrink-0 flex-wrap gap-2">{actions}</div> : null}
      </section>
      {children}
    </div>
  );
}

export function StatCard({
  label,
  value,
  detail,
  icon: Icon,
  tone = "teal",
}: {
  label: string;
  value: string;
  detail: string;
  icon: React.ComponentType<{ className?: string }>;
  tone?: "teal" | "amber" | "slate";
}) {
  const toneClass =
    tone === "amber"
      ? "bg-amber-50 text-amber-600 ring-1 ring-amber-200/60"
      : tone === "slate"
        ? "bg-slate-100 text-slate-500 ring-1 ring-slate-200/60"
        : "bg-accent/8 text-accent ring-1 ring-accent/20";

  return (
    <Card className="group relative overflow-hidden rounded-2xl border border-slate-200/70 bg-white p-5 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="text-xs font-semibold text-slate-500">{label}</div>
          <div className="mt-2.5 text-2xl font-bold tracking-tight text-slate-950">{value}</div>
          <div className="mt-1 line-clamp-1 text-xs text-slate-400">{detail}</div>
        </div>
        <div className={`flex size-11 shrink-0 items-center justify-center rounded-xl ${toneClass}`}>
          <Icon className="size-5" />
        </div>
      </div>
    </Card>
  );
}

export function Panel({
  title,
  description,
  action,
  children,
  className = "",
}: {
  title: string;
  description?: string;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <Card className={`overflow-hidden rounded-2xl border border-slate-200/70 bg-white shadow-sm transition-shadow hover:shadow-md ${className}`}>
      <div className="flex flex-col gap-2 border-b border-slate-100 bg-slate-50/60 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-base font-bold text-slate-950">{title}</h2>
          {description ? <p className="mt-0.5 text-xs text-slate-500">{description}</p> : null}
        </div>
        {action}
      </div>
      <div className="px-5 py-4">{children}</div>
    </Card>
  );
}

export function Toolbar({
  searchPlaceholder,
  right,
}: {
  searchPlaceholder: string;
  right?: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
      <div className="relative max-w-xl flex-1">
        <Search className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
        <Input className="pl-10" placeholder={searchPlaceholder} />
      </div>
      <div className="flex flex-wrap gap-2">
        <Button variant="secondary">
          <Filter className="mr-1.5 size-3.5" />
          Filters
        </Button>
        {right}
      </div>
    </div>
  );
}

export function DataTable({ headers, children }: { headers: string[]; children: ReactNode }) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full text-left text-sm">
        <thead>
          <tr className="border-b border-slate-200 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">
            {headers.map((header) => (
              <th key={header} className="pb-3 pr-4">{header}</th>
            ))}
          </tr>
        </thead>
        <tbody>{children}</tbody>
      </table>
    </div>
  );
}

export function StatusPill({ status }: { status: AppointmentStatus }) {
  return <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${getStatusTone(status)}`}>{status.replace("_", " ")}</span>;
}

export function DetailList({ items }: { items: Array<{ label: string; value: string }> }) {
  return (
    <div className="grid gap-2">
      {items.map((item) => (
        <div key={item.label} className="flex items-center justify-between gap-4 rounded-xl border border-slate-100 bg-white px-4 py-3 text-sm">
          <div className="font-medium text-slate-500">{item.label}</div>
          <div className="text-right font-semibold text-slate-900">{item.value}</div>
        </div>
      ))}
    </div>
  );
}

export function EmptyBlock({ title, description }: { title: string; description: string }) {
  return (
    <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 px-5 py-8 text-center">
      <div className="text-sm font-bold text-slate-700">{title}</div>
      <div className="mt-1 text-xs text-slate-400">{description}</div>
    </div>
  );
}

export function ToggleSwitch({
  checked,
  onChange,
  label,
  hint,
}: {
  checked: boolean;
  onChange: (value: boolean) => void;
  label: string;
  hint?: string;
}) {
  return (
    <label className="group flex cursor-pointer items-center justify-between gap-4 rounded-xl border border-slate-200 bg-slate-50/60 px-4 py-3 transition-all hover:border-teal-200 hover:bg-teal-50/20">
      <div>
        <div className="text-sm font-semibold text-slate-700">{label}</div>
        {hint ? <div className="mt-0.5 text-xs text-slate-400">{hint}</div> : null}
      </div>
      <div
        className={`relative h-6 w-11 shrink-0 rounded-full transition-colors duration-300 ${
          checked ? "bg-teal-500 shadow-sm shadow-teal-200" : "bg-slate-300"
        }`}
      >
        <div
          className={`absolute top-0.5 size-5 rounded-full bg-white shadow-md transition-transform duration-300 ${
            checked ? "translate-x-5" : "translate-x-0.5"
          }`}
        />
        <input
          type="checkbox"
          className="sr-only"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
        />
      </div>
    </label>
  );
}
