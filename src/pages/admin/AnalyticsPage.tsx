import { Activity, Download, Star, Users } from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useMemo } from "react";
import { useClinic } from "../../context/ClinicContext";
import { averageRating } from "../../utils";
import { Button } from "../../components/ui/Button";
import { AdminPageShell, DataTable, Panel, StatCard } from "./shared";

export function AnalyticsPage() {
  const { appointments, reviews, doctors, services, patients } = useClinic();
  const trendData = useMemo(
    () =>
      appointments.map((appointment, index) => ({
        day: `B${index + 1}`,
        bookings: index + 2,
        completed: appointment.status === "completed" ? 1 : 0,
      })),
    [appointments],
  );
  const serviceData = services.map((service, index) => ({
    name: service.name,
    total: appointments.filter((appointment) => appointment.serviceId === service.id).length + index,
  }));
  const doctorTable = doctors.map((doctor) => {
    const doctorAppointments = appointments.filter((appointment) => appointment.doctorId === doctor.id);
    const completed = doctorAppointments.filter((appointment) => appointment.status === "completed").length;
    const noShows = doctorAppointments.filter((appointment) => appointment.status === "no_show").length;
    return {
      doctor: doctor.name,
      bookings: doctorAppointments.length,
      completionRate: doctorAppointments.length ? Math.round((completed / doctorAppointments.length) * 100) : 0,
      noShowRate: doctorAppointments.length ? Math.round((noShows / doctorAppointments.length) * 100) : 0,
    };
  });

  return (
    <AdminPageShell
      eyebrow="Analytics"
      title="Booking and demand intelligence"
      description="Visualize service demand, doctor performance, and patient growth with a reporting layout that feels production-ready."
      actions={<Button variant="secondary"><Download className="mr-2 size-4" />Export report</Button>}
    >
      <section className="grid gap-3 md:grid-cols-3">
        <StatCard label="Average rating" value={averageRating(reviews.filter((r) => r.isApproved)).toFixed(1)} detail="Approved reviews only" icon={Star} tone="amber" />
        <StatCard label="Unique patients" value={String(patients.length)} detail="Returning vs new can be derived from visit count" icon={Users} />
        <StatCard label="Tracked bookings" value={String(appointments.length)} detail="Current dataset backing analytics widgets" icon={Activity} tone="slate" />
      </section>

      <div className="grid gap-6 xl:grid-cols-2">
        <Panel title="Bookings over time" description="Top-line booking activity and completed volume trend.">
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="bookings" stroke="#0f766e" strokeWidth={3} />
                <Line type="monotone" dataKey="completed" stroke="#fb923c" strokeWidth={3} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Panel>

        <Panel title="Most popular services" description="Relative service demand across the current appointment set.">
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={serviceData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" hide />
                <YAxis />
                <Tooltip />
                <Bar dataKey="total" radius={[14, 14, 0, 0]}>
                  {serviceData.map((entry, index) => (
                    <Cell key={entry.name} fill={index % 2 === 0 ? "#0f766e" : "#fb923c"} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Panel>
      </div>

      <Panel title="Doctor performance" description="Operational comparison across bookings, completion rate, and no-show rate.">
        <DataTable headers={["Doctor", "Bookings", "Completion rate", "No-show rate"]}>
          {doctorTable.map((row) => (
            <tr key={row.doctor} className="border-b border-slate-100 last:border-0">
              <td className="py-4 pr-4 font-semibold text-slate-900">{row.doctor}</td>
              <td className="py-4 pr-4 text-slate-600">{row.bookings}</td>
              <td className="py-4 pr-4 text-slate-600">{row.completionRate}%</td>
              <td className="py-4 pr-4 text-slate-600">{row.noShowRate}%</td>
            </tr>
          ))}
        </DataTable>
      </Panel>
    </AdminPageShell>
  );
}
