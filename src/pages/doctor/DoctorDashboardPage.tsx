import { CalendarRange, CheckCircle2, Clock, Users } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useClinic } from "../../context/ClinicContext";
import { formatDate, formatTime } from "../../utils";
import { StatCard, StatusPill } from "../admin/shared";

export function DoctorDashboardPage() {
  const { doctorId } = useAuth();
  const { doctors, patients, appointments } = useClinic();

  const doctor = doctors.find((d) => d.id === doctorId);
  const today = new Date().toISOString().slice(0, 10);

  const myAppointments = appointments.filter((a) => a.doctorId === doctorId);
  const todayAppts = myAppointments.filter((a) => a.date === today);
  const upcomingAppts = myAppointments
    .filter((a) => a.date >= today && (a.status === "pending" || a.status === "confirmed"))
    .sort((a, b) => (a.date + a.startTime).localeCompare(b.date + b.startTime))
    .slice(0, 8);

  const myPatientIds = [...new Set(myAppointments.map((a) => a.patientId))];
  const completedToday = todayAppts.filter((a) => a.status === "completed").length;
  const pendingToday = todayAppts.filter((a) => a.status === "pending" || a.status === "confirmed").length;

  return (
    <div className="space-y-5">
      {/* Header */}
      <section className="rounded-2xl border border-slate-200/80 bg-white px-5 py-4 shadow-sm">
        <div className="text-[10px] font-bold uppercase tracking-[0.28em] text-emerald-600">Doctor Portal</div>
        <h1 className="mt-1 text-xl font-bold tracking-tight text-slate-950">
          {doctor ? `Welcome, ${doctor.title} ${doctor.name}` : "Dashboard"}
        </h1>
        {doctor && (
          <p className="mt-0.5 text-sm text-slate-500">{doctor.specialization} · {formatDate(today)}</p>
        )}
      </section>

      {/* Stat cards */}
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Today's Visits"
          value={String(todayAppts.length)}
          detail={`${completedToday} completed · ${pendingToday} remaining`}
          icon={CalendarRange}
          tone="teal"
        />
        <StatCard
          label="Completed Today"
          value={String(completedToday)}
          detail="Consultations finished"
          icon={CheckCircle2}
          tone="teal"
        />
        <StatCard
          label="Pending Today"
          value={String(pendingToday)}
          detail="Still to see"
          icon={Clock}
          tone="amber"
        />
        <StatCard
          label="Total Patients"
          value={String(myPatientIds.length)}
          detail="Unique patients seen"
          icon={Users}
          tone="slate"
        />
      </div>

      {/* Today's schedule */}
      <div className="grid gap-5 xl:grid-cols-[1fr_360px]">
        <div className="overflow-hidden rounded-2xl border border-slate-200/70 bg-white shadow-sm">
          <div className="border-b border-slate-100 bg-slate-50/60 px-5 py-4">
            <h2 className="text-base font-bold text-slate-950">Today's Schedule</h2>
            <p className="mt-0.5 text-xs text-slate-500">{formatDate(today)}</p>
          </div>
          <div className="px-5 py-4">
            {todayAppts.length === 0 ? (
              <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 px-5 py-8 text-center">
                <div className="text-sm font-bold text-slate-700">No appointments today</div>
                <div className="mt-1 text-xs text-slate-400">Your schedule is clear.</div>
              </div>
            ) : (
              <div className="space-y-2">
                {todayAppts
                  .sort((a, b) => a.startTime.localeCompare(b.startTime))
                  .map((appt) => {
                    const patient = patients.find((p) => p.id === appt.patientId);
                    return (
                      <div key={appt.id} className="flex items-center justify-between gap-3 rounded-xl border border-slate-100 bg-slate-50/60 px-4 py-3">
                        <div className="min-w-0 flex-1">
                          <div className="font-semibold text-slate-900">{patient?.name ?? "Unknown patient"}</div>
                          <div className="mt-0.5 text-xs text-slate-500">
                            {formatTime(appt.startTime)} – {formatTime(appt.endTime)}
                            {appt.notes ? ` · ${appt.notes}` : ""}
                          </div>
                        </div>
                        <StatusPill status={appt.status} />
                      </div>
                    );
                  })}
              </div>
            )}
          </div>
        </div>

        {/* Upcoming */}
        <div className="overflow-hidden rounded-2xl border border-slate-200/70 bg-white shadow-sm">
          <div className="border-b border-slate-100 bg-slate-50/60 px-5 py-4">
            <h2 className="text-base font-bold text-slate-950">Upcoming</h2>
            <p className="mt-0.5 text-xs text-slate-500">Next confirmed appointments</p>
          </div>
          <div className="px-5 py-4">
            {upcomingAppts.length === 0 ? (
              <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 px-5 py-8 text-center">
                <div className="text-sm font-bold text-slate-700">No upcoming appointments</div>
                <div className="mt-1 text-xs text-slate-400">Nothing scheduled ahead.</div>
              </div>
            ) : (
              <div className="space-y-2">
                {upcomingAppts.map((appt) => {
                  const patient = patients.find((p) => p.id === appt.patientId);
                  return (
                    <div key={appt.id} className="rounded-xl border border-slate-100 bg-slate-50/60 px-4 py-3">
                      <div className="flex items-center justify-between gap-2">
                        <div className="font-semibold text-slate-900 text-sm">{patient?.name ?? "Unknown"}</div>
                        <StatusPill status={appt.status} />
                      </div>
                      <div className="mt-0.5 text-xs text-slate-400">
                        {formatDate(appt.date)} · {formatTime(appt.startTime)}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
