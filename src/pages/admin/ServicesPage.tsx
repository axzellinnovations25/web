import { Check, Clock, DollarSign, Eye, EyeOff, Hash, Package, Pencil, Plus, Stethoscope, X } from "lucide-react";
import { useState } from "react";
import { useClinic } from "../../context/ClinicContext";
import type { Service } from "../../types";
import { Button } from "../../components/ui/Button";
import { Input, Textarea } from "../../components/ui/Input";
import { formatMoney } from "../../utils";
import { AdminPageShell, Panel, ToggleSwitch, Toolbar } from "./shared";

const DELAYS = ["", "delay-100", "delay-200", "delay-300", "delay-400", "delay-500", "delay-600"] as const;

export function ServicesPage() {
  const { services, clinic, saveService } = useClinic();

  const makeBlank = (): Service => ({
    id: `service-${crypto.randomUUID()}`,
    clinicId: clinic.id,
    name: "",
    description: "",
    durationMinutes: 30,
    price: 100,
    icon: "Stethoscope",
    isActive: true,
    displayOrder: services.length + 1,
  });

  const [draft, setDraft] = useState<Service | null>(null);
  const [saved, setSaved] = useState(false);

  function handleSave() {
    if (!draft) return;
    saveService(draft);
    setSaved(true);
    setTimeout(() => setSaved(false), 2200);
  }

  function closeDraft() {
    setDraft(null);
    setSaved(false);
  }

  const activeCount = services.filter((s) => s.isActive).length;
  const hiddenCount = services.filter((s) => !s.isActive).length;

  return (
    <AdminPageShell
      eyebrow="Services"
      title="Service catalog"
      description="Manage what patients see and book on the public site."
      actions={
        <Button onClick={() => setDraft(makeBlank())}>
          <Plus className="mr-1.5 size-4" />
          Add service
        </Button>
      }
    >
      {/* ── Quick stats ──────────────────────────────────────────────────── */}
      <div className="grid grid-cols-3 gap-3">
        <MiniStat icon={Package} label="Total" value={services.length} tone="slate" />
        <MiniStat icon={Eye} label="Active" value={activeCount} tone="teal" />
        <MiniStat icon={EyeOff} label="Hidden" value={hiddenCount} tone="amber" />
      </div>

      {/* ── Catalog + optional editor ────────────────────────────────────── */}
      <div className={`grid gap-5 ${draft ? "xl:grid-cols-[1.2fr_0.8fr]" : ""}`}>

        {/* ── Service list ─────────────────────────────────────────────── */}
        <Panel
          title="Service catalog"
          description={draft ? "Click a row to switch the service being edited." : "Click 'Edit' on any service to open the editor."}
        >
          <Toolbar searchPlaceholder="Search by name, description, or pricing" />

          <div className="mt-4 space-y-2.5">
            {services.map((service, i) => (
              <div
                key={service.id}
                className={`group relative overflow-hidden rounded-xl border bg-white transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md animate-fadeInUp ${DELAYS[Math.min(i, 6)]} ${
                  draft?.id === service.id
                    ? "border-teal-300 shadow-md shadow-teal-100/60 ring-1 ring-teal-200/50"
                    : service.isActive
                      ? "border-slate-200 hover:border-teal-200 hover:shadow-teal-100/40"
                      : "border-slate-200 bg-slate-50/50 hover:border-slate-300"
                }`}
              >
                {/* Left accent bar */}
                <div
                  className={`absolute left-0 top-0 h-full w-1 transition-all duration-200 group-hover:w-[4px] ${
                    draft?.id === service.id
                      ? "bg-teal-500"
                      : service.isActive
                        ? "bg-gradient-to-b from-teal-400 to-teal-600"
                        : "bg-slate-300"
                  }`}
                />

                <div className="flex items-center gap-3.5 py-3.5 pl-5 pr-4">
                  {/* Icon */}
                  <div
                    className={`flex size-10 shrink-0 items-center justify-center rounded-xl transition-transform duration-200 group-hover:scale-105 ${
                      service.isActive
                        ? "bg-gradient-to-br from-teal-50 to-teal-100 text-teal-600 ring-1 ring-teal-200/60"
                        : "bg-slate-100 text-slate-400 ring-1 ring-slate-200"
                    }`}
                  >
                    <Stethoscope className="size-4.5" />
                  </div>

                  {/* Info */}
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-bold text-slate-900">{service.name}</span>
                      <span
                        className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${
                          service.isActive
                            ? "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200/60"
                            : "bg-slate-100 text-slate-500 ring-1 ring-slate-200"
                        }`}
                      >
                        {service.isActive ? "Active" : "Hidden"}
                      </span>
                    </div>

                    <div className="mt-1 flex flex-wrap gap-x-3 gap-y-0.5">
                      <span className="flex items-center gap-1 text-xs text-slate-500">
                        <Clock className="size-3 text-teal-500" />
                        {service.durationMinutes} min
                      </span>
                      <span className="flex items-center gap-1 text-xs text-slate-500">
                        <DollarSign className="size-3 text-teal-500" />
                        {formatMoney(service.price)}
                      </span>
                      <span className="flex items-center gap-1 text-xs text-slate-400">
                        <Hash className="size-3" />
                        Order {service.displayOrder}
                      </span>
                    </div>

                    {service.description && (
                      <p className="mt-0.5 line-clamp-1 text-xs text-slate-400">{service.description}</p>
                    )}
                  </div>

                  {/* Edit button */}
                  <button
                    onClick={() => { setSaved(false); setDraft(service); }}
                    className={`flex shrink-0 items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-xs font-semibold shadow-sm transition-all duration-200 active:scale-95 ${
                      draft?.id === service.id
                        ? "border-teal-300 bg-teal-50 text-teal-700"
                        : "border-slate-200 bg-white text-slate-600 hover:border-teal-300 hover:bg-teal-50 hover:text-teal-700"
                    }`}
                  >
                    <Pencil className="size-3" />
                    {draft?.id === service.id ? "Editing" : "Edit"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </Panel>

        {/* ── Editor ─────────────────────────────────────────────────────── */}
        {draft && (
          <Panel
            title={draft.name || "New service"}
            description={
              draft.name
                ? `${draft.durationMinutes} min · ${formatMoney(draft.price)}`
                : "Fill in the fields below."
            }
            action={
              <button
                onClick={closeDraft}
                className="flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-medium text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
              >
                <X className="size-3.5" />
                Close
              </button>
            }
          >
            <div className="space-y-3.5 animate-slideInRight">
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Service name</label>
                <Input
                  placeholder="e.g. General Consultation"
                  value={draft.name}
                  onChange={(e) => setDraft({ ...draft, name: e.target.value })}
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Description</label>
                <Textarea
                  rows={3}
                  placeholder="Patients will see this on the booking page."
                  value={draft.description}
                  onChange={(e) => setDraft({ ...draft, description: e.target.value })}
                />
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Duration (min)</label>
                  <div className="relative">
                    <Clock className="pointer-events-none absolute left-3 top-1/2 size-3.5 -translate-y-1/2 text-teal-500" />
                    <Input
                      className="pl-9"
                      type="number"
                      placeholder="30"
                      value={draft.durationMinutes}
                      onChange={(e) => setDraft({ ...draft, durationMinutes: Number(e.target.value) })}
                    />
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Price</label>
                  <div className="relative">
                    <DollarSign className="pointer-events-none absolute left-3 top-1/2 size-3.5 -translate-y-1/2 text-teal-500" />
                    <Input
                      className="pl-9"
                      type="number"
                      placeholder="100"
                      value={draft.price}
                      onChange={(e) => setDraft({ ...draft, price: Number(e.target.value) })}
                    />
                  </div>
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Icon token</label>
                  <Input
                    placeholder="e.g. Stethoscope"
                    value={draft.icon}
                    onChange={(e) => setDraft({ ...draft, icon: e.target.value })}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Display order</label>
                  <div className="relative">
                    <Hash className="pointer-events-none absolute left-3 top-1/2 size-3.5 -translate-y-1/2 text-slate-400" />
                    <Input
                      className="pl-9"
                      type="number"
                      placeholder="1"
                      value={draft.displayOrder}
                      onChange={(e) => setDraft({ ...draft, displayOrder: Number(e.target.value) })}
                    />
                  </div>
                </div>
              </div>

              <ToggleSwitch
                checked={draft.isActive}
                onChange={(v) => setDraft({ ...draft, isActive: v })}
                label="Show on public site"
                hint={draft.isActive ? "Visible to patients during booking" : "Hidden from public catalog"}
              />

              {/* Save button */}
              <button
                onClick={handleSave}
                className={`group relative w-full overflow-hidden rounded-xl px-5 py-3 text-sm font-bold text-white transition-all duration-300 active:scale-[0.98] ${
                  saved
                    ? "bg-emerald-500 shadow-lg shadow-emerald-200"
                    : "bg-gradient-to-r from-teal-600 to-teal-500 shadow-accent-glow hover:from-teal-500 hover:to-teal-400 hover:shadow-[0_8px_32px_rgba(15,118,110,0.35)]"
                }`}
              >
                {!saved && (
                  <div className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/15 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
                )}
                <span className="relative flex items-center justify-center gap-2">
                  {saved ? (
                    <><Check className="size-4" />Saved</>
                  ) : (
                    "Save service"
                  )}
                </span>
              </button>
            </div>
          </Panel>
        )}
      </div>
    </AdminPageShell>
  );
}

/* ── Mini stat ──────────────────────────────────────────────────────────── */
function MiniStat({
  icon: Icon,
  label,
  value,
  tone,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: number;
  tone: "teal" | "amber" | "slate";
}) {
  const styles = {
    teal: "from-teal-50 to-teal-100/40 border-teal-200/60 text-teal-700",
    amber: "from-amber-50 to-amber-100/40 border-amber-200/60 text-amber-700",
    slate: "from-slate-50 to-white border-slate-200 text-slate-600",
  };
  const iconBg = {
    teal: "bg-teal-100/70",
    amber: "bg-amber-100/70",
    slate: "bg-slate-100",
  };
  return (
    <div className={`flex items-center gap-3 rounded-xl border bg-gradient-to-br px-4 py-3 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md ${styles[tone]}`}>
      <div className={`flex size-9 shrink-0 items-center justify-center rounded-xl ${iconBg[tone]}`}>
        <Icon className="size-4.5" />
      </div>
      <div>
        <div className="text-xl font-extrabold leading-none tracking-tight">{value}</div>
        <div className="mt-0.5 text-[10px] font-semibold uppercase tracking-wide opacity-70">{label}</div>
      </div>
    </div>
  );
}
