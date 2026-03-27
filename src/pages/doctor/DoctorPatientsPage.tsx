import { Search } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useClinic } from "../../context/ClinicContext";
import { formatDate } from "../../utils";
import { Input } from "../../components/ui/Input";

export function DoctorPatientsPage() {
  const { doctorId } = useAuth();
  const { patients, appointments, doctorPrescriptions } = useClinic();
  const [search, setSearch] = useState("");

  // Patients who have had at least one appointment with this doctor
  const myPatientIds = [...new Set(
    appointments.filter((a) => a.doctorId === doctorId).map((a) => a.patientId),
  )];

  const myPatients = patients
    .filter((p) => myPatientIds.includes(p.id))
    .filter((p) =>
      !search || p.name.toLowerCase().includes(search.toLowerCase()) || (p.phone ?? "").includes(search),
    );

  function getPatientStats(patientId: string) {
    const patientAppts = appointments.filter(
      (a) => a.patientId === patientId && a.doctorId === doctorId,
    );
    const lastAppt = patientAppts
      .filter((a) => a.status === "completed")
      .sort((a, b) => b.date.localeCompare(a.date))[0];
    const rxCount = doctorPrescriptions.filter(
      (rx) => rx.patientId === patientId && rx.doctorId === doctorId,
    ).length;
    return { visits: patientAppts.length, lastVisit: lastAppt?.date, rxCount };
  }

  return (
    <div className="space-y-5">
      <section className="rounded-2xl border border-slate-200/80 bg-white px-5 py-4 shadow-sm">
        <div className="text-[10px] font-bold uppercase tracking-[0.28em] text-emerald-600">Doctor Portal</div>
        <h1 className="mt-1 text-xl font-bold tracking-tight text-slate-950">My Patients</h1>
        <p className="mt-0.5 text-sm text-slate-500">Patients who have visited you at this clinic.</p>
      </section>

      <div className="overflow-hidden rounded-2xl border border-slate-200/70 bg-white shadow-sm">
        <div className="border-b border-slate-100 bg-slate-50/60 px-5 py-4">
          <div className="relative max-w-sm">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
            <Input
              className="pl-10"
              placeholder="Search by name or phone…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        <div className="px-5 py-4">
          {myPatients.length === 0 ? (
            <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 px-5 py-8 text-center">
              <div className="text-sm font-bold text-slate-700">
                {search ? "No patients match your search" : "No patients yet"}
              </div>
              <div className="mt-1 text-xs text-slate-400">
                {search ? "Try a different search term." : "Patients will appear here once they have an appointment with you."}
              </div>
            </div>
          ) : (
            <div className="grid gap-3">
              {myPatients.map((patient) => {
                const stats = getPatientStats(patient.id);
                return (
                  <Link
                    key={patient.id}
                    to={`/doctor/patients/${patient.id}`}
                    className="flex items-center justify-between gap-4 rounded-xl border border-slate-200 bg-slate-50/60 px-4 py-4 transition hover:border-emerald-200 hover:bg-emerald-50/30"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="font-bold text-slate-900">{patient.name}</div>
                      <div className="mt-0.5 text-xs text-slate-500">
                        {patient.phone}
                        {patient.email ? ` · ${patient.email}` : ""}
                      </div>
                      <div className="mt-1 flex flex-wrap gap-3 text-[11px] text-slate-400">
                        <span>{stats.visits} visit{stats.visits !== 1 ? "s" : ""}</span>
                        {stats.lastVisit && <span>Last seen {formatDate(stats.lastVisit)}</span>}
                        {stats.rxCount > 0 && <span>{stats.rxCount} prescription{stats.rxCount !== 1 ? "s" : ""}</span>}
                      </div>
                    </div>
                    <div className="shrink-0 text-xs font-semibold text-emerald-600">View →</div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
