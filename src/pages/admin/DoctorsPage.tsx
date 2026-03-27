import { Plus, X } from "lucide-react";
import { useState } from "react";
import { useClinic } from "../../context/ClinicContext";
import type { Doctor } from "../../types";
import { Button } from "../../components/ui/Button";
import { Input, Textarea } from "../../components/ui/Input";
import { AdminPageShell, Panel, ToggleSwitch, Toolbar } from "./shared";

export function DoctorsPage() {
  const { doctors, clinic, saveDoctor } = useClinic();
  const [draft, setDraft] = useState<Doctor | null>(null);

  function makeBlank(): Doctor {
    return {
      id: `doctor-${crypto.randomUUID()}`,
      clinicId: clinic.id,
      name: "",
      title: "Dr.",
      specialization: "",
      qualifications: "",
      bio: "",
      photoUrl: "",
      availableSlots: { Monday: ["09:00", "09:30"], Wednesday: ["09:00", "09:30"] },
      consultationDuration: 30,
      isActive: true,
      displayOrder: doctors.length + 1,
    };
  }

  return (
    <AdminPageShell
      eyebrow="Doctors"
      title="Doctor profiles and availability"
      description="Manage public profiles, scheduling rules, and display ordering."
      actions={<Button onClick={() => setDraft(makeBlank())}><Plus className="mr-1.5 size-4" />Add doctor</Button>}
    >
      <div className={`grid gap-5 ${draft ? "xl:grid-cols-[1.2fr_0.8fr]" : ""}`}>
        <Panel
          title="Roster"
          description="Click 'Edit' to update a profile."
        >
          <Toolbar searchPlaceholder="Search doctors by name, title, or specialization" />
          <div className="mt-4 grid gap-3">
            {doctors.map((doctor) => (
              <div key={doctor.id} className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-slate-50/60 px-4 py-4 lg:flex-row lg:items-center lg:justify-between">
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-bold text-slate-900">{doctor.title} {doctor.name}</span>
                    <span className={`rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${doctor.isActive ? "bg-emerald-100 text-emerald-700" : "bg-slate-200 text-slate-500"}`}>
                      {doctor.isActive ? "Active" : "Hidden"}
                    </span>
                  </div>
                  <div className="mt-1 text-xs text-slate-500">{doctor.specialization} · {doctor.qualifications} · {doctor.consultationDuration} min</div>
                  {doctor.bio && <div className="mt-1 line-clamp-1 text-xs text-slate-400">{doctor.bio}</div>}
                </div>
                <Button
                  variant="secondary"
                  className="shrink-0 py-2 text-xs"
                  onClick={() => setDraft(doctor)}
                >
                  Edit
                </Button>
              </div>
            ))}
          </div>
        </Panel>

        {draft && (
          <Panel
            title={draft.name || "New doctor"}
            description={draft.name ? `${draft.specialization || "Editing profile"}` : "Fill in the fields below."}
            action={
              <button
                onClick={() => setDraft(null)}
                className="flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-medium text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
              >
                <X className="size-3.5" />
                Close
              </button>
            }
          >
            <div className="space-y-3">
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Title</label>
                  <Input placeholder="Dr." value={draft.title} onChange={(e) => setDraft({ ...draft, title: e.target.value })} />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Display order</label>
                  <Input type="number" value={draft.displayOrder} onChange={(e) => setDraft({ ...draft, displayOrder: Number(e.target.value) })} />
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Full name</label>
                <Input placeholder="Doctor name" value={draft.name} onChange={(e) => setDraft({ ...draft, name: e.target.value })} />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Specialization</label>
                <Input placeholder="e.g. Cardiology" value={draft.specialization} onChange={(e) => setDraft({ ...draft, specialization: e.target.value })} />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Qualifications</label>
                <Input placeholder="e.g. MBBS, MD" value={draft.qualifications} onChange={(e) => setDraft({ ...draft, qualifications: e.target.value })} />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Photo URL</label>
                <Input placeholder="https://..." value={draft.photoUrl} onChange={(e) => setDraft({ ...draft, photoUrl: e.target.value })} />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Consultation duration (min)</label>
                <Input type="number" placeholder="30" value={draft.consultationDuration} onChange={(e) => setDraft({ ...draft, consultationDuration: Number(e.target.value) })} />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Biography</label>
                <Textarea rows={4} placeholder="Professional biography" value={draft.bio} onChange={(e) => setDraft({ ...draft, bio: e.target.value })} />
              </div>
              <ToggleSwitch
                checked={draft.isActive}
                onChange={(v) => setDraft({ ...draft, isActive: v })}
                label="Publicly visible"
                hint={draft.isActive ? "Shown on the public site" : "Hidden from patients"}
              />
              <Button className="w-full" onClick={() => saveDoctor(draft)}>Save doctor</Button>
            </div>
          </Panel>
        )}
      </div>
    </AdminPageShell>
  );
}
