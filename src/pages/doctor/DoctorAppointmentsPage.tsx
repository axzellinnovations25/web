import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useClinic } from "../../context/ClinicContext";
import { formatDate, formatTime } from "../../utils";
import { Input } from "../../components/ui/Input";
import { StatusPill } from "../admin/shared";
import { Search } from "lucide-react";

export function DoctorAppointmentsPage() {
  const { doctorId } = useAuth();
  const { appointments, patients, services } = useClinic();
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "today" | "upcoming" | "past">("upcoming");

  const today = new Date().toISOString().slice(0, 10);

  const myAppts = appointments
    .filter((a) => a.doctorId === doctorId)
    .filter((a) => {
      if (filter === "today") return a.date === today;
      if (filter === "upcoming") return a.date >= today;
      if (filter === "past") return a.date < today;
      return true;
    })
    .filter((a) => {
      if (!search) return true;
      const patient = patients.find((p) => p.id === a.patientId);
      return patient?.name.toLowerCase().includes(search.toLowerCase()) ||
        a.referenceNumber.toLowerCase().includes(search.toLowerCase());
    })
    .sort((a, b) => (a.date + a.startTime).localeCompare(b.date + b.startTime));

  const filterLabels: Record<typeof filter, string> = {
    all: "All",
    today: "Today",
    upcoming: "Upcoming",
    past: "Past",
  };

  return (
    <div className="space-y-5">
      <section className="rounded-2xl border border-slate-200/80 bg-white px-5 py-4 shadow-sm">
        <div className="text-[10px] font-bold uppercase tracking-[0.28em] text-emerald-600">Doctor Portal</div>
        <h1 className="mt-1 text-xl font-bold tracking-tight text-slate-950">My Appointments</h1>
        <p className="mt-0.5 text-sm text-slate-500">All appointments assigned to you.</p>
      </section>

      <div className="overflow-hidden rounded-2xl border border-slate-200/70 bg-white shadow-sm">
        <div className="border-b border-slate-100 bg-slate-50/60 px-5 py-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="relative max-w-sm flex-1">
              <Search className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
              <Input
                className="pl-10"
                placeholder="Search patient or reference…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <div className="flex gap-1 rounded-xl bg-slate-100 p-1">
              {(["today", "upcoming", "past", "all"] as const).map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                    filter === f
                      ? "bg-white text-emerald-700 shadow-sm"
                      : "text-slate-500 hover:text-slate-700"
                  }`}
                >
                  {filterLabels[f]}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="px-5 py-4">
          {myAppts.length === 0 ? (
            <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 px-5 py-8 text-center">
              <div className="text-sm font-bold text-slate-700">No appointments found</div>
              <div className="mt-1 text-xs text-slate-400">Try a different filter.</div>
            </div>
          ) : (
            <div className="space-y-2">
              {myAppts.map((appt) => {
                const patient = patients.find((p) => p.id === appt.patientId);
                const service = services.find((s) => s.id === appt.serviceId);
                return (
                  <div key={appt.id} className="flex items-center justify-between gap-4 rounded-xl border border-slate-100 bg-slate-50/60 px-4 py-3">
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-semibold text-slate-900">{patient?.name ?? "Unknown"}</span>
                        <span className="text-[11px] text-slate-400">{appt.referenceNumber}</span>
                      </div>
                      <div className="mt-0.5 text-xs text-slate-500">
                        {formatDate(appt.date)} · {formatTime(appt.startTime)} – {formatTime(appt.endTime)}
                        {service ? ` · ${service.name}` : ""}
                      </div>
                      {appt.notes && <div className="mt-0.5 text-xs text-slate-400 italic">{appt.notes}</div>}
                    </div>
                    <StatusPill status={appt.status} />
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
