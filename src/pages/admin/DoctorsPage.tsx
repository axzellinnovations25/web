import { Eye, EyeOff, KeyRound, Plus, X } from "lucide-react";
import { useState } from "react";
import { useClinic } from "../../context/ClinicContext";
import type { Doctor } from "../../types";
import { Button } from "../../components/ui/Button";
import { Input, Textarea } from "../../components/ui/Input";
import { AdminPageShell, Panel, ToggleSwitch, Toolbar } from "./shared";
import { hasServiceRole, supabaseAdmin } from "../../lib/supabaseAdmin";

interface CreatedCredentials {
  email: string;
  password: string;
  name: string;
}

export function DoctorsPage() {
  const { doctors, clinic, saveDoctor } = useClinic();
  const [draft, setDraft] = useState<Doctor | null>(null);
  const [loginPassword, setLoginPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [saving, setSaving] = useState(false);
  const [createdCredentials, setCreatedCredentials] = useState<CreatedCredentials | null>(null);

  const isNew = draft ? !doctors.some((d) => d.id === draft.id) : false;

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
      loginEmail: "",
    };
  }

  function openNew() {
    setDraft(makeBlank());
    setLoginPassword("");
    setShowPassword(false);
    setCreatedCredentials(null);
  }

  function openEdit(doctor: Doctor) {
    setDraft(doctor);
    setLoginPassword("");
    setShowPassword(false);
    setCreatedCredentials(null);
  }

  async function handleSave() {
    if (!draft) return;
    setSaving(true);

    // For new doctors with a login email + password, create a Supabase auth user.
    if (isNew && draft.loginEmail && loginPassword) {
      if (supabaseAdmin) {
        const { data, error } = await supabaseAdmin.auth.admin.createUser({
          email: draft.loginEmail,
          password: loginPassword,
          email_confirm: true,
          user_metadata: { role: "doctor", doctor_id: draft.id },
        });
        if (error) {
          alert(`Could not create login account: ${error.message}`);
          setSaving(false);
          return;
        }
        // Store confirmation for admin to share with doctor
        if (data.user) {
          setCreatedCredentials({ email: draft.loginEmail, password: loginPassword, name: draft.name });
        }
      } else {
        // No service role key — save doctor record anyway and warn.
        console.warn(
          "VITE_SUPABASE_SERVICE_ROLE_KEY not set. Doctor record saved but no Supabase auth user created.",
        );
      }
    }

    saveDoctor(draft);
    setSaving(false);

    if (!isNew) setDraft(null);
  }

  return (
    <AdminPageShell
      eyebrow="Doctors"
      title="Doctor profiles and availability"
      description="Manage public profiles, scheduling rules, and display ordering."
      actions={<Button onClick={openNew}><Plus className="mr-1.5 size-4" />Add doctor</Button>}
    >
      {/* Credentials success banner */}
      {createdCredentials && (
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-5 py-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="text-sm font-bold text-emerald-800">Doctor login created for {createdCredentials.name}</div>
              <div className="mt-1 text-xs text-emerald-700">Share these credentials securely with the doctor.</div>
              <div className="mt-3 space-y-1 rounded-xl border border-emerald-200 bg-white px-4 py-3 font-mono text-xs text-slate-700">
                <div><span className="font-bold">Email:</span> {createdCredentials.email}</div>
                <div><span className="font-bold">Password:</span> {createdCredentials.password}</div>
                <div><span className="font-bold">Login URL:</span> {window.location.origin}/auth/login</div>
              </div>
            </div>
            <button onClick={() => setCreatedCredentials(null)} className="shrink-0 rounded-lg p-1 text-emerald-500 hover:bg-emerald-100">
              <X className="size-4" />
            </button>
          </div>
        </div>
      )}

      <div className={`grid gap-5 ${draft ? "xl:grid-cols-[1.2fr_0.8fr]" : ""}`}>
        <Panel title="Roster" description="Click 'Edit' to update a profile.">
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
                    {doctor.loginEmail && (
                      <span className="flex items-center gap-1 rounded-full bg-blue-100 px-2.5 py-0.5 text-[11px] font-semibold text-blue-700">
                        <KeyRound className="size-2.5" />
                        Portal access
                      </span>
                    )}
                  </div>
                  <div className="mt-1 text-xs text-slate-500">{doctor.specialization} · {doctor.qualifications} · {doctor.consultationDuration} min</div>
                  {doctor.loginEmail && <div className="mt-0.5 text-[11px] text-slate-400">{doctor.loginEmail}</div>}
                  {doctor.bio && <div className="mt-1 line-clamp-1 text-xs text-slate-400">{doctor.bio}</div>}
                </div>
                <Button variant="secondary" className="shrink-0 py-2 text-xs" onClick={() => openEdit(doctor)}>
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

              {/* Doctor Portal Login */}
              <div className="rounded-xl border border-blue-100 bg-blue-50/60 p-3.5">
                <div className="mb-2.5 flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-blue-600">
                  <KeyRound className="size-3" />
                  Doctor Portal Login
                </div>
                <div className="space-y-2.5">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Login email</label>
                    <Input
                      type="email"
                      placeholder="doctor@clinic.com"
                      value={draft.loginEmail ?? ""}
                      onChange={(e) => setDraft({ ...draft, loginEmail: e.target.value })}
                    />
                  </div>
                  {isNew && (
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Temporary password</label>
                      <div className="relative">
                        <Input
                          type={showPassword ? "text" : "password"}
                          placeholder="Min 8 characters"
                          value={loginPassword}
                          onChange={(e) => setLoginPassword(e.target.value)}
                          className="pr-10"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword((v) => !v)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                        >
                          {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                        </button>
                      </div>
                    </div>
                  )}
                  {!hasServiceRole && isNew && draft.loginEmail && (
                    <p className="text-[11px] text-amber-600">
                      Add <code className="rounded bg-amber-100 px-1">VITE_SUPABASE_SERVICE_ROLE_KEY</code> to .env to auto-create the login account.
                    </p>
                  )}
                  {!isNew && draft.loginEmail && (
                    <p className="text-[11px] text-slate-400">Login email saved. To reset the password, use the Supabase dashboard.</p>
                  )}
                </div>
              </div>

              <ToggleSwitch
                checked={draft.isActive}
                onChange={(v) => setDraft({ ...draft, isActive: v })}
                label="Publicly visible"
                hint={draft.isActive ? "Shown on the public site" : "Hidden from patients"}
              />
              <Button className="w-full" disabled={saving} onClick={() => void handleSave()}>
                {saving ? "Saving…" : "Save doctor"}
              </Button>
            </div>
          </Panel>
        )}
      </div>
    </AdminPageShell>
  );
}
