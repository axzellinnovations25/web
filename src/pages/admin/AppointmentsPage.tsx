import { Activity, BadgeCheck, CalendarDays, Check, Download, Plus, TimerReset, X } from "lucide-react";
import { useState } from "react";
import { useClinic } from "../../context/ClinicContext";
import type { AppointmentStatus } from "../../types";
import { formatDate } from "../../utils";
import { Button } from "../../components/ui/Button";
import { Input, Textarea } from "../../components/ui/Input";
import { AdminPageShell, DataTable, Panel, StatCard, StatusPill, Toolbar } from "./shared";

interface FormState {
  patientName: string;
  phone: string;
  email: string;
  serviceId: string;
  doctorId: string;
  date: string;
  startTime: string;
  notes: string;
}

export function AppointmentsPage() {
  const { appointments, patients, doctors, services, updateAppointmentStatus, submitBooking } = useClinic();

  const statusCounts = {
    pending: appointments.filter((item) => item.status === "pending").length,
    confirmed: appointments.filter((item) => item.status === "confirmed").length,
    completed: appointments.filter((item) => item.status === "completed").length,
    cancelled: appointments.filter((item) => item.status === "cancelled").length,
  };

  const today = new Date().toISOString().slice(0, 10);

  const blankForm = (): FormState => ({
    patientName: "",
    phone: "",
    email: "",
    serviceId: services[0]?.id ?? "",
    doctorId: doctors.find((d) => d.isActive)?.id ?? doctors[0]?.id ?? "",
    date: today,
    startTime: "09:00",
    notes: "",
  });

  const [form, setForm] = useState<FormState | null>(null);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function handleSubmit() {
    if (!form) return;
    if (!form.patientName.trim()) { setError("Patient name is required."); return; }
    if (!form.phone.trim()) { setError("Phone number is required."); return; }
    if (!form.serviceId) { setError("Please select a service."); return; }
    if (!form.doctorId) { setError("Please select a doctor."); return; }
    if (!form.date) { setError("Please select a date."); return; }
    if (!form.startTime) { setError("Please select a start time."); return; }

    try {
      submitBooking({
        patientName: form.patientName,
        phone: form.phone,
        email: form.email,
        serviceId: form.serviceId,
        doctorId: form.doctorId,
        date: form.date,
        startTime: form.startTime,
        notes: form.notes,
      });
      setError(null);
      setSaved(true);
      setTimeout(() => {
        setSaved(false);
        setForm(null);
      }, 1800);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not create appointment.");
    }
  }

  function closeForm() {
    setForm(null);
    setError(null);
    setSaved(false);
  }

  return (
    <AdminPageShell
      eyebrow="Appointments"
      title="Appointment manager"
      description="Manage bookings, confirmations, and schedule status."
      actions={
        <Button onClick={() => { setForm(blankForm()); setSaved(false); setError(null); }}>
          <Plus className="mr-1.5 size-4" />New appointment
        </Button>
      }
    >
      <section className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Pending" value={String(statusCounts.pending)} detail="Awaiting confirmation" icon={TimerReset} tone="amber" />
        <StatCard label="Confirmed" value={String(statusCounts.confirmed)} detail="Ready to be serviced" icon={BadgeCheck} />
        <StatCard label="Completed" value={String(statusCounts.completed)} detail="Closed visits" icon={Activity} tone="slate" />
        <StatCard label="Cancelled" value={String(statusCounts.cancelled)} detail="Removed from schedule" icon={CalendarDays} tone="slate" />
      </section>

      <div className={`grid gap-5 ${form ? "xl:grid-cols-[1fr_380px]" : ""}`}>
        <Panel
          title="Booking queue"
          description="All appointments — update status inline via the dropdown."
        >
          <Toolbar
            searchPlaceholder="Search by patient, phone, doctor, service, or reference"
            right={<Button variant="secondary"><Download className="mr-1.5 size-4" />Export</Button>}
          />
          <div className="mt-4">
            <DataTable headers={["Booking", "Patient", "Schedule", "Status", "Change status"]}>
              {appointments.map((appointment) => {
                const patient = patients.find((item) => item.id === appointment.patientId);
                const doctor = doctors.find((item) => item.id === appointment.doctorId);
                const service = services.find((item) => item.id === appointment.serviceId);
                return (
                  <tr key={appointment.id} className="border-b border-slate-100 align-middle last:border-0">
                    <td className="py-3 pr-4">
                      <div className="font-semibold text-slate-900">{appointment.referenceNumber}</div>
                      <div className="mt-0.5 text-[11px] font-medium uppercase tracking-wide text-slate-400">{service?.name ?? "—"}</div>
                    </td>
                    <td className="py-3 pr-4">
                      <div className="font-semibold text-slate-800">{patient?.name ?? "Unknown"}</div>
                      <div className="mt-0.5 text-xs text-slate-400">{patient?.phone ?? "No phone"}</div>
                      {appointment.notes ? (
                        <div className="mt-0.5 line-clamp-1 text-xs italic text-slate-400">{appointment.notes}</div>
                      ) : null}
                    </td>
                    <td className="py-3 pr-4">
                      <div className="font-medium text-slate-800">{formatDate(appointment.date)}</div>
                      <div className="mt-0.5 text-xs text-slate-400">{appointment.startTime} · {doctor?.name ?? "—"}</div>
                    </td>
                    <td className="py-3 pr-4">
                      <StatusPill status={appointment.status} />
                    </td>
                    <td className="py-3 pr-4">
                      <select
                        value={appointment.status}
                        onChange={(e) => updateAppointmentStatus(appointment.id, e.target.value as AppointmentStatus)}
                        className="cursor-pointer rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-medium text-slate-700 transition hover:border-slate-300 focus:outline-none focus:ring-2 focus:ring-accent/20"
                      >
                        {(["pending", "confirmed", "completed", "cancelled", "no_show"] as const).map((s) => (
                          <option key={s} value={s}>{s.replace("_", " ")}</option>
                        ))}
                      </select>
                    </td>
                  </tr>
                );
              })}
            </DataTable>
          </div>
        </Panel>

        {/* ── New appointment form ──────────────────────────────────────── */}
        {form && (
          <Panel
            title="New appointment"
            description="Fill in the details to book on behalf of a patient."
            action={
              <button
                onClick={closeForm}
                className="flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-medium text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
              >
                <X className="size-3.5" />
                Close
              </button>
            }
          >
            <div className="space-y-3.5 animate-slideInRight">
              {/* Patient info */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Patient name *</label>
                <Input
                  placeholder="Full name"
                  value={form.patientName}
                  onChange={(e) => setForm({ ...form, patientName: e.target.value })}
                />
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Phone *</label>
                  <Input
                    placeholder="+1 234 567 8900"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Email</label>
                  <Input
                    type="email"
                    placeholder="optional"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                  />
                </div>
              </div>

              {/* Service + Doctor */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Service *</label>
                <select
                  value={form.serviceId}
                  onChange={(e) => setForm({ ...form, serviceId: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-accent/20"
                >
                  {services.map((s) => (
                    <option key={s.id} value={s.id}>{s.name}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Doctor *</label>
                <select
                  value={form.doctorId}
                  onChange={(e) => setForm({ ...form, doctorId: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-accent/20"
                >
                  {doctors.map((d) => (
                    <option key={d.id} value={d.id}>{d.title} {d.name}</option>
                  ))}
                </select>
              </div>

              {/* Date + Time */}
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Date *</label>
                  <Input
                    type="date"
                    value={form.date}
                    min={today}
                    onChange={(e) => setForm({ ...form, date: e.target.value })}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Start time *</label>
                  <Input
                    type="time"
                    value={form.startTime}
                    onChange={(e) => setForm({ ...form, startTime: e.target.value })}
                  />
                </div>
              </div>

              {/* Notes */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Notes</label>
                <Textarea
                  rows={3}
                  placeholder="Any patient notes or special instructions"
                  value={form.notes}
                  onChange={(e) => setForm({ ...form, notes: e.target.value })}
                />
              </div>

              {/* Error */}
              {error && (
                <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
                  {error}
                </div>
              )}

              {/* Submit */}
              <button
                onClick={handleSubmit}
                disabled={saved}
                className={`group relative w-full overflow-hidden rounded-xl px-5 py-3 text-sm font-bold text-white transition-all duration-300 active:scale-[0.98] ${
                  saved
                    ? "bg-emerald-500 shadow-lg shadow-emerald-200"
                    : "bg-gradient-to-r from-teal-600 to-teal-500 shadow-accent-glow hover:from-teal-500 hover:to-teal-400"
                }`}
              >
                {!saved && (
                  <div className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/15 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
                )}
                <span className="relative flex items-center justify-center gap-2">
                  {saved ? (
                    <><Check className="size-4" />Appointment created</>
                  ) : (
                    "Create appointment"
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
