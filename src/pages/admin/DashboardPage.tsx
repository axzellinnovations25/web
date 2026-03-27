import { Activity, ArrowUpRight, CalendarDays, Download, Eye, Star, Stethoscope } from "lucide-react";
import { useClinic } from "../../context/ClinicContext";
import { averageRating, formatDate, mostBookedDoctor, mostPopularService } from "../../utils";
import { Button } from "../../components/ui/Button";
import { AdminPageShell, DataTable, DetailList, Panel, StatCard, StatusPill } from "./shared";

export function DashboardPage() {
  const { appointments, doctors, services, reviews, clinic } = useClinic();
  const today = new Date().toISOString().slice(0, 10);
  const todayAppointments = appointments.filter((appointment) => appointment.date === today);
  const bookedDoctor = mostBookedDoctor(doctors, appointments);
  const popularService = mostPopularService(services, appointments);
  const pendingCount = todayAppointments.filter((appointment) => appointment.status === "pending").length;
  const confirmedCount = todayAppointments.filter((appointment) => appointment.status === "confirmed").length;
  const completedCount = todayAppointments.filter((appointment) => appointment.status === "completed").length;

  return (
    <AdminPageShell
      eyebrow="Dashboard"
      title="Operational view for the clinic team"
      description="A compact command center for bookings, performance, and the current state of the live clinic website."
      actions={
        <>
          <Button variant="secondary" onClick={() => window.open("/", "_blank")}>
            <Eye className="mr-2 size-4" />
            Preview Site
          </Button>
          <Button>
            <ArrowUpRight className="mr-2 size-4" />
            Open Booking Flow
          </Button>
        </>
      }
    >
      <section className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Today's appointments" value={String(todayAppointments.length)} detail={`${pendingCount} pending, ${confirmedCount} confirmed, ${completedCount} completed`} icon={CalendarDays} />
        <StatCard label="Weekly bookings" value={String(appointments.length)} detail="Current loaded appointment volume" icon={Activity} tone="slate" />
        <StatCard label="Most booked doctor" value={bookedDoctor?.name ?? "No data"} detail={bookedDoctor?.specialization ?? "Waiting for appointment activity"} icon={Stethoscope} />
        <StatCard label="Average rating" value={averageRating(reviews.filter((item) => item.isApproved)).toFixed(1)} detail={`${reviews.filter((item) => item.isApproved).length} approved public reviews`} icon={Star} tone="amber" />
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.25fr_0.75fr]">
        <Panel
          title="Recent bookings"
          description="Latest appointment activity with live statuses and quick context for front-desk staff."
          action={<Button variant="secondary"><Download className="mr-2 size-4" />Export</Button>}
        >
          <DataTable headers={["Reference", "Patient", "Doctor", "Date", "Status"]}>
            {appointments.slice(0, 8).map((appointment) => {
              const doctor = doctors.find((item) => item.id === appointment.doctorId);
              return (
                <tr key={appointment.id} className="group border-b border-slate-50 last:border-0 hover:bg-slate-50/80 transition-colors">
                  <td className="py-4 pr-4 font-semibold text-slate-900 transition-colors group-hover:text-accent">{appointment.referenceNumber}</td>
                  <td className="py-4 pr-4 text-slate-600">{appointment.patientId.slice(0, 8)}</td>
                  <td className="py-4 pr-4 font-medium text-slate-700">{doctor?.name ?? "Unknown"}</td>
                  <td className="py-4 pr-4 text-slate-500">{formatDate(appointment.date)}</td>
                  <td className="py-4 pr-4"><StatusPill status={appointment.status} /></td>
                </tr>
              );
            })}
          </DataTable>
        </Panel>

        <Panel title="Clinic summary" description="Live site settings and commercial signals in one place.">
          <DetailList
            items={[
              { label: "Clinic", value: clinic.name },
              { label: "Public slug", value: clinic.slug },
              { label: "Booking state", value: clinic.bookingEnabled ? "Enabled" : "Disabled" },
              { label: "Top service", value: popularService?.name ?? "No data" },
              { label: "Primary contact", value: clinic.phone || "Not set" },
            ]}
          />
        </Panel>
      </section>
    </AdminPageShell>
  );
}
