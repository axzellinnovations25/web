import { Eye } from "lucide-react";
import { useState } from "react";
import { useClinic } from "../../context/ClinicContext";
import { Button } from "../../components/ui/Button";
import { Input, Textarea } from "../../components/ui/Input";
import { AdminPageShell, DetailList, Panel, ToggleSwitch } from "./shared";

function ColorField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  const safeHex = /^#[0-9a-fA-F]{6}$/.test(value) ? value : "#000000";

  return (
    <div className="space-y-1">
      <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">{label}</label>
      <div className="flex items-center gap-2.5 rounded-xl border border-slate-200 bg-white px-3 py-2 transition focus-within:ring-2 focus-within:ring-accent/20 hover:border-slate-300">
        {/* Swatch — click opens native color picker */}
        <div className="relative shrink-0">
          <div
            className="size-7 cursor-pointer rounded-lg border border-slate-200 shadow-sm transition hover:scale-105"
            style={{ backgroundColor: safeHex }}
          />
          <input
            type="color"
            value={safeHex}
            onChange={(e) => onChange(e.target.value)}
            className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
          />
        </div>
        {/* Hex text */}
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="#000000"
          maxLength={7}
          className="flex-1 bg-transparent font-mono text-sm text-slate-700 outline-none placeholder:text-slate-300"
        />
      </div>
    </div>
  );
}

export function SettingsPage() {
  const { clinic, updateClinic } = useClinic();
  const [draft, setDraft] = useState(clinic);

  return (
    <AdminPageShell
      eyebrow="Settings"
      title="Clinic configuration"
      description="Branding, contact details, and live feature toggles."
      actions={
        <>
          <Button variant="secondary" onClick={() => window.open("/", "_blank")}>
            <Eye className="mr-1.5 size-4" />
            Preview
          </Button>
          <Button onClick={() => updateClinic(draft)}>Save changes</Button>
        </>
      }
    >
      <div className="grid gap-5 xl:grid-cols-[1.15fr_0.85fr]">
        <Panel title="Brand and contact" description="Site identity, messaging, and contact information.">
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Clinic name</label>
              <Input value={draft.name} onChange={(e) => setDraft({ ...draft, name: e.target.value })} placeholder="Clinic name" />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Tagline</label>
              <Input value={draft.tagline} onChange={(e) => setDraft({ ...draft, tagline: e.target.value })} placeholder="Tagline" />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Phone</label>
              <Input value={draft.phone} onChange={(e) => setDraft({ ...draft, phone: e.target.value })} placeholder="Phone number" />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Email</label>
              <Input value={draft.email} onChange={(e) => setDraft({ ...draft, email: e.target.value })} placeholder="Email address" />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">WhatsApp</label>
              <Input value={draft.whatsapp} onChange={(e) => setDraft({ ...draft, whatsapp: e.target.value })} placeholder="WhatsApp number" />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Font family</label>
              <Input value={draft.fontFamily} onChange={(e) => setDraft({ ...draft, fontFamily: e.target.value })} placeholder="Font family" />
            </div>
            <ColorField
              label="Primary color"
              value={draft.primaryColor}
              onChange={(v) => setDraft({ ...draft, primaryColor: v })}
            />
            <ColorField
              label="Secondary color"
              value={draft.secondaryColor}
              onChange={(v) => setDraft({ ...draft, secondaryColor: v })}
            />
          </div>
          <div className="mt-3 space-y-1">
            <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">About the clinic</label>
            <Textarea
              rows={4}
              value={draft.description}
              onChange={(e) => setDraft({ ...draft, description: e.target.value })}
              placeholder="A short description shown on the public site."
            />
          </div>
        </Panel>

        <div className="space-y-5">
          <Panel title="Feature toggles" description="Switches that affect the live public experience.">
            <div className="space-y-2.5">
              <ToggleSwitch
                checked={draft.showReviews}
                onChange={(v) => setDraft({ ...draft, showReviews: v })}
                label="Show reviews"
                hint="Display the testimonials section publicly"
              />
              <ToggleSwitch
                checked={draft.showPricing}
                onChange={(v) => setDraft({ ...draft, showPricing: v })}
                label="Show pricing"
                hint="Display service prices on the booking page"
              />
              <ToggleSwitch
                checked={draft.bookingEnabled}
                onChange={(v) => setDraft({ ...draft, bookingEnabled: v })}
                label="Booking enabled"
                hint="Allow patients to submit bookings online"
              />
              <ToggleSwitch
                checked={draft.emergencyBannerEnabled}
                onChange={(v) => setDraft({ ...draft, emergencyBannerEnabled: v })}
                label="Emergency banner"
                hint="Show an urgent notice at the top of the site"
              />
            </div>
          </Panel>

          <Panel title="Live snapshot" description="Current publish-ready state.">
            <DetailList
              items={[
                { label: "Phone", value: draft.phone || "Not set" },
                { label: "Email", value: draft.email || "Not set" },
                { label: "WhatsApp", value: draft.whatsapp || "Not set" },
                { label: "Reviews", value: draft.showReviews ? "Visible" : "Hidden" },
                { label: "Booking flow", value: draft.bookingEnabled ? "Open" : "Paused" },
              ]}
            />
          </Panel>
        </div>
      </div>
    </AdminPageShell>
  );
}
