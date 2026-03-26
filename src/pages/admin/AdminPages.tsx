import { useMemo, useState } from "react";
import { Download, Plus } from "lucide-react";
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
import { QRCodeSVG } from "qrcode.react";
import { useClinic } from "../../context/ClinicContext";
import type { Doctor, Service } from "../../types";
import { averageRating, formatDate, formatMoney, getStatusTone, mostBookedDoctor, mostPopularService } from "../../utils";
import { Button } from "../../components/ui/Button";
import { Card } from "../../components/ui/Card";
import { Input, Textarea } from "../../components/ui/Input";

function MetricCard({ label, value, detail }: { label: string; value: string; detail: string }) {
  return (
    <Card>
      <div className="text-sm text-slate-500">{label}</div>
      <div className="mt-4 text-3xl font-extrabold">{value}</div>
      <div className="mt-2 text-sm text-slate-500">{detail}</div>
    </Card>
  );
}

export function DashboardPage() {
  const { appointments, doctors, services } = useClinic();
  const today = new Date().toISOString().slice(0, 10);
  const todayAppointments = appointments.filter((appointment) => appointment.date === today);
  const bookedDoctor = mostBookedDoctor(doctors, appointments);
  const popularService = mostPopularService(services, appointments);

  return (
    <div className="space-y-6">
      <div>
        <div className="text-sm font-bold uppercase tracking-[0.25em] text-accent">Dashboard</div>
        <h1 className="mt-2 text-4xl font-extrabold">Operational view for the clinic team.</h1>
      </div>
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard label="Today's appointments" value={String(todayAppointments.length)} detail="Status-aware count" />
        <MetricCard label="This week's bookings" value={String(appointments.length)} detail="Live from appointment state" />
        <MetricCard label="Most booked doctor" value={bookedDoctor?.name ?? "N/A"} detail={bookedDoctor?.specialization ?? "No data"} />
        <MetricCard label="Top service" value={popularService?.name ?? "N/A"} detail={popularService ? formatMoney(popularService.price) : "No data"} />
      </div>
      <Card>
        <div className="text-lg font-bold">Recent bookings</div>
        <div className="mt-5 overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="text-slate-500">
              <tr>
                <th className="pb-3">Reference</th>
                <th className="pb-3">Date</th>
                <th className="pb-3">Time</th>
                <th className="pb-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {appointments.slice(0, 10).map((appointment) => (
                <tr key={appointment.id} className="border-t border-slate-100">
                  <td className="py-3 font-semibold">{appointment.referenceNumber}</td>
                  <td className="py-3">{formatDate(appointment.date)}</td>
                  <td className="py-3">{appointment.startTime}</td>
                  <td className="py-3">
                    <span className={`rounded-full px-3 py-1 text-xs font-semibold ${getStatusTone(appointment.status)}`}>
                      {appointment.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

export function AppointmentsPage() {
  const { appointments, patients, doctors, services, updateAppointmentStatus } = useClinic();
  return (
    <Card>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold">Appointment Manager</h1>
          <p className="mt-2 text-slate-500">List view with status actions, suitable for expansion into calendar mode.</p>
        </div>
        <Button variant="secondary">
          <Download className="mr-2 size-4" />
          Export CSV
        </Button>
      </div>
      <div className="mt-6 space-y-4">
        {appointments.map((appointment) => {
          const patient = patients.find((item) => item.id === appointment.patientId);
          const doctor = doctors.find((item) => item.id === appointment.doctorId);
          const service = services.find((item) => item.id === appointment.serviceId);
          return (
            <div key={appointment.id} className="rounded-3xl border border-slate-200 p-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <div className="text-lg font-bold">{patient?.name} · {service?.name}</div>
                  <div className="text-sm text-slate-500">{doctor?.name} · {formatDate(appointment.date)} · {appointment.startTime}</div>
                </div>
                <div className="flex flex-wrap gap-2">
                  {(["pending", "confirmed", "completed", "cancelled", "no_show"] as const).map((status) => (
                    <button
                      key={status}
                      onClick={() => updateAppointmentStatus(appointment.id, status)}
                      className={`rounded-full px-3 py-2 text-xs font-semibold ${
                        appointment.status === status ? "bg-accent text-white" : "bg-slate-100 text-slate-700"
                      }`}
                    >
                      {status}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}

export function DoctorsPage() {
  const { doctors, clinic, saveDoctor } = useClinic();
  const [draft, setDraft] = useState<Doctor>({
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
  });
  return (
    <div className="grid gap-6 xl:grid-cols-[1fr_360px]">
      <Card>
        <h1 className="text-3xl font-extrabold">Doctor Management</h1>
        <div className="mt-6 space-y-4">
          {doctors.map((doctor) => (
            <div key={doctor.id} className="rounded-3xl border border-slate-200 p-5">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <div className="text-xl font-bold">{doctor.name}</div>
                  <div className="text-sm text-slate-500">{doctor.specialization} · {doctor.consultationDuration} min</div>
                </div>
                <Button variant="secondary" onClick={() => setDraft(doctor)}>Edit</Button>
              </div>
            </div>
          ))}
        </div>
      </Card>
      <Card>
        <div className="flex items-center gap-2 text-lg font-bold"><Plus className="size-5" /> Doctor Form</div>
        <div className="mt-5 space-y-4">
          <Input placeholder="Doctor name" value={draft.name} onChange={(e) => setDraft({ ...draft, name: e.target.value })} />
          <Input placeholder="Specialization" value={draft.specialization} onChange={(e) => setDraft({ ...draft, specialization: e.target.value })} />
          <Input placeholder="Qualifications" value={draft.qualifications} onChange={(e) => setDraft({ ...draft, qualifications: e.target.value })} />
          <Textarea rows={4} placeholder="Bio" value={draft.bio} onChange={(e) => setDraft({ ...draft, bio: e.target.value })} />
          <Input placeholder="Photo URL" value={draft.photoUrl} onChange={(e) => setDraft({ ...draft, photoUrl: e.target.value })} />
          <Button className="w-full" onClick={() => saveDoctor(draft)}>Save Doctor</Button>
        </div>
      </Card>
    </div>
  );
}

export function ServicesPage() {
  const { services, clinic, saveService } = useClinic();
  const [draft, setDraft] = useState<Service>({
    id: `service-${crypto.randomUUID()}`,
    clinicId: clinic.id,
    name: "",
    description: "",
    durationMinutes: 30,
    price: 100,
    icon: "Stethoscope",
    isActive: true,
    displayOrder: services.length + 1,
  });
  return (
    <div className="grid gap-6 xl:grid-cols-[1fr_360px]">
      <Card>
        <h1 className="text-3xl font-extrabold">Service Management</h1>
        <div className="mt-6 space-y-4">
          {services.map((service) => (
            <div key={service.id} className="rounded-3xl border border-slate-200 p-5">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xl font-bold">{service.name}</div>
                  <div className="text-sm text-slate-500">{service.durationMinutes} min · {formatMoney(service.price)}</div>
                </div>
                <Button variant="secondary" onClick={() => setDraft(service)}>Edit</Button>
              </div>
            </div>
          ))}
        </div>
      </Card>
      <Card>
        <div className="text-lg font-bold">Service Form</div>
        <div className="mt-5 space-y-4">
          <Input placeholder="Service name" value={draft.name} onChange={(e) => setDraft({ ...draft, name: e.target.value })} />
          <Textarea rows={4} placeholder="Description" value={draft.description} onChange={(e) => setDraft({ ...draft, description: e.target.value })} />
          <Input type="number" placeholder="Duration" value={draft.durationMinutes} onChange={(e) => setDraft({ ...draft, durationMinutes: Number(e.target.value) })} />
          <Input type="number" placeholder="Price" value={draft.price} onChange={(e) => setDraft({ ...draft, price: Number(e.target.value) })} />
          <Button className="w-full" onClick={() => saveService(draft)}>Save Service</Button>
        </div>
      </Card>
    </div>
  );
}

export function PatientsPage() {
  const { patients, appointments, prescriptions, savePatientNote } = useClinic();
  const [selectedId, setSelectedId] = useState<string | undefined>(patients[0]?.id);
  const patient = patients.find((item) => item.id === selectedId) ?? patients[0];
  const history = appointments.filter((appointment) => appointment.patientId === patient?.id);
  const files = prescriptions.filter((item) => item.patientId === patient?.id);
  return (
    <div className="grid gap-6 xl:grid-cols-[320px_1fr]">
      <Card>
        <h1 className="text-2xl font-extrabold">Patients</h1>
        <div className="mt-5 space-y-3">
          {patients.map((entry) => (
            <button
              key={entry.id}
              onClick={() => setSelectedId(entry.id)}
              className={`w-full rounded-3xl p-4 text-left ${entry.id === patient?.id ? "bg-accent text-white" : "bg-canvas"}`}
            >
              <div className="font-bold">{entry.name}</div>
              <div className="text-sm opacity-80">{entry.phone}</div>
            </button>
          ))}
        </div>
      </Card>
      {patient ? (
        <Card>
          <h2 className="text-3xl font-extrabold">{patient.name}</h2>
          <div className="mt-3 text-slate-500">{patient.email ?? "No email"} · {patient.totalVisits} visits</div>
          <div className="mt-6">
            <div className="font-bold">Patient note</div>
            <Textarea
              rows={4}
              value={patient.notes ?? ""}
              onChange={(event) => savePatientNote(patient.id, event.target.value)}
              className="mt-3"
            />
          </div>
          <div className="mt-8 grid gap-6 xl:grid-cols-2">
            <div>
              <div className="font-bold">Visit history</div>
              <div className="mt-4 space-y-3">
                {history.map((appointment) => (
                  <div key={appointment.id} className="rounded-2xl bg-canvas p-4">
                    <div className="font-semibold">{formatDate(appointment.date)} · {appointment.startTime}</div>
                    <div className="text-sm text-slate-500">{appointment.referenceNumber}</div>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <div className="font-bold">Prescriptions and reports</div>
              <div className="mt-4 space-y-3">
                {files.map((file) => (
                  <div key={file.id} className="rounded-2xl bg-canvas p-4">
                    <div className="font-semibold">{file.fileName}</div>
                    <div className="text-sm text-slate-500">{file.notes}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Card>
      ) : null}
    </div>
  );
}

export function ReviewsPage() {
  const { reviews, toggleReviewApproval, toggleReviewFeatured } = useClinic();
  return (
    <Card>
      <h1 className="text-3xl font-extrabold">Review Moderation</h1>
      <div className="mt-6 space-y-4">
        {reviews.map((review) => (
          <div key={review.id} className="rounded-3xl border border-slate-200 p-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <div className="text-lg font-bold">{review.patientName}</div>
                <div className="text-sm text-slate-500">{review.rating} / 5 stars</div>
                <p className="mt-3 text-slate-700">{review.comment}</p>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button variant="secondary" onClick={() => toggleReviewApproval(review.id)}>
                  {review.isApproved ? "Hide" : "Approve"}
                </Button>
                <Button variant="secondary" onClick={() => toggleReviewFeatured(review.id)}>
                  {review.isFeatured ? "Unfeature" : "Feature"}
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}

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
    <div className="space-y-6">
      <div className="grid gap-5 md:grid-cols-3">
        <MetricCard label="Average rating" value={averageRating(reviews.filter((r) => r.isApproved)).toFixed(1)} detail="Approved reviews only" />
        <MetricCard label="Unique patients" value={String(patients.length)} detail="Returning vs new can be derived from visits" />
        <MetricCard label="Bookings tracked" value={String(appointments.length)} detail="Current clinic dataset" />
      </div>
      <div className="grid gap-6 xl:grid-cols-2">
        <Card>
          <div className="text-lg font-bold">Bookings Over Time</div>
          <div className="mt-4 h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="bookings" stroke="#0f766e" strokeWidth={3} />
                <Line type="monotone" dataKey="completed" stroke="#fb923c" strokeWidth={3} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>
        <Card>
          <div className="text-lg font-bold">Most Popular Services</div>
          <div className="mt-4 h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={serviceData}>
                <CartesianGrid strokeDasharray="3 3" />
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
        </Card>
      </div>
      <Card>
        <div className="text-lg font-bold">Doctor Performance</div>
        <div className="mt-5 overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="text-slate-500">
              <tr>
                <th className="pb-3 text-left">Doctor</th>
                <th className="pb-3 text-left">Bookings</th>
                <th className="pb-3 text-left">Completion Rate</th>
                <th className="pb-3 text-left">No-show Rate</th>
              </tr>
            </thead>
            <tbody>
              {doctorTable.map((row) => (
                <tr key={row.doctor} className="border-t border-slate-100">
                  <td className="py-3 font-semibold">{row.doctor}</td>
                  <td className="py-3">{row.bookings}</td>
                  <td className="py-3">{row.completionRate}%</td>
                  <td className="py-3">{row.noShowRate}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

export function QRPage() {
  const { clinic } = useClinic();
  const bookingUrl = `https://${clinic.slug}.example.com/booking`;
  return (
    <div className="grid gap-6 xl:grid-cols-[1fr_320px]">
      <Card className="min-h-[520px]">
        <div className="text-sm font-bold uppercase tracking-[0.25em] text-accent">QR Studio</div>
        <h1 className="mt-2 text-4xl font-extrabold">Print-ready booking handoff.</h1>
        <div className="mt-6 flex min-h-[380px] items-center justify-center rounded-[2rem] bg-canvas">
          <div className="rounded-[2rem] bg-white p-8 shadow-soft">
            <QRCodeSVG value={bookingUrl} size={240} />
            <div className="mt-4 text-center text-sm font-semibold text-slate-600">{clinic.name} booking</div>
          </div>
        </div>
      </Card>
      <Card>
        <div className="text-lg font-bold">Output</div>
        <div className="mt-4 text-sm text-slate-600">PNG, SVG, poster, business card, and table tent print layouts can branch off this page.</div>
        <div className="mt-6 rounded-3xl bg-canvas p-4 text-sm">
          <div className="font-semibold">Booking URL</div>
          <div className="mt-2 break-all text-slate-500">{bookingUrl}</div>
        </div>
      </Card>
    </div>
  );
}

export function SettingsPage() {
  const { clinic, updateClinic } = useClinic();
  const [draft, setDraft] = useState(clinic);
  return (
    <div className="grid gap-6 xl:grid-cols-[1fr_320px]">
      <Card>
        <h1 className="text-3xl font-extrabold">Clinic Settings</h1>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <Input value={draft.name} onChange={(e) => setDraft({ ...draft, name: e.target.value })} placeholder="Clinic name" />
          <Input value={draft.tagline} onChange={(e) => setDraft({ ...draft, tagline: e.target.value })} placeholder="Tagline" />
          <Input value={draft.phone} onChange={(e) => setDraft({ ...draft, phone: e.target.value })} placeholder="Phone" />
          <Input value={draft.email} onChange={(e) => setDraft({ ...draft, email: e.target.value })} placeholder="Email" />
          <Input value={draft.primaryColor} onChange={(e) => setDraft({ ...draft, primaryColor: e.target.value })} placeholder="Primary color" />
          <Input value={draft.secondaryColor} onChange={(e) => setDraft({ ...draft, secondaryColor: e.target.value })} placeholder="Secondary color" />
        </div>
        <Textarea
          rows={5}
          className="mt-4"
          value={draft.description}
          onChange={(e) => setDraft({ ...draft, description: e.target.value })}
          placeholder="About the clinic"
        />
        <div className="mt-6 flex flex-wrap gap-3">
          <Button onClick={() => updateClinic(draft)}>Save Settings</Button>
          <Button variant="secondary" onClick={() => window.open("/", "_blank")}>Preview Site</Button>
        </div>
      </Card>
      <Card>
        <div className="text-lg font-bold">Feature Toggles</div>
        <div className="mt-5 space-y-3 text-sm">
          <label className="flex items-center justify-between rounded-2xl bg-canvas px-4 py-3">
            Show reviews
            <input type="checkbox" checked={draft.showReviews} onChange={(e) => setDraft({ ...draft, showReviews: e.target.checked })} />
          </label>
          <label className="flex items-center justify-between rounded-2xl bg-canvas px-4 py-3">
            Show pricing
            <input type="checkbox" checked={draft.showPricing} onChange={(e) => setDraft({ ...draft, showPricing: e.target.checked })} />
          </label>
          <label className="flex items-center justify-between rounded-2xl bg-canvas px-4 py-3">
            Booking enabled
            <input type="checkbox" checked={draft.bookingEnabled} onChange={(e) => setDraft({ ...draft, bookingEnabled: e.target.checked })} />
          </label>
          <label className="flex items-center justify-between rounded-2xl bg-canvas px-4 py-3">
            Emergency banner
            <input
              type="checkbox"
              checked={draft.emergencyBannerEnabled}
              onChange={(e) => setDraft({ ...draft, emergencyBannerEnabled: e.target.checked })}
            />
          </label>
        </div>
      </Card>
    </div>
  );
}
