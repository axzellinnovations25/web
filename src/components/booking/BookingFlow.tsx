import { useMemo, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  Calendar,
  Check,
  CheckCircle2,
  Clock,
  Heart,
  Phone,
  ScanSearch,
  Shield,
  Stethoscope,
  Activity,
  User,
} from "lucide-react";
import type { ElementType } from "react";
import { useClinic } from "../../context/ClinicContext";
import type { BookingDraft } from "../../types";
import { buildBookingSlots, formatDate, formatTime } from "../../utils";
import { Button } from "../ui/Button";
import { Input, Textarea } from "../ui/Input";

// ─── Icon map ────────────────────────────────────────────────────────────────
const serviceIconMap: Record<string, ElementType> = {
  HeartPulse: Heart,
  Heart,
  ScanSearch,
  ShieldCheck: Shield,
  Shield,
  Stethoscope,
  Activity,
};
function ServiceIcon({ name, className }: { name: string; className?: string }) {
  const Icon = serviceIconMap[name] ?? Stethoscope;
  return <Icon className={className} />;
}

// ─── Step indicator ──────────────────────────────────────────────────────────
const STEPS = ["Service", "Doctor", "Date & Time", "Your Info", "Confirm", "Done"];

function StepBar({ current }: { current: number }) {
  return (
    <div className="mb-8 flex items-center">
      {STEPS.slice(0, -1).map((label, i) => {
        const done = i < current;
        const active = i === current;
        return (
          <div key={label} className="flex flex-1 items-center last:flex-none">
            <div className="flex flex-col items-center gap-1.5">
              <div
                className={`flex size-8 items-center justify-center rounded-full text-xs font-bold transition-all ${
                  done
                    ? "bg-accent text-white shadow-sm"
                    : active
                      ? "bg-accent text-white shadow-[0_0_0_4px_rgba(15,118,110,0.15)]"
                      : "bg-slate-100 text-slate-400"
                }`}
              >
                {done ? <Check className="size-4" /> : i + 1}
              </div>
              <span
                className={`hidden text-[10px] font-semibold whitespace-nowrap sm:block ${
                  active ? "text-accent" : done ? "text-slate-500" : "text-slate-300"
                }`}
              >
                {label}
              </span>
            </div>
            {i < STEPS.length - 2 && (
              <div
                className={`mx-2 h-0.5 flex-1 rounded-full transition-colors ${
                  i < current ? "bg-accent" : "bg-slate-200"
                }`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

// ─── Main component ──────────────────────────────────────────────────────────
const initialDraft: BookingDraft = {
  patientName: "",
  phone: "",
  email: "",
  notes: "",
};

export function BookingFlow() {
  const [searchParams] = useSearchParams();
  const { services, doctors, appointments, submitBooking, clinic } = useClinic();

  const [step, setStep] = useState(0);
  const [draft, setDraft] = useState<BookingDraft>({
    ...initialDraft,
    serviceId: searchParams.get("service") ?? undefined,
    doctorId: searchParams.get("doctor") ?? undefined,
  });
  const [resultReference, setResultReference] = useState<string | null>(null);

  const selectedDoctor = doctors.find((d) => d.id === draft.doctorId);
  const selectedService = services.find((s) => s.id === draft.serviceId);

  // Extend to 14 days so doctors with limited availability are covered
  const upcomingDates = [...Array(14)].map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i);
    return d.toISOString().slice(0, 10);
  });

  const availableSlots = useMemo(() => {
    if (!selectedDoctor || !draft.date) return [];
    return buildBookingSlots(selectedDoctor, draft.date, appointments);
  }, [appointments, draft.date, selectedDoctor]);

  function next() { setStep((s) => Math.min(s + 1, STEPS.length - 1)); }
  function back() { setStep((s) => Math.max(s - 1, 0)); }

  function completeBooking() {
    const appt = submitBooking(draft);
    setResultReference(appt.referenceNumber);
    setStep(5);
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      {step < 5 && <StepBar current={step} />}

      <div className="rounded-[2rem] bg-white p-7 shadow-soft ring-1 ring-slate-100 sm:p-10">

        {/* ── Step 0: Select Service ── */}
        {step === 0 && (
          <div>
            <h2 className="text-2xl font-extrabold text-ink sm:text-3xl">What service do you need?</h2>
            <p className="mt-2 text-slate-500">Select a service to continue booking.</p>
            <div className="mt-7 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {services
                .filter((s) => s.isActive)
                .sort((a, b) => a.displayOrder - b.displayOrder)
                .map((service, index) => (
                  <button
                    key={service.id}
                    onClick={() => {
                      setDraft((d) => ({ ...d, serviceId: service.id }));
                      next();
                    }}
                    className={`group flex flex-col rounded-[1.5rem] border p-5 text-left transition-all hover:-translate-y-0.5 hover:shadow-md ${
                      draft.serviceId === service.id
                        ? "border-accent bg-accent/5 ring-1 ring-accent/30"
                        : "border-slate-200 hover:border-accent/30"
                    }`}
                  >
                    <div
                      className={`inline-flex size-12 items-center justify-center rounded-2xl ${
                        index % 2 === 0 ? "bg-accent/10 text-accent" : "bg-accent2/10 text-accent2"
                      }`}
                    >
                      <ServiceIcon name={service.icon} className="size-6" />
                    </div>
                    <div className="mt-4 text-lg font-bold text-ink">{service.name}</div>
                    <p className="mt-1.5 text-xs leading-5 text-slate-500">{service.description}</p>
                    <div className="mt-3 flex items-center gap-2">
                      <Clock className="size-3.5 text-muted" />
                      <span className="text-xs font-medium text-muted">
                        {service.durationMinutes} min
                      </span>
                    </div>
                  </button>
                ))}
            </div>
          </div>
        )}

        {/* ── Step 1: Select Doctor ── */}
        {step === 1 && (
          <div>
            <h2 className="text-2xl font-extrabold text-ink sm:text-3xl">Choose your doctor</h2>
            <p className="mt-2 text-slate-500">All doctors below are available for your service.</p>
            <div className="mt-7 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {doctors
                .filter((d) => d.isActive)
                .sort((a, b) => a.displayOrder - b.displayOrder)
                .map((doctor) => (
                  <button
                    key={doctor.id}
                    onClick={() => {
                      setDraft((d) => ({ ...d, doctorId: doctor.id }));
                      next();
                    }}
                    className={`overflow-hidden rounded-[1.5rem] border text-left transition-all hover:-translate-y-0.5 hover:shadow-md ${
                      draft.doctorId === doctor.id
                        ? "border-accent ring-1 ring-accent/30"
                        : "border-slate-200 hover:border-accent/30"
                    }`}
                  >
                    {doctor.photoUrl && (
                      <img
                        src={doctor.photoUrl}
                        alt={doctor.name}
                        className="h-36 w-full object-cover"
                        loading="lazy"
                      />
                    )}
                    <div className="p-4">
                      <div className="text-[11px] font-bold uppercase tracking-wider text-accent">
                        {doctor.specialization}
                      </div>
                      <div className="mt-1 text-lg font-bold text-ink">
                        {doctor.title} {doctor.name}
                      </div>
                      <div className="mt-1 text-xs text-muted">{doctor.qualifications}</div>
                      <div className="mt-3 flex items-center gap-1.5 text-xs text-slate-500">
                        <Clock className="size-3.5" />
                        {doctor.consultationDuration} min consultation
                      </div>
                    </div>
                  </button>
                ))}
            </div>
            <button
              onClick={back}
              className="mt-6 flex items-center gap-1.5 text-sm font-semibold text-slate-500 hover:text-ink"
            >
              <ArrowLeft className="size-4" /> Back
            </button>
          </div>
        )}

        {/* ── Step 2: Date & Time ── */}
        {step === 2 && (
          <div>
            <h2 className="text-2xl font-extrabold text-ink sm:text-3xl">Pick a date and time</h2>
            <p className="mt-2 text-slate-500">
              Showing available slots for {selectedDoctor?.title} {selectedDoctor?.name}.
            </p>

            {/* Date picker */}
            <div className="mt-7">
              <div className="mb-3 text-sm font-semibold text-slate-700">Select date</div>
              <div className="flex flex-wrap gap-2">
                {upcomingDates.map((date) => {
                  const daySlots = buildBookingSlots(selectedDoctor!, date, appointments);
                  const hasSlots = daySlots.some((s) => s.available);
                  return (
                    <button
                      key={date}
                      onClick={() =>
                        hasSlots && setDraft((d) => ({ ...d, date, startTime: undefined }))
                      }
                      disabled={!hasSlots}
                      className={`rounded-2xl px-4 py-2.5 text-sm font-semibold transition-all ${
                        draft.date === date
                          ? "bg-accent text-white shadow-sm"
                          : hasSlots
                            ? "bg-canvas text-slate-700 hover:bg-accent/10"
                            : "cursor-not-allowed bg-slate-50 text-slate-300"
                      }`}
                    >
                      {formatDate(date)}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Time slots */}
            {draft.date && (
              <div className="mt-7">
                <div className="mb-3 text-sm font-semibold text-slate-700">Select time</div>
                {availableSlots.length === 0 ? (
                  <p className="text-sm text-slate-400">
                    No slots available on this date. Please pick another day.
                  </p>
                ) : (
                  <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 xl:grid-cols-6">
                    {availableSlots.map((slot) => (
                      <button
                        key={slot.time}
                        disabled={!slot.available}
                        onClick={() => {
                          setDraft((d) => ({ ...d, startTime: slot.time }));
                          next();
                        }}
                        className={`rounded-2xl px-3 py-3.5 text-sm font-semibold transition-all ${
                          slot.available
                            ? draft.startTime === slot.time
                              ? "bg-accent text-white shadow-sm"
                              : "bg-white text-ink ring-1 ring-slate-200 hover:ring-accent hover:text-accent"
                            : "cursor-not-allowed bg-slate-50 text-slate-300 line-through"
                        }`}
                      >
                        {formatTime(slot.time)}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}

            <button
              onClick={back}
              className="mt-8 flex items-center gap-1.5 text-sm font-semibold text-slate-500 hover:text-ink"
            >
              <ArrowLeft className="size-4" /> Back
            </button>
          </div>
        )}

        {/* ── Step 3: Patient Info ── */}
        {step === 3 && (
          <div className="max-w-xl">
            <h2 className="text-2xl font-extrabold text-ink sm:text-3xl">Your information</h2>
            <p className="mt-2 text-slate-500">
              No account needed — we just need basic contact details.
            </p>
            <div className="mt-7 space-y-4">
              <div>
                <label className="mb-1.5 block text-sm font-semibold text-slate-700">
                  Full name <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <User className="absolute left-3.5 top-3.5 size-4 text-slate-400" />
                  <Input
                    className="!pl-10"
                    placeholder="e.g. Jane Smith"
                    value={draft.patientName}
                    onChange={(e) =>
                      setDraft((d) => ({ ...d, patientName: e.target.value }))
                    }
                  />
                </div>
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-semibold text-slate-700">
                  Phone number <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <Phone className="absolute left-3.5 top-3.5 size-4 text-slate-400" />
                  <Input
                    className="!pl-10"
                    placeholder="+1 (555) 000-0000"
                    value={draft.phone}
                    onChange={(e) => setDraft((d) => ({ ...d, phone: e.target.value }))}
                  />
                </div>
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-semibold text-slate-700">
                  Email{" "}
                  <span className="text-xs font-normal text-muted">
                    (recommended — for confirmation)
                  </span>
                </label>
                <Input
                  type="email"
                  placeholder="jane@example.com"
                  value={draft.email}
                  onChange={(e) => setDraft((d) => ({ ...d, email: e.target.value }))}
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-semibold text-slate-700">
                  Additional notes{" "}
                  <span className="text-xs font-normal text-muted">(optional)</span>
                </label>
                <Textarea
                  rows={3}
                  placeholder="Anything the doctor should know beforehand…"
                  value={draft.notes}
                  onChange={(e) => setDraft((d) => ({ ...d, notes: e.target.value }))}
                />
              </div>
            </div>
            <div className="mt-7 flex gap-3">
              <button
                onClick={back}
                className="flex items-center gap-1.5 text-sm font-semibold text-slate-500 hover:text-ink"
              >
                <ArrowLeft className="size-4" /> Back
              </button>
              <Button
                onClick={next}
                disabled={!draft.patientName || !draft.phone}
                className="gap-2"
              >
                Continue <ArrowRight className="size-4" />
              </Button>
            </div>
          </div>
        )}

        {/* ── Step 4: Confirm ── */}
        {step === 4 && (
          <div className="max-w-xl">
            <h2 className="text-2xl font-extrabold text-ink sm:text-3xl">Confirm your booking</h2>
            <p className="mt-2 text-slate-500">
              Please review the details below before confirming.
            </p>

            <div className="mt-7 overflow-hidden rounded-[1.5rem] ring-1 ring-slate-200">
              {[
                { label: "Service", value: selectedService?.name },
                { label: "Doctor", value: `${selectedDoctor?.title} ${selectedDoctor?.name}` },
                { label: "Date", value: draft.date ? formatDate(draft.date) : "—" },
                { label: "Time", value: draft.startTime ? formatTime(draft.startTime) : "—" },
                { label: "Patient", value: draft.patientName },
                { label: "Phone", value: draft.phone },
                ...(draft.email ? [{ label: "Email", value: draft.email }] : []),
                ...(draft.notes ? [{ label: "Notes", value: draft.notes }] : []),
              ].map(({ label, value }) => (
                <div
                  key={label}
                  className="flex items-start gap-4 border-b border-slate-100 px-5 py-4 last:border-0 odd:bg-canvas"
                >
                  <span className="w-20 shrink-0 text-xs font-bold uppercase tracking-wide text-muted">
                    {label}
                  </span>
                  <span className="text-sm font-semibold text-ink">{value}</span>
                </div>
              ))}
            </div>

            {!clinic.bookingEnabled && (
              <div className="mt-4 rounded-2xl bg-amber-50 px-4 py-3 text-sm text-amber-700">
                Online booking is currently disabled. Please call us to book.
              </div>
            )}

            <div className="mt-7 flex flex-wrap gap-3">
              <button
                onClick={back}
                className="flex items-center gap-1.5 text-sm font-semibold text-slate-500 hover:text-ink"
              >
                <ArrowLeft className="size-4" /> Edit
              </button>
              <Button
                onClick={completeBooking}
                disabled={!clinic.bookingEnabled}
                className="gap-2"
              >
                <Calendar className="size-4" />
                Confirm Booking
              </Button>
            </div>
          </div>
        )}

        {/* ── Step 5: Success ── */}
        {step === 5 && (
          <div className="flex min-h-[440px] flex-col items-center justify-center py-8 text-center">
            <div className="relative flex size-24 items-center justify-center rounded-full bg-emerald-50">
              <CheckCircle2 className="size-12 text-emerald-500" />
              <div className="absolute inset-0 animate-ping rounded-full bg-emerald-100 opacity-30" />
            </div>

            <h2 className="mt-7 text-3xl font-extrabold text-ink sm:text-4xl">Booking confirmed!</h2>
            <p className="mt-4 max-w-md text-slate-500">
              Your reference number is{" "}
              <span className="rounded-xl bg-canvas px-3 py-1 font-bold font-mono text-ink">
                {resultReference}
              </span>
              . Keep it safe for your records.
            </p>

            {draft.email && (
              <p className="mt-3 text-sm text-slate-400">
                A confirmation email has been queued to {draft.email}.
              </p>
            )}

            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Button
                onClick={() => {
                  setDraft(initialDraft);
                  setStep(0);
                  setResultReference(null);
                }}
                variant="secondary"
              >
                Book another
              </Button>
              <Link to="/">
                <Button>Back to home</Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
